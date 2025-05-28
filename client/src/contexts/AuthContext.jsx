import React, { createContext, useContext, useState, useEffect } from 'react';
import { API_BASE_URL } from '../api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState(() => {
    const savedAuth = localStorage.getItem('authState');
    if (savedAuth) {
      try {
        const parsed = JSON.parse(savedAuth);
        if (parsed.token && parsed.user) {
          return {
            user: {
              ...parsed.user,
              role: parsed.user.role || 'user'
            },
            token: parsed.token
          };
        }
      } catch (e) {
        console.error('Error parsing auth state:', e);
      }
    }
    return { user: null, token: '' };
  });

  const login = async (email, password) => {
    try {
      console.log('Attempting login with email:', email);
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      console.log('Login response status:', response.status);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Login error response:', errorData);
        throw new Error(errorData.error || 'Login failed');
      }

      const data = await response.json();
      console.log('Login response data:', JSON.stringify(data, null, 2));
      
      // Handle both direct and nested response formats
      const userData = data?.data?.user || data?.user;
      const token = data?.data?.token || data?.token;

      if (!token || !userData) {
        console.error('Invalid response format:', data);
        throw new Error('Invalid response from server');
      }

      console.log('User data:', userData);
      console.log('Token:', token.substring(0, 10) + '...');

      // Ensure we have a role property
      const normalizedUser = {
        ...userData,
        role: userData.role || 'user' // Default to 'user' if no role
      };

      // Store in localStorage immediately
      localStorage.setItem('authState', JSON.stringify({
        user: {
          id: userData.id,
          name: userData.name,
          email: userData.email,
          role: userData.role || 'user'
        },
        token
      }));
      
      // Update auth state
      setAuthState({
        user: normalizedUser,
        token
      });
      
      return { user: normalizedUser, token };
    } catch (error) {
      console.error('Login error:', error);
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

      // Ensure endpoint starts with '/api/'
      const fullEndpoint = endpoint.startsWith('/api/') ? endpoint : `/api${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
      
      const response = await fetch(`${API_BASE_URL}${fullEndpoint}`, {
        ...config,
        headers,
        credentials: 'include'
      });

      if (!response.ok) {
        // Handle DELETE responses differently
        if (config.method === 'DELETE') {
          // For DELETE requests, we don't need to parse the response
          // Just throw the error with status
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        // Handle 404 errors differently for admin routes
        if (response.status === 404 && endpoint.startsWith('/api/admin/')) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || 'Resource not found');
        }
        // Handle other 404 errors silently
        if (response.status === 404) {
          return null;
        }
        // Handle other errors
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      } else if (config.method === 'DELETE') {
        // For successful DELETE requests, just return
        return null;
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
      } else {
        // For simple responses, return the entire data object
        return data;
      }

      // For admin routes, return the full response
      if (endpoint.startsWith('/admin/')) {
        return data;
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