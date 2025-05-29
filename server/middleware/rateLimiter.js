import rateLimit from 'express-rate-limit';

export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later',
  skip: (req) => {
    // Skip rate limiting for authenticated requests
    return req.headers.authorization?.startsWith('Bearer ');
  }
});

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // Limit each IP to 20 login attempts per 15 minutes
  message: 'Too many login attempts. Please wait a few minutes and try again',
  skip: (req) => {
    // Skip rate limiting if user is authenticated
    return req.user;
  }
});