import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Music2, ChevronRight } from 'lucide-react';

const CourseCard = ({ course }) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleNavigate = () => {
    if (user) {
      navigate(`/course/${course._id}`);
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col h-full overflow-hidden">
      <div className="p-6 flex-1">
        <div className="flex items-center gap-3 mb-4">
          <Music2 className="w-6 h-6 text-primary" />
          <h3 className="text-xl font-semibold text-primary">{course.title}</h3>
        </div>
        <p className="text-gray-600 mb-4 line-clamp-3">{course.description}</p>
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-secondary">
            <span className="font-medium">Style:</span>
            <span>{course.style || 'Swing Dance'}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-secondary">
            <span className="font-medium">Level:</span>
            <span>{course.level || 'Beginner'}</span>
          </div>
        </div>
      </div>
      <div className="p-6 bg-gray-50/50 border-t border-gray-100">
        <button
          onClick={handleNavigate}
          className="btn-primary w-full flex items-center justify-center gap-2"
        >
          {user ? (
            <>
              Start Dancing
              <ChevronRight className="w-5 h-5" />
            </>
          ) : (
            <>
              Sign in to Join
              <ChevronRight className="w-5 h-5" />
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default CourseCard;