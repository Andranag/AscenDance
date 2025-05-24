import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Play, BookOpen, Clock, User, Edit2, ChevronRight } from 'lucide-react';
import Button from '../components/common/Button';
import { toast } from 'react-toastify';
import api from '../config/axiosConfig';
import CourseCard from '../components/course/CourseCard';
import { useAuth } from '../contexts/AuthContext';

const StudentDashboard = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, navigateToLogin, authLoading } = useAuth();
  const [courses, setCourses] = useState([]);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [editProfileData, setEditProfileData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigateToLogin();
      return;
    }

    if (process.env.NODE_ENV === 'development') {
      // In development mode, use mock data immediately
      setCourses([
        {
          id: '1',
          title: 'Beginner Ballet',
          description: 'Learn the fundamentals of ballet dancing',
          instructor: 'Sarah Johnson',
          duration: '8 weeks',
          startDate: '2025-05-25',
          imageUrl: 'https://images.pexels.com/photos/358010/pexels-photo-358010.jpeg',
          enrolled: true
        },
        {
          id: '2',
          title: 'Hip Hop Basics',
          description: 'Introduction to hip hop dance styles',
          instructor: 'Mike Thompson',
          duration: '6 weeks',
          startDate: '2025-05-26',
          imageUrl: 'https://images.pexels.com/photos/2820896/pexels-photo-2820896.jpeg',
          enrolled: true
        }
      ]);
      return;
    }

    fetchCourses();
  }, [user]);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      
      if (process.env.NODE_ENV === 'development') {
        // Mock courses data for development
        setCourses([
          {
            id: '1',
            title: 'Beginner Ballet',
            description: 'Learn the fundamentals of ballet dancing',
            instructor: 'Sarah Johnson',
            duration: '8 weeks',
            startDate: '2025-05-25',
            imageUrl: 'https://images.pexels.com/photos/358010/pexels-photo-358010.jpeg',
            enrolled: true
          },
          {
            id: '2',
            title: 'Hip Hop Basics',
            description: 'Introduction to hip hop dance styles',
            instructor: 'Mike Thompson',
            duration: '6 weeks',
            startDate: '2025-05-26',
            imageUrl: 'https://images.pexels.com/photos/2820896/pexels-photo-2820896.jpeg',
            enrolled: true
          }
        ]);
        return;
      }

      const response = await api.get('/courses/user-courses');
      setCourses(response.data.courses || []);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to fetch courses');
      toast.error(error.response?.data?.message || 'Failed to fetch courses');
    } finally {
      setLoading(false);
    }
  };

  const fetchProfile = async () => {
    try {
      if (process.env.NODE_ENV === 'development') {
        // Use mock user data from AuthContext
        setProfile(user);
        return;
      }

      // Use user ID from context
      const userId = user?._id;

      const response = await api.get(`/user/${userId}`);
      setProfile(response.data);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to fetch profile');
      throw error;
    }
  };

  const handleCourseClick = (courseId) => {
    navigate(`/student/course/${courseId}`);
  };

  const handleEditProfile = async (e) => {
    e.preventDefault();
    try {
      const response = await api.put('/user/profile', {
        name: editProfileData.name || profile.name,
        email: editProfileData.email || profile.email,
        phone: editProfileData.phone || profile.phone
      });
      setProfile(response.data);
      toast.success('Profile updated successfully');
      setShowEditProfile(false);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to update profile');
      throw error;
    }
  };

  if (loading || userLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold mb-4">Error</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <Button onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {authLoading ? (
        <div className="flex items-center justify-center min-h-screen">Loading...</div>
      ) : isAuthenticated ? (
        <div className="flex flex-col h-full">
          <div className="w-64 border-r border-white/10 bg-black/40 backdrop-blur-xl p-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <User className="w-6 h-6 text-purple-400" />
                <h3 className="font-medium">{user?.name}</h3>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-white/70" />
                <p className="text-white/70">Joined {new Date(user?.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
          </div>
          <div className="flex-1 overflow-auto">
            <header className="border-b border-white/10 bg-black/40 backdrop-blur-xl sticky top-0">
              <div className="px-8 py-6">
                <h1 className="text-2xl font-medium">Dashboard</h1>
              </div>
            </header>
            <main className="p-8">
              <div className="bg-black/40 backdrop-blur-xl rounded-lg p-6">
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h2 className="text-xl font-medium">My Courses</h2>
                    <Link to="/courses" className="text-purple-400 hover:text-purple-300">
                      View All <ChevronRight className="inline w-4 h-4 ml-1" />
                    </Link>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {courses.map((course) => (
                      <CourseCard key={course._id} course={course} />
                    ))}
                  </div>
                  {courses.length === 0 && (
                    <div className="text-center py-8">
                      <p className="text-white/70">No courses found. Start exploring our courses!</p>
                    </div>
                  )}
                </div>
              </div>
            </main>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <p className="text-white/70">Please log in to view your dashboard</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentDashboard;
