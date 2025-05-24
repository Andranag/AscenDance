import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Edit2, Trash2, CheckCircle } from 'lucide-react';
import Button from '../components/common/Button';
import { toast } from 'react-toastify';
import { useAuth } from '../contexts/AuthContext';
import api from '../config/axiosConfig';

const Profile = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: ''
  });
  const [isLoading, setIsLoading] = useState(true);

  const { user, isAuthenticated, navigateToLogin, token, updateUser } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      navigateToLogin();
      return;
    }

    fetchProfile();
  }, [isAuthenticated]);

  const fetchProfile = async () => {
    try {
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await api.get('/user/profile');
      
      if (response.status !== 200) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch profile');
      }

      const data = response.data;
      setProfile(data);
      setFormData({
        name: data.name || '',
        email: data.email || '',
        phone: data.phone || ''
      });
    } catch (error) {
      console.error('Fetch error:', error);
      toast.error(error.message || 'Failed to fetch profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = () => {
    setEditMode(true);
  };

  const handleSave = async () => {
    try {
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await api.put('/user/profile', formData);

      console.log('Update response status:', response.status);
      console.log('Update response headers:', response.headers);
      
      if (!response.ok) {
        const errorData = await response.json();
        console.log('Update error data:', errorData);
        throw new Error(errorData.message || 'Failed to update profile');
      }

      toast.success('Profile updated successfully');
      setEditMode(false);
      fetchProfile();
    } catch (error) {
      console.error('Update error:', error);
      toast.error(error.message || 'Failed to update profile');
    }
  };

  const handleCancel = () => {
    setEditMode(false);
    setFormData(profile);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {isLoading && (
        <div className="flex items-center justify-center min-h-screen">Loading...</div>
      )}
      {!profile && (
        <div className="flex items-center justify-center min-h-screen">Profile not found</div>
      )}
      {profile && (
        <div className="flex flex-col h-full">
          <div className="w-64 border-r border-white/10 bg-black/40 backdrop-blur-xl p-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <User className="w-6 h-6 text-purple-400" />
                <h3 className="font-medium">{profile.name}</h3>
              </div>
            </div>
          </div>
          <div className="flex-1 overflow-auto">
            <header className="border-b border-white/10 bg-black/40 backdrop-blur-xl sticky top-0">
              <div className="px-8 py-6">
                <h1 className="text-2xl font-medium">Profile</h1>
              </div>
            </header>
            <main className="p-8">
              <div className="bg-black/40 backdrop-blur-xl rounded-lg p-6">
                {editMode ? (
                  <form onSubmit={(e) => {
                    e.preventDefault();
                    handleSave();
                  }} className="space-y-6">
                    <div>
                      <label className="block text-sm text-white/70 mb-2">Name</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-white/70 mb-2">Email</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-white/70 mb-2">Phone</label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white"
                      />
                    </div>
                    <div className="flex justify-end gap-4">
                      <Button 
                        onClick={handleCancel}
                        variant="secondary"
                        className="!py-2"
                      >
                        Cancel
                      </Button>
                      <Button 
                        type="submit"
                        className="!py-2"
                      >
                        Save Changes
                      </Button>
                    </div>
                  </form>
                ) : (
                  <div className="space-y-6">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-medium">Name</h3>
                        <p className="text-white/70">{profile.name}</p>
                      </div>
                      <Button 
                        onClick={handleEdit}
                        variant="secondary"
                        className="!py-2"
                      >
                        <Edit2 className="w-5 h-5 mr-2" />
                        Edit Profile
                      </Button>
                    </div>
                    <div>
                      <h3 className="font-medium">Email</h3>
                      <p className="text-white/70">{profile.email}</p>
                    </div>
                    <div>
                      <h3 className="font-medium">Phone</h3>
                      <p className="text-white/70">{profile.phone || 'Not set'}</p>
                    </div>
                  </div>
                )}
              </div>
            </main>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
