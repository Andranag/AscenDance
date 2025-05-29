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
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  const AdminRoute = ({ children }) => {
    if (!user || !isAdmin) {
      return <Navigate to="/" />;
    }
    return children;
  };

  const isAuthPage = window.location.pathname === '/login' || window.location.pathname === '/register';

  return (
    <ToastProvider>
      <div className="min-h-screen bg-gradient-custom flex flex-col">
        {!isAuthPage && user && <Navbar />}
        <div className="flex-1">
          <main className="min-h-screen">
            <Routes>
              {/* Public Routes */}
              <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
              <Route path="/register" element={!user ? <Register /> : <Navigate to="/" />} />
              <Route path="/" element={<LandingPage />} />
              <Route path="/courses" element={<Courses />} />
              <Route path="/course/:courseId" element={<CoursePage />} />

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