import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from '../contexts/AuthContext';
import { useToast } from "../contexts/ToastContext";

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showRequirements, setShowRequirements] = useState(false);
  const [showPasswordMatchMessage, setShowPasswordMatchMessage] = useState(false);

  const { register } = useAuth();
  const { toastSuccess, toastError } = useToast();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePasswordFocus = () => setShowRequirements(true);
  const handlePasswordBlur = () => setShowRequirements(false);
  const handleConfirmPasswordFocus = () => setShowPasswordMatchMessage(true);
  const handleConfirmPasswordBlur = () => setShowPasswordMatchMessage(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await register(formData);
      const userName = result?.user?.name || formData.name || 'User';
      toastSuccess(`Registration successful! Welcome, ${userName}!`);
      navigate('/login');
    } catch (err) {
      console.error('Registration error:', err);
      toastError(err.message || 'Registration failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const requirements = {
    minLength: formData.password.length >= 8,
    hasUpperCase: /[A-Z]/.test(formData.password),
    hasLowerCase: /[a-z]/.test(formData.password),
    hasNumber: /\d/.test(formData.password),
    hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(formData.password)
  };

  return (
    <div className="auth-container">
      <div className="auth-form-container">
        <div className="auth-card">
          <div className="card-body">
            <h1 className="auth-heading">Sign Up</h1>
            <p className="auth-subtitle">Create your account to start your journey!</p>

            <form onSubmit={handleSubmit} className="needs-validation">
              <div className="mb-4">
                <label htmlFor="name" className="form-label">Full Name</label>
                <div className="input-group">
                  <span className="input-group-text"><i className="bi bi-person"></i></span>
                  <input
                    type="text"
                    className="form-control"
                    id="name"
                    placeholder="Full Name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="mb-4">
                <label htmlFor="email" className="form-label">Email address</label>
                <div className="input-group">
                  <span className="input-group-text"><i className="bi bi-envelope"></i></span>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    placeholder="name@example.com"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="mb-4">
                <label htmlFor="password" className="form-label">Password</label>
                <div className="input-group position-relative">
                  <span className="input-group-text"><i className="bi bi-lock"></i></span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className="form-control"
                    id="password"
                    placeholder="Password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    onFocus={handlePasswordFocus}
                    onBlur={handlePasswordBlur}
                    required
                  />
                  <button
                    type="button"
                    className="btn btn-outline-secondary btn-sm eye-button"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    <i className={`bi bi-eye${showPassword ? '-slash' : ''}`} />
                  </button>
                </div>
                {showRequirements && (
                  <div className="mt-2">
                    <div className="form-check">
                      <input 
                        className="form-check-input" 
                        type="checkbox" 
                        checked={requirements.minLength} 
                        disabled 
                      />
                      <label className="form-check-label">
                        At least 8 characters
                      </label>
                    </div>
                    <div className="form-check">
                      <input 
                        className="form-check-input" 
                        type="checkbox" 
                        checked={requirements.hasUpperCase} 
                        disabled 
                      />
                      <label className="form-check-label">
                        Contains uppercase letter
                      </label>
                    </div>
                    <div className="form-check">
                      <input 
                        className="form-check-input" 
                        type="checkbox" 
                        checked={requirements.hasLowerCase} 
                        disabled 
                      />
                      <label className="form-check-label">
                        Contains lowercase letter
                      </label>
                    </div>
                    <div className="form-check">
                      <input 
                        className="form-check-input" 
                        type="checkbox" 
                        checked={requirements.hasNumber} 
                        disabled 
                      />
                      <label className="form-check-label">
                        Contains number
                      </label>
                    </div>
                    <div className="form-check">
                      <input 
                        className="form-check-input" 
                        type="checkbox" 
                        checked={requirements.hasSpecialChar} 
                        disabled 
                      />
                      <label className="form-check-label">
                        Contains special character
                      </label>
                    </div>
                  </div>
                )}
              </div>

              <div className="mb-4">
                <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
                <div className="input-group position-relative">
                  <span className="input-group-text"><i className="bi bi-lock"></i></span>
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    className="form-control"
                    id="confirmPassword"
                    placeholder="Confirm Password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    onFocus={handleConfirmPasswordFocus}
                    onBlur={handleConfirmPasswordBlur}
                    required
                  />
                  <button
                    type="button"
                    className="btn btn-outline-secondary btn-sm eye-button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    <i className={`bi bi-eye${showConfirmPassword ? '-slash' : ''}`} />
                  </button>
                </div>
                {showPasswordMatchMessage && (
                  <div className="mt-2">
                    <div className="form-check">
                      <input 
                        className="form-check-input" 
                        type="checkbox" 
                        checked={formData.password === formData.confirmPassword} 
                        disabled 
                      />
                      <label className="form-check-label">
                        Passwords match
                      </label>
                    </div>
                  </div>
                )}
              </div>

              <button
                type="submit"
                className="btn btn-primary auth-button"
                disabled={loading}
              >
                {loading ? 'Creating account...' : 'Sign Up'}
              </button>
            </form>

            <div className="auth-link">
              <Link 
                to="/login" 
                className="text-decoration-none text-primary"
              >
                Already have an account? Sign In
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;