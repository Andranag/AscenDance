import React, { useState, useEffect } from 'react';
import { PlusCircle, Pencil, Trash2, Loader, AlertTriangle, ArrowUp, ArrowDown } from 'lucide-react';
import { courseService } from '../../services/api';
import { useToast } from '../../contexts/ToastContext';
import CourseModal from '../../components/modals/CourseModal';
import ConfirmationModal from '../../components/modals/ConfirmationModal';

const getStyleColor = (style) => {
  switch (style.toLowerCase()) {
    case 'swing':
      return 'bg-blue-500 text-white'; // Classic swing
    case 'lindy hop':
      return 'bg-green-500 text-white'; // Energetic and playful
    case 'boogie woogie':
      return 'bg-yellow-500 text-white'; // Energetic and fun
    case 'balboa':
      return 'bg-purple-500 text-white'; // Elegant and close
    case 'charleston':
      return 'bg-pink-500 text-white'; // Playful and bouncy
    case 'solo jazz':
      return 'bg-orange-500 text-white'; // Expressive and solo
    default:
      return 'bg-gray-500 text-white';
  }
};

const getStatusColor = (status) => {
  switch (status) {
    case 'active':
      return 'bg-green-500';
    case 'draft':
      return 'bg-yellow-500';
    case 'pending':
      return 'bg-orange-500';
    case 'archived':
      return 'bg-gray-500';
    default:
      return 'bg-gray-400';
  }
};

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
    className="px-6 py-3 text-center text-sm font-semibold text-gray-900 uppercase tracking-wider cursor-pointer hover:text-gray-700"
    onClick={() => handleSort(field)}
  >
    <div className="flex items-center justify-center gap-1">
      <div className="flex items-center">
        {children}
        {sortField === field && (
          <span className="text-primary ml-1">
            {sortDirection === 'asc' ? (
              <ArrowUp className="w-4 h-4" />
            ) : (
              <ArrowDown className="w-4 h-4" />
            )}
          </span>
        )}
      </div>
    </div>
  </th>
);

