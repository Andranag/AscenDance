import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Message } from 'semantic-ui-react';
import { fetchPublic } from '../api';

const Register = () => {
  const navigate = useNavigate();
  const [error, setError] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    const formData = new FormData(e.target);
    try {
      const data = await fetchPublic('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify({
          name: formData.get('name'),
          email: formData.get('email'),
          password: formData.get('password')
        })
      });
      
      if (!data.token) {
        throw new Error('Registration failed');
      }
      
      localStorage.setItem('token', data.token);
      navigate('/courses');
    } catch (error) {
      console.error('Registration error:', error);
      setError(error.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container style={{ marginTop: '4em' }}>
      <h2>Register</h2>
      {error && (
        <Message negative>
          <Message.Header>Error</Message.Header>
          <p>{error}</p>
        </Message>
      )}
      <form onSubmit={handleSubmit} className="ui form">
        <div className="field">
          <label>Name</label>
          <input name="name" placeholder="Name" required />
        </div>
        <div className="field">
          <label>Email</label>
          <input name="email" type="email" placeholder="Email" required />
        </div>
        <div className="field">
          <label>Password</label>
          <input name="password" type="password" placeholder="Password" required />
        </div>
        <button type="submit" className="ui primary button" disabled={loading}>
          {loading ? 'Registering...' : 'Register'}
        </button>
      </form>
    </Container>
  );
};

export default Register;
