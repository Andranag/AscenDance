import { Menu } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAdmin, logout } = useAuth();

  const handleItemClick = (e, { name }) => {
    // No need to set active item since we're using location.pathname
  };

  return (
    <Menu>
      {user ? (
        <>
          <Menu.Item
            as={Link}
            to="/courses"
            name="courses"
            active={location.pathname === '/' || location.pathname === '/courses'}
            onClick={handleItemClick}
          >
            Courses
          </Menu.Item>
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
            active={false}
            onClick={() => {
              logout();
              navigate('/');
            }}
          >
            Logout
          </Menu.Item>
        </>
      ) : (
        <>
          <Menu.Item
            as={Link}
            to="/courses"
            name="courses"
            active={location.pathname === '/' || location.pathname === '/courses'}
            onClick={handleItemClick}
          >
            Courses
          </Menu.Item>
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
      {isAdmin && (
        <Menu.Item
          as={Link}
          to="/admin"
          name="admin"
          active={location.pathname === '/admin'}
          onClick={handleItemClick}
        >
          Admin
        </Menu.Item>
      )}
    </Menu>
  );
};

export default Navbar;
