import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { handleAxiosError } from '../utils/errorHandler';

// Configure base Axios instance
const api = axios.create({
  baseURL: 'http://localhost:3000',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Add a request interceptor to handle token injection
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    console.log('Axios Request:', {
      method: config.method,
      url: config.url,
      headers: config.headers
    });
    return config;
  },
  (error) => {
    console.error('Axios Request Setup Error:', error);
    return Promise.reject(error);
  }
);

// Add a response interceptor for global error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('Axios Global Error:', {
      error: error.message,
      response: error.response,
      request: error.request,
      config: error.config
    });
    return Promise.reject(error);
  }
);

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
      // Add token to Authorization header
      const response = await api.get('/users/validate-token', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      // Check if we got a valid user object
      if (response.data && response.data._id) {
        // The server returns the user data directly
        setUser(response.data);
        setIsAuthenticated(true);
      } else if (response.data && response.data.error) {
        // If we got an error response, handle it appropriately
        throw new Error(response.data.error);
      } else {
        // If we don't have a user object, but also no error, keep the token
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      const errorMessage = handleAxiosError(error);
      console.error('Token validation failed:', errorMessage);
      
      // Only remove token if it's an authentication error
      if (error.response) {
        if (error.response.status === 401 || error.response.status === 403) {
          localStorage.removeItem('token');
          setUser(null);
          setIsAuthenticated(false);
        } else {
          // For other errors, keep the token and try again later
          console.warn('Non-authentication error. Keeping token for retry.');
        }
      } else {
        // For network errors, keep the token and try again later
        console.warn('Network error. Keeping token for retry.');
      }
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      console.log('Attempting login with:', { email });
      
      const response = await api.post('/users/login', { email, password });
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

        // Specific handling for 429 Too Many Requests
        if (error.response.status === 429) {
          const retryAfter = error.response.headers['retry-after'] || 'a few minutes';
          throw new Error(`Too many login attempts. Please try again ${retryAfter}.`);
        }

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
      const response = await api.post('/users/register', userData);
      localStorage.setItem('token', response.data.token);
      setUser(response.data);
      setIsAuthenticated(true);
      return response.data;
    } catch (error) {
      console.error('Registration error:', error);
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
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

export default AuthContext;
