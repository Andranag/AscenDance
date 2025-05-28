import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { LogOut, User, Mail, Music, Users, Clock } from 'lucide-react';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-custom p-4">
      <div className="max-w-4xl mx-auto">
        <div className="card backdrop-blur-sm bg-white/95">
          <div className="flex justify-between items-center mb-6">
            <h1 className="heading-primary">Welcome to Your Dance Journey!</h1>
            <button
              onClick={handleLogout}
              className="btn-secondary flex items-center gap-2"
            >
              <LogOut className="w-5 h-5" />
              Logout
            </button>
          </div>

          <div className="space-y-6">
            {/* Profile Section */}
            <div className="bg-gray-50/50 rounded-lg p-6">
              <h2 className="heading-secondary mb-4">Your Profile</h2>
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-gray-700">
                  <User className="w-5 h-5 text-secondary" />
                  <span className="font-medium">{user?.name}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-700">
                  <Mail className="w-5 h-5 text-secondary" />
                  <span>{user?.email}</span>
                </div>
              </div>
            </div>

            {/* Stats Section */}
            <div className="bg-gray-50/50 rounded-lg p-6">
              <h2 className="heading-secondary mb-4">Dance Progress</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <div className="flex items-center gap-3 mb-2">
                    <Music className="w-5 h-5 text-primary" />
                    <h3 className="text-lg font-semibold text-primary">Dance Styles</h3>
                  </div>
                  <p className="text-3xl font-bold text-secondary">3</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <div className="flex items-center gap-3 mb-2">
                    <Users className="w-5 h-5 text-primary" />
                    <h3 className="text-lg font-semibold text-primary">Dance Partners</h3>
                  </div>
                  <p className="text-3xl font-bold text-secondary">5</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <div className="flex items-center gap-3 mb-2">
                    <Clock className="w-5 h-5 text-primary" />
                    <h3 className="text-lg font-semibold text-primary">Practice Hours</h3>
                  </div>
                  <p className="text-3xl font-bold text-secondary">12</p>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-gray-50/50 rounded-lg p-6">
              <h2 className="heading-secondary mb-4">Your Dance Journey</h2>
              <div className="text-center text-gray-500 py-8">
                <p>Ready to start your dance journey?</p>
                <button className="btn-primary mt-4">Explore Dance Styles</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;