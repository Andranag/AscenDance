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
    // Disable caching
    res.header('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.header('Pragma', 'no-cache');
    res.header('Expires', '0');

    // Get all courses with detailed logging
    console.log('Starting course fetch...');
    const allCourses = await Course.find({});
    console.log('Found total courses:', allCourses.length);
    
    // If we have less than 4 courses, duplicate them until we have 4
    let selectedCourses = allCourses;
    while (selectedCourses.length < 4) {
      selectedCourses = [...selectedCourses, ...selectedCourses];
    }
    
    // Randomly select 4 courses from the expanded list
    const shuffled = selectedCourses.sort(() => Math.random() - 0.5);
    const finalCourses = shuffled.slice(0, 4);
    
    console.log('Final selected courses:', finalCourses.length);
    finalCourses.forEach((course, index) => {
      console.log(`Selected course ${index + 1}:`);
      console.log('  ID:', course._id);
      console.log('  Title:', course.title);
      console.log('  Style:', course.style);
      console.log('  Level:', course.level);
      console.log('---');
    });

    // Format the courses
    const formattedCourses = finalCourses.map(course => ({
      _id: course._id.toString(),
      title: course.title,
      description: course.description,
      style: course.style,
      level: course.level,
      instructor: course.instructor,
      price: course.price,
      duration: course.duration,
      rating: course.rating,
      enrolled: course.enrolled,
      image: course.image
    }));

    console.log('Final formatted courses:', formattedCourses.length);
    console.log('First formatted course:', formattedCourses[0]);

    res.status(200).json({
      success: true,
      data: formattedCourses
    });
  } catch (error) {
    console.error('Error fetching featured courses:', error);
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