import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Loader } from 'lucide-react';

const FeaturedCoursesSection = ({ courses, loading, error }) => {
  return (
    <section id="featured-courses" className="py-24 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4">
            Featured Courses
          </h2>
          <p className="text-xl text-white/90">
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <div
                key={course._id}
                className="card hover-lift backdrop-blur-sm bg-white/95"
              >
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {course.title}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {course.description}
                  </p>
                  <div className="flex flex-wrap gap-3 mb-4">
                    <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                      {course.style}
                    </span>
                    <span className="px-3 py-1 bg-accent/10 text-accent rounded-full text-sm">
                      {course.level}
                    </span>
                  </div>
                  <Link
                    to={`/courses/${course._id}`}
                    className="btn-primary w-full"
                  >
                    Learn More
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedCoursesSection;
