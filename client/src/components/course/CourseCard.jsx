import React from 'react';
import { Link } from 'react-router-dom';
import { Award, ChevronRight } from 'lucide-react';
import Button from "../common/Button";

const CourseCard = ({ course, onClick }) => {
  return (
    <div 
      className="bg-white/5 rounded-lg p-4 hover:bg-white/10 transition-colors cursor-pointer"
      onClick={onClick}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">{course.name}</h3>
        <Award className="w-5 h-5 text-purple-500" />
      </div>
      <p className="text-white/80 mb-4">{course.description}</p>
      <div className="flex justify-end">
        <Button variant="secondary">
          View Course
          <ChevronRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
};

export default CourseCard;
