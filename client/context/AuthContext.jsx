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
      const response = await axios.post('http://localhost:3000/users/login', { email, password });
      localStorage.setItem('token', response.data.token);
      setUser(response.data);
      setIsAuthenticated(true);
      return response.data;
    } catch (error) {
      const errorMessage = handleAxiosError(error);
      console.error('Login error:', errorMessage);
      throw new Error(errorMessage);
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
