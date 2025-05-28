import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import ProfileEditor from '../components/ProfileEditor';
import { Loader } from 'lucide-react';

const Profile = () => {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  const { toastSuccess, toastError } = useToast();
  const [isUpdating, setIsUpdating] = useState(false);

  if (!user) {
    navigate('/login');
    return null;
  }

  return (
    <div className="min-h-screen bg-profile-pattern p-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Your Dance Profile</h1>
          <p className="text-white/90">Manage your account settings</p>
        </div>

        <ProfileEditor 
          user={user}
          isLoading={isUpdating}
        />
      </div>
    </div>
  );
};

export default Profile;