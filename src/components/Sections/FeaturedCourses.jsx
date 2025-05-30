import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Loader, ChevronRight, Clock, Star } from 'lucide-react';
import { courseService } from "../../services/api";
import { API_ENDPOINTS } from "../../config/api";

const FeaturedCoursesSection = ({ courses, loading, error }) => {
  const [detailedCourses, setDetailedCourses] = useState([]);
  const [fetchingDetails, setFetchingDetails] = useState(false);

  useEffect(() => {
    if (courses.length > 0 && !fetchingDetails) {
      setFetchingDetails(true);
      const fetchDetails = async () => {
        try {
          const detailed = await Promise.all(
            courses.map(async (course) => {
              try {
                const response = await courseService.getCourse(course._id);
                return response.data;
              } catch (err) {
                console.error(`Failed to fetch details for course ${course._id}:`, err);
                return course;
              }
            })
          );
          setDetailedCourses(detailed);
        } catch (err) {
          console.error('Error fetching course details:', err);
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {courses.map((course) => (
              <div
                key={course._id}
                className="card hover-lift backdrop-blur-sm bg-white/95 min-h-[450px] flex flex-col"
              >
                {fetchingDetails ? (
                  <div className="flex items-center justify-center h-full">
                    <Loader className="w-6 h-6 animate-spin text-primary" />
                  </div>
                ) : (
                  <div className="p-8 flex-grow flex flex-col justify-between h-full">
                    <div className="flex-grow flex flex-col justify-between">
                      <div className="flex-shrink">
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">
                          {course.title}
                        </h3>
                        <p className="text-gray-600 text-base leading-relaxed">
                          {course.description}
                        </p>
                        <div className="flex justify-center items-center gap-6 mt-6">
                          <span className="px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium">
                            {course.style || 'Unknown Style'}
                          </span>
                          <span className="px-4 py-2 bg-accent/10 text-accent rounded-full text-sm font-medium">
                            {course.level || 'Unknown Level'}
                          </span>
                        </div>
                      </div>
                      <div className="flex justify-center items-center gap-4 mt-auto">
                        <div className="flex items-center gap-2">
                          <Clock className="w-5 h-5 text-blue-500" />
                          <span className="text-sm text-gray-600 font-medium">
                            {course.duration || 'Unknown duration'}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Star className="w-5 h-5 text-yellow-400" />
                          <span className="text-sm text-gray-600 font-medium">
                            {course.rating ? `${course.rating} / 5` : 'No rating'}
                          </span>
                        </div>
                      </div>
                      <div className="mt-auto">
                        <Link
                          to={`/course/${course._id}`}
                          className="btn-primary w-full px-4 py-2 flex items-center justify-center gap-2 text-sm hover:opacity-90 transition-opacity duration-200"
                        >
                          View Course Details
                          <ChevronRight className="w-4 h-4" />
                        </Link>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedCoursesSection;