import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { Container, Form, Input, Button, Segment } from 'semantic-ui-react';
import {
  authContainerStyle,
  authFormContainerStyle,
  authFormStyle,
  authButtonStyle,
  authLinkStyle
} from '../styles/authStyles';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const { toastSuccess, toastError } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Use AuthContext's login function directly
      await login(email, password);
      toastSuccess('Login successful! Redirecting...');
      navigate('/profile');
    } catch (err) {
      console.error('Login error:', err);
      toastError(err.message || 'Login failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container text style={authContainerStyle}>
      <Segment style={authFormContainerStyle}>
        <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>Sign In</h2>
        <Form onSubmit={handleSubmit} style={authFormStyle}>
          <Form.Field>
            <label>Email</label>
            <Input
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Form.Field>

          <Form.Field>
            <label>Password</label>
            <div style={{ position: 'relative' }}>
              <Input
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter password"
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

          <div style={{ textAlign: 'center', marginTop: '1rem' }}>
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
