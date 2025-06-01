import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { createServer } from 'http';
import { initializeSocket } from './services/socketService.js';
import { apiLimiter, authLimiter } from './middleware/rateLimiter.js';
import { errorHandler } from './middleware/errorHandler.js';
import { requestLogger, logger } from './utils/logger.js';
import { authRoutes } from './routes/auth.js';
import { courseRoutes } from './routes/courses.js';
import { analyticsRoutes } from './routes/analytics.js';
import { progressRoutes } from './routes/progress.js';
import { lessonRoutes } from './routes/lessons.js';
import { enrollmentRoutes } from './routes/enrollments.js';
import { debugRoutes } from './routes/debug.js';
import { userRoutes } from './routes/users.js';
dotenv.config();

// Add chalk for colored output
import chalk from 'chalk';

// Console helper functions
const consoleLog = {
  success: (msg) => console.log(chalk.greenBright(`✅ ${msg}`)),
  info: (msg) => console.log(chalk.blueBright(`ℹ️ ${msg}`)),
  warning: (msg) => console.log(chalk.yellow(`⚠️ ${msg}`)),
  error: (msg) => console.error(chalk.red(`❌ ${msg}`)),
  start: (msg) => console.log(chalk.cyan(`🚀 ${msg}`)),
  connect: (msg) => console.log(chalk.magenta(`🔌 ${msg}`))
};

// Add process exit handler
process.on('exit', () => {
  consoleLog.info('Server shutting down...');
});

// Get MongoDB URI
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  consoleLog.error('MONGODB_URI is not set in .env file');
  process.exit(1);
}

const app = express();
const httpServer = createServer(app);
initializeSocket(httpServer);

// Connect to MongoDB
consoleLog.connect('Connecting to MongoDB Atlas...');
mongoose.connect(MONGODB_URI)
  .then(() => {
    consoleLog.success('Connected to MongoDB Atlas');
    mongoose.connection.on('error', err => {
      consoleLog.error('MongoDB connection error:', err);
    });
    mongoose.connection.on('disconnected', () => {
      consoleLog.warning('MongoDB disconnected');
    });
  })
  .catch(err => {
    consoleLog.error('MongoDB connection error:', err);
    consoleLog.error('MONGODB_URI:', MONGODB_URI);
    process.exit(1); // Exit process if connection fails
  });

// Middleware
const corsOptions = {
  origin: 'http://localhost:5173', // Your frontend URL
  credentials: true, // Allow credentials
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(requestLogger);

// Rate limiting
app.use('/api/', apiLimiter);
app.use('/api/auth/', authLimiter);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/lessons', lessonRoutes);
app.use('/api/enrollments', enrollmentRoutes);
app.use('/api/debug', debugRoutes);
app.use('/api/users', userRoutes);

// Error handling
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
  consoleLog.start(`Server running on port ${PORT}`);
});