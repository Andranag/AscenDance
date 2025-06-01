export const responseUtils = {
  // Success responses
  success: (data, message = 'Success', statusCode = 200) => ({
    success: true,
    message,
    data,
    statusCode
  }),

  created: (data, message = 'Created successfully', statusCode = 201) => ({
    success: true,
    message,
    data,
    statusCode
  }),

  updated: (data, message = 'Updated successfully', statusCode = 200) => ({
    success: true,
    message,
    data,
    statusCode
  }),

  deleted: (message = 'Deleted successfully', statusCode = 200) => ({
    success: true,
    message,
    statusCode
  }),

  // Error responses
  error: (error, message = 'Error occurred', statusCode = 500) => ({
    success: false,
    message: error?.message || message,
    code: error?.code || 'UNKNOWN_ERROR',
    statusCode,
    data: error?.data
  }),

  validationError: (errors, message = 'Validation failed', statusCode = 400) => ({
    success: false,
    message,
    errors,
    code: 'VALIDATION_ERROR',
    statusCode
  }),

  notFound: (message = 'Not found', statusCode = 404) => ({
    success: false,
    message,
    code: 'NOT_FOUND',
    statusCode
  }),

  unauthorized: (message = 'Unauthorized', statusCode = 401) => ({
    success: false,
    message,
    code: 'UNAUTHORIZED',
    statusCode
  }),

  forbidden: (message = 'Forbidden', statusCode = 403) => ({
    success: false,
    message,
    code: 'FORBIDDEN',
    statusCode
  }),

  // Response type checking
  isSuccess: (response) => response?.success === true,
  isError: (response) => response?.success === false,
  isValidationError: (response) => response?.code === 'VALIDATION_ERROR',
  isNotFound: (response) => response?.code === 'NOT_FOUND',
  isUnauthorized: (response) => response?.code === 'UNAUTHORIZED',
  isForbidden: (response) => response?.code === 'FORBIDDEN'
};
