import { useNavigate, useLocation } from 'react-router-dom';
import ProfileEditor from '../components/ProfileEditor';
import { useState, useEffect } from 'react';
import { fetchWithAuth } from '../api';
import AdminLayout from '../components/Admin/AdminLayout';

const Profile = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const isAdmin = localStorage.getItem('role') === 'admin';


  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // Verify token exists
        const token = localStorage.getItem('token');
        if (!token) {
          console.error('No token found in localStorage');
          setError('Not authenticated. Please login again.');
          return;
        }
        console.log('Token exists:', token);

        // First try to get user data from localStorage
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          const userData = JSON.parse(storedUser);
          // Ensure role is set to 'user' if it's 'student'
          if (userData.role === 'student') {
            userData.role = 'user';
          }
          setUser(userData);
          return;
        }

        // If not in localStorage, fetch from API
        const response = await fetchWithAuth('/api/auth/profile');
        console.log('Profile response:', response);
        
        // Ensure we have user data
        const userData = response.data || response.user || {};
        
        // Store the user data in localStorage
        localStorage.setItem('user', JSON.stringify({
          _id: userData._id || userData.user?.id || Date.now().toString(),
          name: userData.name || userData.user?.name || userData.user?.username || userData.username || email.split('@')[0],
          email: email,
          role: userData.role || userData.user?.role || 'user'
        }));
        
        setUser(userData);
      } catch (err) {
        console.error('Error fetching profile:', err);
        
        // Check for specific error messages
        if (err.message.includes('Unauthorized')) {
          setError('Your session has expired. Please login again.');
        } else if (err.message.includes('user_not_found')) {
          setError('User account not found. Please contact support.');
        } else if (err.message.includes('token_expired')) {
          setError('Your token has expired. Please login again.');
        } else {
          setError(`Failed to load profile: ${err.message}`);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleUpdate = async (updates) => {
    try {
      // Verify token exists before making request
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }
      console.log('Token exists:', token);

      // Ensure we're not sending any role data in the update
      const updateData = {
        name: updates.name,
        email: updates.email
      };
      
      try {
        const response = await fetchWithAuth('/api/auth/profile', {
          method: 'PUT',
          body: JSON.stringify(updateData)
        });
        
        // The backend returns a nested response structure
        const updatedData = response.data;
        
        // Store the updated user data in localStorage
        localStorage.setItem('user', JSON.stringify({
          _id: updatedData.id,
          name: updatedData.name,
          email: updatedData.email,
          role: localStorage.getItem('role') || 'user'  // Preserve role from localStorage
        }));
        
        // Update the user state
        setUser({
          id: updatedData.id,
          name: updatedData.name,
          email: updatedData.email,
          role: localStorage.getItem('role') || 'user'
        });
        
        return updatedData;
      } catch (error) {
        console.error('Profile update error:', error);
        setError('Failed to update profile. Please try again.');
        return null;
      }
    } catch (err) {
      console.error('Error updating profile:', err);
      
      // Check for specific error messages
      if (err.message.includes('Unauthorized')) {
        setError('Your session has expired. Please login again.');
      } else if (err.message.includes('user_not_found')) {
        setError('User account not found. Please contact support.');
      } else if (err.message.includes('token_expired')) {
        setError('Your token has expired. Please login again.');
      } else {
        setError(`Failed to update profile: ${err.message}`);
      }
      return null;
    }
  };

  if (loading) {
    return (
      <div style={{ maxWidth: '800px', margin: '2rem auto', padding: '1rem' }}>
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
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ maxWidth: '800px', margin: '2rem auto', padding: '1rem' }}>
        <h2>Profile</h2>
        {error && (
          <div style={{
            padding: '1rem',
            backgroundColor: '#fef3f3',
            borderRadius: '0.25rem',
            color: '#c4302b'
          }}>
            {error}
          </div>
        )}
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '800px', margin: '2rem auto', padding: '1rem' }}>
      <h2>Profile</h2>
      {error && (
        <div style={{
          padding: '1rem',
          backgroundColor: '#fef3f3',
          borderRadius: '0.25rem',
          color: '#c4302b'
        }}>
          {error}
        </div>
      )}
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
          <div className="ui active inline loader"></div>
          <span>Loading profile...</span>
        </div>
      ) : (
        user && (
          <div>
            <p>Name: {user.name}</p>
            <p>Email: {user.email}</p>
            <ProfileEditor 
              user={{
                _id: user.id,
                name: user.name,
                email: user.email
              }} 
              onUpdate={handleUpdate} 
            />
          </div>
        )
      )}
    </div>
  );
};

export default Profile;
