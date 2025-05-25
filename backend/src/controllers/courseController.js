const Course = require('../models/Course');
console.log('Course controller loaded:', Course);

const getAllCourses = async (req, res) => {
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
    
    if (validCourses.length !== courses.length) {
      console.error('Some courses are missing required fields:', courses);
      return res.status(500).json({
        error: 'missing_fields',
        message: 'Some courses are missing required fields'
      });
    }
    
    res.json(validCourses);
  } catch (error) {
    console.error('Error fetching courses:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch courses'
    });
  }
};

const getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }
    res.json(course);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch course' });
  }
};

const unmarkLesson = async (req, res) => {
  try {
    // Extract and validate parameters
    const { id: courseId, lessonIndex: lessonIndexStr } = req.params;
    if (!courseId || !lessonIndexStr) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }

    // Validate user authentication
    if (!req.user || !req.user._id) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Convert lesson index
    const lessonIndex = parseInt(lessonIndexStr);
    if (isNaN(lessonIndex) || lessonIndex < 0) {
      return res.status(400).json({ error: 'Invalid lesson index' });
    }

    // Get user ID as string
    const userId = req.user._id.toString();

    // Log request
    console.log('Unmark lesson request received:', {
      courseId,
      lessonIndex,
      userId
    });

    // Fetch and validate course
    const course = await Course.findById(courseId);
    if (!course) {
      console.error('Course not found:', { courseId });
      return res.status(404).json({ 
        error: 'Course not found',
        message: 'The specified course does not exist'
      });
    }

    // Validate lesson index against course
    if (lessonIndex >= course.lessons.length) {
      return res.status(400).json({ 
        error: 'Lesson not found',
        message: 'The specified lesson index is out of range'
      });
    }

    // Get and validate lesson
    const lesson = course.lessons[lessonIndex];
    if (!lesson) {
      console.error('Lesson not found:', {
        courseId,
        lessonIndex,
        lessonCount: course.lessons.length
      });
      return res.status(404).json({ 
        error: 'Lesson not found',
        message: 'The specified lesson does not exist'
      });
    }


    // Find or create user progress
    const userProgress = course.progress.find(p => p.userId.toString() === userId);
    if (!userProgress) {
      // Create new progress entry if it doesn't exist
      course.progress.push({
        userId,
        completedLessons: []
      });
      await course.save();
      return res.status(400).json({ 
        error: 'No progress to unmark',
        message: 'You have not marked any lessons in this course'
      });
    }

    // Convert lesson ID to string
    const lessonId = lesson._id.toString();
    
    // Check if lesson is marked as complete
    const completedLesson = userProgress.completedLessons.find(cl => cl.lessonId.toString() === lessonId);
    if (!completedLesson) {
      return res.status(400).json({ 
        error: 'Lesson not marked',
        message: 'This lesson is not marked as complete'
      });
    }

    // Remove the lesson from completedLessons
    userProgress.completedLessons = userProgress.completedLessons.filter(cl => cl.lessonId.toString() !== lessonId);
    
    await course.save();
    console.log('Successfully unmarked lesson:', {
      courseId,
      lessonId,
      userId,
      remainingLessons: userProgress.completedLessons.length
    });
    
    res.json({
      success: true,
      data: course,
      message: 'Successfully unmarked lesson'
    });
  } catch (error) {
    console.error('Error unmarking lesson:', {
      error,
      courseId: req.params.id,
      lessonIndex: req.params.lessonIndex,
      userId: req.user._id
    });
    res.status(500).json({ 
      error: 'Failed to unmark lesson',
      message: 'An unexpected error occurred while unmarking the lesson'
    });
  }

const markLessonComplete = async (req, res) => {
  try {
    // Extract and validate parameters
    const { id: courseId, lessonIndex: lessonIndexStr } = req.params;
    if (!courseId || !lessonIndexStr) {
      return res.status(400).json({ 
        error: 'Missing required parameters',
        message: 'Course ID and lesson index are required'
      });
    }

    // Validate user authentication
    if (!req.user || !req.user._id) {
      return res.status(401).json({ 
        error: 'Unauthorized',
        message: 'User authentication required'
      });
    }

    // Convert lesson index
    const lessonIndex = parseInt(lessonIndexStr);
    if (isNaN(lessonIndex) || lessonIndex < 0) {
      return res.status(400).json({ 
        error: 'Invalid lesson index',
        message: 'Lesson index must be a non-negative number'
      });
    }

    // Get user ID as string
    const userId = req.user._id.toString();

    // Log request
    console.log('Mark lesson complete request received:', {
      courseId,
      lessonIndex,
      userId
    });

    // Fetch and validate course
    const course = await Course.findById(courseId);
    if (!course) {
      console.error('Course not found:', { courseId });
      return res.status(404).json({ 
        error: 'Course not found',
        message: 'The specified course does not exist'
      });
    }

    // Validate lesson index against course
    if (lessonIndex >= course.lessons.length) {
      return res.status(400).json({ 
        error: 'Lesson not found',
        message: 'The specified lesson index is out of range'
      });
    }

    // Get and validate lesson
    const lesson = course.lessons[lessonIndex];
    if (!lesson) {
      console.error('Lesson not found:', {
        courseId,
        lessonIndex,
        lessonCount: course.lessons.length
      });
      return res.status(404).json({ 
        error: 'Lesson not found',
        message: 'The specified lesson does not exist'
      });
    }

    // Convert lesson ID to string
    const lessonId = lesson._id.toString();

    // Find user progress
    const userProgress = course.progress.find(p => p.userId.toString() === userId);
    if (!userProgress) {
      // Create new progress entry
      course.progress.push({
        userId,
        completedLessons: [{ lessonId }]
      });
    } else {
      // Check if lesson is already marked as complete
      const existing = userProgress.completedLessons.find(cl => cl.lessonId.toString() === lessonId);
      if (existing) {
        return res.status(400).json({ 
          error: 'Lesson already marked',
          message: 'This lesson is already marked as complete'
        });
      }
      userProgress.completedLessons.push({ lessonId });
    }

    await course.save();
    console.log('Successfully marked lesson as complete:', {
      courseId,
      lessonIndex,
      lessonId,
      userId,
      totalLessons: course.lessons.length,
      completedLessons: userProgress.completedLessons.length
    });

    res.json({
      success: true,
      data: course,
      message: 'Successfully marked lesson as complete'
    });
  } catch (error) {
    console.error('Error marking lesson complete:', {
      error,
      courseId,
      lessonIndex,
      userId
    });
    res.status(500).json({ 
      error: 'Failed to mark lesson complete',
      message: 'An error occurred while marking the lesson as complete'
    });
  }
}
};

module.exports = {
  getAllCourses,
  getCourseById,
  markLessonComplete,
  unmarkLesson
};
