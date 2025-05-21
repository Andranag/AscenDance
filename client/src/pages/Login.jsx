import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import { ArrowRight, Eye, EyeOff, Facebook, Github, Mail, AlertCircle } from 'lucide-react';
import DanceBackground from '../components/DanceBackround'
import InputField from '../components/forms/InputField';
import Button from '../components/common/Button';
import SocialButton from '../components/forms/SocialButton';
import Logo from '../components/common/Logo';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    identifier: '',
    password: '',
    rememberMe: false
  });
  const [showPassword, setShowPassword] = useState(false);
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

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.identifier.trim()) {
      newErrors.identifier = 'Email or username is required';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const response = await axios.post('http://localhost:3050/user/login', {
        email: formData.identifier.includes('@') ? formData.identifier : undefined,
        username: !formData.identifier.includes('@') ? formData.identifier : undefined,
        password: formData.password
      });

      if (response.data.token) {
        // Store token based on remember me preference
        const storage = formData.rememberMe ? localStorage : sessionStorage;
        storage.setItem('token', response.data.token);
        storage.setItem('user', JSON.stringify(response.data.user));
        toast.success('Successfully logged in!');
        navigate('/student/dashboard');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.msg || 'Login failed. Please try again.';
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
          <div className="mb-8">
            <Logo />
            <h1 className="text-4xl font-['Playfair_Display'] font-medium mt-6 text-white">Welcome Back</h1>
            <p className="text-white/80 mt-2 font-light">Sign in to continue your dance journey</p>
          </div>
          
          {errors.general && (
            <div className="mb-6 animate-fade-in flex items-start text-red-300 border-l-2 border-red-400/50 pl-3">
              <AlertCircle className="w-4 h-4 mt-0.5 mr-2 flex-shrink-0" />
              <div>
                <h3 className="font-medium text-sm">Unable to sign in</h3>
                <p className="text-xs opacity-90">{errors.general}</p>
              </div>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-5">
            <InputField
              label="Email or Username"
              type="text"
              name="identifier"
              value={formData.identifier}
              onChange={handleChange}
              error={errors.identifier}
              placeholder="Enter your email or username"
              icon={<Mail size={18} className="text-white/50" />}
              className="text-white"
            />
            
            <div className="relative">
              <InputField
                label="Password"
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                error={errors.password}
                placeholder="Enter your password"
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
            
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                  className="h-4 w-4 text-purple-500 border-white/20 bg-white/10 focus:ring-purple-500"
                />
                <span className="ml-2 text-white/80">Remember me</span>
              </label>
              
              <a href="#" className="text-purple-300 hover:text-purple-200 transition-colors">
                Forgot password?
              </a>
            </div>
            
            <Button 
              type="submit" 
              fullWidth 
              disabled={isSubmitting} 
              isLoading={isSubmitting}
              className="mt-6"
            >
              Sign In <ArrowRight size={18} className="ml-2" />
            </Button>
          </form>
          
          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-3 py-0.5 bg-white/5 text-white/60 backdrop-blur-sm">
                  Or continue with
                </span>
              </div>
            </div>
            
            <div className="mt-4 grid grid-cols-3 gap-3">
              <SocialButton icon={<Facebook size={18} />} provider="facebook" />
              <SocialButton icon={<Github size={18} />} provider="github" />
              <SocialButton icon={<Mail size={18} />} provider="google" />
            </div>
          </div>
          
          <p className="mt-8 text-center text-sm text-white/70">
            Don't have an account?{' '}
            <Link 
              to="/register" 
              className="font-medium text-purple-300 hover:text-purple-200 transition-colors"
            >
              Sign up now
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

export default Login;