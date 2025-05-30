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

// dotenv.config();

console.log("🔄 Connecting to MongoDB with hardcoded URI...");

// Connect to MongoDB
const MONGO_URI = 'mongodb+srv://lindyverse:lindyverse@cluster0.mongodb.net/lindyverse?retryWrites=true&w=majority';

mongoose.connect(MONGO_URI)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

const app = express();
const httpServer = createServer(app);
const io = initializeSocket(httpServer);

// Middleware
const corsOptions = {
  origin: 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
app.use(express.json());

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
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});