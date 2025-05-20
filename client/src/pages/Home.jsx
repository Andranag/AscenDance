import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Play, Star, Users, Calendar, ArrowRight, User, Menu, X, LogOut } from 'lucide-react';
import Logo from '../components/common/Logo';
import Button from '../components/common/Button';

const Home = () => {
  const features = [
    {
      icon: <Play className="w-6 h-6 text-purple-400" />,
      title: "Live Online Classes",
      description: "Join interactive dance sessions from anywhere in the world"
    },
    {
      icon: <Star className="w-6 h-6 text-purple-400" />,
      title: "Expert Instructors",
      description: "Learn from professional dancers with years of experience"
    },
    {
      icon: <Users className="w-6 h-6 text-purple-400" />,
      title: "Community Support",
      description: "Connect with fellow dancers and share your progress"
    },
    {
      icon: <Calendar className="w-6 h-6 text-purple-400" />,
      title: "Flexible Schedule",
      description: "Choose from multiple class times that fit your lifestyle"
    }
  ];

  const danceStyles = [
    {
      name: "Tango",
      image: "https://images.pexels.com/photos/2188012/pexels-photo-2188012.jpeg",
      level: "All Levels"
    },
    {
      name: "Hip Hop",
      image: "https://images.pexels.com/photos/2820896/pexels-photo-2820896.jpeg",
      level: "Beginner Friendly"
    },
    {
      name: "Ballet",
      image: "https://images.pexels.com/photos/358010/pexels-photo-358010.jpeg",
      level: "Intermediate"
    }
  ];

  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (token) {
      // Fetch user data from API
      fetch('http://localhost:3050/api/user/me', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      .then(response => response.json())
      .then(data => setUser(data));
    }
  }, []);

  const [showMenu, setShowMenu] = useState(false);
  const [isAuthed, setIsAuthed] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    setIsAuthed(!!token);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation */}
      <nav className="border-b border-white/10 bg-black/40 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-6">
              <Logo />
              {isAuthed && (
                <>
                  <div className="hidden md:flex items-center gap-4">
                    <Link 
                      to="/student/dashboard" 
                      className="px-4 py-2 bg-white/10 rounded-lg text-white hover:bg-white/20 transition-colors"
                    >
                      Dashboard
                    </Link>
                    <Link 
                      to="/student/courses" 
                      className="px-4 py-2 bg-white/10 rounded-lg text-white hover:bg-white/20 transition-colors"
                    >
                      Courses
                    </Link>
                    <Link 
                      to="/student/profile" 
                      className="px-4 py-2 bg-white/10 rounded-lg text-white hover:bg-white/20 transition-colors"
                    >
                      Profile
                    </Link>
                  </div>
                  <button 
                    onClick={() => setShowMenu(!showMenu)}
                    className="md:hidden text-white hover:text-white/80"
                  >
                    {showMenu ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                  </button>
                </>
              )}
            </div>
            <div className="flex items-center gap-6">
              {isAuthed ? (
                <div className="flex items-center gap-4">
                  <User className="w-6 h-6 text-white/80 hover:text-white transition-colors" />
                  <span className="text-white/80 hover:text-white transition-colors">Student</span>
                  <button
                    onClick={() => {
                      localStorage.removeItem('token');
                      sessionStorage.removeItem('token');
                      setIsAuthed(false);
                      navigate('/');
                    }}
                    className="flex items-center gap-2 text-white/80 hover:text-white transition-colors"
                  >
                    <LogOut className="w-5 h-5" />
                    <span>Logout</span>
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-4">
                  <Link 
                    to="/login" 
                    className="text-white/80 hover:text-white transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link 
                    to="/register"
                    className="text-white/80 hover:text-white transition-colors"
                  >
                    Join Now
                  </Link>
                </div>
              )}
            </div>
          </div>
          
          {/* Mobile Menu */}
          {isAuthed && showMenu && (
            <div className="md:hidden mt-4">
              <div className="border-t border-white/10 pt-4">
                <div className="px-4 py-3 bg-white/10 rounded-lg text-white hover:bg-white/20 transition-colors">
                  <Link to="/student/dashboard" onClick={() => setShowMenu(false)}>
                    Dashboard
                  </Link>
                </div>
                <div className="px-4 py-3 bg-white/10 rounded-lg text-white hover:bg-white/20 transition-colors">
                  <Link to="/student/courses" onClick={() => setShowMenu(false)}>
                    Courses
                  </Link>
                </div>
                <div className="px-4 py-3 bg-white/10 rounded-lg text-white hover:bg-white/20 transition-colors">
                  <Link to="/student/profile" onClick={() => setShowMenu(false)}>
                    Profile
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src="https://images.pexels.com/photos/690597/pexels-photo-690597.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" 
            alt="Hero background" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="max-w-3xl">
            <h1 className="text-5xl md:text-6xl font-['Playfair_Display'] font-medium mb-6">
              {user ? (
                <>
                  Welcome back, {user.name}!
                  <br />
                  Ready to dance?
                </>
              ) : (
                "Dance Your Way to Excellence"
              )}
            </h1>
            <p className="text-xl text-white/80 mb-8 font-light">
              {user ? (
                "Continue your dance journey with our online classes and expert instructors."
              ) : (
                "Join our online dance classes and learn from world-class instructors. Whether you're a beginner or advanced dancer, we have the perfect class for you."
              )}
            </p>
            {user ? (
              <Link to="/student/dashboard">
                <Button variant="primary" className="!text-lg">
                  Go to Dashboard <ArrowRight className="ml-2" />
                </Button>
              </Link>
            ) : (
              <Link to="/register">
                <Button variant="primary" className="!text-lg">
                  Start Your Journey <ArrowRight className="ml-2" />
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-black/40 backdrop-blur-xl border-y border-white/10 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white/5 rounded-xl p-6 hover:bg-white/10 transition-colors">
                <div className="bg-purple-500/10 rounded-lg w-12 h-12 flex items-center justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-medium mb-2">{feature.title}</h3>
                <p className="text-white/70">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Dance Styles Section */}
      <div className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-['Playfair_Display'] font-medium mb-12 text-center">
            Popular Dance Styles
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {danceStyles.map((style, index) => (
              <div key={index} className="group relative overflow-hidden rounded-xl">
                <img 
                  src={style.image} 
                  alt={style.name}
                  className="w-full h-[400px] object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="text-2xl font-medium mb-2">{style.name}</h3>
                  <p className="text-white/70">{style.level}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;