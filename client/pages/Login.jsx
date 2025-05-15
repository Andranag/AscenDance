import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { validateForm } from "../utils/formValidation";
import LoadingSpinner from "../components/LoadingSpinner";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const authContext = useAuth(); // Move this outside of async function

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Clear specific field error when user starts typing
    if (validationErrors[e.target.name]) {
      setValidationErrors(prev => ({ ...prev, [e.target.name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setValidationErrors({});

    // Validate form before submission
    const { isValid, errors } = validateForm(formData, 'login');
    if (!isValid) {
      setValidationErrors(errors);
      return;
    }

    setLoading(true);
    try {
      await authContext.login(formData.email, formData.password);
      
      toast.success('Login Successful!', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true
      });
      
      navigate("/", { replace: true });
    } catch (err) {
      console.error('Login error in component:', err);
      
      // Check if it's an axios error with response
      const errorMessage = err.response?.data?.message || 
                          err.message || 
                          "Login failed. Please try again.";
      
      setError(errorMessage);
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Logging in..." />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Sign in to your account</h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && <p className="text-red-500 text-center">{error}</p>}
          
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <input
                name="email"
                type="email"
                placeholder="Email address"
                className={`appearance-none rounded-none relative block w-full px-3 py-2 border ${validationErrors.email ? 'border-red-500' : 'border-gray-300'} placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm`}
                onChange={handleChange}
                required
              />
              {validationErrors.email && <p className="text-red-500 text-xs">{validationErrors.email}</p>}
            </div>
            <div>
              <div className="relative">
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <i className="fas fa-eye-slash text-gray-400"></i>
                  ) : (
                    <i className="fas fa-eye text-gray-400"></i>
                  )}
                </button>
              </div>
              {validationErrors.password && <p className="text-red-500 text-xs">{validationErrors.password}</p>}
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Sign in
            </button>
          </div>
        </form>
        <div className="text-center space-y-2">
          <p>Don't have an account? <a href="/register" className="text-indigo-600 hover:text-indigo-500">Register</a></p>
          <p><a href="/forgot-password" className="text-indigo-600 hover:text-indigo-500">Forgot Password?</a></p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
