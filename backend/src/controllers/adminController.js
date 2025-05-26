const Course = require('../models/Course');
const { isAdmin } = require('../middleware/adminMiddleware');

// Get all courses with detailed information
const getAllCoursesAdmin = async (req, res) => {
  try {
    const courses = await Course.find({})
      .populate('progress.userId', 'name email')
      .populate('progress.completedLessons.lessonId', 'title');
    
    res.json(courses);
  } catch (error) {
    console.error('Error fetching courses:', error);
    res.status(500).json({ error: 'Failed to fetch courses' });
  }
};

// Create a new course
const createCourse = async (req, res) => {
  try {
    const { title, description, lessons } = req.body;
    
    const course = new Course({
      title,
      description,
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
    const { title, description, lessons } = req.body;
    const course = await Course.findById(req.params.id);
    
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }
    
    course.title = title || course.title;
    course.description = description || course.description;
    course.lessons = lessons || course.lessons;
    
    const updatedCourse = await course.save();
    res.json(updatedCourse);
  } catch (error) {
    console.error('Error updating course:', error);
    res.status(500).json({ error: 'Failed to update course' });
  }
};

// Delete a course
const deleteCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }
    
    await course.deleteOne();
    res.json({ message: 'Course deleted successfully' });
  } catch (error) {
    console.error('Error deleting course:', error);
    res.status(500).json({ error: 'Failed to delete course' });
  }
};

module.exports = {
  getAllCoursesAdmin,
  createCourse,
  updateCourse,
  deleteCourse
};
