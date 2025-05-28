import React, { createContext, useContext, useState, useEffect } from 'react';
import { API_BASE_URL, fetchAuth } from '../api';

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

  const login = async (credentials) => {
    try {
      // Ensure credentials are in the correct format
      const formattedCredentials = {
        email: credentials.email,
        password: credentials.password
      };

      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formattedCredentials)
      });

      const data = await response.json();
      
      // Handle success case
      if (response.ok && data.success && data.data && data.data.token) {
        localStorage.setItem('token', data.data.token);
        setUser(data.data.user);
        return { success: true, ...data.data };
      }

      // Handle error case - specifically check for invalid credentials
      if (data.error) {
        if (data.error === 'Invalid credentials') {
          throw new Error('Invalid email or password');
        }
        throw new Error(data.error);
      }

      throw new Error('Invalid response format from server');
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      });

      const data = await response.json();
      
      if (data.success && data.data && data.data.token) {
        localStorage.setItem('token', data.data.token);
        setUser(data.data.user);
        return { success: true, ...data.data };
      }
      throw new Error('Invalid response from server');
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  useEffect(() => {
    setLoading(true);
    const token = localStorage.getItem('token');
    if (token) {
      // Load user data from localStorage
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
      // Also try to fetch fresh user data from API
      const fetchUserData = async () => {
        try {
          const response = await fetchAuth('/api/auth/profile');
          if (response && response.success && response.data) {
            setUser(response.data);
            localStorage.setItem('user', JSON.stringify(response.data));
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
          // If we can't fetch fresh data, keep the stored user data
        }
      };
      fetchUserData();
    }
    setLoading(false);
  }, []);

  const value = {
    user,
    loading,
    setUser,
    login,
    register,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};