import { useNavigate, useLocation } from 'react-router-dom';
import ProfileEditor from '../components/ProfileEditor';
import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { fetchWithAuth } from '../api';
import { useToast } from '../contexts/ToastContext';

const Profile = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const { user, token, logout } = useAuth();
  const { toastError, toastSuccess } = useToast();
  const isAdmin = user?.role === 'admin';


  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // Check if we have user data already
        if (user) {
          setLoading(false);
          return;
        }

        // Try to fetch profile
        try {
          const response = await fetchWithAuth('/api/auth/profile');
          console.log('Profile response:', response);
          
          // Update user state with the response
          setUser({
            ...user,
            ...response
          });
        } catch (fetchErr) {
          console.error('Fetch error:', fetchErr);
          
          // If fetch fails but we have user data in state, use that
          if (user) {
            console.log('Using cached user data');
            return;
          }
          
          throw fetchErr;
        }
      } catch (err) {
        console.error('Error fetching profile:', err);
        
        // Handle different error types
        if (err.message.includes('Unauthorized') || err.message.includes('token_expired')) {
          toastError('Your session has expired. Please login again.');
          logout();
        } else if (err.message.includes('user_not_found')) {
          toastError('User account not found. Please contact support.');
          logout();
        } else {
          toastError(`Failed to load profile: ${err.message}`);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user, navigate, logout]);

  const handleUpdate = async (updates) => {
    try {
      if (!token) {
        throw new Error('No authentication token found');
      }

      const updateData = {
        name: updates.name,
        email: updates.email
      };
      
      const response = await fetchWithAuth('/api/auth/profile', {
        method: 'PUT',
        body: JSON.stringify(updateData)
      });
      
      // Update the user state using AuthContext
      setUser({
        ...user,
        ...response
      });
      
      return response;
    } catch (err) {
      console.error('Error updating profile:', err);
      
      if (err.message.includes('Unauthorized')) {
        toastError('Your session has expired. Please login again.');
        logout();
      } else if (err.message.includes('user_not_found')) {
        toastError('User account not found. Please contact support.');
        logout();
      } else if (err.message.includes('token_expired')) {
        toastError('Your token has expired. Please login again.');
        logout();
      } else {
        toastError(`Failed to update profile: ${err.message}`);
      }
      return null;
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '2rem auto', padding: '1rem' }}>
      <h1 style={{ marginBottom: '1rem' }}>Profile</h1>
      {loading ? (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '1rem',
          padding: '1rem',
          backgroundColor: '#f8f8f8',
          borderRadius: '0.25rem'
        }}>
          <div style={{
            width: '24px',
            height: '24px',
            border: '3px solid #f3f3f3',
            borderTop: '3px solid #2185d0',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }}></div>
          <span>Loading profile...</span>
        </div>
      ) : (
        <ProfileEditor
          user={user}
          onUpdate={handleUpdate}
          navigate={navigate}
        />
      )}
    </div>
  );
};

export default Profile;
