import React from 'react';
import { Menu, Icon } from 'semantic-ui-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const isAdmin = user?.role === 'admin';

  const handleItemClick = (e, { name }) => {
    // No need to set active item since we're using location.pathname
  };

  return (
    <div style={{
      width: '100%'
    }}>
      <Menu pointing secondary>
        <Menu.Item
          as={Link}
          to="/courses"
          name="courses"
          active={location.pathname === '/' || location.pathname === '/courses'}
          onClick={handleItemClick}
        >
          Courses
        </Menu.Item>
        {user ? (
          <>
            <Menu.Item
              as={Link}
              to="/profile"
              name="profile"
              active={location.pathname === '/profile'}
              onClick={handleItemClick}
            >
              Profile
            </Menu.Item>
            <Menu.Item
              name="logout"
              position="right"
              active={false}
              onClick={() => {
                logout();
                navigate('/');
              }}
            >
              <Icon name='sign out' />
              Sign Out
            </Menu.Item>
          </>
        ) : (
          <>
            <Menu.Item
              as={Link}
              to="/login"
              name="login"
              active={location.pathname === '/login'}
              onClick={handleItemClick}
            >
              Sign In
            </Menu.Item>
            <Menu.Item
              as={Link}
              to="/register"
              name="register"
              active={location.pathname === '/register'}
              onClick={handleItemClick}
            >
              Sign Up
            </Menu.Item>
          </>
        )}
      </Menu>
    </div>
  );
};

export default Navbar;