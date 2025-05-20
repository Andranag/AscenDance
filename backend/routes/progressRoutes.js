const express = require('express');
const router = express.Router();
const Progress = require('../models/Progress');
const Course = require('../models/Course');
const auth = require('../middleware/auth');

// Get student's progress for a course
router.get('/:courseId', auth, async (req, res) => {
  try {
    const progress = await Progress.findOne({
      student: req.user.id,
      course: req.params.courseId
    }).populate('course');

    if (!progress) {
      return res.status(404).json({ message: 'Progress not found' });
    }

    res.json(progress);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Mark content as completed
router.post('/:courseId/content/:contentId/complete', auth, async (req, res) => {
  try {
    const progress = await Progress.findOne({
      student: req.user.id,
      course: req.params.courseId
    });

    if (!progress) {
      return res.status(404).json({ message: 'Progress not found' });
    }

    if (!progress.completedContent.some(c => c.contentId === req.params.contentId)) {
      progress.completedContent.push({
        contentId: req.params.contentId,
        completedAt: new Date()
      });
    }

    progress.calculateProgress();
    await progress.save();

    res.json({ message: 'Content marked as completed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add note to content
router.post('/:courseId/content/:contentId/note', auth, async (req, res) => {
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
