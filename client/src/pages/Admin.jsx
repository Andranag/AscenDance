import React, { useState } from 'react';
import { Calendar, Clock, Plus, Trash, Edit, Users } from 'lucide-react';
import Logo from '../components/common/Logo';
import Button from '../components/common/Button';
import { toast } from 'react-toastify';

const Admin = () => {
  const [formData, setFormData] = useState({
    title: '',
    image: '',
    instructor: '',
    level: 'Beginner',
    description: '',
    price: '',
    duration: '',
    startDate: '',
    recurringTime: '',
    maxSpots: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('http://localhost:3050/api/classes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token') || sessionStorage.getItem('token')}`
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error('Failed to create class');
      }

      toast.success('Class created successfully!');
      setFormData({
        title: '',
        image: '',
        instructor: '',
        level: 'Beginner',
        description: '',
        price: '',
        duration: '',
        startDate: '',
        recurringTime: '',
        maxSpots: ''
      });
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex">
      {/* Sidebar */}
      <div className="w-64 border-r border-white/10 bg-black/40 backdrop-blur-xl p-6">
        <Logo />
        <nav className="mt-8">
          <div className="space-y-2">
            <a href="#" className="flex items-center px-4 py-3 text-white bg-white/10 rounded-lg">
              <Plus className="w-5 h-5 mr-3" />
              Add New Class
            </a>
            <a href="#" className="flex items-center px-4 py-3 text-white/70 hover:bg-white/5 rounded-lg transition-colors">
              <Calendar className="w-5 h-5 mr-3" />
              All Classes
            </a>
            <a href="#" className="flex items-center px-4 py-3 text-white/70 hover:bg-white/5 rounded-lg transition-colors">
              <Users className="w-5 h-5 mr-3" />
              Students
            </a>
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <header className="border-b border-white/10 bg-black/40 backdrop-blur-xl sticky top-0">
          <div className="px-8 py-6">
            <h1 className="text-2xl font-medium">Add New Dance Class</h1>
            <p className="text-white/70 mt-1">Create a new class for your students</p>
          </div>
        </header>

        <main className="p-8">
          <form onSubmit={handleSubmit} className="max-w-3xl space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-white/90 mb-2">
                  Class Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-purple-500/50 focus:border-transparent text-white placeholder-white/40"
                  placeholder="Enter class title"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white/90 mb-2">
                  Instructor Name
                </label>
                <input
                  type="text"
                  name="instructor"
                  value={formData.instructor}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-purple-500/50 focus:border-transparent text-white placeholder-white/40"
                  placeholder="Enter instructor name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white/90 mb-2">
                  Image URL
                </label>
                <input
                  type="url"
                  name="image"
                  value={formData.image}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-purple-500/50 focus:border-transparent text-white placeholder-white/40"
                  placeholder="Enter image URL"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white/90 mb-2">
                  Level
                </label>
                <select
                  name="level"
                  value={formData.level}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-purple-500/50 focus:border-transparent text-white"
                  required
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-white/90 mb-2">
                  Price ($)
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-purple-500/50 focus:border-transparent text-white placeholder-white/40"
                  placeholder="Enter price"
                  min="0"
                  step="0.01"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white/90 mb-2">
                  Duration (e.g., 60 minutes)
                </label>
                <input
                  type="text"
                  name="duration"
                  value={formData.duration}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-purple-500/50 focus:border-transparent text-white placeholder-white/40"
                  placeholder="Enter duration"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white/90 mb-2">
                  Start Date
                </label>
                <input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-purple-500/50 focus:border-transparent text-white placeholder-white/40"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white/90 mb-2">
                  Recurring Time
                </label>
                <input
                  type="time"
                  name="recurringTime"
                  value={formData.recurringTime}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-purple-500/50 focus:border-transparent text-white placeholder-white/40"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white/90 mb-2">
                  Maximum Spots
                </label>
                <input
                  type="number"
                  name="maxSpots"
                  value={formData.maxSpots}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-purple-500/50 focus:border-transparent text-white placeholder-white/40"
                  placeholder="Enter maximum spots"
                  min="1"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-white/90 mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="4"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-purple-500/50 focus:border-transparent text-white placeholder-white/40"
                placeholder="Enter class description"
                required
              ></textarea>
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              isLoading={isSubmitting}
              className="mt-6"
            >
              Create Class
            </Button>
          </form>
        </main>
      </div>
    </div>
  );
};

export default Admin;