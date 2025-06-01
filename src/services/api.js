import axios from 'axios';
import { getAuthHeaders } from '../config/api';
import BaseService from './BaseService';
import { apiErrorUtils } from '../utils/apiError';

// Create a reusable API client with common configurations
export const api = axios.create({
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

// Add request interceptor for authentication
api.interceptors.request.use(
  (config) => {
    const headers = getAuthHeaders();
    config.headers = { ...config.headers, ...headers };
    return config;
  },
  (error) => {
    const errorResponse = apiErrorUtils.handleNetworkError(error);
    return Promise.reject(errorResponse);
  }
);

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

// Auth service
class AuthService extends BaseService {
  constructor() {
    super(api, '/api/auth');
  }

  async login(credentials) {
    return this.post('login', credentials);
  }

  async register(userData) {
    return this.post('register', userData);
  }

  async updateProfile(data) {
    return this.put('profile', data);
  }

  async getProfile() {
    return this.get('profile');
  }

  async getAllUsers() {
    return this.get('/users');
  }

  async deleteUser(userId) {
    return this.delete(`/users/${userId}`);
  }

  async toggleUserRole(userId) {
    return this.post(`/users/${userId}/toggle-role`);
  }
}

// Course service
class CourseService extends BaseService {
  constructor() {
    super(api, '/api/courses');
  }

  async getAllCourses() {
    return this.get('');
  }

  async getFeaturedCourses() {
    return this.get('featured');
  }

  async getCourse(id) {
    return this.get(id);
  }

  async createCourse(data) {
    return this.post('', data);
  }

  async updateCourse(id, data) {
    return this.put(id, data);
  }

  async deleteCourse(id) {
    return this.delete(id);
  }
}

// Analytics service
class AnalyticsService extends BaseService {
  constructor() {
    super(api, '/api/analytics');
  }

  async getOverview() {
    return this.get('overview');
  }

  async getCourseStats() {
    return this.get('courses');
  }

  async getUserStats() {
    return this.get('users');
  }
}

// User service
class UserService extends BaseService {
  constructor() {
    super(api, '/api/users');
  }

  async getAllUsers() {
    return this.get('');
  }

  async getUser(userId) {
    return this.get(userId);
  }

  async updateUser(userId, data) {
    return this.put(userId, data);
  }

  async deleteUser(userId) {
    return this.delete(userId);
  }

  async toggleUserRole(userId) {
    return this.post(`${userId}/toggle-role`);
  }
}

// Export instances of services
export const authService = new AuthService();
export const courseService = new CourseService();
export const analyticsService = new AnalyticsService();
export const userService = new UserService();