const logger = require('./logger');

// Custom error classes
class AppError extends Error {
  constructor(message, statusCode, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';

    // Capture stack trace
    Error.captureStackTrace(this, this.constructor);
  }
}

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
    stack: err.stack
  });

  // Determine error response based on environment
  const errorResponse = {
    status: err.status,
    message: err.isOperational ? err.message : 'Something went wrong'
  };

  // Add stack trace in development
  if (process.env.NODE_ENV === 'development') {
    errorResponse.stack = err.stack;
  }

  // Send error response
  res.status(err.statusCode).json(errorResponse);
};

// Async error wrapper to avoid try-catch in every route
const catchAsync = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};

module.exports = {
  AppError,
  errorHandler,
  catchAsync
};
