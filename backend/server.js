require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const logger = require('./src/utils/logger');
const { apiLimiter, authLimiter } = require('./src/middleware/rateLimiter');
const logUserActivity = require('./src/middleware/activityLogger');
const { errorHandler, AppError } = require('./src/utils/errorHandler');
const userRoutes = require('./src/routes/userRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// CORS Configuration
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      'http://localhost:5173',  // Vite dev server
      'http://127.0.0.1:5173',
      'http://localhost:3000',  // Backend server
      process.env.CORS_ORIGIN
    ];
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 200
};

// Enable CORS pre-flight for all routes
app.options('*', cors(corsOptions));
app.use(cors(corsOptions));

// Body Parsing Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate Limiting
app.use('/users/login', authLimiter); // Stricter rate limit for login
app.use('/users', apiLimiter); // General rate limit for user routes

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => logger.info('MongoDB connected'))
  .catch(err => logger.error('MongoDB connection error', err));

// Routes
app.use('/users', userRoutes);

// Activity Logging Middleware (after routes are defined)
app.use(logUserActivity);

// 404 Handler for undefined routes
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

// Global Error Handler
app.use(errorHandler);

// Start Server
const server = app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});

// Graceful Shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    logger.info('HTTP server closed');
    mongoose.connection.close(false, () => {
      logger.info('MongoDB connection closed');
      process.exit(0);
    });
  });
});

module.exports = app;
