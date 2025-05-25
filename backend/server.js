require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./src/routes/authRoutes');
const courseRoutes = require('./src/routes/courseRoutes');
const User = require('./src/models/User');

// Database connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ascendance', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000
})
.then(() => {
  console.log('Database connected successfully');
  // Test connection by listing databases
  mongoose.connection.db.listCollections().toArray((err, collections) => {
    console.log('Collections:', collections);
  });
})
.catch(err => {
  console.error('Database connection error:', err);
  console.error('MongoDB URI:', process.env.MONGODB_URI || 'mongodb://localhost:27017/ascendance');
});

const app = express();

// Ensure JWT_SECRET is configured
if (!process.env.JWT_SECRET) {
  console.warn('JWT_SECRET not configured in environment. Using default value.');
  process.env.JWT_SECRET = 'ascendance-secret-key-2025';
}

// CORS middleware
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Authorization']
}));

// Custom preflight handler for profile endpoint
app.options('/api/auth/profile', (req, res) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:5173');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.status(200).end();
});

app.use(express.json());

// Public routes
app.use('/api/auth', authRoutes);

// Mount course routes directly
app.use('/api/courses', courseRoutes);

// Health check endpoint
app.get('/api/health', async (req, res) => {
  try {
    const userCount = await User.countDocuments();
    const users = await User.find({}, 'name email _id').limit(10);
    res.json({
      status: 'ok',
      database: 'connected',
      userCount,
      users
    });
  } catch (error) {
    console.error('Health check failed:', error);
    res.status(500).json({
      status: 'error',
      message: 'Database connection failed'
    });
  }
});

// Debug endpoint to check specific user
app.get('/api/debug/user/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).select('name email _id');
    res.json({
      found: !!user,
      user: user ? user.toObject() : null
    });
  } catch (error) {
    console.error('Debug user check failed:', error);
    res.status(500).json({
      error: 'Failed to check user'
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Not found'
  });
});

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error('MONGODB_URI environment variable is not set');
  process.exit(1);
}

mongoose.connect(MONGODB_URI, {
  serverSelectionTimeoutMS: 5000, // Timeout after 5 seconds
  socketTimeoutMS: 45000,
  family: 4 // Use IPv4, skip trying IPv6
})
  .then(() => {
    console.log('Connected to MongoDB');
    mongoose.connection.on('error', err => {
      console.error('MongoDB connection error:', err);
      // Don't exit on error, just log it
      console.error('Attempting to reconnect...');
    });
    mongoose.connection.on('disconnected', () => {
      console.error('MongoDB disconnected');
      // Don't exit on disconnect, just log it
      console.error('Attempting to reconnect...');
    });

    // Start server after database connection
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
    console.error('Connection string:', MONGODB_URI);
    process.exit(1);
  });


