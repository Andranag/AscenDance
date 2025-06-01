import axios from 'axios';
import { apiErrorUtils } from './apiError';
import { responseUtils } from './response';
import { showToast } from './toast';

// Create axios instance with base config
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const errorResponse = apiErrorUtils.handleApiError(error);
    showToast.error(errorResponse.message);
    return Promise.reject(errorResponse);
  }
);

// API endpoints
export const apiEndpoints = {
  auth: {
    login: '/auth/login',
    register: '/auth/register',
    profile: '/auth/profile',
  },
  courses: {
    all: '/courses',
    featured: '/courses/featured',
    create: '/courses',
    update: (id) => `/courses/${id}`,
    delete: (id) => `/courses/${id}`,
  },
  lessons: {
    all: (courseId) => `/courses/${courseId}/lessons`,
    create: (courseId) => `/courses/${courseId}/lessons`,
    update: (courseId, lessonId) => `/courses/${courseId}/lessons/${lessonId}`,
    delete: (courseId, lessonId) => `/courses/${courseId}/lessons/${lessonId}`,
  },
  newsletter: '/newsletter',
};

// API wrapper functions
export const apiUtils = {
  // Authentication
  login: async (email, password) => {
    try {
      const response = await api.post(apiEndpoints.auth.login, { email, password });
      return responseUtils.success(response.data, 'Successfully logged in');
    } catch (error) {
      throw apiErrorUtils.handleAuthError(error);
    }
  },

  register: async (userData) => {
    try {
      const response = await api.post(apiEndpoints.auth.register, userData);
      return responseUtils.success(response.data, 'Successfully registered');
    } catch (error) {
      throw apiErrorUtils.handleApiError(error);
    }
  },

  // Courses
  getFeaturedCourses: async () => {
    try {
      const response = await api.get(apiEndpoints.courses.featured);
      return responseUtils.success(response.data);
    } catch (error) {
      throw apiErrorUtils.handleApiError(error);
    }
  },

  // Newsletter
  subscribe: async (formData) => {
    try {
      const response = await api.post(apiEndpoints.newsletter, formData);
      return responseUtils.success(response.data, 'Successfully subscribed');
    } catch (error) {
      throw apiErrorUtils.handleApiError(error);
    }
  },
};

export default api;
