import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import CourseCard from '../components/CourseCard';
import { Music2, Loader } from 'lucide-react';

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        // Simulated API call
        const mockCourses = [
          {
            _id: '1',
            title: 'Introduction to Swing',
            description: 'Learn the fundamentals of swing dancing, from basic steps to rhythm and musicality.',
            style: 'Swing',
            level: 'Beginner'
          },
          {
            _id: '2',
            title: 'Lindy Hop Basics',
            description: 'Master the essential moves and techniques of Lindy Hop, the original swing dance.',
            style: 'Lindy Hop',
            level: 'Beginner'
          },
          {
            _id: '3',
            title: 'Advanced Charleston',
            description: 'Take your Charleston to the next level with advanced variations and styling.',
            style: 'Charleston',
            level: 'Advanced'
          }
        ];
        setCourses(mockCourses);
      } catch (error) {
        console.error('Error fetching courses:', error);
        setError(error.message || 'Failed to load courses');
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-courses-pattern p-4 flex items-center justify-center">
        <div className="flex items-center gap-3 text-white">
          <Loader className="w-6 h-6 animate-spin" />
          <span className="text-lg font-medium">Loading dance courses...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-courses-pattern p-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-red-600 mb-4">Error: {error}</h2>
            <Link to="/login" className="btn-primary inline-flex items-center gap-2">
              Go to Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-courses-pattern p-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Music2 className="w-8 h-8 text-white" />
            <h1 className="text-4xl font-bold text-white">Dance Courses</h1>
          </div>
          <p className="text-xl text-white/90">Begin your journey into the world of dance</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map(course => (
            <CourseCard key={course._id} course={course} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Courses;