import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import ProfileEditor from '../components/ProfileEditor';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';

const Profile = () => {
  const navigate = useNavigate();
  const { user, token, logout, updateUser, fetchWithAuth } = useAuth();
  const { toastSuccess, toastError } = useToast();
  const isAdmin = user?.role === 'admin';
  const [isUpdating, setIsUpdating] = useState(false);

  // Auth check useEffect
  useEffect(() => {
    if (!token) {
      toastError('Not authenticated');
      navigate('/login');
    }
  }, [token, navigate]);

  // Profile fetch useEffect
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetchWithAuth('/api/auth/profile');
        if (response) {
          // Handle nested response structure
          const userData = response.data?.user || response.user || response;
          if (userData) {
            updateUser(userData);
          }
        }
      } catch (error) {
        console.error('Profile fetch error:', error);
        
        // Only navigate to login if token is invalid
        if (error.message.includes('Session expired') || 
            error.message.includes('Unauthorized') || 
            error.message.includes('Token invalid')) {
          logout();
          navigate('/login');
        }
      }
    };

    // Only fetch if we have a token AND user is not already loaded
    if (token && (!user || !user.email)) {
      fetchProfile();
    }
  }, [fetchWithAuth, navigate, updateUser, token, logout, user]);

  const handleUpdate = async (updates) => {
    try {
      setIsUpdating(true);
      
      const response = await fetchWithAuth('/api/auth/profile', {
        method: 'PUT',
        body: JSON.stringify({
          name: updates.name,
          email: updates.email
        })
      });

      // Handle nested response structure
      if (response) {
        const userData = response.data?.user || response.user || response;
        if (userData) {
          // Store in localStorage immediately
          localStorage.setItem('authState', JSON.stringify({
            user: userData,
            token: token
          }));
          updateUser(userData);
          toastSuccess('Profile updated successfully!');
        } else {
          throw new Error('Invalid response data');
        }
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
