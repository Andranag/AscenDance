const express = require("express");
const cors = require("cors");
const rateLimiter = require("./src/middleware/rateLimiter.js");
const logger = require("./src/utils/logger.js");
const { errorHandler } = require("./src/utils/errorHandler.js");

require("dotenv").config({ path: __dirname + '/.env' }); // Load environment variables

// Log loaded environment variables
logger.info('Environment variables loaded:', {
  hasJWTSecret: !!process.env.JWT_SECRET,
  hasMongoUri: !!process.env.MONGODB_URI,
  port: process.env.PORT
});

const { connectDB, mongoose } = require("./src/config/db.js");
const authRoutes = require("./src/routes/authRoutes.js");
const userRoutes = require("./src/routes/userRoutes.js");
const courseRoutes = require("./src/routes/courseRoutes.js");
const progressRoutes = require("./src/routes/progressRoutes.js");

const app = express();
const port = process.env.PORT || 3050;

// Initialize database connection
const dbConnection = connectDB();

// Check if database is connected
if (!dbConnection) {
  logger.error('Database connection failed');
  process.exit(1); // Exit if database connection fails
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

// Public auth routes (no authentication required)
app.use('/api/auth', authRoutes);

// Protected user routes
app.use('/api/user', userRoutes);

// Course and progress routes
app.use('/api/courses', courseRoutes);
app.use('/api/progress', progressRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// Legacy routes - redirect to API version
app.get('/classes', (req, res) => {
  res.redirect('/api/courses');
});

app.get('/user/profile/:id', (req, res) => {
  res.redirect(`/api/user/profile/${req.params.id}`);
});

// Use the proper error handler
app.use(errorHandler);

// Start server
const server = app.listen(port, () => {
  logger.info(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${port}`);
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
