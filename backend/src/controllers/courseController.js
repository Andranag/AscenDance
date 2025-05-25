const Course = require('../models/Course');

const getAllCourses = async (req, res) => {
  res.json(await Course.find({}));
};

const getCourseById = async (req, res) => {
  const course = await Course.findById(req.params.id);
  if (!course) {
    return res.json({ message: 'Course not found' });
  }
  res.json(course);
};

const markLessonComplete = async (req, res) => {
  const { courseId, lessonId } = req.params;
  const userId = req.user._id;
  const course = await Course.findById(courseId);

  if (!course) {
    return res.json({ message: 'Course not found' });
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
};

module.exports = {
  getAllCourses,
  getCourseById,
  markLessonComplete
};
