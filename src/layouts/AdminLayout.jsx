import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { BookOpen, Users, BarChart3, Music2 } from 'lucide-react';

const AdminLayout = ({ children }) => {
  const location = useLocation();
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-custom p-8">
      <div className="max-w-[1400px] mx-auto">
        {children}
      </div>
    </div>
  );
};

export default AdminLayout;