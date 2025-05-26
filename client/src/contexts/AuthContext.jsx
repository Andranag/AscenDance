import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children, render }) => {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [token, setToken] = useState(null);

  // Function to handle login
  const login = (newToken, userData) => {
    try {
      localStorage.setItem('token', newToken);
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      setIsAdmin(userData.role === 'admin');
      setToken(newToken);
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
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setIsAdmin(false);
    setToken(null);
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
        setToken(response.token);
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
        setUser(parsedUser);
        setIsAdmin(parsedUser.role === 'admin');
        setToken(storedToken);
      } catch (error) {
        console.error('Error initializing auth state:', error);
        // Clear invalid data
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        setIsAdmin(false);
        setToken(null);
      }
    } else {
      setUser(null);
      setIsAdmin(false);
      setToken(null);
    }
  }, []);

  const authContextValue = {
    user,
    isAdmin,
    token,
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
