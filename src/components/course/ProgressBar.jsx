import React from 'react';
import { Trophy } from 'lucide-react';

const ProgressBar = ({ progress, showCertificate = false }) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-700">Course Progress</span>
        <span className="text-sm font-medium text-primary">{Math.round(progress)}%</span>
      </div>
      
      <div className="relative">
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-primary transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        
        {showCertificate && progress === 100 && (
          <div className="absolute -right-2 -top-1 animate-bounce">
            <Trophy className="w-5 h-5 text-yellow-400" />
          </div>
        )}
      </div>
    </div>
  );
};

export default ProgressBar;