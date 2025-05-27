import React, { useState, useEffect } from 'react';
import { Form, Button, Segment } from 'semantic-ui-react';
import { useToast } from '../contexts/ToastContext';
import { useAuth } from '../contexts/AuthContext';

const ProfileEditor = ({ 
  user = { name: '', email: '' }, 
  onUpdate,
  isLoading
}) => {
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || ''
  });

  const [loading, setLoading] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);

  useEffect(() => {
    if (!initialLoad) {
      setFormData({
        name: user?.name || '',
        email: user?.email || ''
      });
    }
  }, [user, initialLoad]);

  useEffect(() => {
    // Skip first render
    if (initialLoad) {
      setInitialLoad(false);
      return;
    }
    
    // Update form data when user changes
    setFormData({
      name: user?.name || '',
      email: user?.email || ''
    });
  }, [user, initialLoad]);

  const { toastError, toastSuccess } = useToast();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value.trim()
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await onUpdate(formData);
      if (result) {
        toastSuccess('Profile updated successfully!');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      // Don't show toast here - it's already shown in Profile component
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {loading && (
        <div className="ui form" style={{ maxWidth: '600px', margin: '2rem auto' }}>
          <div style={{
            padding: '1rem',
            backgroundColor: '#f8f8f8',
            borderRadius: '0.25rem',
            marginBottom: '1rem'
          }}>
            <div className="ui active inline loader"></div>
            <span>Updating profile...</span>
          </div>
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
