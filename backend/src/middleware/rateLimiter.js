const rateLimit = require('express-rate-limit');
const logger = require('../utils/logger');

// Create rate limiter for different types of requests
const createLimiter = (windowMs, max, message) => {
  return rateLimit({
    windowMs: windowMs, // 15 minutes
    max: max, // limit each IP to 100 requests per windowMs
    message: message || 'Too many requests, please try again later',
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    handler: (req, res, next, options) => {
      logger.warn(`Rate limit exceeded for IP ${req.ip}`, {
        ip: req.ip,
        path: req.path,
        method: req.method
      });
      res.status(options.statusCode).send(options.message);
    }
  });
};

// Different rate limiters for different routes
module.exports = {
  // General API rate limiter
  apiLimiter: createLimiter(
    process.env.RATE_LIMIT_WINDOW_MS || 15 * 60 * 1000, 
    process.env.RATE_LIMIT_MAX_REQUESTS || 100
  ),

  // More strict limiter for authentication routes
  authLimiter: createLimiter(
    15 * 60 * 1000, // 15 minutes
    5, // only 5 login attempts
    'Too many login attempts, please try again later'
  ),

  // Lenient limiter for public routes
  publicLimiter: createLimiter(
    15 * 60 * 1000, // 15 minutes
    50 // 50 requests
  )
};
