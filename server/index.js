import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { createServer } from 'http';
import { initializeSocket } from './services/socketService.js';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { apiLimiter, authLimiter } from './middleware/rateLimiter.js';
import { errorHandler } from './middleware/errorHandler.js';
import { authRoutes } from './routes/auth.js';
import { courseRoutes } from './routes/courses.js';
import { analyticsRoutes } from './routes/analytics.js';
import { progressRoutes } from './routes/progress.js';
import { lessonRoutes } from './routes/lessons.js';
import { enrollmentRoutes } from './routes/enrollments.js';
import { debugRoutes } from './routes/debug.js';
import { userRoutes } from './routes/users.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Load environment variables
dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = initializeSocket(httpServer);

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// MongoDB Connection
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error('❌ MONGO_URI is not defined in environment variables');
  process.exit(1);
}

console.log('🔄 Connecting to MongoDB...');

mongoose.connect(MONGO_URI)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Handle MongoDB connection events
mongoose.connection.on('error', err => {
  console.error('MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected');
});

mongoose.connection.on('reconnected', () => {
  console.log('MongoDB reconnected');
});

// MongoDB Debug Routes
app.get('/api/debug/ping', async (req, res) => {
  try {
    const admin = await mongoose.connection.db.admin().ping();
    res.json({ status: '✅ MongoDB connected' });
  } catch (err) {
    res.status(500).json({ error: '❌ MongoDB not connected', details: err.message });
  }
});

app.get('/api/debug/collections', async (req, res) => {
  try {
    const collections = await mongoose.connection.db.listCollections().toArray();
    const collectionNames = collections.map(col => col.name);
    res.json({ 
      status: '✅ Collections retrieved',
      collections: collectionNames
    });
  } catch (err) {
    res.status(500).json({ 
      error: '❌ Failed to retrieve collections', 
      details: err.message 
    });
  }
});

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

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(join(__dirname, '../dist')));
  app.get('*', (req, res) => {
    res.sendFile(join(__dirname, '../dist/index.html'));
  });
}

// Error handling
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

// Start server
httpServer.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
});