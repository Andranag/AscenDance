import React, { useState, useEffect } from 'react';
import { PlusCircle, Pencil, Trash2, Loader, X, Music2 } from 'lucide-react';

const CourseManagement = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingCourse, setEditingCourse] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sortField, setSortField] = useState('title');
  const [sortDirection, setSortDirection] = useState('asc');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    style: 'Lindy Hop',
    level: 'Beginner'
  });

  const danceStyles = ['Lindy Hop', 'Rhythm and Blues', 'Authentic Jazz'].sort();
  const levels = ['Beginner', 'Intermediate', 'Advanced'];

  const levelOrder = {
    'Beginner': 1,
    'Intermediate': 2,
    'Advanced': 3
  };

  useEffect(() => {
    if (editingCourse) {
      setFormData(editingCourse);
    } else {
      setFormData({
        title: '',
        description: '',
        style: 'Lindy Hop',
        level: 'Beginner'
      });
    }
  }, [editingCourse]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const mockCourses = [
          {
            _id: '1',
            title: 'Introduction to Swing',
            description: 'Learn the fundamentals of swing dancing.',
            style: 'Lindy Hop',
            level: 'Beginner'
          },
          {
            _id: '2',
            title: 'Lindy Hop Basics',
            description: 'Master the essential moves of Lindy Hop.',
            style: 'Lindy Hop',
            level: 'Beginner'
          },
          {
            _id: '3',
            title: 'Advanced Charleston',
            description: 'Take your Charleston to the next level with advanced variations and styling.',
            style: 'Authentic Jazz',
            level: 'Advanced'
          }
        ];
        setCourses(mockCourses);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching courses:', error);
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedCourses = [...courses].sort((a, b) => {
    if (sortField === 'level') {
      const comparison = levelOrder[a.level] - levelOrder[b.level];
      return sortDirection === 'asc' ? comparison : -comparison;
    }
    
    const aValue = a[sortField]?.toLowerCase() || '';
    const bValue = b[sortField]?.toLowerCase() || '';
    return sortDirection === 'asc' 
      ? aValue.localeCompare(bValue)
      : bValue.localeCompare(aValue);
  });

  const handleEdit = (course) => {
    setEditingCourse(course);
    setIsModalOpen(true);
  };

  const handleDelete = async (courseId) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      try {
        setCourses(courses.filter(course => course._id !== courseId));
      } catch (error) {
        console.error('Error deleting course:', error);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCourse) {
        setCourses(courses.map(course => 
          course._id === editingCourse._id ? { ...course, ...formData } : course
        ));
      } else {
        const newCourse = {
          _id: Date.now().toString(),
          ...formData
        };
        setCourses([...courses, newCourse]);
      }
      setIsModalOpen(false);
      setEditingCourse(null);
    } catch (error) {
      console.error('Error saving course:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const getLevelColor = (level) => {
    switch (level?.toLowerCase()) {
      case 'beginner':
        return 'bg-emerald-100 text-emerald-800';
      case 'intermediate':
        return 'bg-amber-100 text-amber-800';
      case 'advanced':
        return 'bg-rose-100 text-rose-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const SortButton = ({ field, children }) => (
    <th 
      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700"
      onClick={() => handleSort(field)}
    >
      <div className="flex items-center gap-1">
        {children}
        {sortField === field && (
          <span className="text-primary">
            {sortDirection === 'asc' ? '↑' : '↓'}
          </span>
        )}
      </div>
    </th>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-custom p-8">
      <div className="max-w-[1400px] mx-auto space-y-6">
        <div className="flex justify-between items-center mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center">
                <Music2 className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">Course Management</h1>
                <p className="text-white/80">Create and manage your dance courses</p>
              </div>
            </div>
          </div>
          <button
            onClick={() => {
              setEditingCourse(null);
              setIsModalOpen(true);
            }}
            className="btn-primary hover:scale-105 transform transition-transform duration-200 shadow-lg hover:shadow-xl bg-white text-primary hover:bg-white/90 flex items-center gap-2 px-6 py-3 rounded-lg"
          >
            <PlusCircle className="w-5 h-5" />
            <span className="font-medium">Add New Course</span>
          </button>
        </div>

        <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-xl border border-white/20 overflow-hidden">
          <div className="w-full overflow-x-auto">
            <table className="w-full divide-y divide-gray-200">
              <thead className="bg-gray-50/80 backdrop-blur-sm">
                <tr>
                  <SortButton field="title">Course Details</SortButton>
                  <SortButton field="style">Style</SortButton>
                  <SortButton field="level">Level</SortButton>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sortedCourses.map((course) => (
                  <tr key={course._id} className="hover:bg-gray-50/80 backdrop-blur-sm transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-base font-medium text-gray-900">{course.title}</div>
                        <div className="text-sm text-gray-500 mt-0.5">{course.description}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium bg-primary/10 text-primary">
                        {course.style}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium ${getLevelColor(course.level)}`}>
                        {course.level}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleEdit(course)}
                          className="group relative inline-flex items-center px-3 py-1.5 bg-amber-50 text-amber-600 rounded-md hover:bg-amber-100 transition-all duration-200 hover:shadow-md"
                          title="Edit course"
                        >
                          <Pencil className="w-4 h-4 mr-1.5 transition-transform group-hover:scale-110" />
                          <span className="font-medium">Edit</span>
                          <span className="absolute inset-0 rounded-md border-2 border-amber-200 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                        </button>
                        <button
                          onClick={() => handleDelete(course._id)}
                          className="group relative inline-flex items-center px-3 py-1.5 bg-red-50 text-red-600 rounded-md hover:bg-red-100 transition-all duration-200 hover:shadow-md"
                          title="Delete course"
                        >
                          <Trash2 className="w-4 h-4 mr-1.5 transition-transform group-hover:scale-110" />
                          <span className="font-medium">Delete</span>
                          <span className="absolute inset-0 rounded-md border-2 border-red-200 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
              <div className="flex justify-between items-center p-6 border-b">
                <h2 className="text-xl font-semibold text-gray-900">
                  {editingCourse ? 'Edit Course' : 'Add New Course'}
                </h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                    Title
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className="input-field mt-1"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows="3"
                    className="input-field mt-1"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="style" className="block text-sm font-medium text-gray-700">
                    Dance Style
                  </label>
                  <select
                    id="style"
                    name="style"
                    value={formData.style}
                    onChange={handleChange}
                    className="input-field mt-1"
                    required
                  >
                    {danceStyles.map((style) => (
                      <option key={style} value={style}>
                        {style}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="level" className="block text-sm font-medium text-gray-700">
                    Level
                  </label>
                  <select
                    id="level"
                    name="level"
                    value={formData.level}
                    onChange={handleChange}
                    className="input-field mt-1"
                    required
                  >
                    {levels.map((level) => (
                      <option key={level} value={level}>
                        {level}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex justify-end gap-3 mt-6">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary">
                    {editingCourse ? 'Update Course' : 'Create Course'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseManagement;