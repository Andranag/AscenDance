import React, { useState, useEffect } from 'react';
import { User, Mail, Save } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { fetchAuth } from '../api';
import { useToast } from '../contexts/ToastContext';

const ProfileEditor = ({ initialUser = { name: '', email: '' }, isLoading }) => {
  const [formData, setFormData] = useState({
    name: initialUser?.name || '',
    email: initialUser?.email || ''
  });
  const { user, setUser } = useAuth();
  const { toastSuccess, toastError } = useToast();

  useEffect(() => {
    setFormData({
      name: user?.name || '',
      email: user?.email || ''
    });
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value.trim()
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;

    try {
      const response = await fetchAuth('/api/auth/update', {
        method: 'PUT',
        body: JSON.stringify({
          id: user.id,
          name: formData.name,
          email: formData.email
        })
      });

      if (response.success && response.data) {
        const updatedUser = { ...user, ...response.data };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setUser(updatedUser);
        toastSuccess('Profile updated successfully!');
        return response;
      }
      throw new Error('Invalid response format');
    } catch (error) {
      console.error('Update profile error:', error);
      toastError(error.message || 'Failed to update profile');
      throw error;
    }
  };

  return (
    <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-lg p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Full Name
          </label>
          <div className="relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <User className="h-5 w-5 text-secondary" />
            </div>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="input-field pl-10"
              placeholder="Your name"
              disabled={isLoading}
            />
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email Address
          </label>
          <div className="relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 text-secondary" />
            </div>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="input-field pl-10"
              placeholder="you@example.com"
              disabled={isLoading}
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className={`btn-primary w-full flex items-center justify-center gap-2 ${
            isLoading ? 'opacity-70 cursor-not-allowed' : ''
          }`}
        >
          {isLoading ? (
            <>
              <div className="animate-spin h-5 w-5 mr-2 border-2 border-white border-t-transparent rounded-full" />
              Updating Profile...
            </>
          ) : (
            <>
              <Save className="w-5 h-5" />
              Update Profile
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default ProfileEditor;