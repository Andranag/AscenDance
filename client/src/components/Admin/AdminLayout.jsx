import React, { useEffect } from 'react';
import { Menu } from 'semantic-ui-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const AdminLayout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const path = location.pathname.split('/');
  const { user, logout } = useAuth();
  const isAdmin = user?.role === 'admin';
  const currentAdminPage = path[2] || '';

  useEffect(() => {
    if (!isAdmin) {
      navigate('/');
    }
  }, [isAdmin, navigate]);

  if (!isAdmin) {
    return null;
  }

  const handleNavigation = (page) => {
    navigate(`/admin/${page}`);
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Menu secondary vertical style={{
        width: '250px',
        borderRight: '1px solid #ddd',
        backgroundColor: '#f5f5f5',
        padding: '1rem 0'
      }}>
        <Menu.Item
          as='a'
          onClick={() => navigate('/')}
          icon='home'
          content='Back to Main Site'
          style={{ marginBottom: '1rem' }}
        />
        
        <Menu.Item
          name='courses'
          active={currentAdminPage === 'courses'}
          onClick={() => handleNavigation('courses')}
          icon='book'
          content='Course Management'
        />
        
        <Menu.Item
          name='users'
          active={currentAdminPage === 'users'}
          onClick={() => handleNavigation('users')}
          icon='users'
          content='User Management'
        />
        
        <Menu.Item
          name='analytics'
          active={currentAdminPage === 'analytics'}
          onClick={() => handleNavigation('analytics')}
          icon='chart line'
          content='Analytics'
        />
      </Menu>
      
      <div style={{ flex: 1, padding: '2rem' }}>
        {children}
      </div>
    </div>
  );
};

export default AdminLayout;
