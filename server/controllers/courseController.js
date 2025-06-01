import Course from '../models/Course.js';
import { 
  ValidationError, 
  NotFoundError,
  successResponse,
  errorResponse
} from '../utils/errorUtils.js';
import { COURSE_LEVELS, COURSE_STYLES } from '../utils/constants.js';
import { logger } from '../utils/logger.js';

const getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find();
    return successResponse(res, courses, 'Courses retrieved successfully');
  } catch (error) {
    logger.error('Error fetching courses', error);
    return errorResponse(res, error);
  }
};

const getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      throw new NotFoundError('Course not found');
    }
    
    // Validate course data
    const requiredFields = ['title', 'description', 'level', 'style'];
    const missingFields = requiredFields.filter(field => !course[field]);
    
    if (missingFields.length > 0) {
      throw new ValidationError('Course is missing required fields', missingFields);
    }

    if (!Object.values(COURSE_LEVELS).includes(course.level)) {
      throw new ValidationError('Invalid course level');
    }

    if (!Object.values(COURSE_STYLES).includes(course.style)) {
      throw new ValidationError('Invalid course style');
    }
    
    return successResponse(res, course);
  } catch (error) {
    logger.error('Error getting course', error);
    return errorResponse(res, error);
  }
};

const createCourse = async (req, res) => {
  try {
    const courseData = req.body;

    // Validate course data
    if (!courseData.title || !courseData.description || !courseData.level || !courseData.style) {
      throw new ValidationError('Missing required fields', ['title', 'description', 'level', 'style']);
    }

    if (!Object.values(COURSE_LEVELS).includes(courseData.level)) {
      throw new ValidationError('Invalid course level');
    }

    if (!Object.values(COURSE_STYLES).includes(courseData.style)) {
      throw new ValidationError('Invalid course style');
    }

    const course = new Course(courseData);
    await course.save();
    
    logger.info('Course created successfully', { courseId: course._id });
    return successResponse(res, course, 'Course created successfully', 201);
  } catch (error) {
    logger.error('Course creation error', error);
    return errorResponse(res, error);
  }
};

const updateCourse = async (req, res) => {
  try {
    const courseId = req.params.id;
    const updates = req.body;

    // Validate required fields
    const requiredFields = ['title', 'description', 'level', 'style'];
    const missingFields = requiredFields.filter(field => !updates[field]);
    
    if (missingFields.length > 0) {
      throw new ValidationError('Missing required fields', missingFields);
    }

    // Validate level and style
    if (!Object.values(COURSE_LEVELS).includes(updates.level)) {
      throw new ValidationError('Invalid course level');
    }

    if (!Object.values(COURSE_STYLES).includes(updates.style)) {
      throw new ValidationError('Invalid course style');
    }

    const course = await Course.findByIdAndUpdate(
      courseId,
      updates,
      { new: true }
    );
    
    if (!course) {
      throw new NotFoundError('Course not found');
    }

    logger.info('Course updated successfully', { courseId });
    return successResponse(res, course, 'Course updated successfully');
  } catch (error) {
    logger.error('Error updating course', error);
    return errorResponse(res, error);
  }
};

const deleteCourse = async (req, res) => {
  try {
    const courseId = req.params.id;
    const course = await Course.findByIdAndDelete(courseId);
    
    if (!course) {
      throw new NotFoundError('Course not found');
    }

    logger.info('Course deleted successfully', { courseId });
    return successResponse(res, null, 'Course deleted successfully');
  } catch (error) {
    logger.error('Error deleting course', error);
    return errorResponse(res, error);
  }
};

const getFeaturedCourses = async (req, res) => {
  try {
    // Disable caching
    res.header('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.header('Pragma', 'no-cache');
    res.header('Expires', '0');

    // Get all courses
    const allCourses = await Course.find({});
    logger.info('Courses fetched for featured courses', { totalCourses: allCourses.length });
    
    // If we have less than 4 courses, duplicate them until we have 4
    let selectedCourses = allCourses;
    while (selectedCourses.length < 4) {
      selectedCourses = [...selectedCourses, ...selectedCourses];
    }
    
    // Randomly select 4 courses from the expanded list
    const shuffled = selectedCourses.sort(() => Math.random() - 0.5);
    const finalCourses = shuffled.slice(0, 4);
    
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

    logger.info('Featured courses generated successfully', { 
      totalFeatured: formattedCourses.length,
      firstCourseId: formattedCourses[0]?._id
    });

    return successResponse(res, formattedCourses, 'Featured courses retrieved successfully');
  } catch (error) {
    logger.error('Error fetching featured courses', error);
    return errorResponse(res, error);
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