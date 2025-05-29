import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Music2, ChevronRight, Clock, Users, Star, BookOpen } from 'lucide-react';

const CourseCard = ({ course }) => {
  console.log('Rendering CourseCard with course:', {
    id: course?._id,
    title: course?.title,
    style: course?.style,
    level: course?.level
  });

  if (!course || !course._id || !course.title || !course.style || !course.level) {
    console.error('Invalid course data:', course);
    return null;
  }
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleNavigate = () => {
    if (user) {
      navigate(`/course/${course._id}`);
    } else {
      navigate('/login');
    }
  };

  const getLevelColor = (level) => {
    switch (level?.toLowerCase()) {
      case 'beginner':
        return 'bg-emerald-100 text-emerald-800 ring-1 ring-emerald-200';
      case 'intermediate':
        return 'bg-amber-100 text-amber-800 ring-1 ring-amber-200';
      case 'advanced':
        return 'bg-rose-100 text-rose-800 ring-1 ring-rose-200';
      default:
        return 'bg-gray-100 text-gray-800 ring-1 ring-gray-200';
    }
  };

  return (
    <div className="group relative bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
      {/* Course Image */}
      <div className="relative h-48">
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent z-10" />
        <img
          src="https://images.pexels.com/photos/2188012/pexels-photo-2188012.jpeg"
          alt={course.title}
          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-4 left-4 z-20">
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getLevelColor(course.level)}`}>
            {course.level}
          </span>
        </div>
      </div>

      {/* Course Content */}
      <div className="p-6">
        <div className="flex items-start gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Music2 className="w-5 h-5 text-primary" />
              <h3 className="text-xl font-semibold text-gray-900 group-hover:text-primary transition-colors">
                {course.title}
              </h3>
            </div>
            <p className="text-gray-600 mb-4 line-clamp-2">{course.description}</p>

            {/* Course Stats */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="flex flex-col items-center p-2 bg-gray-50 rounded-lg">
                <Clock className="w-4 h-4 text-primary mb-1" />
                <span className="text-xs text-gray-600">{course.duration || '2 hours'}</span>
              </div>
              <div className="flex flex-col items-center p-2 bg-gray-50 rounded-lg">
                <Users className="w-4 h-4 text-primary mb-1" />
                <span className="text-xs text-gray-600">{course.studentsCount || '0'} students</span>
              </div>
              <div className="flex flex-col items-center p-2 bg-gray-50 rounded-lg">
                <Star className="w-4 h-4 text-yellow-400 fill-current mb-1" />
                <span className="text-xs text-gray-600">{course.rating || '0.0'}/5.0</span>
              </div>
            </div>
            
            {/* Course Style */}
            <div className="mt-4">
              <div className="flex items-center gap-2">
                <Music2 className="w-4 h-4 text-primary" />
                <span className="text-sm text-gray-600">{course.style}</span>
              </div>
            </div>

            {/* Action Button */}
            <button
              onClick={handleNavigate}
              className="relative w-full btn-primary group overflow-hidden"
            >
              <span className="flex items-center justify-center gap-2">
                {user ? (
                  <>
                    <BookOpen className="w-5 h-5" />
                    Start Learning
                    <ChevronRight className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" />
                  </>
                ) : (
                  <>
                    Sign in to Join
                    <ChevronRight className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;