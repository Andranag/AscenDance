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
    console.log('Mark lesson complete request received:', {
      courseId: req.params.id,
      lessonIndex: req.params.lessonIndex,
      userId: req.user._id
    });

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
    const lesson = course.lessons[parseInt(lessonIndex)];
    if (!lesson) {
      console.error('Lesson not found:', {
        courseId: id,
        lessonIndex,
        lessonCount: course.lessons.length
      });
      return res.status(404).json({ error: 'Lesson not found' });
    }

    console.log('Found lesson:', {
      title: lesson.title,
      index: course.lessons.indexOf(lesson)
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
    res.json(course);
  } catch (error) {
    console.log(`[markLessonComplete] courseId=${id}, lessonId=${lessonIndex}, user=${userId}`);
    console.error('Error marking lesson complete:', error);
    res.status(500).json({ error: 'Failed to mark lesson complete' });
  }
};

module.exports = {
  getAllCourses,
  getCourseById,
  markLessonComplete
};
