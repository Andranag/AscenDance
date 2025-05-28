const express = require('express');
const {
  getAllCourses,
  getCourseById,
  markLessonComplete,
  unmarkLesson
} = require('../controllers/courseController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Public routes
router.get('/', getAllCourses);
router.get('/:id', getCourseById);

// Protected routes
router.put('/:id/lessons/:lessonIndex/complete', protect, markLessonComplete);
router.delete('/:id/lessons/:lessonIndex/complete', protect, unmarkLesson);

module.exports = router;
