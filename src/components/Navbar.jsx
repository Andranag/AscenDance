import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  Music2, 
  User, 
  LogOut,
  Users,
  BarChart3,
  Award,
  Mail,
  CreditCard,
  Headphones,
  MessageCircle
} from 'lucide-react';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleLogoClick = () => {
    if (location.pathname === '/') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      navigate('/');
      setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 100);
    }
  };

  const handleNavClick = (sectionId) => {
    if (location.pathname === '/') {
      document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate('/');
      setTimeout(() => {
        document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  const navItems = [
    { id: 'extras', icon: Headphones, label: 'Extras' },
    { id: 'testimonials', icon: MessageCircle, label: 'Testimonials' },
    { id: 'newsletter', icon: Mail, label: 'Newsletter' },
    { id: 'pricing', icon: CreditCard, label: 'Payment Plans' },
    { id: 'private-lessons', icon: Award, label: 'Private Coaching' },
    { path: '/profile', icon: User, label: 'Profile' }
  ];

  const adminItems = [
    { path: '/admin/analytics', icon: BarChart3, label: 'Analytics' },
    { path: '/admin/courses', icon: Award, label: 'Course Management' },
    { path: '/admin/users', icon: Users, label: 'User Management' }
  ];

  return (
    <div className="fixed left-0 top-0 h-full w-64 bg-gradient-to-b from-secondary/95 to-accent/95 backdrop-blur-sm shadow-lg z-50">
      <div className="flex flex-col h-full">
        {/* Logo */}
        <button
          onClick={handleLogoClick}
          className="p-6 border-b border-white/10 w-full text-left hover:bg-white/5 transition-colors"
        >
          <div className="flex items-center gap-3 group">
            <h1 className="text-xl font-bold text-white">LindyVerse</h1>
            <p className="text-xs text-white/80">Your gateway to Lindy Hop excellence</p>
          </div>
        </button>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 overflow-y-auto">
          <div className="space-y-2">
            {navItems.map((item) => (
              item.path ? (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 ${
                    location.pathname === item.path
                      ? 'bg-white/5 text-white shadow-md translate-x-2'
                      : 'text-white hover:bg-white/10 hover:translate-x-2'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              ) : (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 w-full text-left text-white hover:bg-white/10 hover:translate-x-2 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2"
                >
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </button>
              )
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
                      location.pathname === item.path
                        ? 'bg-primary/20 text-white shadow-md translate-x-2'
                        : 'text-white hover:bg-primary/10 hover:translate-x-2'
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
          <div className="flex items-center gap-3 group">
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-bold text-white">LindyVerse</h1>
              <p className="text-xs text-white/80">Your gateway to Lindy Hop excellence</p>
            </div>
          </div>
          <div className="flex items-center gap-3 px-4 py-2 mb-4">
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
              <User className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="font-medium text-white">{user?.name}</p>
              <p className="text-sm text-white/80">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-white hover:bg-white/10 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Navbar;