// Standardized imports for controllers
export const commonImports = `
import { successResponse, errorResponse } from '../utils/errorUtils.js';
import { logger } from '../utils/logger.js';
import { validate } from '../middleware/validation.js';

// Common error classes
import { ValidationError, NotFoundError, AuthenticationError, ConflictError } from '../utils/errorUtils.js';

// Common middleware
import { apiLimiter, createRateLimiter } from '../middleware/rateLimiter.js';

// Common constants
import { USER_ROLES, COURSE_LEVELS, COURSE_STYLES } from '../utils/constants.js';
`;
