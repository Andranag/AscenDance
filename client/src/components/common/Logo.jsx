import React from 'react';
import { Music } from 'lucide-react';

const Logo = () => {
  return (
    <div className="flex items-center justify-center">
      <div className="bg-purple-600 p-2 rounded-full">
        <Music size={24} className="text-white" />
      </div>
      <span className="ml-2 text-xl font-bold text-purple-800">Ascendance</span>
    </div>
  );
};

export default Logo;