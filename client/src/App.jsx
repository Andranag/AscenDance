import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Courses from './pages/Courses';
import CoursePage from './pages/CoursePage';
import Profile from './pages/Profile';
import Navbar from './components/Navbar';
import AdminLayout from './components/Admin/AdminLayout';
import CourseManagement from './components/Admin/CourseManagement';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ToastProvider } from './contexts/ToastContext';

// Protected route component
const ProtectedRoute = ({ children }) => {
  const { token, user } = useAuth();
  const navigate = useNavigate();

  // Check if we have both token and user data
  if (!token || !user) {
    // Only navigate if we're not already on login page
    if (window.location.pathname !== '/login') {
      navigate('/login', { replace: true });
    }
    return null;
  }

  return children;
};

function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <BrowserRouter>
          <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Navbar />
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/profile" element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } />
              <Route path="/admin/*" element={
                <AdminLayout>
                  <Routes>
                    <Route index element={<CourseManagement />} />
                    <Route path="courses" element={<CourseManagement />} />
                    <Route path="dashboard" element={<CourseManagement />} />
                  </Routes>
                </AdminLayout>
              } />
              <Route path="/" element={<Courses />} />
              <Route path="/courses" element={<Courses />} />
              <Route path="/course/:courseId" element={<CoursePage />} />
            </Routes>
          </div>
        </BrowserRouter>
      </AuthProvider>
    </ToastProvider>
  );
}

export default App;
