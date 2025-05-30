import React, { useState, useEffect } from 'react';
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
  MessageCircle,
  Menu,
  X
} from 'lucide-react';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  useEffect(() => {
    const handleClickOutside = (event) => {
      const navbar = document.querySelector('.navbar');
      const menuButton = document.querySelector('.navbar button');
      
      if (isOpen && navbar && !navbar.contains(event.target) && !menuButton.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isOpen]);

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
    setIsOpen(false);
  };

  const handleNavClick = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (location.pathname === '/') {
      if (section) {
        section.scrollIntoView({ 
          behavior: 'smooth',
          block: 'center'
        });
      }
    } else {
      navigate('/');
      setTimeout(() => {
        if (section) {
          section.scrollIntoView({ 
            behavior: 'smooth',
            block: 'center'
          });
        }
      }, 100);
    }
    setIsOpen(false);
  };

  const navItems = [
    { id: 'featured-courses', icon: Award, label: 'Featured Courses' },
    { id: 'about', icon: User, label: 'About Me' },
    { id: 'extras', icon: Headphones, label: 'Extras' },
    { id: 'testimonials', icon: MessageCircle, label: 'What Students Say' },
    { id: 'newsletter', icon: Mail, label: 'Newsletter' },
    { id: 'pricing', icon: CreditCard, label: 'Payment Plans' },
    { id: 'private-lessons', icon: Headphones, label: '1-on-1 Online' }
  ];



  const adminItems = [
    { path: '/admin/analytics', icon: BarChart3, label: 'Analytics' },
    { path: '/admin/courses', icon: Award, label: 'Course Management' },
    { path: '/admin/users', icon: Users, label: 'User Management' }
  ];

  return (
    <div className="navbar">
      {/* Hamburger Menu Button */}
      <button
        onClick={toggleMenu}
        className="fixed left-4 top-4 z-50 p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white"
      >
        <Menu className="w-6 h-6" />
      </button>

      {/* Main Navigation */}
      <div
        className={`fixed left-0 top-0 h-full bg-gradient-to-b from-secondary/95 to-accent/95 backdrop-blur-sm shadow-lg z-50 transition-all duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
            <div className="p-4 border-b border-white/10 w-full text-left hover:bg-white/5 transition-colors">
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl font-bold text-white cursor-pointer" onClick={handleLogoClick}>LindyVerse</h1>
                </div>
                <div className="flex items-center gap-4">
                  {user && (
                    <Link
                      to="/profile"
                      onClick={() => setIsOpen(false)}
                      className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white"
                      title="Profile"
                    >
                      <User className="w-6 h-6" />
                    </Link>
                  )}
                  <button
                    onClick={toggleMenu}
                    className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white"
                    title="Close Navigation"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>
               <div className="flex-1"></div>
            </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 overflow-y-auto">
            <div className="space-y-2">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 w-full text-left text-white hover:bg-white/10 hover:translate-x-2 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 ${
                    location.pathname === '/' && document.getElementById(item.id)?.contains(document.activeElement)
                      ? 'bg-white/5 text-white shadow-md translate-x-2 font-bold'
                      : ''
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </button>
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
                      onClick={() => setIsOpen(false)}
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
              <div className="pt-6">
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg w-full text-left transition-all duration-300 text-white hover:bg-red-500/10 hover:translate-x-2 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:ring-offset-2"
                >
                  <LogOut className="w-5 h-5" />
                  <span className="font-medium">Logout</span>
                </button>
              </div>
            </div>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default Navbar;