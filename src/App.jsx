import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import LandingPage from './pages/LandingPage';
import Courses from './pages/Courses';
import CoursePage from './pages/CoursePage';
import CourseManagement from './pages/admin/CourseManagement';
import UsersManagement from './pages/admin/UsersManagement';
import Analytics from './pages/admin/Analytics';
import { useAuth } from './contexts/AuthContext';
import { ToastProvider } from './contexts/ToastContext';
import Toast from './components/Toast';

function App() {
  console.log('App component rendering');
  const { user, loading } = useAuth();
  console.log('User:', user);
  const isAdmin = user?.role === 'admin';

  const AdminRoute = ({ children }) => {
    if (!user || !isAdmin) {
      return <Navigate to="/" />;
    }
    return children;
  };

  const isAuthPage = window.location.pathname === '/login' || window.location.pathname === '/register';

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-neutral-900 to-neutral-800 flex flex-col">
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
        </div>
      </div>
    );
  }

  return (
    <ToastProvider>
      <div className="min-h-screen bg-gradient-to-br from-neutral-900 to-neutral-800 flex flex-col">
        {!isAuthPage && user && <Navbar />}
        <div className="flex-1">
          <main className="min-h-screen">
            <Routes>
              {/* Public Routes */}
              <Route path="/login" element={
                !user ? (
                  <Login />
                ) : (
                  <Navigate to="/" replace />
                )
              } />
              <Route path="/register" element={
                !user ? (
                  <Register />
                ) : (
                  <Navigate to="/" replace />
                )
              } />
              <Route path="/" element={
                <LandingPage />
              } />
              <Route path="/courses" element={
                <Courses />
              } />
              <Route path="/course/:courseId" element={
                <CoursePage />
              } />

              {/* Protected Routes */}
              <Route path="/profile" element={user ? <Profile /> : <Navigate to="/login" />} />

              {/* Admin Routes */}
              <Route path="/admin/analytics" element={
                <AdminRoute>
                  <Analytics />
                </AdminRoute>
              } />
              <Route path="/admin/courses" element={
                <AdminRoute>
                  <CourseManagement />
                </AdminRoute>
              } />
              <Route path="/admin/users" element={
                <AdminRoute>
                  <UsersManagement />
                </AdminRoute>
              } />
              <Route path="/admin" element={<Navigate to="/admin/analytics" replace />} />

              {/* Catch all route */}
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </main>
          {!isAuthPage && <Footer />}
        </div>
        <Toast />
      </div>
    </ToastProvider>
  );
}

export default App;