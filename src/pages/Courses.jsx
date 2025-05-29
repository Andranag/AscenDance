import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import CourseCard from '../components/CourseCard';
import { Loader, Music2 } from 'lucide-react';

const Courses = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        // This would be replaced with an actual API call
        const mockCourses = [
          {
            _id: '1',
            title: 'Introduction to Swing',
            description: 'Master the fundamentals of swing dancing in this comprehensive course. Learn basic steps, rhythm, and musicality.',
            style: 'Lindy Hop',
            level: 'Beginner'
          },
          {
            _id: '2',
            title: 'Rhythm and Blues Foundations',
            description: 'Discover the soulful moves of Rhythm and Blues dancing. Perfect for beginners wanting to explore this expressive dance style.',
            style: 'Rhythm and Blues',
            level: 'Beginner'
          },
          {
            _id: '3',
            title: 'Advanced Jazz Steps',
            description: 'Take your jazz dancing to the next level with advanced variations, styling, and improvisation techniques.',
            style: 'Authentic Jazz',
            level: 'Advanced'
          }
        ];

        setCourses(mockCourses);
        setLoading(false);
      } catch (err) {
        setError(err.message || 'Failed to fetch courses');
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
          <span className="text-lg font-medium">Loading courses...</span>
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
            <h1 className="text-4xl font-bold text-white">Available Courses</h1>
          </div>
          <p className="text-xl text-white/90">Explore our collection of dance courses</p>
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