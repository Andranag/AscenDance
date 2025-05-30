import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Loader, ChevronRight, Clock, Star } from 'lucide-react';
import CourseCard from '../cards/CourseCard';

const FeaturedCourses = ({ courses, loading, error }) => {
  const [displayCourses, setDisplayCourses] = useState([]);

  useEffect(() => {
    if (courses && Array.isArray(courses)) {
      // Take up to 4 courses
      const validCourses = courses
        .filter(course => course && course._id && course.title)
        .slice(0, 4);
      
      // If we have less than 4 courses, duplicate them
      let finalCourses = [...validCourses];
      while (finalCourses.length < 4) {
        finalCourses = [...finalCourses, ...validCourses];
      }
      
      setDisplayCourses(finalCourses.slice(0, 4));
    }
  }, [courses]);

  if (loading) {
    return (
      <section id="featured-courses" className="py-24 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center">
            <Loader className="w-8 h-8 animate-spin text-white" />
            <span className="ml-3 text-white">Loading featured courses...</span>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="featured-courses" className="py-24 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="bg-red-50/10 backdrop-blur-sm rounded-lg p-6">
            <p className="text-red-400">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </section>
    );
  }

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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {displayCourses.map((course) => (
            <CourseCard key={course._id} course={course} />
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            to="/courses"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white text-primary rounded-lg hover:bg-white/90 transition-all duration-300"
          >
            View All Courses
            <ChevronRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedCourses;