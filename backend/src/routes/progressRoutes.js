const express = require('express');
const router = express.Router();
const Progress = require('../models/Progress');
const Course = require('../models/Course');
const { protect } = require('../middleware/authMiddleware');
const logger = require('../utils/logger');

// Get student's progress for a course
router.get('/:courseId', protect, async (req, res) => {
  try {
    const progress = await Progress.findOne({
      student: req.user.id,
      course: req.params.courseId
    }).populate('course');

    if (!progress) {
      return res.status(404).json({
        message: 'Progress not found',
        courseId: req.params.courseId
      });
    }

    res.json(progress);
  } catch (error) {
    logger.error('Error fetching progress:', { 
      error: error.message, 
      courseId: req.params.courseId,
      userId: req.user.id
    });
    res.status(500).json({
      message: 'Server error fetching progress',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Mark content as completed
router.post('/:courseId/content/:contentId/complete', protect, async (req, res) => {
  try {
    const progress = await Progress.findOne({
      student: req.user.id,
      course: req.params.courseId
    });

    if (!progress) {
      return res.status(404).json({
        message: 'Progress not found',
        courseId: req.params.courseId
      });
    }

    // Check if content exists in course
    const course = await Course.findById(req.params.courseId);
    if (!course || !course.content.some(c => c.id === req.params.contentId)) {
      return res.status(404).json({
        message: 'Content not found in course',
        contentId: req.params.contentId
      });
    }

    // Add content to completed list if not already there
    if (!progress.completedContent.some(c => c.contentId === req.params.contentId)) {
      progress.completedContent.push({
        contentId: req.params.contentId,
        completedAt: new Date()
      });
    }

    // Calculate and update progress
    progress.calculateProgress();
    await progress.save();

    res.json({
      message: 'Content marked as completed',
      progressPercentage: progress.progressPercentage
    });
  } catch (error) {
    logger.error('Error marking content as completed:', { 
      error: error.message, 
      courseId: req.params.courseId,
      contentId: req.params.contentId,
      userId: req.user.id
    });
    res.status(500).json({
      message: 'Server error marking content as completed',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Add note to content
router.post('/:courseId/content/:contentId/note', protect, async (req, res) => {
  try {
    const progress = await Progress.findOne({
      student: req.user.id,
      course: req.params.courseId
    });

    if (!progress) {
      return res.status(404).json({ message: 'Progress not found' });
    }

    progress.notes.push({
      contentId: req.params.contentId,
      note: req.body.note
    });

    await progress.save();
    res.json({ message: 'Note added successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
