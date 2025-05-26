import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Courses from './pages/Courses';
import CoursePage from './pages/CoursePage';
import Profile from './pages/Profile';
import Navbar from './components/Navbar';
import AdminLayout from './components/Admin/AdminLayout';
import CourseManagement from './components/Admin/CourseManagement';

function App() {
  const token = localStorage.getItem('token');
  const user = token ? JSON.parse(localStorage.getItem('user')) : null;
  const isAdmin = user?.role === 'admin';

  return (
    <BrowserRouter>
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Navbar />
        {isAdmin ? (
          <AdminLayout>
            <Routes>
              <Route path="/" element={<Courses />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/courses" element={<Courses />} />
              <Route path="/course/:courseId" element={<CoursePage />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/admin/*" element={
                <Routes>
                  <Route index element={<CourseManagement />} />
                  <Route path="courses" element={<CourseManagement />} />
                  <Route path="dashboard" element={<CourseManagement />} />
                </Routes>
              } />
            </Routes>
          </AdminLayout>
        ) : (
          <Routes>
            <Route path="/" element={<Courses />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/course/:courseId" element={<CoursePage />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        )}
      </div>
    </BrowserRouter>
  );
}

export default App;
