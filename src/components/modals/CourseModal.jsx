import React, { useState, useEffect } from 'react';
import { PlusCircle, X, Loader2 } from 'lucide-react';
import { useToast } from '../../contexts/ToastContext';

const CourseModal = ({ isOpen, onClose, onSubmit, course = null }) => {
  const { toastSuccess, toastError } = useToast();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    style: 'Lindy Hop',
    level: 'Beginner',
    image: '/images/course-cards.jpg',
    duration: '',
    rating: 0,
    studentsCount: 0
  });
  const [isLoading, setIsLoading] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  const danceStyles = ['Lindy Hop', 'Balboa', 'Solo Jazz', 'Blues', 'Boogie Woogie', 'Shag', 'Rhythm and Blues'];
  const levels = ['Beginner', 'Intermediate', 'Advanced', 'All Levels'];

  // If editing an existing course, set initial form data
  useEffect(() => {
    if (course) {
      setFormData({
        ...course,
        rating: course.rating || 0,
        studentsCount: course.studentsCount || 0
      });
    } else {
      setFormData({
        title: '',
        description: '',
        style: 'Lindy Hop',
        level: 'Beginner',
        image: '/images/course-cards.jpg',
        duration: '',
        rating: 0,
        studentsCount: 0
      });
    }
  }, [course]);

  // Update image URL when style changes
  useEffect(() => {
    if (!course) {
      const styleToImageMap = {
        'Lindy Hop': '/images/course-cards.jpg',
        'Balboa': '/images/course-cards.jpg',
        'Solo Jazz': '/images/course-cards.jpg',
        'Blues': '/images/course-cards.jpg',
        'Boogie Woogie': '/images/course-cards.jpg',
        'Shag': '/images/course-cards.jpg',
        'Rhythm and Blues': '/images/course-cards.jpg'
      };
      
      const newImage = styleToImageMap[formData.style] || '/images/course-cards.jpg';
      setFormData(prev => ({
        ...prev,
        image: newImage
      }));
    }
  }, [formData.style, course]);

  // Reset form errors when form data changes
  useEffect(() => {
    setFormErrors({});
  }, [formData]);

  const validateFormData = () => {
    const errors = {};
    
    if (!formData.title.trim()) errors.title = 'Title is required';
    if (!formData.description.trim()) errors.description = 'Description is required';
    if (!formData.style) errors.style = 'Style is required';
    if (!formData.level) errors.level = 'Level is required';
    if (!formData.image?.trim()) errors.image = 'Image URL is required';
    if (!formData.duration?.trim()) errors.duration = 'Duration is required';
    if (formData.rating < 0 || formData.rating > 5) errors.rating = 'Rating must be between 0 and 5';
    if (formData.studentsCount < 0) errors.studentsCount = 'Students count must be non-negative';

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
      const normalizedData = {
        ...formData,
        level: formData.level.trim(),
        style: formData.style.trim(),
        image: formData.image.trim(),
        duration: formData.duration.trim(),
        rating: parseFloat(formData.rating),
        studentsCount: parseInt(formData.studentsCount, 10)
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

      await onSubmit(normalizedData);
      toastSuccess(course ? 'Course updated successfully' : 'Course created successfully');
      onClose();
    } catch (error) {
      toastError(error.message || 'Failed to save course');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl p-4 h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center border-b border-gray-200 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900">
            {course ? 'Edit Course' : 'Add New Course'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            {/* Basic Info */}
            <div className="space-y-3">
              <h3 className="text-lg font-medium text-gray-900">Basic Information</h3>
              <div className="grid grid-cols-1 gap-3">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title *</label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary ${
                      formErrors.title ? 'border-red-500' : ''
                    }`}
                    required
                    aria-invalid={formErrors.title ? 'true' : 'false'}
                    aria-errormessage={formErrors.title ? 'title-error' : undefined}
                    placeholder="Enter course title (e.g., 'Lindy Hop Fundamentals')"
                    style={{ color: '#1f2937' }}
                  />
                  {formErrors.title && (
                    <p id="title-error" className="mt-1 text-sm text-red-600">
                      {formErrors.title}
                    </p>
                  )}
                </div>
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description *</label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows="4"
                    className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary ${
                      formErrors.description ? 'border-red-500' : ''
                    }`}
                    required
                    aria-invalid={formErrors.description ? 'true' : 'false'}
                    aria-errormessage={formErrors.description ? 'description-error' : undefined}
                    placeholder="Enter course description (e.g., 'Learn the basics of Lindy Hop, including the swing out, basic footwork, and partner connection.')"
                    style={{ color: '#1f2937' }}
                  />
                  {formErrors.description && (
                    <p id="description-error" className="mt-1 text-sm text-red-600">
                      {formErrors.description}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Course Details */}
            <div className="space-y-3">
              <h3 className="text-lg font-medium text-gray-900">Course Details</h3>
              <div className="grid grid-cols-1 gap-3">
                <div>
                  <label htmlFor="style" className="block text-sm font-medium text-gray-700">Dance Style *</label>
                  <select
                    id="style"
                    name="style"
                    value={formData.style}
                    onChange={handleChange}
                    style={{
                      color: 'gray',
                      backgroundColor: '#f9fafb',
                      padding: '8px 12px',
                      appearance: 'none',
                      '-webkit-appearance': 'none'
                    }}
                    className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary ${
                      formErrors.style ? 'border-red-500' : ''
                    }`}
                    required
                    aria-invalid={formErrors.style ? 'true' : 'false'}
                    aria-errormessage={formErrors.style ? 'style-error' : undefined}
                  >
                    <option value="" disabled hidden>Select dance style</option>
                    {danceStyles.map(style => (
                      <option key={style} value={style} style={{ color: '#1f2937' }}>
                        {style}
                      </option>
                    ))}
                  </select>
                  {formErrors.style && (
                    <p id="style-error" className="mt-1 text-sm text-red-600">
                      {formErrors.style}
                    </p>
                  )}
                </div>
                <div>
                  <label htmlFor="level" className="block text-sm font-medium text-gray-700">Level *</label>
                  <select
                    id="level"
                    name="level"
                    value={formData.level}
                    onChange={handleChange}
                    style={{
                      color: 'gray',
                      backgroundColor: '#f9fafb',
                      padding: '8px 12px',
                      appearance: 'none',
                      '-webkit-appearance': 'none'
                    }}
                    className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary ${
                      formErrors.level ? 'border-red-500' : ''
                    }`}
                    required
                    aria-invalid={formErrors.level ? 'true' : 'false'}
                    aria-errormessage={formErrors.level ? 'level-error' : undefined}
                  >
                    <option value="" disabled hidden>Select skill level</option>
                    {levels.map(level => (
                      <option key={level} value={level} style={{ color: '#1f2937' }}>
                        {level}
                      </option>
                    ))}
                  </select>
                  {formErrors.level && (
                    <p id="level-error" className="mt-1 text-sm text-red-600">
                      {formErrors.level}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Media and Duration */}
            <div className="space-y-3">
              <h3 className="text-lg font-medium text-gray-900">Media and Duration</h3>
              <div className="grid grid-cols-1 gap-3">
                <div>
                  <label htmlFor="image" className="block text-sm font-medium text-gray-700">Image URL *</label>
                  <input
                    type="url"
                    id="image"
                    name="image"
                    value={formData.image}
                    onChange={handleChange}
                    className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary ${
                      formErrors.image ? 'border-red-500' : ''
                    }`}
                    required
                    placeholder="https://example.com/course-image.jpg"
                    aria-invalid={formErrors.image ? 'true' : 'false'}
                    aria-errormessage={formErrors.image ? 'image-error' : undefined}
                    style={{ color: '#1f2937' }}
                    readOnly
                  />
                  {formErrors.image && (
                    <p id="image-error" className="mt-1 text-sm text-red-600">
                      {formErrors.image}
                    </p>
                  )}
                </div>
                <div>
                  <label htmlFor="duration" className="block text-sm font-medium text-gray-700">Duration *</label>
                  <input
                    type="text"
                    id="duration"
                    name="duration"
                    value={formData.duration}
                    onChange={handleChange}
                    className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary ${
                      formErrors.duration ? 'border-red-500' : ''
                    }`}
                    required
                    placeholder="e.g., 2 hours, 6 weeks"
                    aria-invalid={formErrors.duration ? 'true' : 'false'}
                    aria-errormessage={formErrors.duration ? 'duration-error' : undefined}
                    style={{ color: '#1f2937' }}
                  />
                  {formErrors.duration && (
                    <p id="duration-error" className="mt-1 text-sm text-red-600">
                      {formErrors.duration}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Ratings and Statistics */}
            <div className="space-y-3">
              <h3 className="text-lg font-medium text-gray-900">Ratings and Statistics</h3>
              <div className="grid grid-cols-1 gap-3">
                <div>
                  <label htmlFor="rating" className="block text-sm font-medium text-gray-700">Rating</label>
                  <input
                    type="number"
                    id="rating"
                    name="rating"
                    value={formData.rating}
                    onChange={handleChange}
                    className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary ${
                      formErrors.rating ? 'border-red-500' : ''
                    }`}
                    min="0"
                    max="5"
                    step="0.1"
                    aria-invalid={formErrors.rating ? 'true' : 'false'}
                    aria-errormessage={formErrors.rating ? 'rating-error' : undefined}
                    style={{ color: '#1f2937' }}
                  />
                  {formErrors.rating && (
                    <p id="rating-error" className="mt-1 text-sm text-red-600">
                      {formErrors.rating}
                    </p>
                  )}
                </div>
                <div>
                  <label htmlFor="studentsCount" className="block text-sm font-medium text-gray-700">Students Count</label>
                  <input
                    type="number"
                    id="studentsCount"
                    name="studentsCount"
                    value={formData.studentsCount}
                    onChange={handleChange}
                    className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary ${
                      formErrors.studentsCount ? 'border-red-500' : ''
                    }`}
                    min="0"
                    aria-invalid={formErrors.studentsCount ? 'true' : 'false'}
                    aria-errormessage={formErrors.studentsCount ? 'studentsCount-error' : undefined}
                    style={{ color: '#1f2937' }}
                  />
                  {formErrors.studentsCount && (
                    <p id="studentsCount-error" className="mt-1 text-sm text-red-600">
                      {formErrors.studentsCount}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex justify-center rounded-md bg-burgundy px-6 py-3 text-sm font-medium text-white shadow-sm hover:bg-burgundy/90 focus:outline-none focus:ring-2 focus:ring-burgundy focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                course ? 'Update Course' : 'Create Course'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CourseModal;
