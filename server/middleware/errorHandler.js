import { logger } from '../utils/logger.js';

export const errorHandler = (err, req, res, next) => {
  // Log error with detailed context
  logger.error('Error in request', {
    method: req.method,
    path: req.path,
    status: err.statusCode || 500,
    error: {
      name: err.name,
      message: err.message,
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
      details: err.details || undefined
    },
    request: {
      ip: req.ip,
      userAgent: req.headers['user-agent'],
      headers: req.headers,
      body: req.body
    }
  });

  // Handle specific error types
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      message: 'Validation Error',
      errors: err.details || Object.values(err.errors).map(error => error.message)
    });
  }

  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      message: 'Invalid token',
      details: err.message
    });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      message: 'Token expired',
      details: err.message
    });
  }

  // Handle known error classes
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      ...(err.details && { details: err.details })
    });
  }

  // Default error response
  res.status(500).json({
    success: false,
    message: 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? {
      message: err.message,
      stack: err.stack
    } : undefined
  });
};