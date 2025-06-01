import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { User, Mail, Award, Clock, Star, BookOpen, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { showToast } from '../utils/toast';
import { validationUtils } from '../utils/validation';
import { responseUtils } from '../utils/response';
import { apiErrorUtils } from '../utils/apiError';

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const { toastSuccess, toastError } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || ''
  });

  useEffect(() => {
    // Update form data when user state changes
    setFormData({
      name: user?.name || '',
      email: user?.email || ''
    });
  }, [user]);

  // Mock data for demonstration
  const danceStats = {
    totalClasses: 24,
    hoursSpent: 48,
    averageRating: 4.8,
    completedCourses: 3
  };

  const recentAchievements = [
    { title: 'Completed Lindy Hop Basics', date: '2024-01-15' },
    { title: 'Perfect Attendance - January', date: '2024-01-31' },
    { title: 'First Performance Ready', date: '2024-02-01' }
  ];

  const enrolledCourses = [
    { name: 'Advanced Jazz Steps', progress: 75, lastAccessed: '2024-02-10' },
    { name: 'Blues Fundamentals', progress: 90, lastAccessed: '2024-02-09' },
    { name: 'Swing Basics', progress: 100, lastAccessed: '2024-02-08' }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    const validation = validationUtils.validateProfile(formData);
    if (!validation.isValid) {
      showToast.fromResponse(validation.toResponse());
      return;
    }

    try {
      const response = await updateProfile(formData);
      if (responseUtils.isSuccess(response)) {
        showToast.success('Profile updated successfully!');
        setIsEditing(false);
        setFormData({
          name: response.data.name || '',
          email: response.data.email || ''
        });
      } else {
        const errorResponse = apiErrorUtils.handleApiError(response);
        showToast.fromResponse(errorResponse);
      }
    } catch (error) {
      const errorResponse = apiErrorUtils.handleApiError(error);
      showToast.fromResponse(errorResponse);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="min-h-screen bg-profile-pattern p-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Information */}
          <div className="lg:col-span-1">
            <div className="card backdrop-blur-sm bg-white/95">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Profile</h2>
                  <button
                    onClick={() => setIsEditing(!isEditing)}
                    className="btn-primary text-sm"
                  >
                    {isEditing ? 'Cancel' : 'Edit Profile'}
                  </button>
                </div>

                {isEditing ? (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Name</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="input-field mt-1"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Email</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="input-field mt-1"
                      />
                    </div>
                    <button type="submit" className="btn-primary w-full">
                      Save Changes
                    </button>
                  </form>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <User className="w-5 h-5 text-primary" />
                      <span className="text-gray-900">{user?.name}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Mail className="w-5 h-5 text-primary" />
                      <span className="text-gray-900">{user?.email}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Dance Stats */}
            <div className="card backdrop-blur-sm bg-white/95 mt-6">
              <div className="p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Dance Stats</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-primary/5 rounded-lg">
                    <BookOpen className="w-6 h-6 text-primary mb-2" />
                    <div className="text-2xl font-bold text-gray-900">{danceStats.totalClasses}</div>
                    <div className="text-sm text-gray-600">Classes Taken</div>
                  </div>
                  <div className="p-4 bg-primary/5 rounded-lg">
                    <Clock className="w-6 h-6 text-primary mb-2" />
                    <div className="text-2xl font-bold text-gray-900">{danceStats.hoursSpent}</div>
                    <div className="text-sm text-gray-600">Hours Practiced</div>
                  </div>
                  <div className="p-4 bg-primary/5 rounded-lg">
                    <Star className="w-6 h-6 text-primary mb-2" />
                    <div className="text-2xl font-bold text-gray-900">{danceStats.averageRating}</div>
                    <div className="text-sm text-gray-600">Average Rating</div>
                  </div>
                  <div className="p-4 bg-primary/5 rounded-lg">
                    <Award className="w-6 h-6 text-primary mb-2" />
                    <div className="text-2xl font-bold text-gray-900">{danceStats.completedCourses}</div>
                    <div className="text-sm text-gray-600">Courses Completed</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Course Progress and Achievements */}
          <div className="lg:col-span-2 space-y-6">
            {/* Enrolled Courses */}
            <div className="card backdrop-blur-sm bg-white/95">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-gray-900">Your Courses</h2>
                  <Link
                    to="/courses"
                    className="btn-primary"
                  >
                    View All Courses
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
                <div className="space-y-4">
                  {enrolledCourses.map((course, index) => (
                    <div key={index} className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium text-gray-900">{course.name}</h3>
                        <span className="text-sm text-gray-500">
                          Last accessed: {new Date(course.lastAccessed).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="relative pt-1">
                        <div className="flex mb-2 items-center justify-between">
                          <div>
                            <span className="text-xs font-semibold inline-block text-primary">
                              {course.progress}% Complete
                            </span>
                          </div>
                        </div>
                        <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-primary/10">
                          <div
                            style={{ width: `${course.progress}%` }}
                            className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-primary transition-all duration-500"
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Recent Achievements */}
            <div className="card backdrop-blur-sm bg-white/95">
              <div className="p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Recent Achievements</h2>
                <div className="space-y-4">
                  {recentAchievements.map((achievement, index) => (
                    <div key={index} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Award className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">{achievement.title}</h3>
                        <p className="text-sm text-gray-500">
                          {new Date(achievement.date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;