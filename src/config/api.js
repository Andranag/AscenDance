const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const API_ENDPOINTS = {
  auth: {
    login: 'http://localhost:5000/api/auth/login',
    register: 'http://localhost:5000/api/auth/register',
    profile: 'http://localhost:5000/api/auth/profile',
  },
  courses: {
    list: 'http://localhost:5000/api/courses',
    detail: (id) => `http://localhost:5000/api/courses/${id}`,
    create: 'http://localhost:5000/api/courses',
    update: (id) => `http://localhost:5000/api/courses/${id}`,
    delete: (id) => `http://localhost:5000/api/courses/${id}`,
  },
  users: {
    list: 'http://localhost:5000/api/users',
    detail: (id) => `http://localhost:5000/api/users/${id}`,
    update: (id) => `http://localhost:5000/api/users/${id}`,
    delete: (id) => `http://localhost:5000/api/users/${id}`,
    toggleRole: (id) => `http://localhost:5000/api/users/${id}/toggle-role`,
  },
  analytics: {
    overview: 'http://localhost:5000/analytics/overview',
    courseStats: 'http://localhost:5000/analytics/courses',
    userStats: 'http://localhost:5000/analytics/users',
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
  if (error.response) {
    // Server responded with error
    return error.response.data.message || 'An error occurred';
  } else if (error.request) {
    // Request made but no response
    return 'Network error. Please check your connection.';
  } else {
    // Error setting up request
    return 'An unexpected error occurred.';
  }
};