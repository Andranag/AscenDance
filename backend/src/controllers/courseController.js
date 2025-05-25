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

const markLessonComplete = async (req, res) => {
  try {
    const { courseId, lessonId } = req.params;
    const userId = req.user._id;
    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    const progress = course.progress.find(p => p.userId.equals(userId));
    if (progress) {
      progress.completedLessons.push({ lessonId });
    } else {
      course.progress.push({
        userId,
        completedLessons: [{ lessonId }]
      });
    }

    await course.save();
    res.json(course);
  } catch (error) {
    res.status(500).json({ error: 'Failed to mark lesson complete' });
  }
};

module.exports = {
  getAllCourses,
  getCourseById,
  markLessonComplete
};
