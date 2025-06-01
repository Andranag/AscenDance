// Remove API_BASE_URL since we're using Vite proxy
export const API_ENDPOINTS = {
  auth: {
    login: '/api/auth/login',
    register: '/api/auth/register',
    profile: '/api/auth/profile',
  },
  courses: {
    list: '/api/courses',
    detail: (id) => `/api/courses/${id}`,
    create: '/api/courses',
    update: (id) => `/api/courses/${id}`,
    delete: (id) => `/api/courses/${id}`,
    featured: '/api/courses/featured'
  },
  users: {
    list: '/api/users',
    detail: (id) => `/api/users/${id}`,
    update: (id) => `/api/users/${id}`,
    delete: (id) => `/api/users/${id}`,
    toggleRole: (id) => `/api/users/${id}/toggle-role`,
  },
  analytics: {
    overview: '/api/analytics/overview',
    courseStats: '/api/analytics/courses',
    userStats: '/api/analytics/users',
  }
};

export const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    'Authorization': token ? `Bearer ${token}` : ''
  };
};

export const handleApiError = (error) => {
  console.error('API Error:', error);
  if (error.response) {
    // Server responded with error
    const responseData = error.response.data;
    if (responseData) {
      return {
        message: responseData.message || responseData.error || 'An error occurred',
        code: responseData.code || 'UNKNOWN_ERROR',
        statusCode: error.response.status || 500
      };
    }
    return {
      message: 'An error occurred',
      code: 'UNKNOWN_ERROR',
      statusCode: error.response.status || 500
    };
  } else if (error.request) {
    // Request made but no response
    return {
      message: 'Network error. Please check your connection.',
      code: 'NETWORK_ERROR',
      statusCode: 504
    };
  } else {
    // Error setting up request
    return {
      message: 'An unexpected error occurred.',
      code: 'CLIENT_ERROR',
      statusCode: 500
    };
  }
};