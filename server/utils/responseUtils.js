export const successResponse = (res, data, message = 'Success', statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data
  });
};

export const errorResponse = (res, error, message = 'Error', statusCode = 400) => {
  return res.status(statusCode).json({
    success: false,
    message: message || error.message,
    error: process.env.NODE_ENV === 'development' ? error : undefined
  });
};

export const validationError = (res, errors) => {
  return res.status(400).json({
    success: false,
    message: 'Validation error',
    errors
  });
};

export const notFound = (res, message = 'Not found') => {
  return res.status(404).json({
    success: false,
    message
  });
};
