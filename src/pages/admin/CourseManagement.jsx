import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { PlusCircle, Pencil, Trash2, Loader, X, Music2 } from 'lucide-react';
import { courseService } from '../../services/api';
import { useToast } from '../../contexts/ToastContext';

const ErrorBoundary = ({ children, error, setError }) => (
  error ? (
    <div className="fixed inset-0 bg-red-100/90 backdrop-blur-sm flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <p className="text-red-700">{error}</p>
        <button
          onClick={() => setError(null)}
          className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Close
        </button>
      </div>
    </div>
  ) : (
    children
  )
);

const CourseManagement = () => {
  const { toastSuccess, toastError } = useToast();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingCourse, setEditingCourse] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sortField, setSortField] = useState('title');
  const [sortDirection, setSortDirection] = useState('asc');
  const [error, setError] = useState(null);

  // Initialize form data with default values
  const defaultFormData = {
    title: '',
    description: '',
    style: 'Lindy Hop',
    level: 'Beginner'
  };
  const [formData, setFormData] = useState(defaultFormData);

  const danceStyles = [
    'Lindy Hop',
    'Balboa',
    'Solo Jazz',
    'Blues',
    'Boogie Woogie',
    'Shag',
    'Rhythm and Blues'
  ].sort();
  const levels = ['Beginner', 'Intermediate', 'Advanced', 'All Levels'];

  const levelOrder = {
    'All Levels': 0,
    'Beginner': 1,
    'Intermediate': 2,
    'Advanced': 3
  };

  // Get level color
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

  // Handle form data updates
  const handleFormDataChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  }, []);

  // Fetch courses on mount
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await courseService.getAllCourses();
        
        if (!response?.success) {
          throw new Error(response?.message || 'Failed to fetch courses');
        }
        
        setCourses(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching courses:', error);
        setError(error.message || 'Failed to fetch courses');
        setLoading(false);
      }
    };
    fetchInitialData();
  }, []);

  // Handle sorting
  const handleSort = useCallback((field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  }, [sortField, sortDirection, setSortField, setSortDirection]);

  // Sort courses
  const sortedCourses = useMemo(() => {
    return [...courses].sort((a, b) => {
      if (sortField === 'level') {
        const comparison = levelOrder[a.level] - levelOrder[b.level];
        return sortDirection === 'asc' ? comparison : -comparison;
      }
      
      // For style, sort alphabetically
      if (sortField === 'style') {
        const aValue = a.style?.toLowerCase() || '';
        const bValue = b.style?.toLowerCase() || '';
        return sortDirection === 'asc' 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }
      
      // For title (default case)
      const aValue = a[sortField]?.toLowerCase() || '';
      const bValue = b[sortField]?.toLowerCase() || '';
      return sortDirection === 'asc' 
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    });
  }, [courses, sortField, sortDirection, levelOrder]);

  // Edit handler
  const handleEdit = useCallback((course) => {
    setEditingCourse(course);
    setIsModalOpen(true);
    setFormData({
      title: course.title || '',
      description: course.description || '',
      style: course.style || 'Lindy Hop',
      level: course.level || 'Beginner'
    });
  }, [setEditingCourse, setIsModalOpen, setFormData]);

  // Delete handler
  const handleDelete = useCallback(async (courseId) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      try {
        // Optimistically remove the course from UI
        setCourses(courses.filter(course => course._id !== courseId));
        
        // Then make the API call
        await courseService.deleteCourse(courseId);
        toastSuccess('Course deleted successfully!');
      } catch (error) {
        console.error('Error deleting course:', error);
        setError(error.message || 'Failed to delete course');
        toastError('Failed to delete course. Please try again.');
        // If deletion fails, refetch the courses to restore the state
        const response = await courseService.getAllCourses();
        setCourses(response.data);
      }
    }
  }, [courses, setCourses, setError, toastSuccess, toastError]);

  // Submit handler
  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    try {
      // Optimistically update the UI
      if (editingCourse) {
        const optimisticUpdate = {
          ...editingCourse,
          ...formData
        };
        setCourses(courses.map(course => 
          course._id === editingCourse._id ? optimisticUpdate : course
        ));
        toastSuccess('Course updated successfully!');
      } else {
        const optimisticNewCourse = {
          ...formData,
          _id: Date.now().toString(), // Temporary ID
          __temporary: true // Mark as temporary
        };
        setCourses([...courses, optimisticNewCourse]);
        toastSuccess('Course created successfully!');
      }

      // Then make the API call
      if (editingCourse) {
        await courseService.updateCourse(editingCourse._id, formData);
      } else {
        const newCourse = await courseService.createCourse(formData);
        // Replace the temporary course with the real one
        setCourses(courses.map(course => 
          course.__temporary ? newCourse : course
        ));
      }

      // Update state in batch
      React.startTransition(() => {
        setIsModalOpen(false);
        setEditingCourse(null);
        setFormData(defaultFormData);
      });
    } catch (error) {
      console.error('Error saving course:', error);
      setError(error.message || 'Error saving course');
      toastError('Error saving course. Please try again.');
      // If there was an error, refetch the courses to restore the state
      const response = await courseService.getAllCourses();
      setCourses(response.data);
    }
  }, [editingCourse, courses, setCourses, setError, toastSuccess, toastError, formData, defaultFormData]);

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader className="w-8 h-8 animate-spin text-gray-500" />
      </div>
    );
  }

  return (
    <ErrorBoundary error={error} setError={setError}>
      <div className="min-h-screen bg-gradient-custom p-8">
        <div className="max-w-[1400px] mx-auto space-y-6">
          <div className="flex justify-between items-center mb-8">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center">
                  <Music2 className="w-6 h-6 text-white" />
                </div>
                <h1 className="text-3xl font-bold text-white">Course Management</h1>
              </div>
              <p className="text-gray-300">Manage your dance courses and their content.</p>
            </div>
            <button
              onClick={() => {
                setEditingCourse(null);
                setIsModalOpen(true);
                setFormData(defaultFormData);
              }}
              className="btn-primary"
            >
              <PlusCircle className="w-4 h-4 mr-1.5" />
              Add Course
            </button>
          </div>

          <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-xl border border-white/20 overflow-hidden">
            <div className="w-full overflow-x-auto">
              <table className="w-full divide-y divide-gray-200">
                <thead className="bg-gray-50/80 backdrop-blur-sm">
                  <tr>
                    <th
                      onClick={() => handleSort('title')}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700"
                    >
                      Title
                      {sortField === 'title' && (
                        <span className="ml-2">
                          {sortDirection === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Description
                    </th>
                    <th
                      onClick={() => handleSort('style')}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700"
                    >
                      Style
                      {sortField === 'style' && (
                        <span className="ml-2">
                          {sortDirection === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </th>
                    <th
                      onClick={() => handleSort('level')}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700"
                    >
                      Level
                      {sortField === 'level' && (
                        <span className="ml-2">
                          {sortDirection === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {sortedCourses.map((course) => (
                    <tr key={course._id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{course.title}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-500">{course.description}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                          {course.style}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getLevelColor(course.level)}`}>
                          {course.level}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(course)}
                            className="group relative inline-flex items-center px-3 py-1.5 bg-amber-50 text-amber-600 rounded-md hover:bg-amber-100 transition-all duration-200 hover:shadow-md"
                            title="Edit course"
                          >
                            <Pencil className="w-4 h-4 mr-1.5 transition-transform group-hover:scale-110" />
                            <span className="font-medium">Edit</span>
                            <span className="absolute inset-0 rounded-md border-2 border-blue-200 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                          </button>
                          <button
                            onClick={() => handleDelete(course._id)}
                            className="group relative inline-flex items-center px-3 py-1.5 bg-red-50 text-red-700 rounded-md hover:bg-red-100 transition-all duration-200 hover:shadow-md"
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
                      onChange={handleFormDataChange}
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
                      onChange={handleFormDataChange}
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
                      onChange={handleFormDataChange}
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
                      onChange={handleFormDataChange}
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
    </ErrorBoundary>
  );
};

export default CourseManagement;