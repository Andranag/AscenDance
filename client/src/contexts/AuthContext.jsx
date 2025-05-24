import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../config/axiosConfig';
import { toast } from 'react-toastify';
import { setToken, clearToken } from '../utils/tokenManager';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setTokenState] = useState(localStorage.getItem('token'));

  const login = async (credentials) => {
    try {
      console.log('Attempting login with credentials:', credentials);
      const response = await api.post('/auth/login', credentials);
      console.log('Login response received:', response);
      
      if (!response.success) {
        throw new Error(response.message || 'Login failed');
      }
      
      setToken(response.token);
      setTokenState(response.token);
      setUser(response.user);
      
      return response;
    } catch (error) {
      console.error('Login error:', error.response?.data);
      const errorMessage = error.response?.data?.message || 'Login failed';
      toast.error(errorMessage);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
      setTokenState(null);
      setUser(null);
      clearToken();
    } catch (error) {
      console.error('Logout error:', error);
      setTokenState(null);
      setUser(null);
      clearToken();
    }
  };

  const updateUserProfile = async (userData) => {
    try {
      const response = await api.put('/auth/profile', userData);
      setUser(response.data.user);
      return response.data.user;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to update profile';
      toast.error(errorMessage);
      throw error;
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await api.get('/auth/verify');
        if (response.data.isValid) {
          const profileResponse = await api.get('/auth/profile');
          setUser(profileResponse.data.user);
        }
      } catch (error) {
        setUser(null);
        setTokenState(null);
        clearToken();
      }
    };
    fetchUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, login, logout, updateUserProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  return context;
};

export default AuthContext;
