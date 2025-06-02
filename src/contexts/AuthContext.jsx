import React, { createContext, useContext, useState, useEffect } from 'react';
import { api, API_ENDPOINTS } from '../utils/api';
import { showToast } from '../utils/toast';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = import.meta.env.VITE_API_TOKEN || localStorage.getItem('token');
    if (token) {
      setUser({
        token,
        id: 'anonymous',
        name: 'Anonymous',
        email: 'anonymous@example.com',
        role: 'user'
      });
    }
    setLoading(false);
  }, []);

  const updateProfile = async (data) => {
    try {
      const userData = await api.put(API_ENDPOINTS.profile, data);
      
      // Update local storage
      const currentUser = JSON.parse(localStorage.getItem('user'));
      localStorage.setItem('user', JSON.stringify({
        ...currentUser,
        name: userData.name,
        email: userData.email
      }));
      
      // Update state with full user data
      setUser(prev => ({
        ...prev,
        ...userData,
        token: prev.token
      }));
      
      return userData;
    } catch (error) {
      const errorResponse = handleApiError(error);
      showToast.error(errorResponse.message);
      throw errorResponse;
    }
  };

  const login = async (credentials) => {
    try {
      const data = await api.post(API_ENDPOINTS.login, credentials);
      
      // Store the token and user data
      localStorage.setItem('token', data.data.token);
      localStorage.setItem('user', JSON.stringify({
        id: data.data.id,
        name: data.data.name,
        email: data.data.email,
        role: data.data.role
      }));
      
      setUser({
        id: data.data.id,
        name: data.data.name,
        email: data.data.email,
        role: data.data.role,
        token: data.data.token
      });
      return data;
    } catch (error) {
      const errorResponse = handleApiError(error);
      showToast.error(errorResponse.message);
      throw errorResponse;
    }
  };

  const register = async (userData) => {
    try {
      const response = await api.post(API_ENDPOINTS.register, userData);
      
      // Store token
      localStorage.setItem('token', response.token);
      
      // Store user data
      localStorage.setItem('user', JSON.stringify({
        id: response.data.id,
        name: response.data.name,
        email: response.data.email,
        role: response.data.role
      }));
      
      // Update auth state
      setUser({
        id: response.data.id,
        name: response.data.name,
        email: response.data.email,
        role: response.data.role,
        token: response.token
      });
      
      return response;
    } catch (error) {
      const errorResponse = handleApiError(error);
      showToast.error(errorResponse.message);
      throw errorResponse;
    }
  };

  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      login, 
      register, 
      logout,
      updateProfile
    }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};