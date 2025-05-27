import React, { createContext, useContext, useState, useEffect } from 'react';
import { API_BASE_URL } from '../api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState(() => {
    const savedAuth = localStorage.getItem('authState');
    if (savedAuth) {
      try {
        return JSON.parse(savedAuth);
      } catch (e) {
        console.error('Error parsing auth state:', e);
        return { user: null, token: '' };
      }
    }
    return { user: null, token: '' };
  });

  const login = async (email, password) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Login failed');
      }

      const data = await response.json();
      
      // Handle both direct and nested response formats
      const userData = data.data?.data || data.data || data.user;
      const token = data.data?.token || data.token;

      if (!token || !userData) {
        throw new Error('Invalid response from server');
      }

      // Ensure we have a role property
      const normalizedUser = {
        ...userData,
        role: userData.role || 'user' // Default to 'user' if no role
      };

      const newAuth = { user: normalizedUser, token };
      
      // Store in localStorage immediately
      localStorage.setItem('authState', JSON.stringify(newAuth));
      setAuthState(newAuth);
      
      return { user: normalizedUser, token };
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    setAuthState({ user: null, token: '' });
    localStorage.removeItem('authState');
  };

  const fetchWithAuth = async (endpoint, config = {}) => {
    try {
      if (!authState.token) {
        throw new Error('No token available');
      }

      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authState.token}`,
        ...config.headers,
      };

      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...config,
        headers,
        credentials: 'include'
      });

      // For DELETE requests, we don't need to check response.ok
      if (config.method !== 'DELETE') {
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
        }
      }

      // Try to get the response data
      let data = await response.json();
      
      // Handle nested response structure
      if (data.data) {
        // If response has data.user, use that
        if (data.data.user) {
          data = data.data.user;
        } else {
          data = data.data;
        }
      } else if (data.user) {
        data = data.user;
      }

      return data;
    } catch (error) {
      console.error('Fetch error:', error);
      throw error;
    }
  };

  const updateUser = (userData) => {
    if (!userData) return null;
    
    // Always update the user data
    const newAuth = { ...authState, user: userData };
    setAuthState(newAuth);
    localStorage.setItem('authState', JSON.stringify(newAuth));
    return true; // Always return true to indicate update
  };

  // Load auth state from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('authState');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (parsed.token && parsed.user) {
          // Normalize the user data to ensure we have a role property
          const normalizedUser = {
            ...parsed.user,
            role: parsed.user.role || 'user' // Default to 'user' if no role
          };
          
          // Only update if we don't already have the data
          if (!authState.user || JSON.stringify(authState.user) !== JSON.stringify(normalizedUser)) {
            setAuthState({ ...parsed, user: normalizedUser });
          }
        }
      } catch (err) {
        console.error('Invalid auth state:', err);
        logout();
      }
    }
  }, [authState.token, logout]);

  // Update auth state and validate token
  useEffect(() => {
    if (!authState.token) {
      localStorage.removeItem('authState');
      return;
    }

    try {
      // Verify token
      const token = authState.token;
      const [_, payloadB64] = token.split('.');
      const payloadStr = atob(payloadB64.replace(/-/g, '+').replace(/_/g, '/'));
      const payload = JSON.parse(payloadStr);
      
      const currentTime = Math.floor(Date.now() / 1000);
      if (payload.exp && payload.exp < currentTime) {
        throw new Error('Token expired');
      }
    } catch (error) {
      console.error('Token validation error:', error);
      logout();
    }
  }, [authState.token, logout]);

  // Update auth state and validate token
  useEffect(() => {
    if (!authState.token) {
      localStorage.removeItem('authState');
      return;
    }

    try {
      // Verify token is still valid
      const [_, payloadB64] = authState.token.split('.');
      const payloadStr = atob(payloadB64.replace(/-/g, '+').replace(/_/g, '/'));
      const payload = JSON.parse(payloadStr);
      
      const currentTime = Math.floor(Date.now() / 1000);
      if (payload.exp && payload.exp < currentTime) {
        logout();
        return;
      }

      // Store valid auth state
      localStorage.setItem('authState', JSON.stringify(authState));
    } catch (error) {
      console.error('Error validating token:', error);
      logout();
    }
  }, [authState.token]);

  return (
    <AuthContext.Provider value={{
      ...authState,
      login,
      logout,
      updateUser,
      fetchWithAuth,
      isAdmin: () => authState.user?.role === 'admin'
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};