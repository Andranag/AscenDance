import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { validateForm } from "../utils/formValidation";
import LoadingSpinner from "../components/LoadingSpinner";

const LoginPage = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const navigate = useNavigate();

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
      const response = await axios.post("http://localhost:3000/users/login", formData);
      localStorage.setItem("token", response.data.token);
      navigate("/"); // Redirect after login
    } catch (err) {
      const errorResponse = err.response?.data;
      setError(errorResponse?.message || "Login failed");
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
              <input
                name="password"
                type="password"
                placeholder="Password"
                className={`appearance-none rounded-none relative block w-full px-3 py-2 border ${validationErrors.password ? 'border-red-500' : 'border-gray-300'} placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm`}
                onChange={handleChange}
                required
              />
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
