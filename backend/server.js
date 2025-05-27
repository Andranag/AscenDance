require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const routes = require('./src/routes/index');
const User = require('./src/models/User');
const Course = require('./src/models/Course');

const app = express();

// CORS
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

// Routes
app.use('/api', routes);

// Health check
app.get('/api/health', async (req, res) => {
  try {
    const userCount = await User.countDocuments();
    const users = await User.find({}, 'name email _id').limit(10);
    res.json({ status: 'ok', database: 'connected', userCount, users });
  } catch {
    res.status(500).json({ status: 'error', message: 'Database connection failed' });
  }
});

// Debug endpoints
app.get('/api/debug/courses', async (req, res) => {
  try {
    const courses = await Course.find({}, 'title _id');
    res.json({ count: courses.length, courses });
  } catch {
    res.status(500).json({ error: 'Failed to fetch courses' });
  }
});

app.get('/api/debug/user/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).select('name email _id');
    res.json({ found: !!user, user: user?.toObject() || null });
  } catch {
    res.status(500).json({ error: 'Failed to check user' });
  }
});

// Error middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({ error: err.message || 'Internal server error' });
});

// 404
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// DB + start server
const PORT = process.env.PORT || 3050;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ascendance';

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000
}).then(() => {
  console.log('Connected to MongoDB');
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}).catch(err => {
  console.error('MongoDB connection error:', err);
  process.exit(1);
});
