import { api, API_ENDPOINTS, handleApiError } from './api';

export const authUtils = {
  // Authentication flows
  async login(email, password) {
    try {
      const response = await api.post(API_ENDPOINTS.LOGIN, { email, password });
      if (response.data.success) {
        localStorage.setItem('token', response.data.token);
        showToast.success('Successfully logged in');
        return response;
      }
      throw response;
    } catch (error) {
      const errorResponse = handleApiError(error, 'Login failed');
      throw errorResponse;
    }
  },

  async register(userData) {
    try {
      const response = await api.post(API_ENDPOINTS.REGISTER, userData);
      if (response.data.success) {
        showToast.success('Successfully registered');
        return response;
      }
      throw response;
    } catch (error) {
      const errorResponse = handleApiError(error, 'Registration failed');
      throw errorResponse;
    }
  },

  async updateProfile(data) {
    try {
      const response = await api.put(API_ENDPOINTS.PROFILE, data);
      if (response.data.success) {
        showToast.success('Profile updated successfully');
        return response;
      }
      throw response;
    } catch (error) {
      const errorResponse = handleApiError(error, 'Profile update failed');
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
