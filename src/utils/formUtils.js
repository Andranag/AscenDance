// Form validation utilities
import { VALIDATION_PATTERNS, ERROR_MESSAGES } from './constants';

export const formUtils = {
  // Validate field against pattern
  validateField: (value, type, required = true) => {
    if (required && !value) return ERROR_MESSAGES.REQUIRED_FIELD;
    
    if (!value) return null;
    
    const pattern = VALIDATION_PATTERNS[type];
    if (pattern && !pattern.test(value)) {
      return ERROR_MESSAGES.INVALID_FIELD;
    }

    return null;
  },

  // Validate email
  validateEmail: (email) => {
    return formUtils.validateField(email, 'EMAIL');
  },

  // Validate password
  validatePassword: (password) => {
    const result = {
      isValid: false,
      requirements: {
        minLength: password.length >= 8,
        hasUpperCase: /[A-Z]/.test(password),
        hasLowerCase: /[a-z]/.test(password),
        hasNumber: /\d/.test(password),
        hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password)
      }
    };

    result.isValid = Object.values(result.requirements).every(req => req);
    
    return result;
  },

  // Validate form data against schema
  validateForm: (data, schema) => {
    const errors = {};
    
    Object.keys(schema).forEach(field => {
      const { type, required = true } = schema[field];
      const error = formUtils.validateField(data[field], type, required);
      
      if (error) {
        errors[field] = error;
      }
    });
    
    return errors;
  },

  // Format validation errors
  formatValidationErrors: (errors) => {
    if (!errors) return null;
    
    if (Array.isArray(errors)) {
      return errors.map(err => err).join(', ');
    }
    
    if (typeof errors === 'object') {
      return Object.values(errors)
        .filter(err => err)
        .join(', ');
    }
    
    return errors;
  },

  // Get error message for specific field
  getErrorMessage: (field, value, type, required = true) => {
    const error = formUtils.validateField(value, type, required);
    return error ? `${field} ${error}` : null;
  },

  // Check if form is valid
  isFormValid: (errors) => {
    return Object.keys(errors).length === 0;
  }
};
