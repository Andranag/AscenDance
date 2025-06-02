// API utilities
import axios from 'axios';
import { ERROR_MESSAGES } from './constants';

// API Endpoints
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

// Create API client
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '',
  timeout: 10000
});

// Request interceptor for auth
api.interceptors.request.use(
  async (config) => {
    const token = localStorage.getItem('token');
    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    };
    config.headers = { ...config.headers, ...headers };
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error);
    return Promise.reject(error);
  }
);

// Error handling utilities
export const handleApiError = (error, defaultMessage = 'An error occurred') => {
  console.error('API Error:', {
    url: error.config?.url,
    method: error.config?.method,
    status: error.response?.status,
    message: error.message,
    data: error.response?.data
  });

  if (error.response) {
    const responseData = error.response.data;
    if (responseData) {
      showToast.error(responseData.message || responseData.error || defaultMessage);
      return {
        message: responseData.message || responseData.error || defaultMessage,
        code: responseData.code || 'UNKNOWN_ERROR',
        statusCode: error.response.status || 500
      };
    }
    showToast.error(error.response.message || defaultMessage);
    return {
      message: error.response.message || defaultMessage,
      code: 'SERVER_ERROR',
      statusCode: error.response.status || 500
    };
  }
  
  if (error.request) {
    showToast.error('Network error. Please check your connection.');
    return {
      message: 'Network error. Please check your connection.',
      code: 'NETWORK_ERROR',
      statusCode: 500
    };
  }
  
  showToast.error(defaultMessage);
  return {
    message: defaultMessage,
    code: 'UNKNOWN_ERROR',
    statusCode: 500
  };
};

// Format error message
export const formatErrorMessage = (error) => {
  if (!error) return 'Network error';
  
  if (typeof error === 'string') return error;
  
  if (error.message) return error.message;
  if (error.error) return error.error;
  if (error.response?.data?.message) return error.response.data.message;
  
  return 'Server error';
};

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

// Base service class
export class BaseService {
  constructor(endpointPrefix) {
    this.api = api;
    this.endpointPrefix = endpointPrefix || '';
  }

  formatUrl(endpoint) {
    return `${this.endpointPrefix}${endpoint}`;
  }

  async request(config) {
    try {
      const response = await this.api.request(config);
      return response;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  async get(endpoint, config = {}) {
    return this.request({
      method: 'GET',
      url: this.formatUrl(endpoint),
      ...config
    });
  }

  async post(endpoint, data, config = {}) {
    return this.request({
      method: 'POST',
      url: this.formatUrl(endpoint),
      data,
      ...config
    });
  }

  async put(endpoint, data, config = {}) {
    return this.request({
      method: 'PUT',
      url: this.formatUrl(endpoint),
      data,
      ...config
    });
  }

  async delete(endpoint, config = {}) {
    return this.request({
      method: 'DELETE',
      url: this.formatUrl(endpoint),
      ...config
    });
  }
}
