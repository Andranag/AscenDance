import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Music2, BookOpen, User, LogIn, UserPlus, UserCircle } from 'lucide-react';

const Navbar = () => {
  const location = useLocation();
  const { user } = useAuth();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-white/95 shadow-md backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            {/* Logo/Home */}
            <Link
              to="/"
              className="flex items-center px-4 text-primary hover:text-secondary transition-colors"
            >
              <Music2 className="w-6 h-6" />
              <span className="ml-2 font-semibold text-lg">Ascendance</span>
            </Link>

            {/* Main Navigation */}
            <div className="hidden sm:flex sm:ml-6 space-x-4">
              <Link
                to="/courses"
                className={`inline-flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive('/courses')
                    ? 'text-primary bg-primary/5'
                    : 'text-gray-600 hover:text-primary hover:bg-gray-50'
                }`}
              >
                <BookOpen className="w-5 h-5 mr-1.5" />
                Courses
              </Link>
            </div>
          </div>

          {/* Auth Navigation */}
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <Link
                  to="/profile"
                  className={`inline-flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive('/profile')
                      ? 'text-primary bg-primary/5'
                      : 'text-gray-600 hover:text-primary hover:bg-gray-50'
                  }`}
                >
                  <UserCircle className="w-5 h-5 mr-1.5" />
                  Profile
                </Link>
                {user.role === 'admin' && (
                  <Link
                    to="/admin"
                    className={`inline-flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                      location.pathname.startsWith('/admin')
                        ? 'text-primary bg-primary/5'
                        : 'text-gray-600 hover:text-primary hover:bg-gray-50'
                    }`}
                  >
                    <User className="w-5 h-5 mr-1.5" />
                    Admin
                  </Link>
                )}
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className={`inline-flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive('/login')
                      ? 'text-primary bg-primary/5'
                      : 'text-gray-600 hover:text-primary hover:bg-gray-50'
                  }`}
                >
                  <LogIn className="w-5 h-5 mr-1.5" />
                  Login
                </Link>
                <Link
                  to="/register"
                  className="inline-flex items-center px-4 py-2 rounded-md text-sm font-medium btn-primary"
                >
                  <UserPlus className="w-5 h-5 mr-1.5" />
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;