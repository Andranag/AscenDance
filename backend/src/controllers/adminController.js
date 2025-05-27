const Course = require('../models/Course');
const { isAdmin } = require('../middleware/authMiddleware');

console.log('Loaded adminController.js ✅');

// Get all courses with detailed information
const getAllCoursesAdmin = async (req, res) => {
  try {
    const courses = await Course.find({});
    res.json(courses);
  } catch (error) {
    console.error('Error fetching courses:', error);
    res.status(500).json({ error: 'Failed to fetch courses' });
  }
};

// Create a new course
const createCourse = async (req, res) => {
  try {
    const { title, description, image, category, level, duration, lessons } = req.body;

    const course = new Course({
      title,
      description,
      image,
      category,
      level,
      duration,
      lessons
    });

    const savedCourse = await course.save();
    res.status(201).json(savedCourse);
  } catch (error) {
    console.error('Error creating course:', error);
    res.status(500).json({ error: 'Failed to create course' });
  }
};


// Update a course
const updateCourse = async (req, res) => {
  try {
    const { title, description, image, category, level, duration, lessons } = req.body;
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    course.title = title || course.title;
    course.description = description || course.description;
    course.image = image || course.image;
    course.category = category || course.category;
    course.level = level || course.level;
    course.duration = duration || course.duration;
    course.lessons = lessons || course. s;

    const updatedCourse = await course.save();
    res.json(updatedCourse);
  } catch (error) {
    console.error('Error updating course:', error);
    res.status(500).json({ error: 'Failed to update course' });
  }
};


// Delete a course and its related data
const deleteCourse = async (req, res) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);
    if (!course) return res.status(404).json({ error: 'Course not found' });

    res.json({ message: 'Course deleted successfully' });
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({
      error: {
        message: error.message || 'Failed to delete course',
        courseId: req.params.id
      }
    });
  }
};

module.exports = {
  getAllCoursesAdmin,
  createCourse,
  updateCourse,
  deleteCourse
};
