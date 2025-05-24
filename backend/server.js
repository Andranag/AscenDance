require("dotenv").config({ path: __dirname + '/.env' }); // Load environment variables
const express = require("express");
const cors = require("cors");
const rateLimiter = require("./src/middleware/rateLimiter.js");
const logger = require("./src/utils/logger.js");

const { connectDB, mongoose } = require("./src/config/db.js");
const userRoutes = require("./src/routes/userRoutes.js");
const courseRoutes = require("./src/routes/courseRoutes.js");
const progressRoutes = require("./src/routes/progressRoutes.js");

const app = express();
const port = process.env.PORT || 3050;

// Initialize database connection
const dbConnection = connectDB();

// Check if database is connected
if (!dbConnection) {
  logger.warn('Database connection failed, running in degraded mode');
  
  // Add a middleware to handle database-related requests
  app.use((req, res, next) => {
    if (req.path.startsWith('/api/')) {
      return res.status(503).json({
        message: 'Service unavailable - Database connection failed',
        timestamp: new Date().toISOString(),
        retryAfter: process.env.NODE_ENV === 'development' ? 5 : 30 // seconds
      });
    }
    next();
  });
} else {
  logger.info('Database connection established');
}

// Configure CORS to allow requests from the frontend
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body parsing middleware
app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path}`, { 
    ip: req.ip,
    timestamp: new Date().toISOString()
  });
  next();
});

// Apply rate limiting
app.use('/api/auth', rateLimiter.authLimiter);
app.use('/api', rateLimiter.apiLimiter);

// API routes
app.use('/api/auth', userRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/progress', progressRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((err, req, res, next) => {
  logger.error(`Error: ${err.message}`, { 
    stack: err.stack,
    timestamp: new Date().toISOString(),
    path: req.path
  });
  
  // Handle path-to-regexp error specifically
  if (err.name === 'TypeError' && err.message.includes('Missing parameter name')) {
    logger.error('Path-to-regexp error detected:', {
      path: req.path,
      method: req.method
    });
    return res.status(400).json({
      message: 'Invalid route format',
      timestamp: new Date().toISOString()
    });
  }

  res.status(500).json({
    message: "Internal server error",
    error: process.env.NODE_ENV === "development" ? err.message : undefined
  });
});

// Error handling for unmatched routes
app.use((req, res) => {
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({ 
      message: 'Route not found',
      timestamp: new Date().toISOString()
    });
  }
  res.status(404).json({ message: 'Route not found' });
});

// Start server
const server = app.listen(port, () => {
  logger.info(`Server is running on port ${port}`);
  console.log(`Server is running on port ${port}`);
});

// Handle server errors
server.on('error', (error) => {
  logger.error('Server error:', {
    error: error.message,
    stack: error.stack,
    timestamp: new Date()
  });
  console.error('Server error:', error);
  process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received. Shutting down gracefully...');
  server.close(() => {
    logger.info('Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  logger.info('SIGINT received. Shutting down gracefully...');
  server.close(() => {
    logger.info('Server closed');
    process.exit(0);
  });
});
