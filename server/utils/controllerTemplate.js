// Common imports
import { 
  successResponse, 
  errorResponse,
  NotFoundError,
  logger 
} from '../utils/errorUtils.js';
import { validate } from '../middleware/validationMiddleware.js';
import z from 'zod';

// Model imports
import { Model } from '../models/index.js';

// Validation schemas
const createSchema = z.object({
  // Define your schema here
});

const updateSchema = z.object({
  // Define your schema here
});

// Controller functions
const create = async (req, res) => {
  try {
    const validatedData = validate(createSchema)(req);
    const result = await Model.create(validatedData);
    logger.info('Resource created successfully', { id: result._id });
    return successResponse(res, result, 'Resource created successfully', 201);
  } catch (error) {
    logger.error('Error creating resource', error);
    return errorResponse(res, error);
  }
};

const getById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await Model.findById(id);
    if (!result) {
      throw new NotFoundError('Resource not found');
    }
    logger.info('Resource retrieved successfully', { id });
    return successResponse(res, result);
  } catch (error) {
    logger.error('Error retrieving resource', error);
    return errorResponse(res, error);
  }
};

// Export controller functions
export {
  create,
  getById
};
