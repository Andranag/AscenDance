const logger = require('./logger');

// Custom error classes
class AppError extends Error {
  constructor(message, statusCode = 500, isOperational = true, details = null) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.details = details;

    // Capture stack trace
    Error.captureStackTrace(this, this.constructor);
  }
}

// Validation error class
class ValidationError extends AppError {
  constructor(errors) {
    super('Validation failed', 400, true, { errors });
    this.name = 'ValidationError';
  }
}

// Authentication error class
class AuthenticationError extends AppError {
  constructor(message = 'Authentication failed') {
    super(message, 401, true);
    this.name = 'AuthenticationError';
  }
}

// Authorization error class
class AuthorizationError extends AppError {
  constructor(message = 'Not authorized') {
    super(message, 403, true);
    this.name = 'AuthorizationError';
  }
}

// Resource not found error class
class NotFoundError extends AppError {
  constructor(message = 'Resource not found') {
    super(message, 404, true);
    this.name = 'NotFoundError';
  }
}

// Async error wrapper to avoid try-catch in every route
const catchAsync = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};

// Error handling middleware
const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  // Log the error
  logger.error(`${err.status.toUpperCase()} - ${err.message}`, {
    method: req.method,
    path: req.path,
    body: req.body,
    user: req.user ? req.user.id : 'unauthenticated',
    stack: err.stack,
    errorType: err.name || 'Error'
  });

  // Determine error response based on environment
  const errorResponse = {
    status: err.status,
    message: err.isOperational ? err.message : 'Something went wrong',
    ...(err.details && { details: err.details })
  };

  // Add stack trace in development
  if (process.env.NODE_ENV === 'development') {
    errorResponse.stack = err.stack;
  }

  // Send error response
  res.status(err.statusCode).json(errorResponse);
};

module.exports = {
  AppError,
  errorHandler,
  catchAsync
};
