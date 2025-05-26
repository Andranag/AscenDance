import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { fetchPublic } from '../api';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');



  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      // Make login request and handle response
      const response = await fetchPublic('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      // Check for success and extract data
      if (!response.success || !response.data) {
        throw new Error('Invalid response from server');
      }

      // Extract token and user data from nested response
      const { token, user } = response.data;

      // Store token and user data
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('role', user.role);

      // Redirect based on role
      if (user.role === 'admin') {
        navigate('/admin/courses');
      } else {
        navigate('/courses');
      }
      
      // Log stored data
      console.log('Stored user data:', user);
      console.log('Stored token:', token);
      
      setError('');
      
    } catch (error) {
      console.error('Login error:', error);
      setError(error.message || 'Login failed. Please check your credentials.');
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '2rem auto' }}>
      <h2>Login</h2>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ position: 'relative' }}>
          <i className="user icon" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }}></i>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder='Email'
            style={{
              padding: '0.75rem 1rem 0.75rem 3rem',
              width: '100%',
              border: '1px solid #ddd',
              borderRadius: '0.25rem',
              fontSize: '1rem'
            }}
          />
        </div>
        <div style={{ position: 'relative' }}>
          <i className="lock icon" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }}></i>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder='Password'
            style={{
              padding: '0.75rem 1rem 0.75rem 3rem',
              width: '100%',
              border: '1px solid #ddd',
              borderRadius: '0.25rem',
              fontSize: '1rem'
            }}
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          style={{
            padding: '0.75rem',
            background: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '0.25rem',
            cursor: 'pointer',
            fontSize: '1rem'
          }}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
};

export default Login;
