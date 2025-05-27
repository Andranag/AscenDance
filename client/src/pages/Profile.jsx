import { useNavigate } from 'react-router-dom';
import { useEffect, useState, useCallback } from 'react';
import ProfileEditor from '../components/ProfileEditor';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';

const Profile = () => {
  const navigate = useNavigate();
  const { user, token, logout, fetchWithAuth, updateUser } = useAuth();
  const { toastSuccess, toastError } = useToast();
  const isAdmin = user?.role === 'admin';
  const [isUpdating, setIsUpdating] = useState(false);

  // Combined auth check and profile fetch useEffect
  useEffect(() => {
    if (!token) {
      toastError('Not authenticated');
      navigate('/login');
      return;
    }

    const fetchProfile = async () => {
      try {
        const response = await fetchWithAuth('/api/auth/profile');
        if (response) {
          // Handle nested response structure
          const userData = response.data?.data || response.data || response.user;
          if (userData) {
            const updated = updateUser(userData);
            if (!updated) {
              // If no update was needed, skip further processing
              return;
            }
          }
        }
      } catch (error) {
        console.error('Profile fetch error:', error);
        
        if (error.message.includes('Session expired') || 
            error.message.includes('Unauthorized') || 
            error.message.includes('Token invalid')) {
          logout();
          navigate('/login');
        }
      }
    };

    fetchProfile();
  }, [token, navigate, fetchWithAuth, updateUser, logout, toastError]);

  const handleUpdate = async (updates) => {
    try {
      setIsUpdating(true);
      
      const data = await fetchWithAuth('/api/auth/profile', {
        method: 'PUT',
        body: JSON.stringify({
          name: updates.name,
          email: updates.email
        })
      });

      if (data) {
        // Store in localStorage immediately
        localStorage.setItem('authState', JSON.stringify({
          user: data,
          token: token
        }));
        updateUser(data);
        toastSuccess('Profile updated successfully!');
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      
      if (error.message.includes('Session expired') || 
          error.message.includes('Unauthorized') || 
          error.message.includes('Token invalid')) {
        toastError('Session expired. Please log in again.');
        logout();
        navigate('/login');
      } else {
        toastError('Failed to update profile. Please try again.');
      }
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '2rem auto', padding: '1rem' }}>
      <h1 style={{ marginBottom: '1rem' }}>Profile</h1>
      <ProfileEditor 
        user={user} 
        onUpdate={handleUpdate}
        isLoading={isUpdating}
        isAdmin={isAdmin}
      />
    </div>
  );
};

export default Profile;
