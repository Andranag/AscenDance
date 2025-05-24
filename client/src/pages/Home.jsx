import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Play, Star, Users, Calendar, ArrowRight, User, Menu, X, LogOut } from 'lucide-react';
import Logo from '../components/common/Logo';
import Button from '../components/common/Button';
import { useAuth } from '../contexts/AuthContext';

const Home = () => {
  const auth = useAuth();
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
  const [isAuthed, setIsAuthed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // In development mode, use mock data from AuthContext
    if (process.env.NODE_ENV === 'development') {
      setUser({
        id: '123',
        name: 'Developer User',
        email: 'developer@example.com',
        role: 'student'
      });
      setLoading(false);
      return;
    }

    // Production mode - use real API
    const checkAuth = async () => {
      try {
        if (!auth.user) {
          throw new Error('No user data found');
        }
        setUser(auth.user);
      } catch (err) {
        console.error('Auth error:', err);
        setError('Failed to load user data');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [auth.user]);

  const [showMenu, setShowMenu] = useState(false);

  return (
    <div className="min-h-screen bg-black text-white">
      <main className="">
        {/* Hero Section */}
        <section className="relative h-screen flex items-center justify-center">
          <div className="absolute inset-0">
            <img
              src="https://images.pexels.com/photos/2188012/pexels-photo-2188012.jpeg"
              alt="Dance"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/50"></div>
          </div>
          <div className="relative text-center px-4">
            <h1 className="text-4xl md:text-6xl font-bold mb-4 text-white">
              Welcome to AscenDance
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-8">
              Your journey to dance mastery begins here
            </p>
            <Button
              onClick={() => navigate('/register')}
              className="bg-purple-500 hover:bg-purple-600 px-8 py-4 text-lg rounded-lg"
            >
              Start Learning
            </Button>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-12 text-white">
              Why Choose AscenDance?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <div key={index} className="bg-white/5 p-6 rounded-lg">
                  <div className="flex items-center gap-4 mb-4">
                    {feature.icon}
                    <h3 className="text-xl font-semibold text-white">
                      {feature.title}
                    </h3>
                  </div>
                  <p className="text-white/80">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Dance Styles Section */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-12 text-white">
              Our Dance Styles
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {danceStyles.map((style, index) => (
                <div key={index} className="bg-white/5 p-6 rounded-lg">
                  <img
                    src={style.image}
                    alt={style.name}
                    className="w-full h-48 object-cover rounded-lg mb-4"
                  />
                  <h3 className="text-xl font-semibold text-white">
                    {style.name}
                  </h3>
                  <p className="text-white/80">
                    {style.level}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-white/5 py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold mb-6 text-white">
              Ready to Start Your Dance Journey?
            </h2>
            <p className="text-xl text-white/90 mb-8">
              Join thousands of students learning to dance with us
            </p>
            <Button
              onClick={() => navigate('/register')}
              className="bg-purple-500 hover:bg-purple-600 px-8 py-4 text-lg rounded-lg"
            >
              Get Started Now
            </Button>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Home;