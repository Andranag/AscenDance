import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { token, user } = useAuth();
  const location = useLocation();

  // Check if we have both token and user data
  const isAuthenticated = !!token && !!user;

  // Handle navigation
  if (!isAuthenticated && 
      location.pathname !== '/login' && 
      location.pathname !== '/register' && 
      location.pathname !== '/courses' && 
      !location.pathname.startsWith('/courses/')) {
    return <Navigate to="/login" replace />;
  }

  // Allow access to courses page for non-authenticated users
  if (location.pathname === '/courses' || location.pathname.startsWith('/courses/')) {
    return children;
  }

  return children;
};

export default ProtectedRoute;
