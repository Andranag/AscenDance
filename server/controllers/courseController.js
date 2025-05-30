import Course from '../models/Course.js';

const getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find();
    res.status(200).json({
      success: true,
      data: courses
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }
    
    // Ensure we have all required fields
    if (!course.title || !course.description || !course.level || !course.style) {
      return res.status(400).json({
        success: false,
        message: 'Course is missing required fields'
      });
    }
    
    res.status(200).json({
      success: true,
      data: course
    });
  } catch (error) {
    console.error('Error getting course:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Internal server error'
    });
  }
};

const createCourse = async (req, res) => {
  try {
    console.log('Received course data:', req.body);
    const course = new Course(req.body);
    console.log('Created course object:', course);
    await course.save();
    res.status(201).json(course);
  } catch (error) {
    console.error('Course creation error:', error);
    res.status(500).json({ message: error.message });
  }
};

const updateCourse = async (req, res) => {
  try {
    // Validate required fields
    const requiredFields = ['title', 'description', 'level', 'style'];
    const missingFields = requiredFields.filter(field => !req.body[field]);
    
    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Missing required fields: ${missingFields.join(', ')}`
      });
    }

    const course = await Course.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    res.status(200).json({
      success: true,
      data: course
    });
  } catch (error) {
    console.error('Error updating course:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Internal server error'
    });
  }
};

const deleteCourse = async (req, res) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }
    res.status(200).json({
      success: true,
      message: 'Course deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const getFeaturedCourses = async (req, res) => {
  try {
    // Get 4 random courses
    const featuredCourses = await Course.aggregate([
      { $sample: { size: 3 } }, // Changed from 4 to 3 courses for a cleaner display
      {
        $project: {
          title: 1,
          description: 1,
          style: 1,
          level: 1,
          instructor: 1,
          price: 1,
          duration: 1,
          rating: 1,
          enrolled: 1,
          image: 1
        }
      }
    ]);

    res.status(200).json({
      success: true,
      data: featuredCourses
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export {
  getAllCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
  getFeaturedCourses
};