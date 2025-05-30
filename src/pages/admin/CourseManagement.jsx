import React, { useState, useEffect } from 'react';
import { PlusCircle, Pencil, Trash2, Loader } from 'lucide-react';
import { courseService } from '../../services/api';
import { useToast } from '../../contexts/ToastContext';
import CourseModal from '../../components/modals/CourseModal';

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
  };
  const [sortField, setSortField] = useState('title');
  const [sortDirection, setSortDirection] = useState('asc');

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

  const validateFormData = () => {
    const errors = [];
    
    if (!formData.title.trim()) errors.push('Title is required');
    if (!formData.description.trim()) errors.push('Description is required');
    if (!formData.style) errors.push('Style is required');
    if (!formData.level) errors.push('Level is required');
    if (!formData.image?.trim()) errors.push('Image URL is required');
    if (!formData.duration?.trim()) errors.push('Duration is required');
    if (formData.rating < 0 || formData.rating > 5) errors.push('Rating must be between 0 and 5');
    if (formData.studentsCount < 0) errors.push('Students count must be non-negative');

    return errors;
  };

  const handleSubmit = async (data) => {
    try {
      if (editingCourse) {
        const updated = await courseService.updateCourse(editingCourse._id, data);
        setCourses(courses.map(c => (c._id === editingCourse._id ? { ...c, ...updated } : c)));
      } else {
        const created = await courseService.createCourse(data);
        if (created) {
          setCourses([...courses, created]);
        } else {
          throw new Error('Failed to create course');
        }
      }
    } catch (error) {
      throw error;
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
        <CourseModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setEditingCourse(null);
          }}
          onSubmit={handleSubmit}
          course={editingCourse}
        />
      )}
    </div>
  );
};

export default CourseManagement;
