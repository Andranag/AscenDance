import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import Navbar from "./components/Navbar";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import StudentDashboard from "./pages/StudentDashboard";
import CourseView from "./pages/CourseView";
import CourseContent from "./pages/CourseContent";
import Profile from "./pages/Profile";


// Protected Route component
const ProtectedRoute = ({ children }) => {
  const location = useLocation();

  // Check token existence
  const token = localStorage.getItem('token') || sessionStorage.getItem('token');
  
  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

// Wrap the app with AuthProvider
const App = () => {
  return (
    <Router>
      <Navbar>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Protected routes */}
          <Route path="/student/*" element={
            <ProtectedRoute>
              <Routes>
                <Route path="dashboard" element={<StudentDashboard />} />
                <Route path="courses" element={<StudentDashboard />} />
                <Route path="course/:id" element={<CourseView />} />
                <Route path="course/:courseId/content/:contentId" element={<CourseContent />} />
                <Route path="profile" element={<Profile />} />
              </Routes>
            </ProtectedRoute>
          } />
          
          {/* Catch-all route */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Navbar>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </Router>
  );
}

export default App;
