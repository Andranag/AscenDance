import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import SignIn from './pages/SignIn';
import Register from './pages/Register';
import Courses from './pages/Courses';
import CoursePage from './pages/CoursePage';
import Profile from './pages/Profile';
import Navbar from './components/Navbar';
import AdminLayout from './components/Admin/AdminLayout';
import CourseManagement from './components/Admin/CourseManagement';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ToastProvider } from './contexts/ToastContext';

function App() {
  return (
    <ToastProvider>
      <AuthProvider render={({ isAdmin }) => (
        <BrowserRouter>
          <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Navbar />
            <Routes>
              <Route path="/" element={<Courses />} />
              <Route path="/login" element={<SignIn />} />
              <Route path="/register" element={<Register />} />
              <Route path="/courses" element={<Courses />} />
              <Route path="/course/:courseId" element={<CoursePage />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/admin/*" element={
                isAdmin ? (
                  <AdminLayout>
                    <Routes>
                      <Route index element={<CourseManagement />} />
                      <Route path="courses" element={<CourseManagement />} />
                      <Route path="dashboard" element={<CourseManagement />} />
                    </Routes>
                  </AdminLayout>
                ) : (
                  <Navigate to="/" replace />
                )
              } />
            </Routes>
          </div>
        </BrowserRouter>
      )} />
    </ToastProvider>
  );
}

export default App;
