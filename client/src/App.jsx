import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Courses from './pages/Courses';
import CoursePage from './pages/CoursePage';
import AdminLayout from './components/Admin/AdminLayout';
import UsersManagement from './components/Admin/UsersManagement';
import CourseManagement from './components/Admin/CourseManagement';
import Analytics from './components/Admin/Analytics';
import { useAuth } from './contexts/AuthContext';
import Toast from './components/Toast';

function App() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-custom flex flex-col">
      <Navbar />
      <Toast />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" />} />
          <Route path="/login" element={!user ? <Login /> : <Navigate to="/dashboard" />} />
          <Route path="/register" element={!user ? <Register /> : <Navigate to="/dashboard" />} />
          <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/login" />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/course/:id" element={<CoursePage />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route path="users" element={<UsersManagement />} />
            <Route path="courses" element={<CourseManagement />} />
            <Route path="analytics" element={<Analytics />} />
          </Route>
        </Routes>
      </main>
    </div>
  );
}

export default App;