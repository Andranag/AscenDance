const Course = require('../models/Course');
const { AppError, catchAsync } = require('../utils/errorHandler');
const logger = require('../utils/logger');

// Create a new course
const createCourse = catchAsync(async (req, res, next) => {
  const course = new Course(req.body);
  await course.save();
  res.status(201).json(course);
});

// Get all courses
const getAllCourses = catchAsync(async (req, res, next) => {
  const courses = await Course.find({});
  res.json(courses);
});

// Get a single course by ID
const getCourseById = catchAsync(async (req, res, next) => {
  const course = await Course.findById(req.params.id);
  if (!course) {
    return next(new AppError('Course not found', 404));
  }
  res.json(course);
});

// Update a course
const updateCourse = catchAsync(async (req, res, next) => {
  const course = await Course.findById(req.params.id);
  if (!course) {
    return next(new AppError('Course not found', 404));
  }

  // Update sessions if provided
  if (req.body.sessions) {
    course.sessions = req.body.sessions;
  }

  // Update other fields
  course.title = req.body.title || course.title;
  course.description = req.body.description || course.description;
  course.instructor = req.body.instructor || course.instructor;
  course.level = req.body.level || course.level;
  course.price = req.body.price || course.price;
  course.duration = req.body.duration || course.duration;
  course.startDate = req.body.startDate || course.startDate;
  course.recurringTime = req.body.recurringTime || course.recurringTime;
  course.maxSpots = req.body.maxSpots || course.maxSpots;

  await course.save();
  res.json(course);
});

// Delete a course
const deleteCourse = catchAsync(async (req, res, next) => {
  const course = await Course.findById(req.params.id);
  if (!course) {
    return next(new AppError('Course not found', 404));
  }
  await course.deleteOne();
  res.json({ message: 'Course deleted' });
});

// Enroll in a course
const enrollInCourse = catchAsync(async (req, res, next) => {
  const course = await Course.findById(req.params.id);
  if (!course) {
    return next(new AppError('Course not found', 404));
  }

  // Check if user is already enrolled
  if (course.enrolledStudents.includes(req.user.id)) {
    logger.warn('User already enrolled in course', { courseId: req.params.id, userId: req.user.id });
    return next(new AppError('Already enrolled in this course', 400));
  }

  if (course.enrolledStudents.length >= course.maxSpots) {
    logger.warn('Course enrollment failed - course is full', { courseId: req.params.id });
    return next(new AppError('Course is full', 400));
  }

  course.enrolledStudents.push(req.user.id);
  await course.save();

  res.json({ message: 'Successfully enrolled in course' });
});

// Get enrolled courses for a user
const getUserCourses = catchAsync(async (req, res, next) => {
  try {
    // Find courses where user is enrolled
    const courses = await Course.find({
      enrolledStudents: req.user._id
    }).populate('enrolledStudents', 'name email');

    res.status(200).json({
      success: true,
      courses
    });
  } catch (error) {
    logger.error('Error fetching user courses:', {
      error: error.message,
      userId: req.user._id
    });
    return next(new AppError('Failed to fetch user courses', 500));
  }
});

module.exports = {
  createCourse,
  getAllCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
  enrollInCourse,
  getUserCourses
};
