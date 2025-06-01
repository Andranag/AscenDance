import { responseUtils } from './response';
import { showToast } from './toast';

export const apiErrorUtils = {
  // Handle API errors with consistent formatting
  handleApiError: (error, defaultMessage = 'An error occurred') => {
    console.error('API Error:', {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      message: error.message,
      data: error.response?.data
    });

    // Handle different error types
    if (error.response) {
      // Server responded with an error
      const responseData = error.response.data;
      if (responseData) {
        return responseUtils.error(responseData);
      }
      return responseUtils.error(error.response, defaultMessage);
    } else if (error.request) {
      // Request made but no response
      return responseUtils.error(error, 'Network error. Please check your connection.');
    } else {
      // Error setting up request
      return responseUtils.error(error, defaultMessage);
    }
  },

  // Handle authentication errors
  handleAuthError: (error) => {
    const response = error.response?.data;
    
    if (response?.code === 'UNAUTHORIZED') {
      showToast.error('Authentication required');
      return responseUtils.unauthorized();
    }
    
    if (response?.code === 'FORBIDDEN') {
      showToast.error('Access denied');
      return responseUtils.forbidden();
    }
    
    return apiErrorUtils.handleApiError(error, 'Authentication error');
  },

  // Handle validation errors
  handleValidationError: (error) => {
    const response = error.response?.data;
    
    if (response?.errors) {
      showToast.error('Validation failed');
      return responseUtils.validationError(response.errors);
    }
    
    return apiErrorUtils.handleApiError(error, 'Validation error');
  },

  // Handle network errors
  handleNetworkError: (error) => {
    showToast.error('Network error. Please check your connection.');
    return responseUtils.error(error, 'Network error');
  },

  // Handle not found errors
  handleNotFoundError: (error) => {
    const response = error.response?.data;
    
    if (response?.code === 'NOT_FOUND') {
      showToast.error(response.message || 'Resource not found');
      return responseUtils.notFound(response.message);
    }
    
    return apiErrorUtils.handleApiError(error, 'Resource not found');
  }
};
