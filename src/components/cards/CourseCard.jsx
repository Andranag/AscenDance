import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from "../../contexts/AuthContext";
import { ChevronRight, Clock, Users, Star, BookOpen } from 'lucide-react';
import { COURSE_LEVEL_COLORS, DANCE_STYLE_COLORS, ERROR_MESSAGES, UI_CONFIG } from '../../utils/constants';

const CourseCard = ({ course }) => {
  // Get appropriate color for dance style
  const getStyleColor = (style) => {
    return DANCE_STYLE_COLORS[style?.toLowerCase()] || 'bg-gray-500 text-white';
  };

  // Get appropriate color for course level
  const getLevelColor = (level) => {
    return COURSE_LEVEL_COLORS[level?.toLowerCase()] || 'bg-gray-100 text-gray-800 ring-1 ring-gray-200';
  };

  // Log course data for debugging
  useEffect(() => {
    console.log('Rendering CourseCard with course:', {
      id: course?._id,
      title: course?.title,
      style: course?.style,
      level: course?.level
    });
  }, [course]);

  // Handle undefined or invalid data
  if (!course) {
    return (
      <div className={`bg-gray-100 p-4 rounded-lg ${UI_CONFIG.SKELETON_ANIMATION}`}>
        <div className="h-40 bg-gray-200 rounded mb-4"></div>
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  if (!course._id || !course.title || !course.style || !course.level) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
        <h3 className="text-red-600 font-semibold mb-2">{ERROR_MESSAGES.INVALID_CREDENTIALS}</h3>
        <p className="text-gray-600">{ERROR_MESSAGES.REQUIRED_FIELD}</p>
      </div>
    );
  }

  // Validate and normalize data with constants
  const normalizedCourse = {
    ...course,
    duration: course.duration || '2 hours',
    studentsCount: course.studentsCount || 0,
    rating: course.rating || 0.0,
    style: course.style || 'Unknown Style',
    level: course.level || 'Unknown Level'
  };

  // Handle missing optional fields with default values
  const courseWithDefaults = {
    ...course,
    image: course.image || '/images/default-course.jpg',
    instructor: course.instructor || {
      name: 'Unknown Instructor',
      avatar: '/images/default-avatar.png'
    },
    lessons: course.lessons || [
      { title: 'Introduction', duration: '10 min' },
      { title: 'Lesson 1', duration: '30 min' },
      { title: 'Lesson 2', duration: '30 min' }
    ]
  };

  const { user } = useAuth();
  const navigate = useNavigate();

  const handleNavigate = () => {
    if (user) {
      // Check if this is a temporary course
      const isTemporary = course.isTemporary || !course._id;
      if (isTemporary) {
        // For temporary courses, show a message instead of navigating
        alert('This is a temporary course. Please try again later.');
      } else {
        // For real courses, navigate to course details
        navigate(`/course/${course._id}`);
      }
    } else {
      navigate('/login');
    }
  };

  return (
    <div className={`group relative bg-white rounded-2xl ${UI_CONFIG.SHADOW} hover:${UI_CONFIG.SHADOW} transition-all ${UI_CONFIG.TRANSITION_DURATION} overflow-hidden`}>
      {/* Course Image */}
      <div className="relative h-48">
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent z-10" />
        <img
          src={course.image}
          alt={course.title}
          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-4 left-4 z-20 flex gap-2">
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getLevelColor(course.level)}`}>
            {course.level}
          </span>
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStyleColor(course.style)}`}>
            {course.style}
          </span>
        </div>
      </div>

      {/* Course Content */}
      <div className="p-6 flex flex-col h-[300px] overflow-hidden">
        <div className="flex-1">
          <div className="space-y-2">
            {/* Course Title */}
            <h3 className="text-xl font-semibold text-gray-900 group-hover:text-primary transition-colors">
              {course.title}
            </h3>
            
            {/* Course Description */}
            <p className="text-gray-600 line-clamp-2">{course.description}</p>
          </div>

          {/* Course Stats */}
          <div className="grid grid-cols-3 gap-4 mt-4">
            <div className="flex flex-col items-center p-2 bg-gray-50 rounded-lg">
              <Clock className="w-4 h-4 text-primary mb-1" />
              <span className="text-xs text-gray-600">{course.duration}</span>
            </div>
            <div className="flex flex-col items-center p-2 bg-gray-50 rounded-lg">
              <Users className="w-4 h-4 text-primary mb-1" />
              <span className="text-xs text-gray-600">{course.studentsCount} students</span>
            </div>
            <div className="flex flex-col items-center p-2 bg-gray-50 rounded-lg">
              <Star className="w-4 h-4 text-yellow-400 fill-current mb-1" />
              <span className="text-xs text-gray-600">{course.rating}/5.0</span>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={handleNavigate}
          className={`relative w-full h-12 bg-secondary text-white rounded-lg ${UI_CONFIG.SHADOW} hover:bg-secondary-dark transition-all ${UI_CONFIG.TRANSITION_DURATION} flex items-center justify-center gap-2 px-6`}
        >
          <span className="flex items-center">
            {user ? (
              <>
                <BookOpen className="w-5 h-5" />
                <span className="text-sm font-medium ml-2">Start Learning</span>
                <ChevronRight className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform" />
              </>
            ) : (
              <>
                <span className="text-sm font-medium">Sign in to Join</span>
                <ChevronRight className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </span>
        </button>
      </div>
    </div>
  );
};

export default CourseCard;