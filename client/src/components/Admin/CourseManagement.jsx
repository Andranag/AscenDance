import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useToast } from "../../contexts/ToastContext";
import { Plus, Edit2, Trash2, Check, X } from "lucide-react";

const CourseManagement = () => {
  const navigate = useNavigate();
  const { fetchWithAuth } = useAuth();
  const { toastSuccess, toastError } = useToast();
  const [courses, setCourses] = useState([]);
  const [newCourse, setNewCourse] = useState({
    title: '',
    description: '',
    image: '',
    level: 'beginner',
    category: '',
    duration: '',
    lessons: []
  });
  const [editCourse, setEditCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [formValues, setFormValues] = useState({
    title: '',
    description: '',
    category: '',
  });

  useEffect(() => {
    fetchCourses().catch((err) => {
      toastError('Something went wrong');
    });
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const response = await fetchWithAuth('/api/courses');
      console.log('Raw response:', response);
      
      // Handle direct array response
      const courses = Array.isArray(response) 
        ? response
        : response.data?.courses || [];
      
      console.log('Parsed courses:', courses);
      setCourses(courses);
    } catch (err) {
      console.error('Error fetching courses:', err);
      toastError('Failed to fetch courses');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCourse = async () => {
    try {
      setLoading(true);
      const createdCourse = await fetchWithAuth('/api/admin/courses', {
        method: 'POST',
        body: JSON.stringify({
          ...newCourse,
          lessons: newCourse.lessons || []
        })
      });
      if (createdCourse) {
        setCourses([...courses, createdCourse]);
        setNewCourse({ title: '', description: '', image: '', level: 'beginner', category: '', duration: '', lessons: [] });
        toastSuccess('Course created successfully');
      } else {
        throw new Error('Failed to create course');
      }
    } catch (error) {
      toastError(error?.message || 'Failed to create course');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateCourse = async (courseId, updates) => {
    try {
      setLoading(true);
      const updatedCourse = await fetchWithAuth(`/api/admin/courses/${encodeURIComponent(courseId)}`, {
        method: 'PUT',
        body: JSON.stringify(updates)
      });
      setCourses(courses.map(course => 
        course._id === courseId ? updatedCourse : course
      ));
      setEditCourse(null);
      toastSuccess('Course updated successfully');
    } catch (error) {
      toastError('Failed to update course');
    } finally {
      setLoading(false);
    }
  };

  const handleEditCourse = (course) => {
    setEditCourse(course);
    setFormValues({
      title: course.title,
      description: course.description,
      category: course.category,
    });
    setEditing(true);
    setOpen(true);
  };
  
  const handleDeleteCourse = async (courseId) => {
    if (!window.confirm('Are you sure you want to delete this course?')) return;

    setLoading(true);
    
    try {
      // Try to delete the course
      await fetchWithAuth(`/api/admin/courses/${courseId}`, {
        method: 'DELETE'
      });
      
      // If we got here without throwing, the request was successful
      toastSuccess?.('Course deleted successfully');
      setCourses(prev => prev.filter(c => c._id !== courseId));
    } catch (err) {
      console.error('Delete error occurred:', err);
      toastError?.('Failed to delete course');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = () => {
    setOpen(true);
    setEditing(false);
    setFormValues({
      title: '',
      description: '',
      category: '',
    });
  };

  const handleCloseModal = () => {
    setOpen(false);
  };

  const handleSave = async () => {
    if (editing) {
      await handleUpdateCourse(editCourse._id, {
        title: formValues.title,
        description: formValues.description,
        category: formValues.category,
      });
    } else {
      await handleCreateCourse();
    }
    handleCloseModal();
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Course Management</h2>
        <button
          onClick={handleOpenModal}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Add Course
        </button>
      </div>

      <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Title
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Created At
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {courses.map((course) => (
              <tr key={course._id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  {course.title}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {course.category}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {new Date(course.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() => handleEditCourse(course)}
                    className="btn-secondary flex items-center gap-1"
                  >
                    <Edit2 className="w-4 h-4" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteCourse(course._id)}
                    className="btn-danger flex items-center gap-1 ml-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-50 ${open ? 'block' : 'hidden'}`}
        onClick={handleCloseModal}
      >
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md transform transition-all">
            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div className="sm:flex sm:items-start">
                <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                    {editing ? "Edit Course" : "Add Course"}
                  </h3>
                  <form className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Title
                      </label>
                      <input
                        type="text"
                        value={formValues.title}
                        onChange={(e) => setFormValues({ ...formValues, title: e.target.value })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                        placeholder="Course title"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Category
                      </label>
                      <input
                        type="text"
                        value={formValues.category}
                        onChange={(e) => setFormValues({ ...formValues, category: e.target.value })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                        placeholder="Category"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Description
                      </label>
                      <textarea
                        value={formValues.description}
                        onChange={(e) => setFormValues({ ...formValues, description: e.target.value })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                        rows={3}
                        placeholder="Course description"
                      />
                    </div>
                  </form>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <button
                type="button"
                onClick={handleSave}
                className={`btn-primary flex items-center gap-1 ${editing ? 'bg-green-600 hover:bg-green-700' : ''}`}
              >
                <Check className="w-4 h-4" />
                {editing ? "Update" : "Add"}
              </button>
              <button
                type="button"
                onClick={handleCloseModal}
                className="btn-secondary flex items-center gap-1 ml-3"
              >
                <X className="w-4 h-4" />
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseManagement;
