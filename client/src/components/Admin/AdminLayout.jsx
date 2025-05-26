import React from 'react';
import { Menu } from 'semantic-ui-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';

function AdminLayout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const path = location.pathname.split('/');
  const token = localStorage.getItem('token');
  const user = token ? JSON.parse(localStorage.getItem('user')) : null;
  const isAdmin = user?.role === 'admin';
  const currentAdminPage = path[2] || '';

  // Redirect if not admin
  React.useEffect(() => {
    if (!isAdmin) {
      navigate('/');
    }
  }, [isAdmin, navigate]);

  // Return null if not admin
  if (!isAdmin) {
    return null;
  }

  // Handle navigation
  const handleNavigation = (page) => {
    navigate(`/admin/${page}`);
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Menu secondary vertical={true} style={{
        width: '250px',
        borderRight: '1px solid #ddd',
        backgroundColor: '#f5f5f5',
        padding: '1rem 0'
      }}>
        <Menu.Item
          as='a'
          onClick={() => navigate('/')}
          icon={{ name: 'home' }}
          content='Back to Main Site'
          style={{ marginBottom: '1rem' }}
        />
        
        <Menu.Item
          name='dashboard'
          active={currentAdminPage === ''}
          onClick={() => handleNavigation('')}
          icon={{ name: 'dashboard' }}
          content='Dashboard'
        />
        <Menu.Item
          name='courses'
          active={currentAdminPage === 'courses'}
          onClick={() => handleNavigation('courses')}
          icon={{ name: 'book' }}
          content='Course Management'
        />
        <Menu.Item
          name='users'
          active={currentAdminPage === 'users'}
          onClick={() => handleNavigation('users')}
          icon={{ name: 'users' }}
          content='User Management'
        />
        <Menu.Item
          name='analytics'
          active={currentAdminPage === 'analytics'}
          onClick={() => handleNavigation('analytics')}
          icon={{ name: 'chart line' }}
          content='Analytics'
        />
      </Menu>

      <div style={{ flex: 1, padding: '2rem' }}>
        {children}
      </div>
    </div>
  );
}

export default AdminLayout;
