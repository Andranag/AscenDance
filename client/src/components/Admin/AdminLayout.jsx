import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { BookOpen, Users, BarChart3, LogOut } from 'lucide-react';

const AdminLayout = ({ children }) => {
  const location = useLocation();
  const { user, logout } = useAuth();
  const isAdmin = user?.role === 'admin';

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="flex min-h-screen">
      <div className="w-64 bg-white shadow-lg fixed h-full">
        <div className="flex flex-col h-full">
          <div className="p-4 border-b">
            <h2 className="text-xl font-semibold text-primary">Admin Dashboard</h2>
          </div>
          <nav className="flex-1 p-4 space-y-2">
            <Link
              to="/admin/courses"
              className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                location.pathname === '/admin/courses'
                  ? 'bg-primary text-white'
                  : 'text-gray-600 hover:bg-primary/5'
              }`}
            >
              <BookOpen className="w-5 h-5" />
              <span>Course Management</span>
            </Link>
            <Link
              to="/admin/users"
              className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                location.pathname === '/admin/users'
                  ? 'bg-primary text-white'
                  : 'text-gray-600 hover:bg-primary/5'
              }`}
            >
              <Users className="w-5 h-5" />
              <span>User Management</span>
            </Link>
            <Link
              to="/admin/analytics"
              className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                location.pathname === '/admin/analytics'
                  ? 'bg-primary text-white'
                  : 'text-gray-600 hover:bg-primary/5'
              }`}
            >
              <BarChart3 className="w-5 h-5" />
              <span>Analytics</span>
            </Link>
          </nav>
          <div className="p-4 border-t">
            <button
              onClick={logout}
              className="flex items-center space-x-3 p-3 w-full rounded-lg text-gray-600 hover:bg-red-50 hover:text-red-600 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
      <div className="ml-64 flex-1 p-8 bg-gray-50">
        {children}
      </div>
    </div>
  );
};

export default AdminLayout;