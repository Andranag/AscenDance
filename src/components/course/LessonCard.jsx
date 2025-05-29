import React from 'react';
import { Play, CheckCircle, Lock, Clock, FileText } from 'lucide-react';

const LessonCard = ({ lesson, isCompleted, isLocked, onSelect, isActive }) => {
  return (
    <div
      onClick={() => !isLocked && onSelect(lesson)}
      className={`
        relative p-4 rounded-lg transition-all duration-200 cursor-pointer
        ${isLocked ? 'bg-gray-100 cursor-not-allowed' : isActive ? 'bg-primary/10 ring-2 ring-primary' : 'bg-white hover:bg-gray-50'}
      `}
    >
      <div className="flex items-start gap-4">
        <div className={`
          w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0
          ${isCompleted ? 'bg-accent/10' : isLocked ? 'bg-gray-200' : 'bg-primary/10'}
        `}>
          {isCompleted ? (
            <CheckCircle className="w-5 h-5 text-accent" />
          ) : isLocked ? (
            <Lock className="w-5 h-5 text-gray-400" />
          ) : (
            <Play className="w-5 h-5 text-primary" />
          )}
        </div>
        
        <div className="flex-1">
          <h3 className={`font-medium mb-1 ${isLocked ? 'text-gray-400' : 'text-gray-900'}`}>
            {lesson.title}
          </h3>
          
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1 text-gray-500">
              <Clock className="w-4 h-4" />
              <span>{lesson.duration} min</span>
            </div>
            {lesson.resources?.length > 0 && (
              <div className="flex items-center gap-1 text-gray-500">
                <FileText className="w-4 h-4" />
                <span>{lesson.resources.length} resources</span>
              </div>
            )}
          </div>
        </div>

        {isLocked && (
          <div className="absolute inset-0 bg-white/60 backdrop-blur-sm rounded-lg flex items-center justify-center">
            <div className="text-sm font-medium text-gray-500 flex items-center gap-2">
              <Lock className="w-4 h-4" />
              Complete previous lessons
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LessonCard;