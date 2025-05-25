const express = require('express');
const { getAllCourses, getCourseById, markLessonComplete } = require('../controllers/courseController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Public: View available courses
router.get('/', getAllCourses);

// Protected: Access course content and track progress
router.use(protect);
router.get('/:id', getCourseById);
router.post('/:id/lessons/:lessonId/complete', markLessonComplete);

module.exports = router;



module.exports = router;
