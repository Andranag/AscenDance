import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
  useNavigate,
} from "react-router-dom";
import Navbar from "./components/Navbar";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import StudentDashboard from "./pages/StudentDashboard";
import MyCourses from "./pages/MyCourses";
import CourseView from "./pages/CourseView";
import CourseContent from "./pages/CourseContent";
import Profile from "./pages/Profile";
import { AuthProvider, useAuth } from "./contexts/AuthContext";

// Protected Route component
const ProtectedRoute = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const { token } = useAuth();
  const isAuthenticated = !!token;

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login", { state: { from: location }, replace: true });
    }
  }, [location, navigate, isAuthenticated]);

  return isAuthenticated ? children : null;
};

// Error Boundary component
const ErrorBoundary = ({ children }) => {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-center text-white">
          <h1 className="text-4xl font-bold mb-4">Something went wrong</h1>
          <p className="text-gray-400 mb-6">Please try refreshing the page or contact support.</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  }

  return children;
};

// Wrap the app with AuthProvider
const App = () => {
  return (
    <AuthProvider>
      <ErrorBoundary>
        <Router>
          <div className="min-h-screen">
            <Navbar />
            <ToastContainer
              position="top-right"
              autoClose={5000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="dark"
            />
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <Home />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/student-dashboard"
                element={
                  <ProtectedRoute>
                    <StudentDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/my-courses"
                element={
                  <ProtectedRoute>
                    <MyCourses />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/courses/:courseId"
                element={
                  <ProtectedRoute>
                    <CourseView />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/courses/:courseId/content/:contentId"
                element={
                  <ProtectedRoute>
                    <CourseContent />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </Router>
      </ErrorBoundary>
    </AuthProvider>
  );
};

export default App;
