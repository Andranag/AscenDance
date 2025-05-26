import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { fetchPublic } from '../api';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { Container, Form, Input, Button, Message, Segment, Icon } from 'semantic-ui-react';
import { authContainerStyle, authFormContainerStyle, authFormStyle, authButtonStyle, authLinkStyle } from '../styles/authStyles';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const { login } = useAuth();
  const { toastSuccess, toastError } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Make login request
      const response = await fetchPublic('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      // Use AuthContext to handle login
      await login(response.data.token, response.data.user);

      // Show success message
      toastSuccess('Login successful!');

      // Navigate to appropriate page
      navigate(response.data.user.role === 'admin' ? '/admin' : '/courses');
    } catch (error) {
      console.error('Login error:', error);
      setError(error.message || 'Login failed. Please try again.');
      toastError(error.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container text style={authContainerStyle}>
      <Segment style={authFormContainerStyle}>
        <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>Sign In</h2>
        {error && (
          <Message error content={error} />
        )}
        <Form onSubmit={handleSubmit} style={authFormStyle}>
          <Form.Field>
            <Input
              icon='user'
              iconPosition='left'
              type="email"
              placeholder='Email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete={rememberMe ? 'username' : 'off'}
            />
          </Form.Field>
          <Form.Field>
            <Input
              icon='lock'
              iconPosition='left'
              type={showPassword ? 'text' : 'password'}
              placeholder='Password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete={rememberMe ? 'on' : 'off'}
              action={{
                icon: showPassword ? 'eye slash' : 'eye',
                onClick: () => setShowPassword(!showPassword)
              }}
            />
          </Form.Field>
          <Form.Field>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                style={{ marginRight: '0.5rem' }}
              />
              <label style={{ fontSize: '0.9rem', color: '#666' }}>Remember Me</label>
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
            {loading ? 'Signing in...' : 'Sign In'}
          </Button>
          <div style={{ textAlign: 'center' }}>
            <Link to="/register" style={authLinkStyle}>
              Don't have an account? Sign Up
            </Link>
          </div>
        </Form>
      </Segment>
    </Container>
  );
};

export default Login;
