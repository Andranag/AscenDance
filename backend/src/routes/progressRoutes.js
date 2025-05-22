const express = require('express');
const router = express.Router();
const { getCourseProgress, markContentComplete, addNote, getCourseNotes } = require('../controllers/progressController');
const { protect } = require('../middleware/authMiddleware');

// Get student's progress for a course
router.get('/:courseId', protect, getCourseProgress);

// Mark content as completed
router.post('/:courseId/content/:contentId/complete', protect, markContentComplete);

// Add note to content
router.post('/:courseId/content/:contentId/note', protect, addNote);

// Get all notes for a course
router.get('/:courseId/notes', protect, getCourseNotes);

module.exports = router;
