import { successResponse, errorResponse, NotFoundError, ValidationError } from './errorUtils.js';
import { logger } from './logger.js';
import { validateCourse, validatePartialCourse } from './schemas.js';

export class BaseController {
  constructor(Model, validators = {}, logger) {
    this.Model = Model;
    this.validators = {
      create: validators.create || validateCourse,
      update: validators.update || validatePartialCourse,
      delete: validators.delete || validateCourse
    };
    this.logger = logger;
  }

  // Import response utilities
  successResponse = (res, data, message = 'Success', statusCode = 200) => {
    return res.status(statusCode).json({
      success: true,
      message,
      data
    });
  };

  errorResponse = (res, error, message = 'Error', statusCode = 500) => {
    const errorData = error?.response?.data || {
      message: error?.message || message,
      code: error?.code || 'UNKNOWN_ERROR',
      status: statusCode
    };
    return res.status(statusCode).json(errorData);
  };

  getAll = async (req, res) => {
    try {
      const items = await this.Model.find();
      return successResponse(res, items);
    } catch (error) {
      this.logger?.error(`Error fetching ${this.Model.modelName.toLowerCase()}s`, error);
      return errorResponse(res, error);
    }
  };

  getById = async (req, res) => {
    try {
      const { id } = req.params;
      const item = await this.Model.findById(id);
      if (!item) {
        throw new NotFoundError(`${this.Model.modelName} not found`);
      }
      return successResponse(res, item);
    } catch (error) {
      this.logger?.error(`Error getting ${this.Model.modelName.toLowerCase()}`, error);
      return errorResponse(res, error);
    }
  };

  create = async (req, res) => {
    try {
      const data = this.validators.create(req.body);
      const item = new this.Model(data);
      await item.save();
      logger.info(`${this.Model.modelName} created successfully`, { id: item._id });
      return successResponse(res, item, `${this.Model.modelName} created successfully`, 201);
    } catch (error) {
      this.logger?.error(`Error creating ${this.Model.modelName.toLowerCase()}`, error);
      return errorResponse(res, error);
    }
  };

  update = async (req, res) => {
    try {
      const { id } = req.params;
      const updates = this.validators.update(req.body);
      const item = await this.Model.findByIdAndUpdate(
        id,
        updates,
        { new: true, runValidators: true }
      );
      if (!item) {
        throw new NotFoundError(`${this.Model.modelName} not found`);
      }
      logger.info(`${this.Model.modelName} updated successfully`, { id });
      return successResponse(res, item, `${this.Model.modelName} updated successfully`);
    } catch (error) {
      logger.error(`Error updating ${this.Model.modelName.toLowerCase()}`, error);
      return errorResponse(res, error);
    }
  };

  delete = async (req, res) => {
    try {
      const { id } = req.params;
      const item = await this.Model.findByIdAndDelete(id);
      if (!item) {
        throw new NotFoundError(`${this.Model.modelName} not found`);
      }
      logger.info(`${this.Model.modelName} deleted successfully`, { id });
      return successResponse(res, null, `${this.Model.modelName} deleted successfully`);
    } catch (error) {
      logger.error(`Error deleting ${this.Model.modelName.toLowerCase()}`, error);
      return errorResponse(res, error);
    }
  };
}
