import axios from 'axios';
import { API_ENDPOINTS, getAuthHeaders, handleApiError } from '../config/api';

const api = axios.create({
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  baseURL: import.meta.env.VITE_API_URL
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const headers = getAuthHeaders();
    config.headers = { ...config.headers, ...headers };
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(handleApiError(error))
);

export const authService = {
  login: async (credentials) => {
    try {
      const response = await api.post(API_ENDPOINTS.auth.login, credentials);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
  register: async (userData) => {
    try {
      const response = await api.post(API_ENDPOINTS.auth.register, userData);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
  updateProfile: async (data) => {
    try {
      const response = await api.put(API_ENDPOINTS.auth.profile, data);
      if (!response.data?.success) {
        throw new Error(response.data?.message || 'Failed to update profile');
      }
      return response.data.data;
    } catch (error) {
      console.error('Update profile error:', error);
      throw new Error(error.response?.data?.message || error.message || 'Failed to update profile');
    }
  },
  getProfile: async () => {
    try {
      const response = await api.get(API_ENDPOINTS.auth.profile);
      if (!response.data?.success) {
        throw new Error(response.data?.message || 'Failed to get profile');
      }
      return response.data.data;
    } catch (error) {
      console.error('Get profile error:', error);
      throw new Error(error.response?.data?.message || error.message || 'Failed to get profile');
    }
  }
};

export const courseService = {
  getAllCourses: async () => {
    try {
      const response = await api.get(API_ENDPOINTS.courses.list);
      console.log('Raw API Response:', response);
      
      if (!response.data?.success) {
        throw new Error(response.data?.message || 'Failed to fetch courses');
      }
      
      // Return the data object
      return response.data;
    } catch (error) {
      console.error('Get courses error:', error);
      throw new Error(error.response?.data?.message || error.message || 'Failed to fetch courses');
    }
  },
  getCourse: async (id) => {
    try {
      const response = await api.get(API_ENDPOINTS.courses.detail(id));
      if (!response.data?.success) {
        throw new Error(response.data.message || 'Failed to fetch course');
      }
      return response.data;
    } catch (error) {
      console.error('Get course error:', error);
      throw new Error(error.response?.data?.message || error.message || 'Failed to fetch course');
    }
  },
  createCourse: async (data) => {
    try {
      const response = await api.post(API_ENDPOINTS.courses.create, data);
      if (!response.data?.success) {
        throw new Error(response.data?.message || 'Failed to create course');
      }
      return response.data.data;
    } catch (error) {
      console.error('Create course error:', error);
      throw new Error(error.response?.data?.message || error.message || 'Failed to create course');
    }
  },
  updateCourse: async (id, data) => {
    try {
      const response = await api.put(API_ENDPOINTS.courses.update(id), data);
      if (!response.data?.success) {
        throw new Error(response.data.message || 'Failed to update course');
      }
      return response.data.data;
    } catch (error) {
      console.error('Update course error:', error);
      throw new Error(error.response?.data?.message || error.message || 'Failed to update course');
    }
  },
  deleteCourse: async (id) => {
    try {
      const response = await api.delete(API_ENDPOINTS.courses.delete(id));
      if (!response.data?.success) {
        throw new Error(response.data?.message || 'Failed to delete course');
      }
      return response.data.data;
    } catch (error) {
      console.error('Delete course error:', error);
      throw new Error(error.response?.data?.message || error.message || 'Failed to delete course');
    }
  }
};

export const userService = {
  getAllUsers: () => api.get(API_ENDPOINTS.users.list),
  getUser: (id) => api.get(API_ENDPOINTS.users.detail(id)),
  updateUser: (id, data) => api.put(API_ENDPOINTS.users.update(id), data),
  deleteUser: (id) => api.delete(API_ENDPOINTS.users.delete(id)),
};

export const analyticsService = {
  getOverview: () => api.get(API_ENDPOINTS.analytics.overview),
  getCourseStats: () => api.get(API_ENDPOINTS.analytics.courseStats),
  getUserStats: () => api.get(API_ENDPOINTS.analytics.userStats),
};