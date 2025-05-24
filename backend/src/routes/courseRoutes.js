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

// Apply protection middleware to all routes
router.use(protect);

// Create a new course (admin only)
router.post('/', authorize(['admin']), createCourse);

// Get all courses
router.get('/', getAllCourses);

// Get user's enrolled courses
router.get('/user-courses', getUserCourses);

// Get a single course
router.get('/:id', getCourseById);

// Update a course (admin only)
router.put('/:id', authorize(['admin']), updateCourse);

// Delete a course (admin only)
router.delete('/:id', authorize(['admin']), deleteCourse);

// Enroll in a course
router.post('/:id/enroll', enrollInCourse);

module.exports = router;
