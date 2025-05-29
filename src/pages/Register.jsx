import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { Eye, EyeOff, Mail, Lock, User, Check, X, AlertCircle, Shield } from 'lucide-react';

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const { toastSuccess, toastError } = useToast();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [confirmPasswordFocused, setConfirmPasswordFocused] = useState(false);

  const passwordRequirements = {
    minLength: formData.password.length >= 8,
    hasUpperCase: /[A-Z]/.test(formData.password),
    hasLowerCase: /[a-z]/.test(formData.password),
    hasNumber: /\d/.test(formData.password),
    hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(formData.password)
  };

  const passwordStrength = Object.values(passwordRequirements).filter(Boolean).length;
  const passwordsMatch = formData.password === formData.confirmPassword && formData.confirmPassword !== '';
  const showPasswordMatch = confirmPasswordFocused || formData.confirmPassword !== '';

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!passwordsMatch) {
      toastError('Passwords do not match');
      return;
    }
    
    if (passwordStrength < 3) {
      toastError('Password is too weak');
      return;
    }
    
    setLoading(true);

    try {
      const result = await register(formData);
      const userName = result?.user?.name || formData.name || 'User';
      toastSuccess(`Welcome to Ascendance, ${userName}! Let's start your dance journey!`);
      navigate('/login');
    } catch (err) {
      console.error('Registration error:', err);
      toastError(err.message || 'Registration failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const getStrengthText = () => {
    if (passwordStrength <= 1) return 'Very Weak';
    if (passwordStrength <= 2) return 'Weak';
    if (passwordStrength <= 3) return 'Medium';
    if (passwordStrength <= 4) return 'Strong';
    return 'Very Strong';
  };

  const getStrengthColor = () => {
    if (passwordStrength <= 2) return 'bg-red-500';
    if (passwordStrength <= 3) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const renderRequirementIcon = (fulfilled) => {
    return fulfilled ? (
      <Check className="h-4 w-4 text-accent" />
    ) : (
      <X className="h-4 w-4 text-red-400" />
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-auth-pattern">
      <div className="w-full max-w-md">
        <div className="card backdrop-blur-sm bg-white/95">
          <div className="px-6 py-8 sm:p-10">
            <div className="text-center mb-6">
              <h1 className="heading-primary">Join Ascendance</h1>
              <p className="text-secondary">Begin your dance journey today</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Full Name
                </label>
                <div className="relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-secondary" />
                  </div>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="input-field pl-10"
                    placeholder="Your name"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email address
                </label>
                <div className="relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-secondary" />
                  </div>
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
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-secondary" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    onFocus={() => setPasswordFocused(true)}
                    onBlur={() => setPasswordFocused(false)}
                    className="input-field pl-10 pr-10"
                    placeholder="••••••••"
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-secondary hover:text-primary focus:outline-none transition-colors"
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>

                {formData.password && (
                  <div className="mt-2 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="text-xs font-medium text-gray-600">Password strength:</div>
                      <div className={`text-xs font-medium ${
                        passwordStrength <= 2 ? 'text-red-500' : 
                        passwordStrength <= 3 ? 'text-yellow-500' : 
                        'text-accent'
                      }`}>
                        {getStrengthText()}
                      </div>
                    </div>
                    <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${getStrengthColor()} transition-all duration-300 ease-in-out`} 
                        style={{ width: `${(passwordStrength / 5) * 100}%` }}
                      />
                    </div>

                    <div className={`mt-3 space-y-2 text-sm ${passwordFocused ? 'block' : 'hidden'}`}>
                      <div className="flex items-center gap-2">
                        {renderRequirementIcon(passwordRequirements.minLength)}
                        <span className="text-gray-600">At least 8 characters</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {renderRequirementIcon(passwordRequirements.hasUpperCase)}
                        <span className="text-gray-600">Contains uppercase letter</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {renderRequirementIcon(passwordRequirements.hasLowerCase)}
                        <span className="text-gray-600">Contains lowercase letter</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {renderRequirementIcon(passwordRequirements.hasNumber)}
                        <span className="text-gray-600">Contains number</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {renderRequirementIcon(passwordRequirements.hasSpecialChar)}
                        <span className="text-gray-600">Contains special character</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                  Confirm Password
                </label>
                <div className="relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Shield className="h-5 w-5 text-secondary" />
                  </div>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    onFocus={() => setConfirmPasswordFocused(true)}
                    onBlur={() => setConfirmPasswordFocused(false)}
                    className={`input-field pl-10 pr-10 ${
                      formData.confirmPassword ? 
                        (passwordsMatch ? 'border-accent focus:border-accent' : 'border-red-300 focus:border-red-500') :
                        'border-gray-300'
                    }`}
                    placeholder="••••••••"
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="text-secondary hover:text-primary focus:outline-none transition-colors"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>
                
                {showPasswordMatch && (
                  <div className="mt-2">
                    <div className={`flex items-center gap-2 text-sm ${
                      passwordsMatch ? 'text-accent' : 'text-red-600'
                    }`}>
                      {passwordsMatch ? (
                        <>
                          <Check className="h-4 w-4" />
                          <span>Passwords match</span>
                        </>
                      ) : (
                        <>
                          <AlertCircle className="h-4 w-4" />
                          <span>Passwords do not match</span>
                        </>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`btn-primary w-full ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin h-5 w-5 mr-2 border-2 border-white border-t-transparent rounded-full"></div>
                    Creating your account...
                  </div>
                ) : (
                  'Start Your Dance Journey'
                )}
              </button>
            </form>
          </div>
          
          <div className="px-6 py-4 bg-gray-50/50 border-t border-gray-100 sm:px-10 rounded-b-xl">
            <p className="text-sm text-center text-gray-600">
              Already part of our community?{' '}
              <Link to="/login" className="font-medium text-accent hover:text-primary transition-colors">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;