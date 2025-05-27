import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastProvider } from './contexts/ToastContext';

import Login from './pages/Login';
import Register from './pages/Register';
import Courses from './pages/Courses';
import CoursePage from './pages/CoursePage';
import Profile from './pages/Profile';
import CourseManagement from './components/Admin/CourseManagement';
import UsersManagement from './components/Admin/UsersManagement';
import Analytics from './components/Admin/Analytics';
import ProtectedRoute from './components/ProtectedRoute';
import AdminLayout from './components/Admin/AdminLayout';
import Navbar from './components/Navbar';
import { AuthProvider } from './contexts/AuthContext';

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <BrowserRouter>
          <div className="app" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Navbar />
            <div style={{ flex: 1, padding: '1rem' }}>
              <Routes>
                <Route path="/" element={<Navigate to="/courses" replace />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                
                {/* Public routes */}
                <Route
                  path="/courses"
                  element={
                    <Courses />
                  }
                />
                
                {/* Protected routes */}
                <Route
                  path="/courses/:id"
                  element={
                    <ProtectedRoute>
                      <div style={{
                        padding: '2rem',
                        backgroundColor: 'white',
                        flex: 1,
                        overflow: 'auto'
                      }}>
                        <CoursePage />
                      </div>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <div style={{
                        padding: '2rem',
                        backgroundColor: 'white',
                        flex: 1,
                        overflow: 'auto'
                      }}>
                        <Profile />
                      </div>
                    </ProtectedRoute>
                  }
                />
                
                {/* Admin routes */}
                <Route
                  path="/admin/*"
                  element={
                    <ProtectedRoute>
                      <AdminLayout>
                        <Routes>
                          <Route
                            index
                            element={<Navigate to="courses" replace />}
                          />
                          <Route
                            path="courses"
                            element={<CourseManagement />}
                          />
                          <Route
                            path="users"
                            element={<UsersManagement />}
                          />
                          <Route
                            path="analytics"
                            element={<Analytics />}
                          />
                        </Routes>
                      </AdminLayout>
                    </ProtectedRoute>
                  }
                />
              </Routes>
            </div>
          </div>
        </BrowserRouter>
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;
