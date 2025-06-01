import { responseUtils } from './response';

export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const validatePassword = (password) => {
  const minLength = password.length >= 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?\":{}|<>]/.test(password);

  return {
    isValid: minLength && hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar,
    requirements: {
      minLength,
      hasUpperCase,
      hasLowerCase,
      hasNumber,
      hasSpecialChar,
    },
  };
};

export const validateForm = (data, schema) => {
  const errors = {};
  
  Object.keys(schema).forEach(field => {
    const value = data[field];
    const rules = schema[field];

    if (rules.required && !value) {
      errors[field] = `This field is required`;
    }

    if (rules.minLength && value.length < rules.minLength) {
      errors[field] = `Must be at least ${rules.minLength} characters`;
    }

    if (rules.email && !validateEmail(value)) {
      errors[field] = 'Invalid email address';
    }

    if (rules.match && value !== data[rules.match]) {
      errors[field] = `Must match ${rules.match}`;
    }
  });

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    toResponse: () => responseUtils.validationError(errors, 'Validation failed')
  };
};

// Common validation schemas
export const validationSchemas = {
  login: {
    email: { required: true, email: true },
    password: { required: true, minLength: 8 }
  },
  register: {
    email: { required: true, email: true },
    password: { required: true, minLength: 8 },
    confirmPassword: { required: true, match: 'password' },
    name: { required: true, minLength: 2 }
  },
  profile: {
    name: { required: true, minLength: 2 },
    email: { required: true, email: true },
    currentPassword: { required: false, minLength: 8 },
    newPassword: { required: false, minLength: 8 },
    confirmPassword: { required: false, match: 'newPassword' }
  }
};

// Validation utilities
export const validationUtils = {
  // Validate login form
  validateLogin: (data) => validateForm(data, validationSchemas.login),
  
  // Validate registration form
  validateRegister: (data) => validateForm(data, validationSchemas.register),
  
  // Validate profile update
  validateProfile: (data) => validateForm(data, validationSchemas.profile),
  
  // Validate password change
  validatePasswordChange: (data) => {
    const schema = {
      currentPassword: { required: true, minLength: 8 },
      newPassword: { required: true, minLength: 8 },
      confirmPassword: { required: true, match: 'newPassword' }
    };
    return validateForm(data, schema);
  },
  
  // Validate course creation
  validateCourse: (data) => {
    const schema = {
      title: { required: true, minLength: 3 },
      description: { required: true, minLength: 10 },
      level: { required: true },
      price: { required: true },
      duration: { required: true }
    };
    return validateForm(data, schema);
  }
};