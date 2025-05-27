import React from 'react';
import { Menu, Icon } from 'semantic-ui-react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const AdminLayout = ({ children }) => {
  const location = useLocation();
  const { user, logout } = useAuth();
  const isAdmin = user?.role === 'admin';

  if (!isAdmin) {
    return null;
  }

  return (
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      position: 'relative'
    }}>
      <div style={{
        width: '250px',
        borderRight: '1px solid #ddd',
        backgroundColor: '#f5f5f5',
        padding: '1rem 0',
        position: 'fixed',
        top: 0,
        left: 0,
        bottom: 0,
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column'
      }}>
        <div style={{
          flex: 1,
          overflow: 'auto',
          paddingTop: '1rem'
        }}>
          <Menu vertical>
            <Menu.Item
              as={Link}
              to="/admin/courses"
              name="admin-courses"
              active={location.pathname === '/admin/courses'}
              icon='book'
              content='Course Management'
            />
            <Menu.Item
              as={Link}
              to="/admin/users"
              name="admin-users"
              active={location.pathname === '/admin/users'}
              icon='users'
              content='User Management'
            />
            <Menu.Item
              as={Link}
              to="/admin/analytics"
              name="admin-analytics"
              active={location.pathname === '/admin/analytics'}
              icon='chart line'
              content='Analytics'
            />
          </Menu>
        </div>
      </div>
      <div style={{
        marginLeft: '250px',
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        paddingTop: '64px'
      }}>
        <div style={{
          flex: 1,
          overflow: 'auto',
          backgroundColor: 'white'
        }}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
