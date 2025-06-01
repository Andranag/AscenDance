import { authService } from '../services/api';
import { showToast } from './toast';
import { responseUtils } from './response';
import { apiErrorUtils } from './apiError';

export const authUtils = {
  // Authentication flows
  async login(email, password) {
    try {
      const response = await authService.login({ email, password });
      if (responseUtils.isSuccess(response)) {
        localStorage.setItem('token', response.data.token);
        showToast.success('Successfully logged in');
        return response;
      }
      throw response;
    } catch (error) {
      const errorResponse = apiErrorUtils.handleAuthError(error);
      showToast.error(errorResponse.message);
      throw errorResponse;
    }
  },

  async register(userData) {
    try {
      const response = await authService.register(userData);
      if (responseUtils.isSuccess(response)) {
        showToast.success('Successfully registered');
        return response;
      }
      throw response;
    } catch (error) {
      const errorResponse = apiErrorUtils.handleApiError(error);
      showToast.error(errorResponse.message);
      throw errorResponse;
    }
  },

  async updateProfile(data) {
    try {
      const response = await authService.updateProfile(data);
      if (responseUtils.isSuccess(response)) {
        showToast.success('Profile updated successfully');
        return response;
      }
      throw response;
    } catch (error) {
      const errorResponse = apiErrorUtils.handleApiError(error);
      showToast.error(errorResponse.message);
      throw errorResponse;
    }
  },

  logout() {
    localStorage.removeItem('token');
    showToast.success(SUCCESS_MESSAGES.LOGOUT);
  },

  // Token management
  getToken() {
    return localStorage.getItem('token');
  },

  setToken(token) {
    localStorage.setItem('token', token);
  },

  clearToken() {
    localStorage.removeItem('token');
  },

  // Authentication state
  isAuthenticated() {
    return !!this.getToken();
  },

  // Role-based checks
  hasRole(roles) {
    const token = this.getToken();
    if (!token) return false;
    try {
      const decoded = JSON.parse(atob(token.split('.')[1]));
      return roles.includes(decoded.role);
    } catch {
      return false;
    }
  },

  isAdmin() {
    return this.hasRole(['admin']);
  },

  isTeacher() {
    return this.hasRole(['teacher']);
  }
};
