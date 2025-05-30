import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Loader, ChevronRight, Clock, Star } from 'lucide-react';
import CourseCard from '../cards/CourseCard';

const getLevelColor = (level) => {
  const levelColors = {
    'Beginner': 'bg-emerald-500',
    'Intermediate': 'bg-amber-500',
    'Advanced': 'bg-rose-500',
    'Expert': 'bg-indigo-500'
  };
  return levelColors[level] || 'bg-gray-500';
};

const getStyleColor = (style) => {
  const styleColors = {
    'Lindy Hop': 'bg-purple-500',
    'Swing': 'bg-blue-500',
    'Boogie Woogie': 'bg-pink-500',
    'Bachata': 'bg-orange-500',
    'Salsa': 'bg-yellow-500',
    'Kizomba': 'bg-green-500'
  };
  return styleColors[style] || 'bg-gray-500';
};

const FeaturedCoursesSection = ({ courses, loading, error }) => {
  // Helper function to select random courses
  const selectRandomCourses = (courses, count) => {
    const shuffled = [...courses].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  };

  const [detailedCourses, setDetailedCourses] = useState([]);
  const [fetchingDetails, setFetchingDetails] = useState(false);

  useEffect(() => {
    if (courses.length > 0 && !fetchingDetails) {
      setFetchingDetails(true);
      const fetchDetails = async () => {
        try {
          // Fetch all courses
          const response = await fetch('http://localhost:5000/api/courses');
          const allCourses = await response.json();
          
          if (!allCourses?.success) {
            console.error('Failed to fetch courses:', allCourses?.message);
            return;
          }

          const courses = allCourses.data || [];
          
          if (courses.length === 0) {
            console.error('No courses found');
            return;
          }

          // Select 4 random courses
          const featuredCourses = selectRandomCourses(courses, 4);
          setDetailedCourses(featuredCourses);
        } catch (err) {
          console.error('Error fetching courses:', err);
        } finally {
          setFetchingDetails(false);
        }
      };
      fetchDetails();
    }
  }, [courses]);

  return (
    <section id="featured-courses" className="py-24 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-white mb-6">
            Featured Courses
          </h2>
          <p className="text-xl text-white/90 mb-6 max-w-2xl mx-auto">
            Start your dance journey with our most popular courses
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center">
            <Loader className="w-8 h-8 animate-spin text-white" />
          </div>
        ) : error ? (
          <div className="text-center text-red-500">{error}</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {detailedCourses.map((course) => (
              <CourseCard key={course._id} course={course} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedCoursesSection;