import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { validateForm } from "../utils/formValidation";
import LoadingSpinner from "../components/LoadingSpinner";

const RegisterPage = () => {
  const [formData, setFormData] = useState({ name: "", email: "", password: "", role: "student" });
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
    const { isValid, errors } = validateForm(formData, 'register');
    if (!isValid) {
      setValidationErrors(errors);
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post("http://localhost:3000/users/register", formData);
      navigate("/login"); // Redirect after successful registration
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Registering..." />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Create your account</h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && <p className="text-red-500 text-center">{error}</p>}
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <input
                name="name"
                type="text"
                placeholder="Full Name"
                className={`appearance-none rounded-none relative block w-full px-3 py-2 border ${validationErrors.name ? 'border-red-500' : 'border-gray-300'} placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm`}
                onChange={handleChange}
                required
              />
              {validationErrors.name && <p className="text-red-500 text-xs">{validationErrors.name}</p>}
            </div>
            <div>
              <input
                name="email"
                type="email"
                placeholder="Email address"
                className={`appearance-none rounded-none relative block w-full px-3 py-2 border ${validationErrors.email ? 'border-red-500' : 'border-gray-300'} placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm`}
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
            <div>
              <select
                name="role"
                className={`appearance-none rounded-none relative block w-full px-3 py-2 border ${validationErrors.role ? 'border-red-500' : 'border-gray-300'} placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm`}
                onChange={handleChange}
              >
                <option value="student">Student</option>
                <option value="admin">Admin</option>
              </select>
              {validationErrors.role && <p className="text-red-500 text-xs">{validationErrors.role}</p>}
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Register
            </button>
          </div>
        </form>
        <div className="text-center">
          <p>Already have an account? <a href="/login" className="text-indigo-600 hover:text-indigo-500">Sign in</a></p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
