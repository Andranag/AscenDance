import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User } from 'lucide-react';

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token') || sessionStorage.getItem('token');
  
  // For debugging, log the token
  console.log('Token:', token);

  const handleLogout = () => {
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <nav className="bg-purple-500 text-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link to="/" className="flex items-center">
              <span className="text-xl font-bold text-white">AscenDance</span>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {token && (
              <>
                <Link to="/student/dashboard" className="text-white hover:text-gray-100 transition-colors">
                  Dashboard
                </Link>
                <Link to="/student/profile" className="text-white hover:text-gray-100 transition-colors">
                  <User className="w-6 h-6" />
                </Link>
                <button onClick={handleLogout} className="ml-2 px-4 py-2 bg-white/10 border border-white/20 text-white hover:bg-white/20 rounded-lg transition-colors">
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;