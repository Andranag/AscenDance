import React from 'react';
import { Music } from 'lucide-react';
import { Link } from 'react-router-dom';

const Logo = () => {
  return (
    <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
      <div className="bg-white/10 p-2 rounded-full">
        <Music size={24} className="text-white" />
      </div>
      <span className="text-xl font-bold text-white">Ascendance</span>
    </Link>
  );
};

export default Logo;