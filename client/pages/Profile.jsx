import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const { user, isAuthenticated, loading, logout } = useAuth();
  const navigate = useNavigate();
  const [debugInfo, setDebugInfo] = useState({});

  useEffect(() => {
    // Comprehensive logging
    console.log('Profile Component - User Object:', user);
    console.log('Profile Component - Is Authenticated:', isAuthenticated);
    console.log('Profile Component - Loading:', loading);
    
    // Collect debug information
    setDebugInfo({
      user,
      isAuthenticated,
      loading,
      token: localStorage.getItem('token')
    });

    // Check token validity
    const token = localStorage.getItem('token');
    const isTokenPresent = !!token;

    // Redirect logic
    if (!loading) {
      if (!isTokenPresent || !isAuthenticated) {
        navigate('/login');
      }
    }
  }, [user, isAuthenticated, loading, navigate]);

  // Handle case where token might be invalid
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Safely extract user details with multiple fallbacks
  const userName = 
    user?.name || 
    user?.username || 
    user?.displayName || 
    'Not Provided';
  
  const userEmail = 
    user?.email || 
    user?.emailAddress || 
    'Not Provided';
  
  const userRole = 
    user?.role || 
    user?.userRole || 
    user?.type || 
    'Not Assigned';

  // Render loading state
  if (loading) {
    return (
      <div className='flex justify-center items-center h-screen'>
        <div className='animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900'></div>
      </div>
    );
  }

  // Render profile or login prompt
  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center p-4'>
      <div className='w-full max-w-md'>
        {isAuthenticated && user ? (
          <div className='bg-white rounded-2xl shadow-2xl overflow-hidden transform transition-all duration-300 hover:scale-105'>
            {/* Profile Header */}
            <div className='bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 text-center'>
              <div className='w-24 h-24 bg-white rounded-full mx-auto mb-4 flex items-center justify-center shadow-lg'>
                <span className='text-3xl font-bold text-blue-600'>
                  {userName.charAt(0).toUpperCase()}
                </span>
              </div>
              <h2 className='text-2xl font-bold'>{userName}</h2>
              <p className='text-sm opacity-80'>{userRole}</p>
            </div>

            {/* Profile Details */}
            <div className='p-6 space-y-4'>
              <div className='flex items-center space-x-4 bg-gray-50 p-3 rounded-lg'>
                <svg xmlns='http://www.w3.org/2000/svg' className='h-6 w-6 text-blue-500' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' />
                </svg>
                <div>
                  <p className='text-sm text-gray-500'>Email</p>
                  <p className='font-semibold'>{userEmail}</p>
                </div>
              </div>

              <div className='flex items-center space-x-4 bg-gray-50 p-3 rounded-lg'>
                <svg xmlns='http://www.w3.org/2000/svg' className='h-6 w-6 text-green-500' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z' />
                </svg>
                <div>
                  <p className='text-sm text-gray-500'>Role</p>
                  <p className='font-semibold'>{userRole}</p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className='p-6 border-t border-gray-200 flex justify-between items-center'>
              <button 
                onClick={handleLogout}
                className='w-full bg-red-500 text-white py-3 rounded-lg hover:bg-red-600 transition duration-300 flex items-center justify-center space-x-2'
              >
                <svg xmlns='http://www.w3.org/2000/svg' className='h-5 w-5' viewBox='0 0 20 20' fill='currentColor'>
                  <path fillRule='evenodd' d='M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 1.293a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 01-1.414-1.414L14.586 11H7a1 1 0 110-2h7.586l-1.293-1.293a1 1 0 010-1.414z' clipRule='evenodd' />
                </svg>
                <span>Logout</span>
              </button>
            </div>
          </div>
        ) : (
          <div className='bg-white rounded-2xl shadow-2xl p-8 text-center space-y-6'>
            <div className='bg-gray-100 rounded-full w-24 h-24 mx-auto flex items-center justify-center'>
              <svg xmlns='http://www.w3.org/2000/svg' className='h-12 w-12 text-gray-500' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z' />
              </svg>
            </div>
            <h2 className='text-2xl font-bold text-gray-800'>Welcome Back</h2>
            <p className='text-gray-600 mb-4'>Please log in to access your profile</p>
            <button 
              onClick={() => navigate('/login')}
              className='w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition duration-300 flex items-center justify-center space-x-2'
            >
              <svg xmlns='http://www.w3.org/2000/svg' className='h-5 w-5' viewBox='0 0 20 20' fill='currentColor'>
                <path fillRule='evenodd' d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z' clipRule='evenodd' />
              </svg>
              <span>Go to Login</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
