import jwt from 'jsonwebtoken';

// JWT utilities
export const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      email: user.email,
      role: user.role
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );
};

export const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return null;
  }
};

export const generateRefreshToken = (user) => {
  return jwt.sign(
    {
      id: user._id
    },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};

// Error classes
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
  }
}

export class AuthenticationError extends ApiError {
  constructor(message = 'Authentication failed', statusCode = 401, code = 'AUTH_ERROR') {
    super(message, statusCode, code);
  }
}

export class AuthorizationError extends ApiError {
  constructor(message = 'Unauthorized', statusCode = 403, code = 'AUTHZ_ERROR') {
    super(message, statusCode, code);
  }
}

export class NotFoundError extends ApiError {
  constructor(message = 'Resource not found', statusCode = 404, code = 'NOT_FOUND') {
    super(message, statusCode, code);
  }
}

export class ConflictError extends ApiError {
  constructor(message = 'Resource already exists', statusCode = 409, code = 'CONFLICT') {
    super(message, statusCode, code);
  }
}

// Response utilities
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

// Validation error response
export const validationError = (res, errors) => {
  return errorResponse(res, new ValidationError('Validation error', errors), 'Validation error', 400);
};

// Not found response
export const notFound = (res, message = 'Not found') => {
  return errorResponse(res, new NotFoundError(message), message, 404);
};
