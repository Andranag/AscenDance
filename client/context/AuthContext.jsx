import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { handleAxiosError } from '../utils/errorHandler';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check token on initial load
    const token = localStorage.getItem('token');
    if (token) {
      validateToken(token);
    } else {
      setLoading(false);
    }
  }, []);

  const validateToken = async (token) => {
    try {
      const response = await axios.get('http://localhost:3000/users/validate', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser(response.data.user);
      setIsAuthenticated(true);
    } catch (error) {
      const errorMessage = handleAxiosError(error);
      console.error('Token validation failed:', errorMessage);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      console.log('Attempting login with:', { email });
      
      // Configure axios to log request details
      axios.interceptors.request.use(config => {
        console.log('Axios Request:', {
          method: config.method,
          url: config.url,
          data: config.data
        });
        return config;
      }, error => {
        console.error('Axios Request Error:', error);
        return Promise.reject(error);
      });
      
      const response = await axios.post('http://localhost:3000/users/login', { email, password });
      console.log('Login response:', response.data);
      
      localStorage.setItem('token', response.data.token);
      setUser(response.data);
      setIsAuthenticated(true);
      return response.data;
    } catch (error) {
      console.error('Full login error:', {
        error: error,
        response: error.response,
        request: error.request,
        config: error.config
      });
      
      // More detailed error handling
      if (error.response) {
        // The request was made and the server responded with a status code
        console.error('Server responded with error:', {
          status: error.response.status,
          data: error.response.data,
          headers: error.response.headers
        });
        throw new Error(error.response.data.message || 'Login failed');
      } else if (error.request) {
        // The request was made but no response was received
        console.error('No response received:', error.request);
        throw new Error('No response from server. Please check your connection.');
      } else {
        // Something happened in setting up the request
        console.error('Error setting up request:', error.message);
        throw new Error('An unexpected error occurred');
      }
    }
  };

  const register = async (userData) => {
    try {
      const response = await axios.post('http://localhost:3000/users/register', userData);
      localStorage.setItem('token', response.data.token);
      setUser(response.data);
      setIsAuthenticated(true);
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated, 
      loading, 
      login, 
      register, 
      logout 
    }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

export default AuthContext;
