import React, { useState, useEffect } from 'react';
import { PlusCircle, Pencil, Trash2, Loader, X } from 'lucide-react';
import { courseService } from '../../services/api';
import { useToast } from '../../contexts/ToastContext';

const getLevelColor = (level) => {
  switch (level) {
    case 'Beginner':
      return 'bg-green-100 text-green-800';
    case 'Intermediate':
      return 'bg-yellow-100 text-yellow-800';
    case 'Advanced':
      return 'bg-red-100 text-red-800';
    case 'All Levels':
      return 'bg-blue-100 text-blue-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const SortButton = ({ field, children, sortField, sortDirection, handleSort }) => (
  <th
    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700"
    onClick={() => handleSort(field)}
  >
    <div className="flex items-center gap-1">
      {children}
      {sortField === field && (
        <span className="text-primary">{sortDirection === 'asc' ? '↑' : '↓'}</span>
      )}
    </div>
  </th>
);

const CourseManagement = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toastSuccess, toastError } = useToast();
  const [editingCourse, setEditingCourse] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCreateNew = () => {
    setIsModalOpen(true);
    setEditingCourse(null);
    setFormData({
      title: '',
      description: '',
      style: 'Lindy Hop',
      level: 'Beginner'
    });
  };
  const [sortField, setSortField] = useState('title');
  const [sortDirection, setSortDirection] = useState('asc');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    style: 'Lindy Hop',
    level: 'All Levels'
  });

  const danceStyles = ['Lindy Hop', 'Balboa', 'Solo Jazz', 'Blues', 'Boogie Woogie', 'Shag', 'Rhythm and Blues'];
  const levels = ['Beginner', 'Intermediate', 'Advanced', 'All Levels'];

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const response = await courseService.getAllCourses();
        if (!response?.success) throw new Error(response?.message || 'Failed to fetch courses');
        setCourses(response.data);
      } catch (error) {
        toastError(error.message || 'Failed to fetch courses');
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const handleSort = (field) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedCourses = [...courses].sort((a, b) => {
    const aVal = a[sortField]?.toString().toLowerCase() || '';
    const bVal = b[sortField]?.toString().toLowerCase() || '';
    return sortDirection === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
  });

  const handleEdit = (course) => {
    setEditingCourse(course);
    setFormData(course);
    setIsModalOpen(true);
  };

  const handleDelete = async (courseId) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      try {
        await courseService.deleteCourse(courseId);
        setCourses(courses.filter(c => c._id !== courseId));
        toastSuccess('Course deleted successfully');
      } catch (error) {
        toastError(error.message || 'Failed to delete course');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const normalizedData = {
        ...formData,
        level: formData.level.trim(),
        style: formData.style.trim()
      };

      // Normalize level to match backend expectations
      const normalizedLevel = formData.level.trim().toLowerCase();
      const levelMap = {
        'beginner': 'Beginner',
        'intermediate': 'Intermediate',
        'advanced': 'Advanced',
        'all levels': 'All Levels'
      };
      normalizedData.level = levelMap[normalizedLevel] || normalizedLevel.charAt(0).toUpperCase() + normalizedLevel.slice(1);

      if (editingCourse) {
        const updated = await courseService.updateCourse(editingCourse._id, normalizedData);
        setCourses(courses.map(c => (c._id === editingCourse._id ? { ...c, ...updated } : c)));
        toastSuccess('Course updated successfully');
      } else {
        const created = await courseService.createCourse(normalizedData);
        if (created) {
          setCourses([...courses, created]);
          toastSuccess('Course created successfully');
        } else {
          throw new Error('Failed to create course');
        }
      }

      setIsModalOpen(false);
      setEditingCourse(null);
      setFormData({
        title: '',
        description: '',
        style: 'Lindy Hop',
        level: 'Beginner'
      });
    } catch (error) {
      toastError(error.message || 'Failed to save course');
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="space-y-6">
      {loading ? (
        <div className="flex items-center justify-center h-full">
          <Loader className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : (
        <>
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-white">Course Management</h1>
              <p className="text-white/80 mt-1">Manage your dance courses</p>
            </div>
            <button
              onClick={handleCreateNew}
              className="btn-primary flex items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <PlusCircle className="w-4 h-4" />
              Create New Course
            </button>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr>
                  <SortButton field="title" sortField={sortField} sortDirection={sortDirection} handleSort={handleSort}>Title</SortButton>
                  <SortButton field="style" sortField={sortField} sortDirection={sortDirection} handleSort={handleSort}>Style</SortButton>
                  <SortButton field="level" sortField={sortField} sortDirection={sortDirection} handleSort={handleSort}>Level</SortButton>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody>
                {sortedCourses.map((course) => (
                  <tr key={course._id}>
                    <td className="px-6 py-4 text-sm text-gray-900">{course.title}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{course.style}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getLevelColor(course.level)}`}>
                        {course.level}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-right">
                      <button onClick={() => handleEdit(course)} className="text-indigo-600 hover:text-indigo-900 mr-2">
                        <Pencil className="w-5 h-5" />
                      </button>
                      <button onClick={() => handleDelete(course._id)} className="text-red-600 hover:text-red-900">
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-xl font-semibold text-gray-900">
                {editingCourse ? 'Edit Course' : 'Add New Course'}
              </h2>
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setEditingCourse(null);
                  setFormData({
                    title: '',
                    description: '',
                    style: 'Lindy Hop',
                    level: 'Beginner'
                  });
                }}
                className="text-gray-400 hover:text-gray-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
                <input type="text" id="title" name="title" value={formData.title} onChange={handleChange} className="input-field mt-1" required />
              </div>
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                <textarea id="description" name="description" value={formData.description} onChange={handleChange} rows="3" className="input-field mt-1" required />
              </div>
              <div>
                <label htmlFor="style" className="block text-sm font-medium text-gray-700">Dance Style</label>
                <select id="style" name="style" value={formData.style} onChange={handleChange} className="input-field mt-1" required>
                  {danceStyles.map(style => <option key={style} value={style}>{style}</option>)}
                </select>
              </div>
              <div>
                <label htmlFor="level" className="block text-sm font-medium text-gray-700">Level</label>
                <select id="level" name="level" value={formData.level} onChange={handleChange} className="input-field mt-1" required>
                  {levels.map(level => (
                    <option key={level} value={level}>{level}</option>
                  ))}
                </select>
              </div>
              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    setEditingCourse(null);
                    setFormData({
                      title: '',
                      description: '',
                      style: 'Lindy Hop',
                      level: 'Beginner'
                    });
                  }}
                  className="bg-white text-gray-700 hover:bg-gray-50 border border-gray-300 px-4 py-2 rounded-md"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {editingCourse ? 'Update' : 'Create'} Course
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseManagement;
