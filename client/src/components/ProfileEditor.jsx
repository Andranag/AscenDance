import React, { useState, useEffect } from 'react';

const ProfileEditor = ({ 
  user = { name: '', email: '' }, 
  onUpdate = () => {}
}) => {

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    name: user.name || '',
    email: user.email || ''
  });

  useEffect(() => {
    // Update form data when user prop changes
    setFormData(prev => ({
      ...prev,
      name: user.name || '',
      email: user.email || ''
    }));
  }, [user]);

  // Remove role validation since regular users can't change it

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      // Only send name and email in the update
      const updateData = {
        name: formData.name,
        email: formData.email
      };
      await onUpdate(updateData);
      setSuccess('Profile updated successfully!');
    } catch (err) {
      setError(err.message || 'Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {loading && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          padding: '1rem',
          backgroundColor: '#f8f8f8',
          borderRadius: '0.25rem',
          marginBottom: '1rem'
        }}>
          <div className="ui active inline loader"></div>
          <span>Updating profile...</span>
        </div>
      )}
      {error && (
        <div style={{
          padding: '1rem',
          backgroundColor: '#fef3f3',
          borderRadius: '0.25rem',
          color: '#c4302b',
          marginBottom: '1rem'
        }}>
          {error}
        </div>
      )}
      {success && (
        <div style={{
          padding: '1rem',
          backgroundColor: '#f8fdf6',
          borderRadius: '0.25rem',
          color: '#21ba45',
          marginBottom: '1rem'
        }}>
          {success}
        </div>
      )}
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ position: 'relative' }}>
          <i className="user icon" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }}></i>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Name"
            disabled={loading}
            style={{
              width: '100%',
              padding: '0.75rem 1rem 0.75rem 3rem',
              border: '1px solid #ddd',
              borderRadius: '0.25rem',
              fontSize: '1rem'
            }}
          />
        </div>
        <div style={{ position: 'relative' }}>
          <i className="mail icon" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }}></i>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            disabled={loading}
            style={{
              width: '100%',
              padding: '0.75rem 1rem 0.75rem 3rem',
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
            backgroundColor: '#21ba45',
            color: 'white',
            border: 'none',
            borderRadius: '0.25rem',
            cursor: 'pointer',
            fontSize: '1rem'
          }}
        >
          {loading ? 'Updating...' : 'Update Profile'}
        </button>
      </form>
    </div>
  );
};

export default ProfileEditor;
