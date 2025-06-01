import rateLimit from 'express-rate-limit';
import { logger } from '../utils/logger.js';

// Rate limiting configurations
const RATE_LIMIT_CONFIG = {
  api: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // 100 requests per window
    message: 'Too many requests from this IP, please try again later',
    standardHeaders: true,
    legacyHeaders: false,
    skip: (req) => {
      // Skip rate limiting for authenticated requests
      return req.headers.authorization?.startsWith('Bearer ');
    }
  },
  auth: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 20, // 20 login attempts per window
    message: 'Too many login attempts. Please wait a few minutes and try again',
    standardHeaders: true,
    legacyHeaders: false,
    skip: (req) => {
      // Skip rate limiting if user is authenticated
      return req.user;
    }
  },
  custom: (config) => ({
    windowMs: config.windowMs || 15 * 60 * 1000,
    max: config.max || 100,
    message: config.message || 'Too many requests from this IP',
    standardHeaders: true,
    legacyHeaders: false,
    skip: config.skip || (() => false)
  })
};

// Create rate limiters
export const apiLimiter = rateLimit(RATE_LIMIT_CONFIG.api);
export const authLimiter = rateLimit(RATE_LIMIT_CONFIG.auth);

// Create custom rate limiter
export const createRateLimiter = (config) => {
  const normalizedConfig = RATE_LIMIT_CONFIG.custom(config);
  const limiter = rateLimit(normalizedConfig);
  
  limiter.on('tooManyRequests', (req, res) => {
    logger.warn('Rate limit exceeded', {
      ip: req.ip,
      path: req.path,
      limit: normalizedConfig.max,
      windowMs: normalizedConfig.windowMs
    });
  });

  return limiter;
};

// Example usage:
// const customLimiter = createRateLimiter({
//   max: 50,
//   windowMs: 5 * 60 * 1000,
//   message: 'Too many requests from this IP. Please wait 5 minutes.',
//   skip: (req) => req.user?.role === 'admin'
// });