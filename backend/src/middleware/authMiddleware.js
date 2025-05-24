const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const { AppError } = require("../utils/errorHandler");
const logger = require("../utils/logger");

const protect = async (req, res, next) => {
  try {
    let token;
    
    // Get token from cookie if available
    if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }
    // Get token from Authorization header
    else if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      logger.warn('No token provided', {
        method: req.method,
        path: req.path,
        headers: req.headers
      });
      return next(new AppError('Not authorized, no token', 401));
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'ascendance-secret-key-2025');
      
      // Find user by ID
      const user = await User.findById(decoded.userId).select("-password");
      
      if (!user) {
        logger.warn('User not found for token', {
          userId: decoded.userId,
          token: token.substring(0, 10) + '...' // Log first 10 chars of token for debugging
        });
        return next(new AppError('User not found', 401));
      }

      req.user = user;
      next();
    } catch (error) {
      logger.error('Token verification failed', {
        error: error.message,
        token: token.substring(0, 10) + '...',
        stack: error.stack
      });
      return next(new AppError('Not authorized, token failed', 401));
    }
  } catch (error) {
    logger.error('Authentication error', {
      error: error.message,
      stack: error.stack
    });
    return next(new AppError('Internal server error', 500));
  }
};

// Role-based access control middleware
const authorize = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new AppError('Not authorized', 401));
    }

    if (!roles.includes(req.user.role)) {
      return next(new AppError('Access denied', 403));
    }

    next();
  };
};

module.exports = { protect, authorize };
