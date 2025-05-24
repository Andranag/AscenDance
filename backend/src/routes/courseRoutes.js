const express = require('express');
const router = express.Router();
const { 
  createCourse, 
  getAllCourses, 
  getCourseById, 
  updateCourse, 
  deleteCourse, 
  enrollInCourse, 
  getUserCourses 
} = require('../controllers/courseController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Create a new course (admin only)
router.post('/', protect, authorize(['admin']), createCourse);

// Get all courses
router.get('/', protect, getAllCourses);

// Get a single course
router.get('/:id', protect, getCourseById);

// Update a course (admin only)
router.put('/:id', protect, authorize(['admin']), updateCourse);

// Delete a course (admin only)
router.delete('/:id', protect, authorize(['admin']), deleteCourse);

// Enroll in a course
router.post('/:id/enroll', protect, enrollInCourse);

// Get user's enrolled courses
router.get('/user-courses', protect, getUserCourses);

module.exports = router;
