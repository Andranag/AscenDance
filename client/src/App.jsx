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
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={
          <>
            <Navbar />
            <Courses />
          </>
        } />
        <Route path="/login" element={
          <>
            <Navbar />
            <Login />
          </>
        } />
        <Route path="/register" element={
          <>
            <Navbar />
            <Register />
          </>
        } />
        <Route path="/courses" element={
          <>
            <Navbar />
            <Courses />
          </>
        } />
        <Route path="/course/:courseId" element={
          <>
            <Navbar />
            <CoursePage />
          </>
        } />
        <Route path="/profile" element={
          <>
            <Navbar />
            <Profile />
          </>
        } />
        <Route path="/admin" element={
          <AdminLayout>
            <Routes>
              <Route index element={<CourseManagement />} />
              <Route path="courses" element={<CourseManagement />} />
              <Route path="dashboard" element={<CourseManagement />} />
            </Routes>
          </AdminLayout>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
