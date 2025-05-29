import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import CourseCard from '../components/CourseCard';
import PrivateCoachingForm from '../components/modals/PrivateCoachingForm';
import { 
  Music2, Loader, Star, Users, Clock, ChevronRight, Quote, CheckCircle, Play, 
  Calendar, Award, Mail, CreditCard, ArrowRight, Headphones, Video, Target, Heart,
  BookOpen, Gamepad
} from 'lucide-react';

const LandingPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [email, setEmail] = useState('');
  const [showCoachingForm, setShowCoachingForm] = useState(false);

  const historicImages = [
    {
      src: '/frankie_manning_ann_johnson_1941-1-216x300.jpg',
      caption: 'Frankie Manning performing his signature aerial move',
      year: '1941'
    },
    {
      src: '/Nicholas-Brothers-102622-03-7a28b8d5b677496e8e274baa5c161db9.webp',
      caption: 'The Nicholas Brothers showcasing their incredible talent',
      year: '1943'
    },
    {
      src: '/1-ginger-rogers-and-fred-astaire-dancing-bettmann.jpg',
      caption: 'Fred Astaire and Ginger Rogers bringing swing to Hollywood',
      year: '1936'
    },
    {
      src: '/MV5BMmQ1YjZmNzItMDJiOS00Y2UxLTg1YmEtZGY2ZDc0YTIxNTJmXkEyXkFqcGc@._V1_.jpg',
      caption: 'The elegance and style of the swing era',
      year: '1940s'
    }
  ];

  useEffect(() => {
    const fetchFeaturedCourses = async () => {
      try {
        // This would be replaced with an actual API call
        const mockCourses = [
          {
            _id: '1',
            title: 'Introduction to Swing',
            description: 'Master the fundamentals of swing dancing in this comprehensive course.',
            style: 'Lindy Hop',
            level: 'Beginner'
          },
          {
            _id: '2',
            title: 'Rhythm and Blues Foundations',
            description: 'Discover the soulful moves of Rhythm and Blues dancing.',
            style: 'Rhythm and Blues',
            level: 'Beginner'
          }
        ];

        setCourses(mockCourses);
        setLoading(false);
      } catch (err) {
        setError(err.message || 'Failed to fetch courses');
        setLoading(false);
      }
    };

    fetchFeaturedCourses();
  }, []);

  useEffect(() => {
    if (location.hash === '#about') {
      const aboutSection = document.getElementById('about');
      if (aboutSection) {
        aboutSection.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [location.hash]);

  const testimonials = [
    {
      id: 1,
      name: 'Emily Rodriguez',
      role: 'Intermediate Dancer',
      image: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg',
      content: "The instructors break down complex moves in a way that's easy to understand. After 3 months, I'm confidently dancing at social events!"
    },
    {
      id: 2,
      name: 'Marcus Chen',
      role: 'Advanced Dancer',
      image: 'https://images.pexels.com/photos/1516680/pexels-photo-1516680.jpeg',
      content: "The advanced techniques taught here have completely transformed my solo jazz game. The attention to historical context is unmatched."
    }
  ];

  const pricingPlans = [
    {
      name: 'Monthly',
      price: 29,
      period: 'month',
      features: [
        'Access to all basic courses',
        'Community forum access',
        'Monthly live Q&A sessions',
        'Basic progress tracking'
      ],
      buttonText: 'Start Monthly Plan',
      style: 'bg-white hover:bg-primary text-primary hover:text-white border-2 border-primary/20 shadow-lg hover:shadow-xl'
    },
    {
      name: 'Quarterly',
      price: 79,
      period: '3 months',
      popular: true,
      features: [
        'All Monthly features',
        'Advanced course access',
        'Weekly live workshops',
        'Personal feedback sessions',
        'Save 10% vs monthly'
      ],
      buttonText: 'Choose Best Value',
      style: 'bg-primary hover:bg-primary/90 text-white border-2 border-white/20 shadow-lg hover:shadow-xl'
    },
    {
      name: 'Annual',
      price: 249,
      period: 'year',
      features: [
        'All Quarterly features',
        '1-on-1 mentoring sessions',
        'Priority support',
        'Custom learning path',
        'Save 25% vs monthly'
      ],
      buttonText: 'Start Annual Plan',
      style: 'bg-white hover:bg-primary text-primary hover:text-white border-2 border-primary/20 shadow-lg hover:shadow-xl'
    }
  ];

  const practicePlaylists = [
    {
      title: "Beginner Swing Essentials",
      description: "Perfect for practicing basic steps and timing",
      tempo: "120-140 BPM",
      duration: "60 minutes",
      style: "Easy listening swing",
      image: "https://images.pexels.com/photos/1626481/pexels-photo-1626481.jpeg"
    },
    {
      title: "Intermediate Lindy Hop Mix",
      description: "Dynamic tracks for social dancing practice",
      tempo: "140-160 BPM",
      duration: "75 minutes",
      style: "Classic swing era",
      image: "https://images.pexels.com/photos/1644616/pexels-photo-1644616.jpeg"
    },
    {
      title: "Advanced Jazz Steps",
      description: "Complex rhythms for advanced routines",
      tempo: "160-180 BPM",
      duration: "90 minutes",
      style: "Hot jazz and bebop",
      image: "https://images.pexels.com/photos/4088012/pexels-photo-4088012.jpeg"
    }
  ];

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    // Handle newsletter subscription
    console.log('Newsletter subscription:', email);
    toastSuccess('Successfully subscribed to the newsletter!');
    setEmail('');
  };

  const sections = [
    {
      id: 'hero',
      component: (
        <section id="hero" className="min-h-screen flex items-center justify-center p-4">
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
              Elevate Your Dance Journey
            </h1>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Join our vibrant community and master the art of dance through expert-led courses
              and personalized guidance.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/courses"
                className="btn-primary bg-white text-primary hover:bg-white/90 group"
              >
                Explore Courses
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/#about"
                className="btn-primary bg-primary/10 text-white hover:bg-primary/20"
              >
                Learn More
              </Link>
            </div>
          </div>
        </section>
      )
    },
    {
      id: 'heritage',
      component: (
        <section className="py-20 px-4 bg-white/5">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-white mb-4">Our Dance Heritage</h2>
              <p className="text-xl text-white/90">Drawing inspiration from the legends who shaped swing dancing</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {historicImages.map((image, index) => (
                <div key={index} className="group relative overflow-hidden rounded-xl bg-black/50 backdrop-blur-sm">
                  <img
                    src={image.src}
                    alt={image.caption}
                    className="w-full h-[300px] object-cover opacity-80 group-hover:opacity-100 transition-all duration-300"
                  />
                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                    <p className="text-white text-sm">{image.year}</p>
                    <p className="text-white font-medium">{image.caption}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )
    },
    {
      id: 'about',
      component: (
        <section id="about" className="py-20 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="relative">
                <div className="aspect-square rounded-2xl overflow-hidden shadow-2xl">
                  <img
                    src="https://images.pexels.com/photos/2188012/pexels-photo-2188012.jpeg"
                    alt="Dance Instructor"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-6 -right-6 bg-white rounded-2xl p-6 shadow-xl">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <Award className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Experience</p>
                      <p className="text-xl font-bold text-gray-900">10+ Years</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <h2 className="text-4xl font-bold text-white">Meet Your Dance Instructor</h2>
                <div className="prose prose-lg text-white/90">
                  <p>
                    Hi, I'm Andreas Anagnostou, a professional dance instructor with over a decade of experience 
                    in dancing Lindy Hop, RnB (Rhythm n' Blues), Blues, Shag, Balboa, and Boogie Woogie. 
                    My journey in dance started from a young age, I was learning traditional greek dances at school 
                    and since 2013, when I met swing dancing, I've dedicated my life to mastering and teaching 
                    these beautiful african american art forms.
                  </p>
                  <p>
                    I've participated in countless festivals and received international recognition. 
                    For me, dance is not just a movement, it's a threefold connection with the music, 
                    your partner, and yourself and a way to tell a story!
                  </p>
                  <p>
                    In my classes, I aim to cultivate greater awareness, expression, and joy through rhythm, 
                    body, and presence. Whether you're just starting out or looking to refine your skills, 
                    I'm here to guide you on your dance journey.
                  </p>
                </div>
                <div className="flex flex-wrap gap-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
                      <Users className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-white">2,000+</p>
                      <p className="text-white/80">Students Taught</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
                      <Star className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-white">4.9/5</p>
                      <p className="text-white/80">Student Rating</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
                      <Award className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-white">10+</p>
                      <p className="text-white/80">Years Experience</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )
    },
    {
      id: 'extras',
      component: (
        <section id="extras" className="py-20 px-4 bg-white/5">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-white mb-4">Learning Resources</h2>
              <p className="text-xl text-white/90">Enhance your dance journey with interactive tools</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Practice Music */}
              <div className="card hover-lift backdrop-blur-sm bg-white/95">
                <div className="p-6">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Headphones className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">Practice Music</h3>
                      <p className="text-gray-600">Curated playlists for every style and level</p>
                    </div>
                  </div>
                  <div className="space-y-4 mb-6">
                    <div className="flex items-center gap-3">
                      <Music2 className="w-5 h-5 text-primary" />
                      <span className="text-gray-700">Style-specific collections</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Clock className="w-5 h-5 text-primary" />
                      <span className="text-gray-700">Tempo-based organization</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Play className="w-5 h-5 text-primary" />
                      <span className="text-gray-700">Offline availability</span>
                    </div>
                  </div>
                  <button className="btn-primary w-full">
                    Browse Playlists
                  </button>
                </div>
              </div>

              {/* Interactive Learning */}
              <div className="card hover-lift backdrop-blur-sm bg-white/95">
                <div className="p-6">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Gamepad className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">Interactive Learning</h3>
                      <p className="text-gray-600">Fun quizzes and challenges to test your knowledge</p>
                    </div>
                  </div>
                  <div className="space-y-4 mb-6">
                    <div className="flex items-center gap-3">
                      <BookOpen className="w-5 h-5 text-primary" />
                      <span className="text-gray-700">Theory quizzes</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Target className="w-5 h-5 text-primary" />
                      <span className="text-gray-700">Progress tracking</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Award className="w-5 h-5 text-primary" />
                      <span className="text-gray-700">Achievement badges</span>
                    </div>
                  </div>
                  <button className="btn-primary w-full">
                    Start Learning
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      )
    },
    {
      id: 'featured-courses',
      component: (
        <section className="py-20 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-white mb-4">Featured Courses</h2>
              <p className="text-xl text-white/90">Start your dance journey with our most popular courses</p>
            </div>

            {loading ? (
              <div className="flex items-center justify-center">
                <Loader className="w-8 h-8 animate-spin text-white" />
              </div>
            ) : error ? (
              <div className="text-center text-red-500">{error}</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {courses.map(course => (
                  <CourseCard key={course._id} course={course} />
                ))}
              </div>
            )}

            <div className="text-center mt-12">
              <Link
                to="/courses"
                className="btn-primary bg-white text-primary hover:bg-white/90 group inline-flex"
              >
                View All Courses
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </section>
      )
    },
    {
      id: 'private-lessons',
      component: (
        <section id="private-lessons" className="py-20 px-4 bg-white/5">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="relative">
                <div className="aspect-square rounded-2xl overflow-hidden shadow-2xl">
                  <img
                    src="https://images.pexels.com/photos/1644616/pexels-photo-1644616.jpeg"
                    alt="Private Dance Lesson"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-6 -right-6 bg-white rounded-2xl p-6 shadow-xl">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <Video className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Session Duration</p>
                      <p className="text-xl font-bold text-gray-900">45 Minutes</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <h2 className="text-4xl font-bold text-white">Private Online Lessons</h2>
                <div className="prose prose-lg text-white/90">
                  <p>
                    Take your dancing to the next level with personalized one-on-one instruction.
                    Whether you're preparing for a special event, working on specific techniques,
                    or seeking detailed feedback, private lessons offer the focused attention you need.
                  </p>
                  <p>
                    During these sessions, we'll work together to:
                  </p>
                  <ul className="space-y-2 list-none pl-0">
                    <li className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                        <Target className="w-4 h-4 text-white" />
                      </div>
                      <span>Set clear, achievable dance goals</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                        <Video className="w-4 h-4 text-white" />
                      </div>
                      <span>Receive real-time feedback and corrections</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                        <Music2 className="w-4 h-4 text-white" />
                      </div>
                      <span>Develop your unique style and musicality</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                        <Heart className="w-4 h-4 text-white" />
                      </div>
                      <span>Build confidence in your dancing</span>
                    </li>
                  </ul>
                </div>
                <button 
                  onClick={() => setShowCoachingForm(true)}
                  className="btn-primary bg-white text-primary hover:bg-white/90"
                >
                  Schedule a Private Lesson
                </button>
              </div>
            </div>
          </div>
        </section>
      )
    },
    {
      id: 'testimonials',
      component: (
        <section id="testimonials" className="py-20 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-white mb-4">Student Success Stories</h2>
              <p className="text-xl text-white/90">Hear from our amazing community of dancers</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {testimonials.map((testimonial) => (
                <div key={testimonial.id} className="card hover-lift backdrop-blur-sm bg-white/95">
                  <div className="p-6">
                    <Quote className="w-10 h-10 text-primary/20 mb-4" />
                    <p className="text-gray-600 mb-6">{testimonial.content}</p>
                    <div className="flex items-center gap-4">
                      <img
                        src={testimonial.image}
                        alt={testimonial.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div>
                        <h4 className="font-medium text-gray-900">{testimonial.name}</h4>
                        <p className="text-sm text-gray-500">{testimonial.role}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )
    },
    {
      id: 'pricing',
      component: (
        <section id="pricing" className="py-20 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-white mb-4">Payment Plans</h2>
              <p className="text-xl text-white/90">Choose the perfect plan for your dance journey</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {pricingPlans.map((plan, index) => (
                <div
                  key={index}
                  className={`relative flex flex-col h-full bg-white rounded-2xl overflow-hidden backdrop-blur-sm border-2 border-primary/10 ${
                    plan.popular ? 'transform scale-105' : ''
                  }`}
                >
                  <div className="p-8 flex-1">
                    {plan.popular && (
                      <span className="absolute top-4 right-4 px-4 py-1 rounded-full text-sm font-medium bg-primary text-white">
                        Most Popular
                      </span>
                    )}
                    <h3 className="text-2xl font-bold mb-2 text-gray-900">
                      {plan.name}
                    </h3>
                    <div className="flex items-baseline gap-1 mb-6">
                      <span className="text-5xl font-bold text-gray-900">
                        ${plan.price}
                      </span>
                      <span className="text-gray-600">
                        /{plan.period}
                      </span>
                    </div>
                    <ul className="space-y-4 mb-8">
                      {plan.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center gap-3">
                          <CheckCircle className="w-5 h-5 flex-shrink-0 text-primary" />
                          <span className="text-gray-700 font-medium">
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="p-8 pt-0">
                    <button className="w-full py-4 px-6 rounded-lg font-semibold text-lg bg-primary text-white">
                      {plan.buttonText}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )
    },
    {
      id: 'newsletter',
      component: (
        <section id="newsletter" className="py-20 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="card backdrop-blur-sm bg-white/95">
              <div className="p-8">
                <Mail className="w-12 h-12 text-primary mx-auto mb-4" />
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Stay in Rhythm with Our Newsletter
                </h2>
                <p className="text-gray-600 mb-6">
                  Get the latest dance tips, course updates, and special offers delivered to your inbox.
                </p>
                <form onSubmit={handleNewsletterSubmit} className="max-w-md mx-auto">
                  <div className="flex flex-col gap-4">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      className="flex-1 input-field"
                      required
                    />
                    <button type="submit" className="btn-primary whitespace-nowrap">
                      Subscribe
                    </button>
                    <p className="text-sm text-gray-500">
                      By clicking the button you agree to our{' '}
                      <Link to="/privacy" className="text-primary hover:text-primary/80">
                        Privacy Policy
                      </Link>
                    </p>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </section>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-custom">
      {sections.map((section, index) => (
        <React.Fragment key={section.id || index}>
          {section.component}
        </React.Fragment>
      ))}
      {showCoachingForm && (
        <PrivateCoachingForm onClose={() => setShowCoachingForm(false)} />
      )}
    </div>
  );
};

export default LandingPage;