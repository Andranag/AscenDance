import { Menu } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
  const [activeItem, setActiveItem] = useState('login');
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAdmin, logout } = useAuth();

  const handleItemClick = (e, { name }) => {
    setActiveItem(name);
  };

  return (
    <Menu>
      {user ? (
        <>
          <Menu.Item
            as={Link}
            to="/courses"
            name="courses"
            active={activeItem === 'courses'}
            onClick={handleItemClick}
          >
            Courses
          </Menu.Item>
          <Menu.Item
            as={Link}
            to="/profile"
            name="profile"
            active={activeItem === 'profile'}
            onClick={handleItemClick}
          >
            Profile
          </Menu.Item>
          <Menu.Item
            name="logout"
            active={activeItem === 'logout'}
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
            active={activeItem === 'courses'}
            onClick={handleItemClick}
          >
            Courses
          </Menu.Item>
          <Menu.Item
            as={Link}
            to="/login"
            name="login"
            active={activeItem === 'login'}
            onClick={handleItemClick}
          >
            Sign In
          </Menu.Item>
          <Menu.Item
            as={Link}
            to="/register"
            name="register"
            active={activeItem === 'register'}
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
          active={activeItem === 'admin'}
          onClick={handleItemClick}
        >
          Admin
        </Menu.Item>
      )}
    </Menu>
  );
};

export default Navbar;
