const Progress = require('../models/Progress');
const Course = require('../models/Course');
const { AppError } = require('../utils/errorHandler');
const { catchAsync } = require('../utils/errorHandler');

// Get student's progress for a course
const getCourseProgress = catchAsync(async (req, res) => {
  const { courseId } = req.params;
  const userId = req.user.id;

  const progress = await Progress.findOne({
    student: userId,
    course: courseId
  }).populate('course');

  if (!progress) {
    throw new AppError('Progress not found', 404);
  }

  res.status(200).json(progress);
});

// Mark content as completed
const markContentComplete = catchAsync(async (req, res) => {
  const { courseId, contentId } = req.params;
  const userId = req.user.id;

  const progress = await Progress.findOne({
    student: userId,
    course: courseId
  });

  if (!progress) {
    throw new AppError('Progress not found', 404);
  }

  // Check if content exists in course
  const course = await Course.findById(courseId);
  if (!course || !course.content.some(c => c.id === contentId)) {
    throw new AppError('Content not found in course', 404);
  }

  // Add content to completed list if not already there
  if (!progress.completedContent.some(c => c.contentId === contentId)) {
    progress.completedContent.push({
      contentId,
      completedAt: new Date()
    });
  }

  // Calculate and update progress
  progress.calculateProgress();
  await progress.save();

  res.status(200).json({
    message: 'Content marked as completed',
    progressPercentage: progress.progressPercentage
  });
});

// Add note to content
const addNote = catchAsync(async (req, res) => {
  const { courseId, contentId } = req.params;
  const userId = req.user.id;
  const { note } = req.body;

  const progress = await Progress.findOne({
    student: userId,
    course: courseId
  });

  if (!progress) {
    throw new AppError('Progress not found', 404);
  }

  // Check if content exists in course
  const course = await Course.findById(courseId);
  if (!course || !course.content.some(c => c.id === contentId)) {
    throw new AppError('Content not found in course', 404);
  }

  // Add or update note for content
  const contentProgress = progress.completedContent.find(
    c => c.contentId === contentId
  );

  if (contentProgress) {
    contentProgress.note = note;
  } else {
    progress.completedContent.push({
      contentId,
      completedAt: new Date(),
      note
    });
  }

  await progress.save();

  res.status(200).json({
    message: 'Note added successfully',
    note
  });
});

// Get all notes for a course
const getCourseNotes = catchAsync(async (req, res) => {
  const { courseId } = req.params;
  const userId = req.user.id;

  const progress = await Progress.findOne({
    student: userId,
    course: courseId
  });

  if (!progress) {
    throw new AppError('Progress not found', 404);
  }

  const notes = progress.completedContent
    .filter(c => c.note)
    .map(c => ({
      contentId: c.contentId,
      note: c.note,
      completedAt: c.completedAt
    }));

  res.status(200).json(notes);
});

module.exports = {
  getCourseProgress,
  markContentComplete,
  addNote,
  getCourseNotes
};
