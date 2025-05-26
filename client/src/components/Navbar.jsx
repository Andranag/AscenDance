import { Menu } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const [activeItem, setActiveItem] = useState('login');
  const [isAdmin, setIsAdmin] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const user = JSON.parse(localStorage.getItem('user'));
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const payload = JSON.parse(window.atob(base64));
      const role = payload.role || user.role;
      setIsAdmin(role === 'admin');
    } else {
      setIsAdmin(false);
    }
  }, [location]);

  const handleItemClick = (e, { name }) => {
    setActiveItem(name);
  };

  const token = localStorage.getItem('token');

  return (
    <Menu>
      {token ? (
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
          {isAdmin && (
            <>
              <Menu.Item
                as={Link}
                to="/admin/courses"
                name="admin"
                active={activeItem === 'admin'}
                onClick={handleItemClick}
              >
                Admin
              </Menu.Item>
              <Menu.Item
                as={Link}
                to="/admin/dashboard"
                name="dashboard"
                active={activeItem === 'dashboard'}
                onClick={handleItemClick}
              >
                Dashboard
              </Menu.Item>
            </>
          )}
          <Menu.Item
            name="logout"
            active={activeItem === 'logout'}
            onClick={() => {
              localStorage.removeItem('token');
              localStorage.removeItem('user');
              localStorage.removeItem('role');
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
        </>
      )}
    </Menu>
  );
};

export default Navbar;
