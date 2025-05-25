import { Menu } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { useState } from 'react';

const Navbar = () => {
  const [activeItem, setActiveItem] = useState('login');

  const handleItemClick = (e, { name }) => {
    setActiveItem(name);
  };

  return (
    <Menu>
      <Menu.Item
        as={Link}
        to="/"
        name="login"
        active={activeItem === 'login'}
        onClick={handleItemClick}
      >
        Login
      </Menu.Item>
      <Menu.Item
        as={Link}
        to="/register"
        name="register"
        active={activeItem === 'register'}
        onClick={handleItemClick}
      >
        Register
      </Menu.Item>
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
    </Menu>
  );
};

export default Navbar;
