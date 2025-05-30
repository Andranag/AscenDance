const API_BASE_URL = '/api';

export const API_ENDPOINTS = {
  auth: {
    login: `${API_BASE_URL}/auth/login`,
    register: `${API_BASE_URL}/auth/register`,
    profile: `${API_BASE_URL}/auth/profile`,
  },
  courses: {
    list: `${API_BASE_URL}/courses`,
    detail: (id) => `${API_BASE_URL}/courses/${id}`,
    create: `${API_BASE_URL}/courses`,
    update: (id) => `${API_BASE_URL}/courses/${id}`,
    delete: (id) => `${API_BASE_URL}/courses/${id}`,
    featured: `${API_BASE_URL}/courses/featured`
  },
  users: {
    list: `${API_BASE_URL}/users`,
    detail: (id) => `${API_BASE_URL}/users/${id}`,
    update: (id) => `${API_BASE_URL}/users/${id}`,
    delete: (id) => `${API_BASE_URL}/users/${id}`,
    toggleRole: (id) => `${API_BASE_URL}/users/${id}/toggle-role`,
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