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
      const data = await fetchPublic('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      // Store token and user data
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify({
        _id: data.user.id,
        name: data.user.name,
        email: data.user.email
      }));
      navigate('/profile', { replace: true });
    } catch (err) {
      console.error('Login error:', err);
      setError('Invalid email or password');
      setError(error.message || 'Login failed. Please check your credentials.');
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
          style={{
            backgroundColor: '#2185d0',
            color: 'white',
            padding: '0.75rem',
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
