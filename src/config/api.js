const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const API_ENDPOINTS = {
  auth: {
    login: `${API_BASE_URL}/api/auth/login`,
    register: `${API_BASE_URL}/api/auth/register`,
    profile: `${API_BASE_URL}/api/auth/profile`,
  },
  courses: {
    list: `${API_BASE_URL}/api/courses`,
    detail: (id) => `${API_BASE_URL}/api/courses/${id}`,
    create: `${API_BASE_URL}/api/courses`,
    update: (id) => `${API_BASE_URL}/api/courses/${id}`,
    delete: (id) => `${API_BASE_URL}/api/courses/${id}`,
  },
  users: {
    list: `${API_BASE_URL}/api/users`,
    detail: (id) => `${API_BASE_URL}/api/users/${id}`,
    update: (id) => `${API_BASE_URL}/api/users/${id}`,
    delete: (id) => `${API_BASE_URL}/api/users/${id}`,
    toggleRole: (id) => `${API_BASE_URL}/api/users/${id}/toggle-role`,
  },
  analytics: {
    overview: `${API_BASE_URL}/analytics/overview`,
    courseStats: `${API_BASE_URL}/analytics/courses`,
    userStats: `${API_BASE_URL}/analytics/users`,
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