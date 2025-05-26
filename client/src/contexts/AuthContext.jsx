import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({
    user: null,
    isAdmin: false,
    token: ''
  });

  const login = async (token, userData) => {
    try {
      if (!token || !userData) {
        throw new Error('Invalid token or user data');
      }

      // Verify token format
      if (!token.startsWith('eyJ')) {
        throw new Error('Invalid token format');
      }

      // Store token and user data
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      
      // Update auth state
      setAuthState({
        user: userData,
        isAdmin: userData.role === 'admin',
        token
      });
      
      // Return success
      return true;
    } catch (error) {
      console.error('Error during login:', error);
      throw error;
    }
  };

  const logout = () => {
    // Clear all auth data
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setAuthState({
      user: null,
      isAdmin: false,
      token: ''
    });
  };

  // Initialize auth state from localStorage and verify token
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    
    if (storedToken && storedUser) {
      const userData = JSON.parse(storedUser);
      
      // Verify token format
      if (!storedToken.startsWith('eyJ')) {
        console.error('Invalid token format in localStorage');
        logout();
        return;
      }

      // Verify token expiration
      try {
        const decodedToken = JSON.parse(atob(storedToken.split('.')[1]));
        const currentTime = Math.floor(Date.now() / 1000);
        if (decodedToken.exp && decodedToken.exp < currentTime) {
          console.error('Token has expired');
          logout();
          return;
        }
      } catch (err) {
        console.error('Error decoding token:', err);
        logout();
        return;
      }

      // If token is valid, update auth state
      setAuthState({
        user: userData,
        isAdmin: userData.role === 'admin',
        token: storedToken
      });
    }
  }, []);

  return (
    <AuthContext.Provider value={{
      ...authState,
      login,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
