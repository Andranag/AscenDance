import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children, render }) => {
  const [authState, setAuthState] = useState({
    user: null,
    isAdmin: false,
    token: null
  });

  const { user, isAdmin, token } = authState;

  // Function to handle login
  const login = (newToken, userData) => {
    try {
      localStorage.setItem('token', newToken);
      localStorage.setItem('user', JSON.stringify(userData));
      setAuthState({
        user: userData,
        isAdmin: userData.role === 'admin',
        token: newToken
      });
    } catch (error) {
      console.error('Error during login:', error);
      // Clear invalid data
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
      setIsAdmin(false);
      setToken(null);
      throw error;
    }
  };

  // Function to handle logout
  const logout = () => {
    try {
      // Clear localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // Update auth state
      setAuthState({
        user: null,
        isAdmin: false,
        token: null
      });

      // Force re-render by updating state again
      setAuthState(prev => ({
        ...prev,
        token: null
      }));
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  // Function to refresh token
  const refreshToken = async () => {
    try {
      const response = await fetchPublic('/api/auth/refresh', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.token) {
        localStorage.setItem('token', response.token);
        setAuthState(prev => ({
          ...prev,
          token: response.token
        }));
        return response.token;
      }
      throw new Error('Failed to refresh token');
    } catch (error) {
      console.error('Token refresh failed:', error);
      logout();
      throw error;
    }
  };

  // Initialize auth state from localStorage
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (storedToken && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setAuthState({
          user: parsedUser,
          isAdmin: parsedUser.role === 'admin',
          token: storedToken
        });
        return () => {
          // Cleanup function - clear localStorage when component unmounts
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        };
      } catch (error) {
        console.error('Error initializing auth state:', error);
        // Clear invalid data
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setAuthState({
          user: null,
          isAdmin: false,
          token: null
        });
      }
    } else {
      setAuthState({
        user: null,
        isAdmin: false,
        token: null
      });
    }
  }, []);

  const authContextValue = {
    ...authState,
    login,
    logout,
    refreshToken
  };

  const renderContent = () => {
    if (render) {
      return render(authContextValue);
    }
    return children;
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      {renderContent()}
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
