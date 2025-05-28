const Course = require('../models/Course');
const { 
  createErrorResponse, 
  createSuccessResponse, 
  logError, 
  validateParams, 
  validateUser, 
  validateLessonIndex, 
  getCourseAndLesson, 
  getUserProgress 
} = require('../utils/courseUtils');

exports.getAllCourses = async (req, res) => {
  try {
    console.log('Attempting to find courses');
    const courses = await Course.find({});
    console.log('Found courses:', courses, 'Type:', typeof courses, 'Array:', Array.isArray(courses));
    
    // Ensure we have an array
    if (!Array.isArray(courses)) {
      console.error('Courses is not an array:', courses);
      return res.status(500).json({
        error: 'invalid_data_format',
        message: 'Invalid data format from database'
      });
    }
    
    // Ensure each course has required properties
    const validCourses = courses.filter(course => 
      course && course.title && course.description
    );
  } catch (error) {
    logError('Get all courses', error);
    res.status(500).json(createErrorResponse(
      500,
      'Failed to fetch courses',
      'An unexpected error occurred while fetching courses'
    ));
  }
};

exports.getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json(createErrorResponse(
        404,
        'Course not found',
        'The specified course does not exist'
      ));
    }
    res.json(course);
  } catch (error) {
    logError('Get course by ID', error, { courseId: req.params.id });
    res.status(500).json(createErrorResponse(
      500,
      'Failed to fetch course',
      'An unexpected error occurred while fetching the course'
    ));
  }
};

exports.unmarkLesson = async (req, res) => {
  try {
    // Validate parameters
    const paramsError = validateParams(req, res, ['id', 'lessonIndex']);
    if (paramsError) return paramsError;

    // Validate user
    const userError = validateUser(req, res);
    if (userError) return userError;

    // Get course and lesson
    const courseData = await getCourseAndLesson(req, res);
    if (!courseData) return;

    const { course, lesson, lessonIndex } = courseData;
    const userId = req.user._id.toString();
    const lessonId = lesson._id.toString();

    // Get user progress
    const userProgress = getUserProgress(course, userId);
    if (!userProgress) {
      return res.status(400).json(createErrorResponse(
        400,
        'No progress to unmark',
        'User has no progress in this course'
      ));
    }

    // Check if lesson is marked as complete
    const markedLesson = userProgress.completedLessons.find(cl => cl.lessonId.toString() === lessonId);
    if (!markedLesson) {
      return res.status(400).json(createErrorResponse(
        400,
        'Lesson not marked as complete',
        'This lesson is not marked as complete'
      ));
    }

    // Remove the lesson from completedLessons
    userProgress.completedLessons = userProgress.completedLessons.filter(
      cl => cl.lessonId.toString() !== lessonId
    );
    
    await course.save();
    logError('Unmark lesson', null, {
      courseId: course._id,
      lessonId,
      userId,
      remainingLessons: userProgress.completedLessons.length
    });
    
<<<<<<< HEAD
    res.json(createSuccessResponse(
      course,
      'Successfully unmarked lesson'
    ));
=======
    // Return the course object directly
    res.json(course);
>>>>>>> temp-progress
  } catch (error) {
    logError('Unmark lesson', error, {
      courseId: req.params.id,
      lessonIndex: req.params.lessonIndex,
      userId: req.user._id
    });
    res.status(500).json(createErrorResponse(
      500,
      'Failed to unmark lesson',
      'An unexpected error occurred while unmarking the lesson'
    ));
  }
};

exports.markLessonComplete = async (req, res) => {
  try {
    // Validate parameters
    const paramsError = validateParams(req, res, ['id', 'lessonIndex']);
    if (paramsError) return paramsError;

    // Validate user
    const userError = validateUser(req, res);
    if (userError) return userError;

    // Get course and lesson
    const courseData = await getCourseAndLesson(req, res);
    if (!courseData) return;

    const { course, lesson, lessonIndex } = courseData;
    const userId = req.user._id.toString();
    const lessonId = lesson._id.toString();

    // Get user progress
    const userProgress = getUserProgress(course, userId);

    // Check if lesson is already marked as complete
    const existing = userProgress.completedLessons.find(cl => cl.lessonId.toString() === lessonId);
    if (existing) {
      return res.status(400).json(createErrorResponse(
        400,
        'Lesson already marked',
        'This lesson is already marked as complete'
      ));
    }

    // Mark lesson as complete
    userProgress.completedLessons.push({ lessonId });

    await course.save();
    logError('Mark lesson complete', null, {
      courseId: course._id,
      lessonIndex,
      lessonId,
      userId,
      totalLessons: course.lessons.length,
      completedLessons: userProgress.completedLessons.length
    });

    res.json(createSuccessResponse(
      course,
      'Successfully marked lesson as complete'
    ));
  } catch (error) {
    logError('Mark lesson complete', error, {
      courseId: req.params.id,
      lessonIndex: req.params.lessonIndex,
      userId: req.user._id
    });
<<<<<<< HEAD
    res.status(500).json(createErrorResponse(
      500,
      'Failed to mark lesson complete',
      'An unexpected error occurred while marking the lesson as complete'
    ));
=======

    const { id, lessonIndex } = req.params;
    const userId = req.user._id;
    const course = await Course.findById(id);

    if (!course) {
      console.error('Course not found:', { courseId: id });
      return res.status(404).json({ error: 'Course not found' });
    }

    console.log('Found course:', {
      title: course.title,
      lessonCount: course.lessons.length
    });

    // Find the lesson by its numeric index
    const lessonIndexNum = parseInt(lessonIndex);
    if (isNaN(lessonIndexNum) || lessonIndexNum < 0 || lessonIndexNum >= course.lessons.length) {
      console.error('Invalid lesson index:', {
        courseId: id,
        lessonIndex,
        lessonCount: course.lessons.length
      });
      return res.status(400).json({ error: 'Invalid lesson index' });
    }

    const lesson = course.lessons[lessonIndexNum];
    console.log('Found lesson:', {
      title: lesson.title,
      index: lessonIndexNum
    });

    const progress = course.progress.find(p => p.userId.equals(userId));
    if (progress) {
      progress.completedLessons.push({ lessonId: lesson._id });
    } else {
      course.progress.push({
        userId,
        completedLessons: [{ lessonId: lesson._id }]
      });
    }

    await course.save();
    console.log('Successfully marked lesson as complete:', {
      courseId: id,
      lessonId: lesson._id,
      userId
    });
    
    // Return the course object directly
    res.json(course);
  } catch (error) {
    console.error('Error marking lesson complete:', {
      error,
      courseId: req.params.id,
      lessonIndex: req.params.lessonIndex,
      userId: req.user._id
    });
    res.status(500).json({ error: 'Failed to mark lesson complete' });
>>>>>>> temp-progress
  }
};

module.exports = {
  getAllCourses,
  getCourseById,
  markLessonComplete,
  unmarkLesson
};
