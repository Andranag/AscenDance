const express = require('express');
const router = express.Router();
const { getAllCourses, getCourseById, markLessonComplete } = require('../controllers/courseController');
const { protect } = require('../middleware/authMiddleware');

// Apply protection middleware to all routes
router.use(protect);

// Get all courses
router.get('/', getAllCourses);

// Get course by ID
router.get('/:id', getCourseById);

// Mark lesson as complete
router.post('/:id/lessons/:lessonId/complete', markLessonComplete);

module.exports = router;
