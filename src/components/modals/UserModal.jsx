import React, { useState } from 'react';
import { Eye, EyeOff, X } from 'lucide-react';
import { useToast } from '../../contexts/ToastContext';
import { api, API_ENDPOINTS } from '../../utils/api';

const UserModal = ({ isOpen, onClose, user, onSubmit }) => {
  const { toastSuccess, toastError } = useToast();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    password: '',
    role: user?.role || 'user'
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = user 
        ? await api.put(API_ENDPOINTS.users.update(user._id), formData)
        : await api.post(API_ENDPOINTS.users.create, formData);

      onSubmit(response);
      toastSuccess(user ? 'User updated successfully' : 'User created successfully');
      onClose();
    } catch (error) {
      console.error('Error saving user:', error);
      // Handle specific error cases
      if (error.response?.data?.message) {
        toastError(error.response.data.message);
      } else if (error.message) {
        toastError(error.message);
      } else {
        toastError('Failed to save user');
      }
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-8 z-50">
      <div className="bg-white rounded-xl shadow-2xl border border-gray-200 w-full max-w-md z-50">
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-xl font-semibold text-gray-900">
            {user ? 'Edit User' : 'Create User'}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-800 mb-1">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary/50 bg-white placeholder-gray-500 text-gray-900 shadow-sm transition-all duration-200"
              required
              placeholder="Enter user name"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-800 mb-1">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary/50 bg-white placeholder-gray-500 text-gray-900 shadow-sm transition-all duration-200"
              required
              placeholder="Enter email address"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-800 mb-1">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary/50 bg-white placeholder-gray-500 text-gray-900 shadow-sm transition-all duration-200"
                required={!user}
                placeholder="Enter password"
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="focus:outline-none transition-all"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-700 hover:text-gray-600" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-700 hover:text-primary" />
                  )}
                </button>
              </div>
            </div>
          </div>
          <div>
            <label htmlFor="role" className="block text-sm font-medium text-gray-800 mb-1">Role</label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary/50 bg-white text-gray-900 shadow-sm transition-all duration-200"
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="bg-white text-gray-700 hover:bg-gray-50 border border-gray-300 px-4 py-2 rounded-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || (!formData.name || !formData.email || (!user && !formData.password))}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin h-5 w-5 mr-2 border-2 border-white border-t-transparent rounded-full"></div>
                  Saving...
                </div>
              ) : (
                user ? 'Update' : 'Create'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserModal;
