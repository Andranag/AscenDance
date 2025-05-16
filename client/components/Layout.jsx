import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const NavigationMenu = () => {
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();

  const menuItems = [
    { name: 'Home', path: '/', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
    { name: 'Profile', path: '/profile', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a8 8 0 00-8 8h16a8 8 0 00-8-8z' }
  ];

  return (
    <nav className='fixed bottom-0 left-0 right-0 bg-white shadow-2xl rounded-t-2xl z-50'>
      <div className='flex justify-around py-3'>
        {menuItems.map((item) => (
          <button 
            key={item.path}
            onClick={() => navigate(item.path)}
            className='flex flex-col items-center justify-center space-y-1 text-gray-600 hover:text-blue-600 transition-colors duration-300'
          >
            <svg xmlns='http://www.w3.org/2000/svg' className='h-6 w-6' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d={item.icon} />
            </svg>
            <span className='text-xs'>{item.name}</span>
          </button>
        ))}
        {isAuthenticated && (
          <button 
            onClick={logout}
            className='flex flex-col items-center justify-center space-y-1 text-red-600 hover:text-red-800 transition-colors duration-300'
          >
            <svg xmlns='http://www.w3.org/2000/svg' className='h-6 w-6' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1' />
            </svg>
            <span className='text-xs'>Logout</span>
          </button>
        )}
      </div>
    </nav>
  );
};

const Layout = ({ children }) => {
  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex flex-col'>
      <main className='flex-grow pb-20'>
        {children}
      </main>
      <NavigationMenu />
    </div>
  );
};

export default Layout;
