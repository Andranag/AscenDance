const logger = require('../utils/logger');
const UserActivity = require('../models/userActivityModel');

// Middleware to log user activities
const logUserActivity = async (req, res, next) => {
  // Skip logging for certain routes or methods
  const ignoredRoutes = ['/health', '/metrics'];
  const ignoredMethods = ['OPTIONS', 'HEAD'];

  if (
    ignoredRoutes.includes(req.path) || 
    ignoredMethods.includes(req.method)
  ) {
    return next();
  }

  try {
    // Capture request details
    const activityData = {
      user: req.user ? req.user.id : null,
      method: req.method,
      path: req.path,
      ipAddress: req.ip,
      userAgent: req.get('User-Agent'),
      timestamp: new Date(),
      requestBody: sanitizeRequestBody(req.body),
      status: res.statusCode
    };

    // Create activity log
    await UserActivity.create(activityData);

    // Log to console/file for immediate visibility
    logger.info('User Activity', activityData);
  } catch (error) {
    // Log error but don't block request
    logger.error('Failed to log user activity', { 
      error: error.message, 
      path: req.path 
    });
  }

  next();
};

// Sanitize sensitive information from request body
const sanitizeRequestBody = (body) => {
  if (!body) return null;

  const sanitizedBody = { ...body };
  
  // Remove sensitive fields
  const sensitiveFields = [
    'password', 
    'confirmPassword', 
    'token', 
    'resetPasswordToken', 
    'emailVerificationToken'
  ];

  sensitiveFields.forEach(field => {
    if (sanitizedBody[field]) {
      sanitizedBody[field] = '***REDACTED***';
    }
  });

  return sanitizedBody;
};

module.exports = logUserActivity;
