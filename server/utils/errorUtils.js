export class ApiError extends Error {
  constructor(message, statusCode = 500, code = 'INTERNAL_ERROR') {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.name = 'ApiError';
  }
}

export class ValidationError extends ApiError {
  constructor(message, errors = [], statusCode = 400, code = 'VALIDATION_ERROR') {
    super(message, statusCode, code);
    this.errors = errors;
    this.name = 'ValidationError';
  }
}

export class AuthenticationError extends ApiError {
  constructor(message = 'Authentication failed', statusCode = 401, code = 'AUTH_ERROR') {
    super(message, statusCode, code);
    this.name = 'AuthenticationError';
  }
}

export class AuthorizationError extends ApiError {
  constructor(message = 'Unauthorized', statusCode = 403, code = 'AUTHZ_ERROR') {
    super(message, statusCode, code);
    this.name = 'AuthorizationError';
  }
}

export class NotFoundError extends ApiError {
  constructor(message = 'Resource not found', statusCode = 404, code = 'NOT_FOUND') {
    super(message, statusCode, code);
    this.name = 'NotFoundError';
  }
}

export class ConflictError extends ApiError {
  constructor(message = 'Resource already exists', statusCode = 409, code = 'CONFLICT') {
    super(message, statusCode, code);
    this.name = 'ConflictError';
  }
}

// Error handling middleware
export const errorHandler = (err, req, res, next) => {
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      code: err.code,
      ...(err.errors ? { errors: err.errors } : {}),
      ...(process.env.NODE_ENV === 'development' ? { error: err } : {})
    });
  }

  // Handle mongoose validation errors
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      errors: Object.values(err.errors).map(e => e.message)
    });
  }

  // Handle JWT errors
  if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired token'
    });
  }

  // Default error response
  res.status(500).json({
    success: false,
    message: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' ? { error: err } : {})
  });
};

// Response utility functions
export const successResponse = (res, data, message = 'Success', statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data
  });
};

export const errorResponse = (res, error, message = 'Error', statusCode = 500) => {
  return res.status(statusCode).json({
    success: false,
    message: message || error.message,
    ...(process.env.NODE_ENV === 'development' ? { error } : {})
  });
};
