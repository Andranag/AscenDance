import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import { ArrowRight, Eye, EyeOff, Mail, User, AlertCircle } from 'lucide-react';
import DanceBackground from '../components/DanceBackround'
import InputField from '../components/forms/InputField';
import Button from '../components/common/Button';
import Logo from '../components/common/Logo';
import PasswordStrength from '../components/forms/PasswordStrength';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
    
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const validatePassword = (password) => {
    const regex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+=\[\]{};':"\\|,.<>/?]).{8,}$/;
    return regex.test(password);
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email address is invalid';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (!validatePassword(formData.password)) {
      newErrors.password = 'Password must be at least 8 characters with an uppercase letter, a number, and a special character';
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    if (!formData.agreeTerms) {
      newErrors.agreeTerms = 'You must agree to the terms and conditions';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const response = await axios.post('http://localhost:3050/user/register', {
        username: formData.username,
        email: formData.email,
        password: formData.password
      });

      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        toast.success('Registration successful! Welcome to DanceFlow!');
        navigate('/');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.msg || 'Registration failed. Please try again later.';
      toast.error(errorMessage);
      setErrors({
        general: errorMessage
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex relative overflow-hidden">
      <div className="w-[600px] z-10 p-12 bg-black/40 backdrop-blur-xl border-r border-white/10">
        <div className="h-full flex flex-col justify-center max-w-[440px] mx-auto">
          <div className="mb-6">
            <Logo />
            <h1 className="text-4xl font-['Playfair_Display'] font-medium mt-6 text-white">Join Our Dance Community</h1>
            <p className="text-white/80 mt-2 font-light">Create an account to start your dance journey</p>
          </div>
          
          {errors.general && (
            <div className="mb-6 animate-fade-in flex items-start text-red-300 border-l-2 border-red-400/50 pl-3">
              <AlertCircle className="w-4 h-4 mt-0.5 mr-2 flex-shrink-0" />
              <div>
                <h3 className="font-medium text-sm">Unable to register</h3>
                <p className="text-xs opacity-90">{errors.general}</p>
              </div>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-5">
            <InputField
              label="Username"
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              error={errors.username}
              placeholder="Choose a username"
              icon={<User size={18} className="text-white/50" />}
              className="text-white"
            />
            
            <InputField
              label="Email Address"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
              placeholder="your@email.com"
              icon={<Mail size={18} className="text-white/50" />}
              className="text-white"
            />
            
            <div>
              <div className="relative">
                <InputField
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  error={errors.password}
                  placeholder="Create a strong password"
                  className="text-white"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-[41px] text-white/50 hover:text-white/70 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {formData.password && <PasswordStrength password={formData.password} />}
            </div>
            
            <div className="relative">
              <InputField
                label="Confirm Password"
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                error={errors.confirmPassword}
                placeholder="Confirm your password"
                className="text-white"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-[41px] text-white/50 hover:text-white/70 transition-colors"
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="agreeTerms"
                  name="agreeTerms"
                  type="checkbox"
                  checked={formData.agreeTerms}
                  onChange={handleChange}
                  className="h-4 w-4 text-purple-500 border-white/20 bg-white/10 focus:ring-purple-500"
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="agreeTerms" className="text-white/80">
                  I agree to the <a href="#" className="text-purple-300 hover:text-purple-200">Terms of Service</a> and <a href="#" className="text-purple-300 hover:text-purple-200">Privacy Policy</a>
                </label>
                {errors.agreeTerms && (
                  <p className="text-red-300 text-xs mt-1">{errors.agreeTerms}</p>
                )}
              </div>
            </div>
            
            <Button 
              type="submit" 
              fullWidth 
              disabled={isSubmitting} 
              isLoading={isSubmitting}
              className="mt-6"
            >
              Create Account <ArrowRight size={18} className="ml-2" />
            </Button>
          </form>
          
          <p className="mt-8 text-center text-sm text-white/70">
            Already have an account?{' '}
            <Link 
              to="/login" 
              className="font-medium text-purple-300 hover:text-purple-200 transition-colors"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
      
      <div className="flex-1 relative">
        <DanceBackground />
      </div>
    </div>
  );
};

export default Register;