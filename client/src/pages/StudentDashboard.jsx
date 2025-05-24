import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Play, BookOpen, Clock, User, Edit2, Award, ChevronRight } from 'lucide-react';
import Button from '../components/common/Button';
import { toast } from 'react-toastify';
import api from '../config/axiosConfig';

const StudentDashboard = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token') || sessionStorage.getItem('token');
  const isAuthenticated = !!token;
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
        setError(error.response?.data?.message || error.message);
        setLoading(false);
      })
      .finally(() => setLoading(false));
  }, [isAuthenticated]);

  const fetchCourses = async () => {
    try {
      const response = await api.get('/courses/user-courses');
      // Handle the backend's response structure
      setCourses(response.data.courses || []);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to fetch courses');
      throw error;
    }
  };

  const fetchProfile = async () => {
    try {
      // Get user ID from token
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      if (!token) throw new Error('No token found');

      // Extract user ID from token
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const payload = JSON.parse(window.atob(base64));
      const userId = payload.userId;

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

  return (
    <div className="flex bg-black text-white">
      {/* Profile Header */}
      <div className="w-64 border-r border-white/10 bg-black/40 backdrop-blur-xl p-6">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <User className="w-6 h-6 text-purple-400" />
            <div>
              <h3 className="font-medium">{profile.name || 'Student'}</h3>
              <p className="text-sm text-white/70">{profile.email}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {/* Header */}
        <header className="border-b border-white/10 bg-black/40 backdrop-blur-xl">
          <div className="px-8 py-4">
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
                      <div key={course._id} className="bg-black/40 backdrop-blur-xl rounded-lg p-6 hover:bg-black/50 transition-colors cursor-pointer">
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
