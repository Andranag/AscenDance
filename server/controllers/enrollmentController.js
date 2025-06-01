import { Enrollment, Course } from '../models/index.js';
import { ValidationError, NotFoundError, successResponse, errorResponse } from '../utils/errorUtils.js';
import { logger } from '../utils/logger.js';
import { ENROLLMENT_STATUS } from '../utils/constants.js';

const enrollInCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.user.id;

    // Validate course exists
    const course = await Course.findById(courseId);
    if (!course) {
      throw new NotFoundError('Course not found');
    }

    // Check if already enrolled
    const existingEnrollment = await Enrollment.findOne({
      user: userId,
      course: courseId,
      status: { $in: ['active', 'completed'] }
    });

    if (existingEnrollment) {
      throw new ValidationError('Already enrolled in this course');
    }

    // Create enrollment
    const enrollment = new Enrollment({
      user: userId,
      course: courseId,
      status: 'active',
      expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) // 1 year access
    });

    await enrollment.save();

    logger.info('User enrolled successfully', { userId, courseId });
    return successResponse(res, enrollment);
  } catch (error) {
    logger.error('Error enrolling in course:', error);
    return errorResponse(res, error);
  }
};

const getUserEnrollments = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Get all enrollments for the user
    const enrollments = await Enrollment.find({ user: userId })
      .populate('course')
      .sort({ createdAt: -1 });

    logger.info('Enrollments retrieved successfully', { userId });
    return successResponse(res, enrollments);
  } catch (error) {
    logger.error('Error getting user enrollments:', error);
    return errorResponse(res, error);
  }
};

const updateEnrollmentStatus = async (req, res) => {
  try {
    const { enrollmentId } = req.params;
    const { status } = req.body;

    // Validate status
    if (!Object.values(ENROLLMENT_STATUS).includes(status)) {
      throw new ValidationError('Invalid enrollment status');
    }

    // Find enrollment
    const enrollment = await Enrollment.findById(enrollmentId);
    if (!enrollment) {
      throw new NotFoundError('Enrollment not found');
    }

    enrollment.status = status;
    await enrollment.save();

    logger.info('Enrollment status updated successfully', { enrollmentId, status });
    return successResponse(res, enrollment);
  } catch (error) {
    logger.error('Error updating enrollment status:', error);
    return errorResponse(res, error);
  }
};

export {
  enrollInCourse,
  getUserEnrollments,
  updateEnrollmentStatus
};