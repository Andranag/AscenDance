const Course = require('../models/Course');
const User = require('../models/User');
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

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
};

const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Prevent admin from downgrading themselves
    if (user._id.toString() === req.user.id && role !== 'admin') {
      return res.status(400).json({ error: 'Cannot change your own role' });
    }

    user.role = role;
    await user.save();

    res.json(user);
  } catch (error) {
    console.error('Error updating user role:', error);
    res.status(500).json({ error: 'Failed to update user role' });
  }
};

const deleteUser = async (req, res) => {
  try {
    console.log('=== DELETE USER REQUEST ===');
    console.log('Request params:', req.params);
    console.log('Request user:', req.user);
    console.log('Request headers:', req.headers);
    
    // Get user ID from params
    const userId = req.params.id;
    
    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      console.log('User not found');
      return res.status(404).json({ error: 'User not found' });
    }

    // Prevent admin from deleting themselves
    if (user._id.toString() === req.user._id.toString()) {
      console.log('Attempt to delete admin user');
      return res.status(400).json({ error: 'Cannot delete yourself' });
    }

    console.log('Deleting user:', user.email);
    console.log('Attempting to delete user with ID:', userId);
    
    // Use deleteOne directly with conditions
    const result = await User.deleteOne({ _id: userId });
    console.log('Deletion result:', result);
    
    if (result.deletedCount === 0) {
      console.log('No user found with ID:', userId);
      return res.status(404).json({ error: 'User not found' });
    }

    console.log('User deleted successfully');
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('=== DELETE USER ERROR ===');
    console.error('Error details:', {
      error: error,
      message: error.message,
      stack: error.stack,
      req: {
        params: req.params,
        user: req.user,
        headers: req.headers
      }
    });
    console.error('Error deleting user:', error);
    res.status(500).json({ 
      error: 'Failed to delete user',
      details: error.message 
    });
  }
};

module.exports = {
  getAllCoursesAdmin,
  createCourse,
  updateCourse,
  deleteCourse,
  getAllUsers,
  updateUserRole,
  deleteUser
};
