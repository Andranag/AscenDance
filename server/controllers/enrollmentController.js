import Enrollment from '../models/Enrollment.js';
import Course from '../models/Course.js';

const enrollInCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.user.id;

    // Check if already enrolled
    const existingEnrollment = await Enrollment.findOne({
      user: userId,
      course: courseId,
      status: { $in: ['active', 'completed'] }
    });

    if (existingEnrollment) {
      return res.status(400).json({ message: 'Already enrolled in this course' });
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Create enrollment
    const enrollment = new Enrollment({
      user: userId,
      course: courseId,
      status: 'active',
      expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) // 1 year access
    });

    await enrollment.save();

    res.json(enrollment);
  } catch (error) {
    console.error('Error enrolling in course:', error);
    res.status(500).json({ message: 'Error enrolling in course' });
  }
};

const getUserEnrollments = async (req, res) => {
  try {
    const userId = req.user.id;
    const enrollments = await Enrollment.find({ user: userId })
      .populate('course')
      .sort({ createdAt: -1 });
    res.json(enrollments);
  } catch (error) {
    console.error('Error getting user enrollments:', error);
    res.status(500).json({ message: 'Error getting user enrollments' });
  }
};

const updateEnrollmentStatus = async (req, res) => {
  try {
    const { enrollmentId } = req.params;
    const { status } = req.body;

    const enrollment = await Enrollment.findById(enrollmentId);
    if (!enrollment) {
      return res.status(404).json({ message: 'Enrollment not found' });
    }

    enrollment.status = status;
    await enrollment.save();

    res.json(enrollment);
  } catch (error) {
    console.error('Error updating enrollment status:', error);
    res.status(500).json({ message: 'Error updating enrollment status' });
  }
};

export {
  enrollInCourse,
  getUserEnrollments,
  updateEnrollmentStatus
};