import axios from 'axios';
import { toast } from 'react-toastify';

const API_URL = 'http://localhost:3050/api/auth';

export const checkAuth = async () => {
  try {
    // Get token from cookie first
    let token = getCookie('token');
    if (!token) {
      // If not in cookie, check localStorage and sessionStorage
      token = localStorage.getItem('token') || sessionStorage.getItem('token');
    }
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
  // Set token in cookie with SameSite=Lax for security
  document.cookie = `token=${token}; path=/; SameSite=Lax`;
  
  // Also store in localStorage/sessionStorage
  const storage = rememberMe ? localStorage : sessionStorage;
  storage.setItem('token', token);
  
  // Set in axios headers
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
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
