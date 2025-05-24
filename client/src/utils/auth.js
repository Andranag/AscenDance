import axios from 'axios';
import { toast } from 'react-toastify';

const API_URL = 'http://localhost:3050/api/auth';

export const checkAuth = async () => {
  try {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (!token) return false;

    // Verify token with backend
    const response = await axios.get(`${API_URL}/verify`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    return response.data.isValid;
  } catch (error) {
    // Remove invalid token
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');
    return false;
  }
};

export const logout = () => {
  localStorage.removeItem('token');
  sessionStorage.removeItem('token');
  toast.success('Successfully logged out');
};

export const setToken = (token, rememberMe = false) => {
  const storage = rememberMe ? localStorage : sessionStorage;
  storage.setItem('token', token);
};

export const getToken = () => {
  return localStorage.getItem('token') || sessionStorage.getItem('token');
};

export const clearToken = () => {
  localStorage.removeItem('token');
  sessionStorage.removeItem('token');
};

export const isAuthenticated = () => {
  return !!getToken();
};
