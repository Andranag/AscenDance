const express = require("express");
const cors = require("cors");
const rateLimiter = require("./src/middleware/rateLimiter");
const logger = require("./src/utils/logger");

const main = require("./src/config/db");
const userRoutes = require("./src/routes/userRoutes");
const courseRoutes = require("./src/routes/courseRoutes");
const progressRoutes = require("./src/routes/progressRoutes");

const app = express();
const port = process.env.PORT || 3050;

// Error handling middleware
app.use((err, req, res, next) => {
  logger.error(`Error: ${err.message}`, { stack: err.stack });
  res.status(500).json({
    message: "Internal server error",
    error: process.env.NODE_ENV === "development" ? err.message : undefined
  });
});

// Configure CORS to allow requests from the frontend
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Apply rate limiting
app.use(rateLimiter.apiLimiter);
app.use('/auth', rateLimiter.authLimiter);

// Request logging middleware
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path}`, { 
    ip: req.ip,
    timestamp: new Date().toISOString()
  });
  next();
});

app.use(express.json());

main();

// API routes
app.use("/api/auth", userRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/progress", progressRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// Error handling for unmatched routes
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

app.listen(port, () => {
  logger.info(`Server is running on port ${port}`);
  console.log(`Server is running on port ${port}`);
}).on('error', (error) => {
  logger.error('Server error:', error);
  console.error('Server error:', error);
  process.exit(1);
});
