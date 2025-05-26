import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { Container, Form, Input, Button, Segment } from 'semantic-ui-react';
import { authContainerStyle, authFormContainerStyle, authFormStyle, authButtonStyle, authLinkStyle } from '../styles/authStyles';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
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
      const response = await fetch('http://localhost:3050/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      if (!response.ok) {
        const data = await response.json();
        toastError(data.message || 'Login failed. Please try again.');
        throw new Error(data.message || 'Login failed');
      }

      const responseJson = await response.json();
      console.log('Backend response:', JSON.stringify(responseJson, null, 2));
      
      // Get the token and user data from the nested response
      const { token, user } = responseJson.data;
      
      // Use the token and user data from the backend
      await login(token, user);
      
      // Login was successful
      toastSuccess('Login successful! Redirecting to profile...');
      navigate('/profile');
    } catch (error) {
      console.error('Login error:', error);
      toastError(error.message || 'Login failed. Please try again.');
      throw error;
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
                type={showPassword ? "text" : "password"}
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <Button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: 0,
                  top: 0,
                  padding: '8px',
                  background: 'transparent',
                  border: 'none',
                  color: '#666'
                }}
              >
                <i className={`icon eye ${showPassword ? 'slash' : ''}`} />
              </Button>
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
