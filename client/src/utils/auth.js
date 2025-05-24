import api from '../config/axiosConfig';
import { toast } from 'react-toastify';

// Cookie handling functions
const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
};

const setCookie = (name, value, days) => {
  const date = new Date();
  date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
  const expires = date.toUTCString();
  document.cookie = `${name}=${value};expires=${expires};path=/;SameSite=Lax`;
};

const clearCookie = (name) => {
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;SameSite=Lax`;
};

// Initialize axios headers with token if present
const initializeAxiosHeaders = () => {
  const token = localStorage.getItem('token') || sessionStorage.getItem('token') || getCookie('token');
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }
};

// Clear axios headers
const clearAxiosHeaders = () => {
  delete axios.defaults.headers.common['Authorization'];
};

// Initialize headers when module loads
initializeAxiosHeaders();

export const checkAuth = async () => {
  try {
    const response = await api.get('/auth/verify');
    return response.data.isValid;
  } catch (error) {
    // Remove invalid token
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');
    clearCookie('token');
    return false;
  }
};

export const logout = () => {
  localStorage.removeItem('token');
  sessionStorage.removeItem('token');
  clearCookie('token');
  clearAxiosHeaders();
  toast.success('Successfully logged out');
};

export const setToken = (token, rememberMe = false) => {
  if (rememberMe) {
    setCookie('token', token, 7); // 7 days
  } else {
    localStorage.setItem('token', token);
  }
  initializeAxiosHeaders();
};

export const getToken = () => {
  // First try to get from cookie
  let token = getCookie('token');
  if (!token) {
    // If not in cookie, try localStorage and sessionStorage
    token = localStorage.getItem('token') || sessionStorage.getItem('token');
  }
  return token;
};

export const clearToken = () => {
  // Clear token from cookie
  document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
  
  // Clear from storage
  localStorage.removeItem('token');
  sessionStorage.removeItem('token');
  
  // Clear from axios headers
  delete axios.defaults.headers.common['Authorization'];
};

export const isAuthenticated = () => {
  return !!getToken();
};
