const rateLimit = require('express-rate-limit');
const logger = require('../utils/logger');

// Rate limiter configuration - more lenient for development
const rateLimiterConfig = {
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 200, // More lenient limit
  message: 'Too many requests from this IP, please try again in 5 minutes',
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    // Use IP address for rate limiting
    return req.ip;
  },
  handler: (req, res, next, options) => {
    logger.warn(`Rate limit exceeded for IP ${req.ip}`, {
      ip: req.ip,
      path: req.path,
      method: req.method,
      remaining: options.remaining,
      resetTime: options.resetTime
    });
    
    // Add rate limit headers
    res.setHeader('X-RateLimit-Limit', options.limit);
    res.setHeader('X-RateLimit-Remaining', Math.max(0, options.limit - options.current));
    res.setHeader('X-RateLimit-Reset', Math.floor(options.resetTime / 1000));
    
    // Send response
    res.status(options.statusCode).json({
      message: options.message,
      retryAfter: Math.floor((options.resetTime - Date.now()) / 1000)
    });
  }
};

// Create rate limiter
const createLimiter = (config) => {
  return rateLimit(config);
};

// API rate limiter (100 requests per 15 minutes)
const apiLimiter = createLimiter({
  ...rateLimiterConfig,
  max: process.env.RATE_LIMIT_MAX_REQUESTS || 100,
  windowMs: process.env.RATE_LIMIT_WINDOW_MS || 15 * 60 * 1000
});

// Authentication rate limiter (5 attempts per 15 minutes)
const authLimiter = createLimiter({
  ...rateLimiterConfig,
  max: 5,
  message: 'Too many login attempts. Please try again in 15 minutes.',
  windowMs: 15 * 60 * 1000 // 15 minutes
});

// Lenient limiter for public routes
const publicLimiter = createLimiter({
  ...rateLimiterConfig,
  max: 50,
  windowMs: 15 * 60 * 1000 // 15 minutes
});

module.exports = {
  apiLimiter,
  authLimiter,
  publicLimiter,
  createLimiter
};
