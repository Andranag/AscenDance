import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
// Remove this line since we're using useToast hook
import { useToast } from '../contexts/ToastContext';
import { Container, Form, Input, Button, Message, Segment, Icon } from 'semantic-ui-react';
import { authContainerStyle, authFormContainerStyle, authFormStyle, authButtonStyle, authLinkStyle } from '../styles/authStyles';

const Register = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { toastSuccess, toastError } = useToast();

  // Validation functions
  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validatePassword = (password) => {
    // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
    const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    return re.test(password);
  };

  const validateName = (name) => {
    return name.trim().length >= 2;
  };

  const validateForm = () => {
    if (!validateName(name)) {
      toastError('Name must be at least 2 characters long');
      return false;
    }
    if (!validateEmail(email)) {
      toastError('Please enter a valid email address');
      return false;
    }
    if (!validatePassword(password)) {
      toastError('Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, and one number');
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
    
    // Client-side validation
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('http://localhost:3050/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name,
          email,
          password
        })
      });

      const data = await response.json();
      
      // Handle API errors
      if (!response.ok) {
        toastError(data.message || 'Registration failed');
        setLoading(false);
        return;
      }

      // Store token and navigate
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      // Show success message
      toastSuccess('Registration successful! Redirecting to login...');
      
      // Add a small delay before navigation to ensure the toast is visible
      setTimeout(() => {
        navigate('/login');
      }, 1000);
    } catch (error) {
      console.error('Registration error:', error);
      toastError('Registration failed. Please try again.');
      setLoading(false);
    }
  };

  return (
    <Container text style={authContainerStyle}>
      <Segment style={authFormContainerStyle}>
        <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>Sign Up</h2>
        {/* No error message needed since we're using toast */}
        <Form onSubmit={handleSubmit} style={authFormStyle}>
          <Form.Field>
            <Input
              icon='user'
              iconPosition='left'
              type="text"
              placeholder='Name'
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </Form.Field>
          <Form.Field>
            <Input
              icon='mail'
              iconPosition='left'
              type="email"
              placeholder='Email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Form.Field>
          <Form.Field>
            <label>Password</label>
            <div style={{ position: 'relative' }}>
              <Input
                icon={{ name: 'lock' }}
                iconPosition='left'
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
          </Form.Field>
          <Form.Field>
            <label>Confirm Password</label>
            <div style={{ position: 'relative' }}>
              <Input
                icon={{ name: 'lock' }}
                iconPosition='left'
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
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
          </Form.Field>
          <Button
            type="submit"
            primary
            fluid
            loading={loading}
            disabled={loading}
            style={authButtonStyle}
          >
            {loading ? 'Registering...' : 'Sign Up'}
          </Button>
          <div style={{ textAlign: 'center' }}>
            <Link to="/login" style={authLinkStyle}>
              Already have an account? Sign In
            </Link>
          </div>
        </Form>
      </Segment>
    </Container>
  );
};

export default Register;
