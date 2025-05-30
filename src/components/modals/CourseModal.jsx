import React, { useState, useEffect } from 'react';
import { X, Loader2 } from 'lucide-react';
import { useToast } from '../../contexts/ToastContext';

const DEFAULT_IMAGE = 'https://images.pexels.com/photos/2188012/pexels-photo-2188012.jpeg';
const DANCE_STYLES = ['Lindy Hop', 'Balboa', 'Solo Jazz', 'Blues', 'Boogie Woogie', 'Shag', 'Rhythm and Blues'];
const LEVELS = ['Beginner', 'Intermediate', 'Advanced', 'All Levels'];
const DURATION_UNITS = ['Minutes', 'Hours', 'Weeks'];

const CourseModal = ({ isOpen, onClose, onSubmit, course = null, isSubmitting = false }) => {
  const { toastSuccess, toastError } = useToast();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    style: '',
    level: '',
    image: DEFAULT_IMAGE,
    duration: '',
    durationUnit: 'Hours',
    rating: 0,
    studentsCount: 0,
  });

  // Reset form data when component mounts
  useEffect(() => {
    setFormData({
      title: '',
      description: '',
      style: '',
      level: '',
      image: DEFAULT_IMAGE,
      duration: '',
      durationUnit: 'Hours',
      rating: 0,
      studentsCount: 0,
    });
  }, []);

  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    setIsLoading(isSubmitting);
  }, [isSubmitting]);
  const [formErrors, setFormErrors] = useState({});

  // Handle course data updates
  useEffect(() => {
    // Reset form data when modal opens
    if (isOpen) {
      if (course) {
        // For editing, use course data
        setFormData({
          title: course.title,
          description: course.description,
          style: course.style,
          level: course.level,
          image: course.image,
          duration: course.duration ? course.duration.split(' ')[0] : '',
          durationUnit: course.duration ? course.duration.split(' ')[1] : 'Hours',
          rating: course.rating || 0,
          studentsCount: course.studentsCount || 0
        });
      } else {
        // For new course, reset all fields
        setFormData({
          title: '',
          description: '',
          style: '',
          level: '',
          image: DEFAULT_IMAGE,
          duration: '',
          durationUnit: 'Hours',
          rating: 0,
          studentsCount: 0,
        });
      }
    }
  }, [course, isOpen]);

  useEffect(() => {
    if (!course) {
      setFormData(prev => ({
        ...prev,
        image: DEFAULT_IMAGE,
      }));
    }
  }, [formData.style, course]);

  const validateFormData = () => {
    const errors = {};
    if (!formData.title.trim()) errors.title = 'Title is required';
    if (!formData.description.trim()) errors.description = 'Description is required';
    if (!formData.style) errors.style = 'Style is required';
    if (!formData.level) errors.level = 'Level is required';
    if (!formData.image.trim()) errors.image = 'Image URL is required';
    if (!formData.duration.trim()) errors.duration = 'Duration is required';
    else if (!/^[0-9]+$/.test(formData.duration)) errors.duration = 'Duration must be a number';
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validateFormData();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    try {
      setIsLoading(true);
      
      // Normalize the data before submission
      const normalizedData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        style: formData.style.trim(),
        level: formData.level.trim(),
        image: formData.image.trim(),
        duration: formData.duration,
        durationUnit: formData.durationUnit,
        rating: formData.rating,
        studentsCount: formData.studentsCount
      };

      // Call the parent's onSubmit handler with the data
      await onSubmit(normalizedData);
      
      // Show success message and close modal
      toastSuccess(course ? 'Course updated successfully' : 'Course created successfully');
      onClose();
    } catch (error) {
      console.error('Course save error:', error);
      toastError(error.message || 'Failed to save course');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Reset form data when modal closes
  // Reset form data when modal closes
  useEffect(() => {
    if (!isOpen) {
      setFormData({
        title: '',
        description: '',
        style: '',
        level: '',
        image: DEFAULT_IMAGE,
        duration: '',
        durationUnit: 'Hours',
        rating: 0,
        studentsCount: 0,
      });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl p-4 h-[80vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-gray-200 mb-6">
          <h2 className="text-2xl font-semibold text-gray-900">
            {course ? 'Edit Course' : 'Add New Course'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
            <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6" autoComplete="off">
          <div className="space-y-3">
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title *</label>
            <input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring focus:ring-primary ${formErrors.title ? 'border-red-500' : ''}`}
              placeholder="Enter course title"
              style={{ color: formData.title ? '#333' : '#6b7280' }}
              required
              type="text"
            />
            {formErrors.title && <p className="text-sm text-red-600 mt-1">{formErrors.title}</p>}
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description *</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring focus:ring-primary ${formErrors.description ? 'border-red-500' : ''}`}
              placeholder="Enter course description"
              style={{ color: formData.description ? '#333' : '#6b7280' }}
              required
            />
            {formErrors.description && <p className="text-sm text-red-600 mt-1">{formErrors.description}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-3">
              <label htmlFor="style" className="block text-sm font-medium text-gray-700">Style *</label>
              <select
                id="style"
                name="style"
                value={formData.style}
                onChange={handleChange}
                className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring focus:ring-primary ${formErrors.style ? 'border-red-500' : ''}`}
                required
                style={{ color: formData.style ? '#333' : '#6b7280' }}
              >
                <option value="" style={{ color: '#6b7280' }}>Select dance style</option>
                {DANCE_STYLES.map(style => (
                  <option key={style} value={style} style={{ color: '#333' }}>
                    {style}
                  </option>
                ))}
              </select>
              {formErrors.style && <p className="text-sm text-red-600 mt-1">{formErrors.style}</p>}
            </div>

            <div className="space-y-3">
              <label htmlFor="level" className="block text-sm font-medium text-gray-700">Level *</label>
              <select
                id="level"
                name="level"
                value={formData.level}
                onChange={handleChange}
                className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring focus:ring-primary ${formErrors.level ? 'border-red-500' : ''}`}
                required
                style={{ color: formData.level ? '#333' : '#6b7280' }}
              >
                <option value="" style={{ color: '#6b7280' }}>Select course level</option>
                {LEVELS.map(level => (
                  <option key={level} value={level} style={{ color: '#333' }}>
                    {level}
                  </option>
                ))}
              </select>
              {formErrors.level && <p className="text-sm text-red-600 mt-1">{formErrors.level}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-3">
              <label htmlFor="image" className="block text-sm font-medium text-gray-700">Image URL *</label>
              <input
                type="url"
                id="image"
                name="image"
                value={formData.image}
                onChange={handleChange}
                className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring focus:ring-primary ${formErrors.image ? 'border-red-500' : ''}`}
                placeholder="Enter course image URL"
                style={{ color: formData.image ? '#333' : '#6b7280' }}
                required
              />
              {formErrors.image && <p className="text-sm text-red-600 mt-1">{formErrors.image}</p>}
            </div>

            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700">Duration *</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  id="duration"
                  name="duration"
                  value={formData.duration}
                  onChange={handleChange}
                  className={`mt-1 flex-1 rounded-md border-gray-300 shadow-sm focus:ring focus:ring-primary ${
                    formErrors.duration ? 'border-red-500' : ''
                  } text-gray-900`}
                  required
                  aria-invalid={formErrors.duration ? 'true' : 'false'}
                  aria-errormessage={formErrors.duration ? 'duration-error' : undefined}
                  placeholder="Enter duration"
                />
                <select
                  id="durationUnit"
                  name="durationUnit"
                  value={formData.durationUnit}
                  onChange={handleChange}
                  className={`mt-1 flex-1 rounded-md border-gray-300 shadow-sm focus:ring focus:ring-primary ${
                    formErrors.duration ? 'border-red-500' : ''
                  } text-gray-900`}
                  required
                >
                  {DURATION_UNITS.map(unit => (
                    <option key={unit} value={unit}>
                      {unit}
                    </option>
                  ))}
                </select>
              </div>
              {formErrors.duration && (
                <p id="duration-error" className="mt-1 text-sm text-red-600">
                  {formErrors.duration}
                </p>
              )}
            </div>
          </div>
        </form>
        <div className="mt-6 flex justify-end gap-4 px-4">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex justify-center rounded-md bg-gray-100 px-6 py-3 text-sm font-medium text-gray-900 shadow-sm hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            onClick={handleSubmit}
            className="btn-primary flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            {isLoading ? (
              <>
                <Loader2 className="animate-spin mr-2" />
                Loading...
              </>
            ) : (
              course ? 'Update Course' : 'Create Course'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CourseModal;