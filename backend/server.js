require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { protect } = require('./src/middleware/authMiddleware');

const authRoutes = require('./src/routes/authRoutes');
const courseRoutes = require('./src/routes/courseRoutes');
const adminRoutes = require('./src/routes/adminRoutes');
const User = require('./src/models/User');
const Course = require('./src/models/Course');

const app = express();
const PORT = process.env.PORT || 3050;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ascendance';

// Middleware
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());

// Public routes
app.use('/api/auth', authRoutes);
app.use('/api/courses', (req, res, next) => {
  courseRoutes(req, res, next);
});

// Protected routes
app.use('/api/admin', protect, adminRoutes);
app.use('/api/courses/:id/lessons/:lessonIndex/complete', protect, (req, res, next) => {
  courseRoutes(req, res, next);
});
app.use('/api/courses/:id/lessons/:lessonIndex/unmark', protect, (req, res, next) => {
  courseRoutes(req, res, next);
});

// Health check
app.get('/api/health', async (req, res) => {
  try {
    const userCount = await User.countDocuments();
    const users = await User.find({}, 'name email _id').limit(10);
    res.json({ status: 'ok', userCount, users });
  } catch {
    res.status(500).json({ status: 'error', message: 'Database connection failed' });
  }
});

// Debug
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
    res.json({ found: !!user, user });
  } catch {
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

// Error & 404
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({ error: err.message || 'Internal server error' });
});

app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// MongoDB & Start
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('✅ MongoDB connected');
  app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
}).catch(err => {
  console.error('❌ MongoDB connection error:', err);
  process.exit(1);
});
