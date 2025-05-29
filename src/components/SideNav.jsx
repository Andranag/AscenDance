import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  Music2, 
  Home, 
  BookOpen, 
  UserCircle, 
  LogOut,
  Users,
  BarChart3,
  Award
} from 'lucide-react';

const SideNav = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => {
    if (path === '/admin/analytics' && location.pathname === '/admin') {
      return true;
    }
    return location.pathname === path;
  };

  const navItems = [
    { path: '/', icon: Home, label: 'Dashboard' },
    { path: '/courses', icon: BookOpen, label: 'Courses' },
    { path: '/profile', icon: UserCircle, label: 'Profile' },
  ];

  const adminItems = [
    { path: '/admin/analytics', icon: BarChart3, label: 'Analytics' },
    { path: '/admin/courses', icon: Award, label: 'Course Management' },
    { path: '/admin/users', icon: Users, label: 'User Management' }
  ];

  return (
    <div className="fixed left-0 top-0 h-full w-64 bg-gradient-to-b from-primary/95 to-accent/95 backdrop-blur-sm shadow-lg z-50">
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className="p-6 border-b border-white/10">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center transform group-hover:rotate-12 transition-transform">
              <Music2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Dance Academy</h1>
              <p className="text-xs text-white/80">Swing into rhythm</p>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6">
          <div className="space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 ${
                  isActive(item.path)
                    ? 'bg-white text-primary shadow-md translate-x-2'
                    : 'text-white hover:bg-white/10 hover:translate-x-2'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </Link>
            ))}

            {user?.role === 'admin' && (
              <>
                <div className="pt-6 pb-2">
                  <h2 className="px-4 text-sm font-semibold text-white/60 uppercase tracking-wider">
                    Admin
                  </h2>
                </div>
                {adminItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 ${
                      isActive(item.path)
                        ? 'bg-white text-primary shadow-md translate-x-2'
                        : 'text-white hover:bg-white/10 hover:translate-x-2'
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                ))}
              </>
            )}
          </div>
        </nav>

        {/* User Section */}
        <div className="p-4 border-t border-white/10">
          <div className="flex items-center gap-3 px-4 py-2 mb-4">
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
              <UserCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="font-medium text-white">{user?.name}</p>
              <p className="text-sm text-white/80">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-white hover:bg-white/10 transition-all duration-200"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default SideNav;