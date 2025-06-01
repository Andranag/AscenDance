import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
import { showToast } from '../utils/toast';
import { validationUtils } from '../utils/validation';
import { responseUtils } from '../utils/response';
import { apiErrorUtils } from '../utils/apiError';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { toastSuccess, toastError } = useToast();
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Validate form
    const validation = validationUtils.validateLogin(formData);
    if (!validation.isValid) {
      showToast.fromResponse(validation.toResponse());
      setLoading(false);
      return;
    }

    try {
      const response = await login(formData);
      if (responseUtils.isSuccess(response)) {
        const userName = response.data.name || formData.email.split('@')[0] || 'User';
        showToast.success(`Welcome back, ${userName}!`);
        navigate('/');
      } else {
        showToast.fromResponse(response);
      }
    } catch (error) {
      const errorResponse = apiErrorUtils.handleAuthError(error);
      showToast.fromResponse(errorResponse);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-auth-pattern">
      <div className="w-full max-w-md">
        <div className="card backdrop-blur-sm bg-white/95">
          <div className="px-6 py-8 sm:p-10">
            <div className="text-center mb-8">
              <h1 className="heading-primary">Welcome Back</h1>
              <p className="text-secondary">Sign in to continue your dance journey</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email address
                </label>
                <div className="relative rounded-md shadow-sm">
                  <button
                    type="button"
                    className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-600 hover:text-primary focus:outline-none transition-colors"
                  >
                    <Mail className="h-5 w-5 text-gray-500" />
                  </button>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="input-field pl-10"
                    placeholder="name@example.com"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <div className="relative rounded-md shadow-sm">
                  <button
                    type="button"
                    className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-600 hover:text-primary focus:outline-none transition-colors"
                  >
                    <Lock className="h-5 w-5 text-gray-500" />
                  </button>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="input-field pl-10 pr-10"
                    placeholder="••••••••"
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="focus:outline-none transition-all"
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5 text-gray-700 hover:text-gray-600" />
                      ) : (
                        <Eye className="h-5 w-5 text-gray-700 hover:text-primary" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-accent focus:ring-primary border-gray-300 rounded"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                    Remember me
                  </label>
                </div>
                <div className="text-sm">
                  <a href="#" className="font-medium text-gray-600 hover:text-primary transition-colors">
                    Forgot password?
                  </a>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`btn-primary w-full ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin h-5 w-5 mr-2 border-2 border-white border-t-transparent rounded-full"></div>
                    Signing in...
                  </div>
                ) : (
                  'Sign in'
                )}
              </button>
            </form>
          </div>
          
          <div className="px-6 py-4 bg-gray-50/50 border-t border-gray-100 sm:px-10 rounded-b-xl">
            <p className="text-sm text-center text-gray-600">
              Don't have an account?{' '}
              <Link to="/register" className="font-medium text-primary-link">
                Join the dance community
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;