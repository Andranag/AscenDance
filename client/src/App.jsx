import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Courses from './pages/Courses';
import CoursePage from './pages/CoursePage';
import Profile from './pages/Profile';
import Navbar from './components/Navbar';
import AdminLayout from './components/Admin/AdminLayout';
import CourseManagement from './components/Admin/CourseManagement';
import UsersManagement from './components/Admin/UsersManagement';
import Analytics from './components/Admin/Analytics';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ToastProvider } from './contexts/ToastContext';

// Protected route component
const ProtectedRoute = ({ children }) => {
  const { token, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Check if we have both token and user data
  const isAuthenticated = !!token && !!user;

  // Handle navigation in useEffect
  useEffect(() => {
    // Only redirect to login for protected routes
    if (!isAuthenticated && location.pathname !== '/login' && 
        location.pathname !== '/register' && 
        location.pathname !== '/courses' && 
        !location.pathname.startsWith('/courses/')) {
      navigate('/login', { replace: true });
    }
  }, [isAuthenticated, location.pathname, navigate]);

  if (!isAuthenticated && 
      location.pathname !== '/login' && 
      location.pathname !== '/register' && 
      location.pathname !== '/courses' && 
      !location.pathname.startsWith('/courses/')) {
    return null;
  }

  return children;
};

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <BrowserRouter>
          <div className="app">
            <Navbar />
            <Routes>
              <Route path="/" element={<Navigate to="/courses" replace />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/courses" element={<Courses />} />
              <Route path="/courses/:id" element={<CoursePage />} />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/courses"
                element={
                  <ProtectedRoute>
                    <AdminLayout>
                      <CourseManagement />
                    </AdminLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/users"
                element={
                  <ProtectedRoute>
                    <AdminLayout>
                      <UsersManagement />
                    </AdminLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/analytics"
                element={
                  <ProtectedRoute>
                    <AdminLayout>
                      <Analytics />
                    </AdminLayout>
                  </ProtectedRoute>
                }
              />
            </Routes>
          </div>
        </BrowserRouter>
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;
