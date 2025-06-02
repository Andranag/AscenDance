// Response utilities
export const responseUtils = {
  // Success responses
  success: (data, message = 'Success', statusCode = 200) => ({
    success: true,
    message,
    data,
    statusCode
  }),

  error: (error, message = 'Error occurred', statusCode = 500) => ({
    success: false,
    message,
    error,
    statusCode
  }),

  // Response type checking
  isSuccess: (response) => response?.success === true,
  isError: (response) => response?.success === false,
  isValidationError: (response) => response?.status === 400,
  isNotFound: (response) => response?.status === 404,
  isUnauthorized: (response) => response?.status === 401,
  isForbidden: (response) => response?.status === 403
};
