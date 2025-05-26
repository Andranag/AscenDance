import React from 'react';
import { Menu, Segment } from 'semantic-ui-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';

const AdminLayout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const activeItem = location.pathname.split('/').pop() || 'dashboard';

  const handleItemClick = (e, { name }) => {
    setActiveItem(name);
    navigate(`/admin/${name}`);
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Menu vertical style={{ width: '250px', borderRight: '1px solid #ddd' }}>
        <Menu.Item
          as={Link}
          to="/"
          icon='home'
          content='Back to Main Site'
          position='left'
          style={{ marginBottom: '1rem' }}
        />
        <Menu.Item
          name='dashboard'
          active={activeItem === 'dashboard'}
          onClick={handleItemClick}
        >
          Dashboard
        </Menu.Item>
        <Menu.Item
          name='courses'
          active={activeItem === 'courses'}
          onClick={handleItemClick}
        >
          Courses
        </Menu.Item>
        <Menu.Item
          name='users'
          active={activeItem === 'users'}
          onClick={handleItemClick}
        >
          Users
        </Menu.Item>
        <Menu.Item
          name='analytics'
          active={activeItem === 'analytics'}
          onClick={handleItemClick}
        >
          Analytics
        </Menu.Item>
      </Menu>

      <Segment style={{ flex: 1, padding: '2rem' }}>
        {children}
      </Segment>
    </div>
  );
};

export default AdminLayout;
