import { ValidationError } from '../utils/errorUtils.js';

const validate = (schema) => {
  return (req, res, next) => {
    try {
      const validatedData = schema.parse(req.body);
      req.validated = validatedData;
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors = error.errors.reduce((acc, err) => {
          acc[err.path.join('.')] = err.message;
          return acc;
        }, {});
        
        throw new ValidationError('Validation failed', errors);
      }
      throw error;
    }
  };
};

export default validate;
