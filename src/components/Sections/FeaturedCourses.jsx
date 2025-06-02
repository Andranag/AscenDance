import React, { useState, useEffect } from 'react';
import { Loader } from 'lucide-react';
import CourseCard from '../cards/CourseCard';
import { COURSE_LEVEL_COLORS, DANCE_STYLE_COLORS } from '../../utils/constants';



const FeaturedCourses = ({ courses = [], loading = false }) => {
  // Ensure we have an array of courses
  const validCourses = Array.isArray(courses) ? courses : [];
  
  // Log courses for debugging
  useEffect(() => {
    console.log('Received courses:', courses);
    console.log('Valid courses:', validCourses);
  }, [courses]);

  return (
    <section id="featured-courses" className="py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Featured Courses</h2>
          <p className="text-gray-600">Explore our most popular dance courses</p>
        </div>
        {loading ? (
          <div className="flex justify-center">
            <Loader className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : validCourses.length === 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array(4).fill().map((_, index) => (
              <div key={index} className="bg-gray-100 p-4 rounded-lg animate-pulse">
                <div className="h-40 bg-gray-200 rounded mb-4"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {validCourses.map((course, index) => (
              <CourseCard
                key={index}
                course={course}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedCourses;