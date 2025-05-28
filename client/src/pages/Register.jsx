import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Container, Form, Input, Button, Segment, Icon } from 'semantic-ui-react';
import { useToast } from '../contexts/ToastContext';
import {
  authContainerStyle,
  authFormContainerStyle
} from '../styles/authStyles';

const Register = () => {
  const navigate = useNavigate();
  const { toastSuccess, toastError } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showRequirements, setShowRequirements] = useState(false);
  const [showPasswordMatch, setShowPasswordMatch] = useState(false);
  const [showPasswordMatchMessage, setShowPasswordMatchMessage] = useState(false);

  // Password requirements state
  const [requirements, setRequirements] = useState({
    minLength: false,
    hasUpperCase: false,
    hasLowerCase: false,
    hasNumber: false,
    hasSpecialChar: false
  });

  // Update requirements when password changes
  const updateRequirements = (password) => {
    setRequirements({
      minLength: password.length >= 8,
      hasUpperCase: /[A-Z]/.test(password),
      hasLowerCase: /[a-z]/.test(password),
      hasNumber: /\d/.test(password),
      hasSpecialChar: /[^A-Za-z0-9]/.test(password)
    });
  };

  // Check password match
  const checkPasswordMatch = () => {
    const passwordsMatch = formData.password === formData.confirmPassword;
    setShowPasswordMatch(!passwordsMatch); // Show error when they don't match
    setShowPasswordMatchMessage(true); // Always show the message when checking
  };

  // Handle confirm password focus/blur
  const handleConfirmPasswordFocus = () => {
    setShowPasswordMatchMessage(true);
  };

  const handleConfirmPasswordBlur = () => {
    setShowPasswordMatchMessage(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (name === 'password') {
      updateRequirements(value);
    } else if (name === 'confirmPassword') {
      checkPasswordMatch();
    }
  };

  // Handle focus/blur for requirements visibility
  const handlePasswordFocus = () => {
    setShowRequirements(true);
  };

  const handlePasswordBlur = () => {
    setShowRequirements(false);
  };

  const validateForm = () => {
    const { name, email, password, confirmPassword } = formData;

    if (name.trim().length < 2) {
      toastError('Name must be at least 2 characters');
      return false;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toastError('Invalid email address');
      return false;
    }

    const passwordValid =
      password.length >= 8 &&
      /[A-Z]/.test(password) &&
      /[a-z]/.test(password) &&
      /\d/.test(password) &&
      /[^A-Za-z0-9]/.test(password);

    if (!passwordValid) {
      toastError('Password must contain uppercase, lowercase, number, special char and be 8+ chars');
      return false;
    }

    if (password !== confirmPassword) {
      toastError('Passwords do not match');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const res = await fetch('http://localhost:3050/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          password
        })
      });

      const data = await res.json();

      if (!res.ok) {
        toastError(data.message || 'Registration failed');
        return;
      }

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      toastSuccess('Registered successfully! Redirecting...');
      setTimeout(() => navigate('/login'), 1000);
    } catch (err) {
      console.error(err);
      toastError('Server error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container text style={authContainerStyle}>
      <Segment style={authFormContainerStyle}>
        <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>Sign Up</h2>
        <Form onSubmit={handleSubmit} loading={loading}>
          <Form.Field>
            <Input
              icon={{ name: 'user' }}
              iconPosition='left'
              placeholder="Full Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </Form.Field>
          <Form.Field>
            <Input
              icon={{ name: 'mail' }}
              iconPosition='left'
              placeholder="Email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </Form.Field>
          <Form.Field>
            <div style={{ position: 'relative' }}>
              <Input
                type={showPassword ? 'text' : 'password'}
                icon={{ name: 'lock' }}
                iconPosition='left'
                placeholder="Password"
                name="password"
                value={formData.password}
                onChange={(e) => {
                  handleChange(e);
                  updateRequirements(e.target.value);
                }}
                onFocus={handlePasswordFocus}
                onBlur={handlePasswordBlur}
                required
              />
              <Button
                type="button"
                icon={`eye${showPassword ? ' slash' : ''}`}
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: 0,
                  top: 0,
                  background: 'transparent',
                  border: 'none',
                  color: '#666',
                  padding: '8px',
                }}
              />
            </div>
            <div style={{ marginTop: '8px', display: showRequirements ? 'block' : 'none' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <Icon name={requirements.minLength ? 'check circle' : 'circle'} color={requirements.minLength ? 'green' : 'grey'} />
                  <span style={{ marginLeft: '8px' }}>At least 8 characters</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <Icon name={requirements.hasUpperCase ? 'check circle' : 'circle'} color={requirements.hasUpperCase ? 'green' : 'grey'} />
                  <span style={{ marginLeft: '8px' }}>Contains uppercase letter</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <Icon name={requirements.hasLowerCase ? 'check circle' : 'circle'} color={requirements.hasLowerCase ? 'green' : 'grey'} />
                  <span style={{ marginLeft: '8px' }}>Contains lowercase letter</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <Icon name={requirements.hasNumber ? 'check circle' : 'circle'} color={requirements.hasNumber ? 'green' : 'grey'} />
                  <span style={{ marginLeft: '8px' }}>Contains number</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <Icon name={requirements.hasSpecialChar ? 'check circle' : 'circle'} color={requirements.hasSpecialChar ? 'green' : 'grey'} />
                  <span style={{ marginLeft: '8px' }}>Contains special character</span>
                </div>
              </div>
            </div>
          </Form.Field>
          <Form.Field>
            <div style={{ position: 'relative' }}>
              <Input
                type={showConfirmPassword ? 'text' : 'password'}
                icon={{ name: 'lock' }}
                iconPosition='left'
                placeholder="Confirm password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                onFocus={handleConfirmPasswordFocus}
                onBlur={handleConfirmPasswordBlur}
                required
              />
              <Button
                type="button"
                icon={`eye${showConfirmPassword ? ' slash' : ''}`}
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                style={{
                  position: 'absolute',
                  right: 0,
                  top: 0,
                  background: 'transparent',
                  border: 'none',
                  color: '#666',
                  padding: '8px',
                }}
              />
            </div>
            <div style={{ marginTop: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              {showPasswordMatchMessage && (
                <>
                  {formData.password === formData.confirmPassword ? (
                    <>
                      <Icon name='check circle' color='green' />
                      <span style={{ color: 'green' }}>Passwords match</span>
                    </>
                  ) : (
                    <>
                      <Icon name='warning circle' color='red' />
                      <span style={{ color: 'red' }}>Passwords do not match</span>
                    </>
                  )}
                </>
              )}
            </div>
          </Form.Field>
          <Button fluid primary type="submit">
            Register
          </Button>
        </Form>
        <p style={{ marginTop: '1rem', textAlign: 'center' }}>
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </Segment>
    </Container>
  );
};

export default Register;