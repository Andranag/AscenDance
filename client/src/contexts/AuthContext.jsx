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

      const newAuth = { user: userData, token };
      
      // Store in localStorage immediately
      localStorage.setItem('authState', JSON.stringify(newAuth));
      setAuthState(newAuth);
      
      return { success: true, user: userData, token };
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

      // Add network settings
      const fetchConfig = {
        ...config,
        headers,
        credentials: 'include',
        method: config.method || 'GET',
      };

      // Add timeout to prevent hanging requests
      const controller = new AbortController();
      const id = setTimeout(() => controller.abort(), 30000); // 30 second timeout

      try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
          ...fetchConfig,
          signal: controller.signal
        });

        clearTimeout(id);

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          
          // Handle specific error cases
          if (errorData.error?.includes('token expired') || 
              errorData.error?.includes('Token expired') || 
              errorData.error?.includes('Invalid token')) {
            logout();
            throw new Error('Session expired. Please log in again.');
          }
          
          throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        
        // Handle both direct and nested response formats
        if (data && typeof data === 'object') {
          if (data.success && data.data) {
            return data.data;
          }
          if (data.data) {
            return data.data;
          }
          if (data.user) {
            return data.user;
          }
        }
        
        return data;
      } catch (error) {
        if (error.name === 'AbortError') {
          throw new Error('Request timed out');
        }
        console.error('Fetch error:', error);
        throw new Error('Network error. Please check your connection.');
      }
    } catch (error) {
      console.error('fetchWithAuth error:', error);
      throw error;
    }
  };

  const updateUser = (userData) => {
    if (!userData) return;
    
    const newAuth = { ...authState, user: { ...authState.user, ...userData } };
    setAuthState(newAuth);
    localStorage.setItem('authState', JSON.stringify(newAuth));
  };

  // Load auth state from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('authState');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (parsed.token && parsed.user) {
          // Verify token before setting state
          try {
            const token = parsed.token;
            const [_, payloadB64] = token.split('.');
            const payloadStr = atob(payloadB64.replace(/-/g, '+').replace(/_/g, '/'));
            const payload = JSON.parse(payloadStr);
            
            const currentTime = Math.floor(Date.now() / 1000);
            if (payload.exp && payload.exp < currentTime) {
              throw new Error('Token expired');
            }
            
            setAuthState(parsed);
          } catch (err) {
            console.error('Invalid token:', err);
            logout();
          }
        } else {
          logout();
        }
      } catch (error) {
        console.error('Error loading auth state:', error);
        logout();
      }
    }
  }, []);

  // Update auth state when token changes
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

  // Update auth state when token changes
  useEffect(() => {
    if (authState.token) {
      localStorage.setItem('authState', JSON.stringify(authState));
    } else {
      localStorage.removeItem('authState');
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
