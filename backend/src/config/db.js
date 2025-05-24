const path = require('path');
const mongoose = require("mongoose");

// Load environment variables
const envPath = path.resolve(__dirname, '../../.env');
require("dotenv").config({ path: envPath });

// Initialize logger after environment variables are loaded
const logger = require("../utils/logger");

// Log environment variables for debugging
logger.debug('Environment variables loaded:', {
  envPath,
  hasMongodbUri: !!process.env.MONGODB_URI,
  hasPort: !!process.env.PORT
});

const connectDB = async () => {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    logger.error("MONGODB_URI environment variable is not set", {
      service: 'ascendance-backend',
      timestamp: new Date().toISOString(),
      envPath,
      currentDir: __dirname,
      workingDir: process.cwd()
    });
    
    // Try to load from .env.example as a fallback
    const examplePath = path.resolve(__dirname, '../../.env.example');
    if (require('fs').existsSync(examplePath)) {
      logger.warn('Loading example environment variables as fallback', {
        examplePath
      });
      require("dotenv").config({ path: examplePath });
      
      if (process.env.MONGODB_URI) {
        logger.warn('Successfully loaded example MongoDB URI');
        return connectDB();
      }
    }
    
    process.exit(1);
  }

  try {
    // Configure connection options for Atlas
    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      retryWrites: true,
      w: 'majority',
      // Atlas-specific options
      ssl: true,
      tls: true,
      tlsAllowInvalidCertificates: true // Only for development
    };

    await mongoose.connect(uri, options);
    logger.info("MongoDB Connected successfully to Atlas");

    // Handle connection events
    mongoose.connection.on('connected', () => {
      logger.info('MongoDB connected successfully to Atlas');
    });

    mongoose.connection.on('disconnected', () => {
      logger.warn('MongoDB disconnected from Atlas');
      if (process.env.NODE_ENV !== 'production') {
        logger.info('Attempting to reconnect...');
        mongoose.connect(uri, options);
      }
    });

    mongoose.connection.on('error', (err) => {
      logger.error('MongoDB Atlas connection error:', {
        error: err.message,
        name: err.name,
        stack: err.stack
      });
    });

  } catch (err) {
    logger.error("MongoDB Atlas Connection Error:", {
      error: err.message,
      stack: err.stack
    });
    process.exit(1);
  }
};

// Export both the connection function and mongoose
module.exports = {
  connectDB,
  mongoose
};
