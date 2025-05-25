const express = require('express');
const { getAllCourses, getCourseById, markLessonComplete, unmarkLesson } = require('../controllers/courseController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Public: View available courses
router.get('/', getAllCourses);

// Protected: Access course content and track progress
router.use(protect);
router.get('/:id', getCourseById);
router.put('/:id/lessons/:lessonIndex/complete', markLessonComplete);
router.delete('/:id/lessons/:lessonIndex/complete', unmarkLesson);

console.log('Course routes loaded');
module.exports = router;
