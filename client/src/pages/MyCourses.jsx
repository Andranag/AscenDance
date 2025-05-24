import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Play, Clock, User, ChevronRight } from 'lucide-react';
import Button from '../components/common/Button';
import { toast } from 'react-toastify';
import api from '../config/axiosConfig';
import CourseCard from '../components/course/CourseCard';

const MyCourses = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token') || sessionStorage.getItem('token');
  const isAuthenticated = !!token;
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    fetchCourses();
  }, [isAuthenticated, navigate]);

  const fetchCourses = async () => {
    try {
      const response = await api.get('/courses/user-courses');
      setCourses(response.data.courses || []);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to fetch courses');
      toast.error(error.response?.data?.message || 'Failed to fetch courses');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h2 className="text-xl font-medium mb-4">Error</h2>
        <p className="text-gray-600 mb-6">{error}</p>
        <Button onClick={() => window.location.reload()}>
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4">
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">My Courses</h1>
          <Link to="/dashboard" className="text-purple-500 hover:text-purple-600">
            <span>View All Courses</span>
            <ChevronRight className="ml-1 inline-block" />
          </Link>
        </div>
      </div>

      {courses.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <div className="flex flex-col items-center justify-center">
            <Play className="w-12 h-12 text-gray-400 mb-4" />
            <p className="text-gray-600 mb-4">You haven't enrolled in any courses yet.</p>
            <Link to="/dashboard" className="text-purple-500 hover:text-purple-600">
              Browse Available Courses
            </Link>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <CourseCard 
                key={course._id}
                course={{
                  name: course.title,
                  description: course.description,
                  instructor: course.instructor,
                  duration: course.duration,
                  level: course.level,
                  price: course.price
                }}
                onClick={() => navigate(`/courses/${course._id}`)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MyCourses;
