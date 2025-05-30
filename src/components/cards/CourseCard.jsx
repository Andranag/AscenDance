import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from "../../contexts/AuthContext";
import { ChevronRight, Clock, Users, Star, BookOpen } from 'lucide-react';

const CourseCard = ({ course }) => {
  // Get appropriate color for dance style
  const getStyleColor = (style) => {
    const styleColors = {
      'Lindy Hop': 'bg-purple-500 text-white',
      'Swing': 'bg-blue-500 text-white',
      'Boogie Woogie': 'bg-pink-500 text-white',
      'Bachata': 'bg-orange-500 text-white',
      'Salsa': 'bg-yellow-500 text-gray-900',
      'Kizomba': 'bg-green-500 text-white',
      'Solo Jazz': 'bg-gray-500 text-white'
    };
    return styleColors[style?.toLowerCase()] || 'bg-gray-500 text-white';
  };


  console.log('Rendering CourseCard with course:', {
    id: course?._id,
    title: course?.title,
    style: course?.style,
    level: course?.level
  });

  if (!course || !course._id || !course.title || !course.style || !course.level) {
    console.error('Invalid course data:', course);
    return (
      <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
        <h3 className="text-red-600 font-semibold mb-2">Invalid Course Data</h3>
        <p className="text-gray-600">This course is missing required information.</p>
      </div>
    );
  }

  // Validate and normalize data
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
    image: course.image || 'https://images.pexels.com/photos/2188012/pexels-photo-2188012.jpeg',
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
      <div className="p-6 flex flex-col h-[300px]">
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
          className="relative w-full h-12 bg-secondary text-white rounded-lg shadow-md hover:bg-secondary-dark transition-all duration-200 flex items-center justify-center gap-2 px-6"
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