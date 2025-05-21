import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Play, BookOpen, Clock, User, Edit2, Award, ChevronRight } from 'lucide-react';
import Button from '../components/common/Button';
import { toast } from 'react-toastify';
import { useAuth } from '../contexts/AuthContext';

const StudentDashboard = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [courses, setCourses] = useState([]);
  const [profile, setProfile] = useState({});
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [editProfileData, setEditProfileData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    // Fetch courses and profile data
    Promise.all([fetchCourses(), fetchProfile()])
      .catch(error => {
        setError(error.message);  
        setLoading(false);
      })
      .finally(() => setLoading(false));
  }, [isAuthenticated]);

  const fetchCourses = async () => {
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      const response = await fetch('http://localhost:3050/classes', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch courses');
      }

      const data = await response.json();
      setCourses(data);
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  const fetchProfile = async () => {
    try {
      const response = await fetch('http://localhost:3050/api/profile', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch profile');
      }

      const data = await response.json();
      setProfile(data);
      setEditProfileData(data);
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  const handleCourseClick = (courseId) => {
    navigate(`/student/course/${courseId}`);
  };

  const handleEditProfile = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3050/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token') || sessionStorage.getItem('token')}`
        },
        body: JSON.stringify(editProfileData)
      });
      if (response.ok) {
        toast.success('Profile updated successfully');
        setShowEditProfile(false);
        fetchProfile();
      }
    } catch (error) {
      toast.error('Failed to update profile');
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Sidebar */}
      <div className="w-64 border-r border-white/10 bg-black/40 backdrop-blur-xl p-6">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <User className="w-6 h-6 text-purple-400" />
            <div>
              <h3 className="font-medium">{profile.name || 'Student'}</h3>
              <p className="text-sm text-white/70">{profile.email}</p>
            </div>
          </div>
          <nav className="space-y-2">
            <Link to="/student/dashboard" className="flex items-center px-4 py-3 text-white bg-white/10 rounded-lg">
              <Play className="w-5 h-5 mr-3" />
              Dashboard
            </Link>
            <Link to="/student/courses" className="flex items-center px-4 py-3 text-white/70 hover:bg-white/5 rounded-lg transition-colors">
              <BookOpen className="w-5 h-5 mr-3" />
              Courses
            </Link>
            <Link to="/student/profile" className="flex items-center px-4 py-3 text-white/70 hover:bg-white/5 rounded-lg transition-colors">
              <User className="w-5 h-5 mr-3" />
              Profile
            </Link>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {/* Header */}
        <header className="border-b border-white/10 bg-black/40 backdrop-blur-xl sticky top-0">
          <div className="px-8 py-6">
            <h1 className="text-2xl font-medium">Welcome Back, {profile.name || 'Student'}!</h1>
          </div>
        </header>

        {/* Main Content */}
        <main className="p-8">
          {/* Loading State */}
          {loading && (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto"></div>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="text-center py-12 text-red-400">
              <p>{error}</p>
              <Button onClick={() => window.location.reload()}>Retry</Button>
            </div>
          )}

          {/* Profile Section */}
          {!loading && !error && (
            <>
              <div className="bg-black/40 backdrop-blur-xl rounded-lg p-6 mb-8">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-medium">Profile</h2>
                  <button 
                    onClick={() => setShowEditProfile(!showEditProfile)}
                    className="text-purple-400 hover:text-purple-300"
                  >
                    <Edit2 className="w-5 h-5" />
                  </button>
                </div>
                {showEditProfile ? (
                  <form onSubmit={handleEditProfile} className="space-y-4">
                    <div>
                      <label className="block text-sm text-white/70 mb-1">Name</label>
                      <input
                        type="text"
                        value={editProfileData.name || ''}
                        onChange={(e) => setEditProfileData(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-white/70 mb-1">Email</label>
                      <input
                        type="email"
                        value={editProfileData.email || ''}
                        onChange={(e) => setEditProfileData(prev => ({ ...prev, email: e.target.value }))}
                        className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white"
                      />
                    </div>
                    <Button type="submit" className="w-full">Save Changes</Button>
                  </form>
                ) : (
                  <div className="space-y-4">
                    <p className="text-white/70">Name: {profile.name || 'Not set'}</p>
                    <p className="text-white/70">Email: {profile.email || 'Not set'}</p>
                  </div>
                )}
              </div>

              {/* Courses Section */}
              {courses.length > 0 ? (
                <div>
                  <h2 className="text-xl font-medium mb-6">Available Courses</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {courses.map((course) => (
                      <div key={course.id} className="bg-black/40 backdrop-blur-xl rounded-lg p-6 hover:bg-black/50 transition-colors cursor-pointer">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-xl font-medium">{course.title}</h3>
                          <Award className="w-5 h-5 text-purple-500" />
                        </div>
                        <div className="space-y-2 mb-4">
                          <p className="text-white/70">Instructor: {course.instructor}</p>
                          <p className="text-white/70">Level: {course.level}</p>
                          <p className="text-white/70">Duration: {course.duration} mins</p>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-purple-400">${course.price}</span>
                          <Link to={`/student/course/${course.id}`}>
                            <Button variant="secondary">
                              View Course
                              <ChevronRight className="w-4 h-4 ml-2" />
                            </Button>
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-white/70">No courses available yet</p>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default StudentDashboard;
