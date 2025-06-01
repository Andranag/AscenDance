import axios from 'axios';
import { API_ENDPOINTS, getAuthHeaders, handleApiError } from '../config/api';

// Create a reusable API client with common configurations
const api = axios.create({
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  baseURL: '',
  withCredentials: true,
  xsrfCookieName: 'XSRF-TOKEN',
  xsrfHeaderName: 'X-XSRF-TOKEN'
});

// Add request interceptor to handle proxy
api.interceptors.request.use(
  (config) => {
    // Ensure URL is a relative path starting with /api/
    if (config.url) {
      // Remove any protocol or domain from the URL
      config.url = config.url.replace(/^[a-zA-Z]+:\/\//, '');
      // Remove any leading slashes
      config.url = config.url.replace(/^\/+/, '');
      // Add /api/ prefix if not present
      if (!config.url.startsWith('api/')) {
        config.url = 'api/' + config.url;
      }
    }
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Add request interceptor for authentication
api.interceptors.request.use(
  (config) => {
    const headers = getAuthHeaders();
    config.headers = { ...config.headers, ...headers };
    return config;
  },
  (error) => {
    console.error('Request failed:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error);
    const errorData = error.response?.data || {
      message: error.message || 'Failed to connect to server',
      code: 'SERVER_ERROR',
      status: error.response?.status || 500
    };
    
    return Promise.reject({
      message: errorData.message,
      code: errorData.code,
      status: errorData.status
    });
  }
);

// Base service class for common functionality
class BaseService {
  constructor() {
    this.api = api;
  }

  // Helper method to ensure API URLs are properly formatted
  formatUrl(endpoint) {
    if (!endpoint.startsWith('/')) {
      return '/' + endpoint;
    }
    return endpoint;
  }

  async request(config) {
    try {
      // Ensure URL is a relative path starting with /api/
      if (config.url) {
        // Remove any protocol or domain from the URL
        config.url = config.url.replace(/^[a-zA-Z]+:\/\//, '');
        // Remove any leading slashes
        config.url = config.url.replace(/^\/+/, '');
        // Add /api/ prefix if not present
        if (!config.url.startsWith('api/')) {
          config.url = 'api/' + config.url;
        }
      }
      const response = await this.api.request(config);
      return response.data;
    } catch (error) {
      console.error('API Request Error:', {
        url: config.url,
        method: config.method,
        error: error.response?.data || error.message
      });
      throw error;
    }
  }
}

// Auth service
class AuthService extends BaseService {
  async login(credentials) {
    return this.request({
      method: 'POST',
      url: API_ENDPOINTS.auth.login,
      data: credentials
    });
  }

  async register(userData) {
    return this.request({
      method: 'POST',
      url: API_ENDPOINTS.auth.register,
      data: userData
    });
  }

  async updateProfile(data) {
    return this.request({
      method: 'PUT',
      url: API_ENDPOINTS.auth.profile,
      data
    });
  }

  async getProfile() {
    return this.request({
      method: 'GET',
      url: API_ENDPOINTS.auth.profile
    });
  }

  async getAllUsers() {
    return this.request({
      method: 'GET',
      url: API_ENDPOINTS.users.list
    });
  }

  async deleteUser(userId) {
    return this.request({
      method: 'DELETE',
      url: API_ENDPOINTS.users.delete(userId)
    });
  }

  async toggleUserRole(userId) {
    return this.request({
      method: 'POST',
      url: API_ENDPOINTS.users.toggleRole(userId)
    });
  }
}

// Course service
class CourseService extends BaseService {
  async getAllCourses() {
    return this.request({
      method: 'GET',
      url: API_ENDPOINTS.courses.list
    });
  }

  async getFeaturedCourses() {
    return this.request({
      method: 'GET',
      url: API_ENDPOINTS.courses.featured
    });
  }

  async getCourse(id) {
    return this.request({
      method: 'GET',
      url: API_ENDPOINTS.courses.detail(id)
    });
  }

  async createCourse(data) {
    return this.request({
      method: 'POST',
      url: API_ENDPOINTS.courses.create,
      data
    });
  }

  async updateCourse(id, data) {
    return this.request({
      method: 'PUT',
      url: API_ENDPOINTS.courses.update(id),
      data
    });
  }

  async deleteCourse(id) {
    return this.request({
      method: 'DELETE',
      url: API_ENDPOINTS.courses.delete(id)
    });
  }
}

// Analytics service
class AnalyticsService extends BaseService {
  async getOverview() {
    return this.request({
      method: 'GET',
      url: API_ENDPOINTS.analytics.overview
    });
  }

  async getCourseStats() {
    return this.request({
      method: 'GET',
      url: API_ENDPOINTS.analytics.courseStats
    });
  }

  async getUserStats() {
    return this.request({
      method: 'GET',
      url: API_ENDPOINTS.analytics.userStats
    });
  }
}

// User service
class UserService extends BaseService {
  async getAllUsers() {
    return this.request({
      method: 'GET',
      url: API_ENDPOINTS.users.list
    });
  }

  async getUser(userId) {
    return this.request({
      method: 'GET',
      url: API_ENDPOINTS.users.detail(userId)
    });
  }

  async updateUser(userId, data) {
    return this.request({
      method: 'PUT',
      url: API_ENDPOINTS.users.update(userId),
      data
    });
  }

  async deleteUser(userId) {
    return this.request({
      method: 'DELETE',
      url: API_ENDPOINTS.users.delete(userId)
    });
  }

  async toggleUserRole(userId) {
    return this.request({
      method: 'POST',
      url: API_ENDPOINTS.users.toggleRole(userId)
    });
  }
}

// Export instances of services
export const authService = new AuthService();
export const courseService = new CourseService();
export const analyticsService = new AnalyticsService();
export const userService = new UserService();