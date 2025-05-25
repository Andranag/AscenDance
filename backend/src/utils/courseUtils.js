const Course = require('../models/Course');

// Common error response format
const createErrorResponse = (status, error, message) => ({
  error,
  message
});

// Common success response format
const createSuccessResponse = (data, message) => ({
  success: true,
  data,
  message
});

// Common logging function
const logError = (context, error, ...details) => {
  console.error(`${context} error:`, {
    error,
    ...details.reduce((acc, detail) => ({ ...acc, ...detail }), {})
  });
};

// Common validation functions
const validateParams = (req, res, params) => {
  const missing = params.filter(param => !req.params[param]);
  if (missing.length > 0) {
    return res.status(400).json(createErrorResponse(
      400,
      'Missing required parameters',
      `Missing parameters: ${missing.join(', ')}`
    ));
  }
  return null;
};

const validateUser = (req, res) => {
  if (!req.user || !req.user._id) {
    return res.status(401).json(createErrorResponse(
      401,
      'Unauthorized',
      'User authentication required'
    ));
  }
  return null;
};

const validateLessonIndex = (req, res, course) => {
  const lessonIndex = parseInt(req.params.lessonIndex);
  if (isNaN(lessonIndex) || lessonIndex < 0) {
    return res.status(400).json(createErrorResponse(
      400,
      'Invalid lesson index',
      'Lesson index must be a non-negative number'
    ));
  }
  if (lessonIndex >= course.lessons.length) {
    return res.status(400).json(createErrorResponse(
      400,
      'Lesson not found',
      'The specified lesson index is out of range'
    ));
  }
  return null;
};

const getCourseAndLesson = async (req, res) => {
  const course = await Course.findById(req.params.id);
  if (!course) {
    return res.status(404).json(createErrorResponse(
      404,
      'Course not found',
      'The specified course does not exist'
    ));
  }

  const lessonIndex = parseInt(req.params.lessonIndex);
  const lesson = course.lessons[lessonIndex];
  if (!lesson) {
    return res.status(404).json(createErrorResponse(
      404,
      'Lesson not found',
      'The specified lesson does not exist'
    ));
  }

  return { course, lesson, lessonIndex };
};

const getUserProgress = (course, userId) => {
  const userProgress = course.progress.find(p => p.userId.toString() === userId);
  if (!userProgress) {
    course.progress.push({
      userId,
      completedLessons: []
    });
    return course.progress[course.progress.length - 1];
  }
  return userProgress;
};

module.exports = {
  createErrorResponse,
  createSuccessResponse,
  logError,
  validateParams,
  validateUser,
  validateLessonIndex,
  getCourseAndLesson,
  getUserProgress
};
