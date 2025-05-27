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
  const [isLoading, setIsLoading] = useState(true);

  // Handle profile updates
  const handleUpdate = async (updates) => {
    try {
      setIsUpdating(true);
      const response = await fetchWithAuth('/api/auth/profile', {
        method: 'PUT',
        body: JSON.stringify(updates)
      });
      
      if (response) {
        // Update the user data in auth state
        updateUser(response);
        toastSuccess('Profile updated successfully!');
      }
    } catch (error) {
      console.error('Update error:', error);
      toastError('Failed to update profile');
    } finally {
      setIsUpdating(false);
    }
  };

  // Combined auth check and profile fetch useEffect
  useEffect(() => {
    if (!token) {
      toastError('Not authenticated');
      navigate('/login');
      return;
    }

    // Only fetch profile data once on mount
    const fetchProfile = async () => {
      try {
        const response = await fetchWithAuth('/api/auth/profile');
        if (response) {
          updateUser(response);
        }
      } catch (error) {
        console.error('Profile fetch error:', error);
        
        if (error.message.includes('Session expired') || 
            error.message.includes('Unauthorized') || 
            error.message.includes('Token invalid')) {
          logout();
          navigate('/login');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, []); // Empty dependency array to prevent infinite refresh

  // Handle token changes without refetching
  useEffect(() => {
    if (!token) {
      toastError('Not authenticated');
      navigate('/login');
    }
  }, [token, navigate, toastError]); 

  // Show loading state while fetching
  if (isLoading) {
    return (
      <div style={{ maxWidth: '800px', margin: '2rem auto', padding: '1rem' }}>
        <h1 style={{ marginBottom: '1rem' }}>Profile</h1>
        <p>Loading profile data...</p>
      </div>
    );
  }

  // Show error if user data is not available
  if (!user) {
    return (
      <div style={{ maxWidth: '800px', margin: '2rem auto', padding: '1rem' }}>
        <h1 style={{ marginBottom: '1rem' }}>Profile</h1>
        <p>Error: User data not available</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '800px', margin: '2rem auto', padding: '1rem' }}>
      <h1 style={{ marginBottom: '1rem' }}>Profile</h1>
      <ProfileEditor 
        user={user} 
        onUpdate={handleUpdate}
        isLoading={isUpdating || isLoading}
        isAdmin={isAdmin}
      />
    </div>
  );
};

export default Profile;
