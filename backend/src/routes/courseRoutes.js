const express = require('express');
const router = express.Router();
const { getAllCourses, getCourseById, markLessonComplete } = require('../controllers/courseController');
const { protect } = require('../middleware/authMiddleware');

// Apply protection middleware to all routes
router.use(protect);

// Get all courses (requires auth)
router.get('/', getAllCourses);

// Get course by ID (requires auth)
router.get('/:id', getCourseById);

// Mark lesson as complete (requires auth)
router.post('/:id/lessons/:lessonId/complete', markLessonComplete);

module.exports = router;