const CourseManagement = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState('title');
  const [sortDirection, setSortDirection] = useState('asc');
  const { toastSuccess, toastError } = useToast();
  const [editingCourse, setEditingCourse] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    style: '',
    level: '',
    image: '',
    duration: '',
    durationUnit: 'Hours',
    rating: 0,
    studentsCount: 0
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

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



  const filteredCourses = courses.filter(course =>
    course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.style.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.level.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.duration.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.lessons.length.toString().includes(searchQuery)
  ).sort((a, b) => {
    if (sortField === 'title') {
      return sortDirection === 'asc' ? a.title.localeCompare(b.title) : b.title.localeCompare(a.title);
    }
    if (sortField === 'description') {
      return sortDirection === 'asc' ? a.description.localeCompare(b.description) : b.description.localeCompare(a.description);
    }
    if (sortField === 'style') {
      return sortDirection === 'asc' ? a.style.localeCompare(b.style) : b.style.localeCompare(a.style);
    }
    if (sortField === 'level') {
      return sortDirection === 'asc' ? a.level.localeCompare(b.level) : b.level.localeCompare(a.level);
    }
    if (sortField === 'duration') {
      return sortDirection === 'asc' ? a.duration.localeCompare(b.duration) : b.duration.localeCompare(a.duration);
    }
    if (sortField === 'lessons.length') {
      return sortDirection === 'asc' ? a.lessons.length - b.lessons.length : b.lessons.length - a.lessons.length;
    }
    return 0;
  });

  const handleCreateNew = () => {
    setIsModalOpen(true);
    setEditingCourse(null);
  };

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
    let aVal = a[sortField];
    let bVal = b[sortField];

    // Handle special cases for lessons count
    if (sortField === 'lessons.length') {
      aVal = a.lessons?.length || 0;
      bVal = b.lessons?.length || 0;
    }

    // Convert to string for text comparison, keep as number for numeric comparison
    if (typeof aVal === 'number' && typeof bVal === 'number') {
      return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
    }

    aVal = aVal?.toString().toLowerCase() || '';
    bVal = bVal?.toString().toLowerCase() || '';
    return sortDirection === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
  });

  const handleEdit = (course) => {
    // Set editing course state first
    setEditingCourse(course);
    setIsModalOpen(true);
  };

  const handleDelete = (courseId) => {
    const course = courses.find(c => c._id === courseId);
    if (course) {
      setCourseToDelete(course);
      setShowDeleteModal(true);
    }
  };

  const confirmDelete = async () => {
    try {
      await courseService.deleteCourse(courseToDelete._id);
      setCourses(courses.filter(c => c._id !== courseToDelete._id));
      toastSuccess('Course deleted successfully');
      setShowDeleteModal(false);
      setCourseToDelete(null);
    } catch (error) {
      toastError(error.message || 'Failed to delete course');
      setShowDeleteModal(false);
      setCourseToDelete(null);
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
      setIsSubmitting(true);
      console.log('Submitting course data:', data);
      
      let response;
      if (editingCourse) {
        console.log('Updating course with ID:', editingCourse._id);
        response = await courseService.updateCourse(editingCourse._id, data);
        console.log('Update response:', response);
        // If response doesn't have success property, assume it's the course data
        const courseData = response?.success ? response.data : response;
        setCourses(prevCourses => 
          prevCourses.map(c => (c._id === editingCourse._id ? { ...c, ...courseData } : c))
        );
      } else {
        console.log('Creating new course');
        response = await courseService.createCourse(data);
        console.log('Create response:', response);
        // If response doesn't have success property, assume it's the course data
        const courseData = response?.success ? response.data : response;
        setCourses(prevCourses => [...prevCourses, courseData]);
      }
      setIsModalOpen(false);
      setEditingCourse(null);
      setFormData({
        title: '',
        description: '',
        style: '',
        level: '',
        image: '',
        duration: '',
        durationUnit: 'Hours',
        rating: 0,
        studentsCount: 0
      }); // Reset form data after successful submission
      
      // Show single success message after all operations are complete
      toastSuccess(editingCourse ? 'Course updated successfully' : 'Course created successfully');
    } catch (error) {
      console.error('Course save error:', error);
      console.error('Error details:', {
        message: error.message,
        response: error.response?.data,
        stack: error.stack
      });
      toastError(error.message || 'Failed to save course');
      throw error;
    } finally {
      setIsSubmitting(false);
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
          <ConfirmationModal
            isOpen={showDeleteModal}
            onClose={() => {
              setShowDeleteModal(false);
              setCourseToDelete(null);
            }}
            title="Delete Course"
            message={`Are you sure you want to delete the course "${courseToDelete?.title}"? This action cannot be undone.`}
            confirmText="Delete Course"
            type="danger"
            icon={<AlertTriangle className="w-12 h-12 text-red-500" />}
            onConfirm={confirmDelete}
          />
          <div className="flex flex-col items-center justify-between mb-8">
            <div className="flex flex-col items-center gap-4">
              <h1 className="text-3xl font-bold text-white">Course Management</h1>
            </div>
            <div className="w-full flex justify-end">
              <button
                onClick={handleCreateNew}
                className="btn-primary"
              >
                <PlusCircle className="w-5 h-5 mr-2" />
                Create New Course
              </button>
            </div>
          </div>
          <div className="flex items-center justify-center mb-8">
            <div className="w-full max-w-2xl">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search courses..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-colors duration-200 text-gray-900 placeholder-gray-500"
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 overflow-x-auto">
            <table className="min-w-full divide-x divide-gray-200">
              <thead>
                <tr>
                  <SortButton field="title" sortField={sortField} sortDirection={sortDirection} handleSort={handleSort}>Title</SortButton>
                  <SortButton field="description" sortField={sortField} sortDirection={sortDirection} handleSort={handleSort}>Description</SortButton>
                  <SortButton field="style" sortField={sortField} sortDirection={sortDirection} handleSort={handleSort}>Style</SortButton>
                  <SortButton field="level" sortField={sortField} sortDirection={sortDirection} handleSort={handleSort}>Level</SortButton>
                  <SortButton field="duration" sortField={sortField} sortDirection={sortDirection} handleSort={handleSort}>Duration</SortButton>
                  <SortButton field="lessons.length" sortField={sortField} sortDirection={sortDirection} handleSort={handleSort}>Lessons</SortButton>
                  <SortButton field="status" sortField={sortField} sortDirection={sortDirection} handleSort={handleSort}>Status</SortButton>
                  <th className="px-6 py-3 text-center text-sm font-semibold text-gray-900 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCourses.map((course) => (
                  <tr key={course._id} className="border-b border-gray-200 hover:bg-gray-50/20">
                    <td className="py-4">
                      <div className="flex items-start">
                        <h3 className="font-medium text-gray-900">{course.title}</h3>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center justify-center">
                        <p className="text-sm text-gray-600">{course.description}</p>
                      </div>
                    </td>
                    <td className="py-4">
                      <div className="flex justify-center w-full">
                        <div className="flex items-center justify-center">
                          <span className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap ${getStyleColor(course.style)}`}>
                            {course.style}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="py-4">
                      <div className="flex justify-center">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getLevelColor(course.level)}`}>
                          {course.level}
                        </span>
                      </div>
                    </td>
                    <td className="py-4">
                      <div className="flex justify-center">
                        <span className="text-sm text-gray-600">{course.duration}</span>
                      </div>
                    </td>
                    <td className="py-4">
                      <div className="flex justify-center">
                        <span className="text-sm text-gray-600">{course.lessons?.length || 0}</span>
                      </div>
                    </td>
                    <td className="py-4">
                      <div className="flex justify-center">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center`}>
                          <span className={`w-4 h-4 rounded-full ${getStatusColor(course.status)}`} />
                        </div>
                      </div>
                    </td>
                    <td className="py-4">
                      <div className="flex justify-center">
                        <div className="flex items-center gap-4">
                          <button
                            onClick={() => handleEdit(course)}
                            className="bg-blue-600 text-white hover:bg-blue-700 flex items-center gap-2 px-4 py-2 rounded-lg transition-colors duration-200"
                          >
                            <Pencil className="w-4 h-4 text-white" />
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(course._id)}
                            className="btn-danger bg-red-600 text-white hover:bg-red-700 flex items-center gap-2 px-4 py-2 rounded-lg transition-colors duration-200"
                          >
                            <Trash2 className="w-4 h-4 text-white" />
                            Delete
                          </button>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      <CourseModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingCourse(null);
        }}
        onSubmit={handleSubmit}
        course={editingCourse}
        isSubmitting={isSubmitting}
      />
    </div>
  );
};

export default CourseManagement;
