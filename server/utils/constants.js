export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_ERROR: 500
};

export const ERROR_CODES = {
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  AUTH_ERROR: 'AUTH_ERROR',
  AUTHZ_ERROR: 'AUTHZ_ERROR',
  NOT_FOUND: 'NOT_FOUND',
  CONFLICT: 'CONFLICT',
  INVALID_TOKEN: 'INVALID_TOKEN',
  TOKEN_EXPIRED: 'TOKEN_EXPIRED',
  INTERNAL_ERROR: 'INTERNAL_ERROR'
};

export const USER_ROLES = {
  USER: 'user',
  ADMIN: 'admin'
};

export const COURSE_LEVELS = {
  BEGINNER: 'beginner',
  INTERMEDIATE: 'intermediate',
  ADVANCED: 'advanced'
};

export const COURSE_STYLES = {
  CLASSIC: 'classic',
  MODERN: 'modern',
  CONTEMPORARY: 'contemporary'
};

export const ENROLLMENT_STATUS = {
  PENDING: 'pending',
  COMPLETED: 'completed',
  FAILED: 'failed',
  REFUNDED: 'refunded'
};

export const COURSE_PROGRESS_STATUS = {
  ACTIVE: 'active',
  COMPLETED: 'completed',
  EXPIRED: 'expired',
  CANCELLED: 'cancelled'
};

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    PROFILE: '/auth/profile'
  },
  USERS: '/users',
  COURSES: '/courses',
  LESSONS: '/lessons',
  ENROLLMENTS: '/enrollments',
  PROGRESS: '/progress',
  ANALYTICS: '/analytics'
};

export const API_CONFIG = {
  BASE_URL: process.env.API_BASE_URL || 'http://localhost:5000/api',
  TIMEOUT: 30000, // 30 seconds
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000 // 1 second
};

export const JWT_CONFIG = {
  SECRET: process.env.JWT_SECRET,
  ACCESS_TOKEN_EXPIRES_IN: '24h',
  REFRESH_TOKEN_EXPIRES_IN: '7d'
};
