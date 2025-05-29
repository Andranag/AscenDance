import axios from 'axios';
import { API_ENDPOINTS, getAuthHeaders, handleApiError } from '../config/api';

const api = axios.create({
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  baseURL: ''
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
  },
  getAllUsers: async () => {
    try {
      const response = await api.get(API_ENDPOINTS.users.list);
      if (!response.data?.success) {
        throw new Error(response.data?.message || 'Failed to fetch users');
      }
      return response.data;
    } catch (error) {
      console.error('Get users error:', error);
      throw new Error(error.response?.data?.message || error.message || 'Failed to fetch users');
    }
  },
  deleteUser: async (userId) => {
    try {
      const response = await api.delete(API_ENDPOINTS.users.delete(userId));
      if (!response.data?.success) {
        throw new Error(response.data?.message || 'Failed to delete user');
      }
      return response.data;
    } catch (error) {
      console.error('Delete user error:', error);
      throw new Error(error.response?.data?.message || error.message || 'Failed to delete user');
    }
  },
  toggleUserRole: async (userId) => {
    try {
      const response = await api.patch(API_ENDPOINTS.users.toggleRole(userId));
      if (!response.data?.success) {
        throw new Error(response.data?.message || 'Failed to toggle user role');
      }
      return response.data;
    } catch (error) {
      console.error('Toggle role error:', error);
      throw new Error(error.response?.data?.message || error.message || 'Failed to toggle user role');
    }
  }
};

export const courseService = {
  getAllCourses: async () => {
    try {
      const response = await api.get(API_ENDPOINTS.courses.list);
      return response.data;
    } catch (error) {
      console.error('Get courses error:', error);
      throw error;
    }
  },
  getCourse: async (id) => {
    try {
      const response = await api.get(API_ENDPOINTS.courses.detail(id));
      return response.data;
    } catch (error) {
      console.error('Get course error:', error);
      throw error;
    }
  },
  createCourse: async (data) => {
    try {
      const response = await api.post(API_ENDPOINTS.courses.create, data);
      return response.data;
    } catch (error) {
      console.error('Create course error:', error);
      throw error;
    }
  },
  updateCourse: async (id, data) => {
    try {
      const response = await api.put(API_ENDPOINTS.courses.update(id), data);
      return response.data;
    } catch (error) {
      console.error('Update course error:', error);
      throw error;
    }
  },
  deleteCourse: async (id) => {
    try {
      const response = await api.delete(API_ENDPOINTS.courses.delete(id));
      return response.data;
    } catch (error) {
      console.error('Delete course error:', error);
      throw error;
    }
  },
};

export const userService = {
  createUser: async (data) => {
    try {
      const response = await api.post(API_ENDPOINTS.users.list, data);
      if (!response.data?.success) {
        throw new Error(response.data?.message || 'Failed to create user');
      }
      return {
        id: response.data.data.id,
        name: response.data.data.name,
        email: response.data.data.email,
        role: response.data.data.role
      };
    } catch (error) {
      console.error('Create user error:', error);
      throw new Error(error.response?.data?.message || error.message || 'Failed to create user');
    }
  },
  toggleRole: async (id) => {
    try {
      const response = await api.patch(API_ENDPOINTS.users.toggleRole(id));
      return response.data.data;
    } catch (error) {
      console.error('Toggle role error:', error);
      throw error;
    }
  },
  getAllUsers: async () => {
    try {
      const response = await api.get(API_ENDPOINTS.users.list);
      return response.data;
    } catch (error) {
      console.error('Get users error:', error);
      throw error;
    }
  },
  getUser: async (id) => {
    try {
      const response = await api.get(API_ENDPOINTS.users.detail(id));
      if (!response.data?.success) {
        throw new Error(response.data.message || 'Failed to fetch user');
      }
      return response.data.data;
    } catch (error) {
      console.error('Get user error:', error);
      throw new Error(error.response?.data?.message || error.message || 'Failed to fetch user');
    }
  },
  updateUser: async (id, data) => {
    try {
      const response = await api.put(API_ENDPOINTS.users.update(id), data);
      if (!response.data?.success) {
        throw new Error(response.data?.message || 'Failed to update user');
      }
      const userData = response.data.data;
      return {
        id: userData.id,
        name: userData.name,
        email: userData.email,
        role: userData.role
      };
    } catch (error) {
      console.error('Update user error:', error);
      throw new Error(error.response?.data?.message || error.message || 'Failed to update user');
    }
  },
  deleteUser: async (id) => {
    try {
      const response = await api.delete(API_ENDPOINTS.users.delete(id));
      if (!response.data?.success) {
        throw new Error(response.data?.message || 'Failed to delete user');
      }
      return response.data.data;
    } catch (error) {
      console.error('Delete user error:', error);
      throw new Error(error.response?.data?.message || error.message || 'Failed to delete user');
    }
  }
};

export const analyticsService = {
  getOverview: () => api.get(API_ENDPOINTS.analytics.overview),
  getCourseStats: () => api.get(API_ENDPOINTS.analytics.courseStats),
  getUserStats: () => api.get(API_ENDPOINTS.analytics.userStats),
};