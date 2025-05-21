import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Edit2, Trash2, CheckCircle } from 'lucide-react';
import Button from '../components/common/Button';
import { toast } from 'react-toastify';

const Profile = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const payload = JSON.parse(window.atob(base64));
      const userId = payload.userId;

      const response = await fetch(`http://localhost:3050/user/profile/${userId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token') || sessionStorage.getItem('token')}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setProfile(data);
        setFormData(data);
      }
    } catch (error) {
      toast.error('Failed to fetch profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = () => {
    setEditMode(true);
  };

  const handleSave = async () => {
    try {
      const response = await fetch('http://localhost:3050/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token') || sessionStorage.getItem('token')}`
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        toast.success('Profile updated successfully');
        setEditMode(false);
        fetchProfile();
      }
    } catch (error) {
      toast.error('Failed to update profile');
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

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (!profile) {
    return <div className="flex items-center justify-center min-h-screen">Profile not found</div>;
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Sidebar */}
      <div className="w-64 border-r border-white/10 bg-black/40 backdrop-blur-xl p-6">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <User className="w-6 h-6 text-purple-400" />
            <h3 className="font-medium">{profile.name}</h3>
          </div>
          <nav className="space-y-2">
            <Link to="/student/dashboard" className="flex items-center px-4 py-3 text-white/70 hover:bg-white/5 rounded-lg transition-colors">
              <User className="w-5 h-5 mr-3" />
              Dashboard
            </Link>
            <Link to="/student/profile" className="flex items-center px-4 py-3 text-white bg-white/10 rounded-lg">
              <User className="w-5 h-5 mr-3" />
              Profile
            </Link>
            <Link to="/student/courses" className="flex items-center px-4 py-3 text-white/70 hover:bg-white/5 rounded-lg transition-colors">
              <CheckCircle className="w-5 h-5 mr-3" />
              My Courses
            </Link>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {/* Header */}
        <header className="border-b border-white/10 bg-black/40 backdrop-blur-xl sticky top-0">
          <div className="px-8 py-6">
            <h1 className="text-2xl font-medium">Profile</h1>
          </div>
        </header>

        {/* Main Content */}
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
  );
};

export default Profile;
