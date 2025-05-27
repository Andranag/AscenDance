export const handleApiError = (toast, error, message = 'An error occurred') => {
  console.error('API Error:', error);
  toast.error(message);
};

export const handleApiSuccess = (toast, message) => {
  console.log('API Success:', message);
  toast.success(message);
};
