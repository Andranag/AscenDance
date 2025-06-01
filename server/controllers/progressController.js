import { CourseProgress } from '../models/index.js';
import { generateCertificateId, createCertificatePDF } from '../utils/certificateUtils.js';
import { NotFoundError, successResponse, errorResponse } from '../utils/errorUtils.js';
import { logger } from '../utils/logger.js';

const updateLessonProgress = async (req, res) => {
  try {
    const { userId, courseId, lessonId } = req.params;
    const { completed } = req.body;

    let progress = await CourseProgress.findOne({ user: userId, course: courseId });

    if (!progress) {
      progress = new CourseProgress({
        user: userId,
        course: courseId,
        completedLessons: []
      });
    }

    if (completed) {
      if (!progress.completedLessons.some(lesson => lesson.lesson.equals(lessonId))) {
        progress.completedLessons.push({ lesson: lessonId });
      }
    } else {
      progress.completedLessons = progress.completedLessons.filter(
        lesson => !lesson.lesson.equals(lessonId)
      );
    }

    progress.lastAccessedAt = new Date();

    // Check if course is completed
    if (progress.completedLessons.length === progress.course.lessons.length && !progress.completedAt) {
      progress.completedAt = new Date();
      await issueCertificate(userId, courseId);
    }

    await progress.save();
    return successResponse(res, progress);
  } catch (error) {
    logger.error('Error updating lesson progress', error); // Log error
    return errorResponse(res, error);
  }
};

const getProgress = async (req, res) => {
  try {
    const { userId, courseId } = req.params;
    const progress = await CourseProgress.findOne({ user: userId, course: courseId })
      .populate('course', 'title lessons')
      .populate('completedLessons.lesson', 'title');

    if (!progress) {
      throw new NotFoundError('Progress not found');
    }

    return successResponse(res, {
      progress: progress.getProgressPercentage(),
      completedLessons: progress.completedLessons,
      startedAt: progress.startedAt,
      lastAccessedAt: progress.lastAccessedAt,
      completedAt: progress.completedAt,
      certificate: progress.certificate
    });
  } catch (error) {
    logger.error('Error getting progress', error); // Log error
    return errorResponse(res, error);
  }
};

const issueCertificate = async (userId, courseId) => {
  try {
    const progress = await CourseProgress.findOne({ user: userId, course: courseId });
    
    if (!progress || progress.completedLessons.length !== progress.course.lessons.length || progress.certificate.issued) {
      return null;
    }

    const certificateId = generateCertificateId();
    const certificatePDF = await createCertificatePDF(userId, courseId, certificateId);

    progress.certificate = {
      issued: true,
      issuedAt: new Date(),
      certificateId
    };

    await progress.save();
    return certificateId;
  } catch (error) {
    logger.error('Error issuing certificate', error); // Log error
    return errorResponse(res, error);
  }
};

const getCertificate = async (req, res) => {
  try {
    const { userId, courseId } = req.params;
    const progress = await CourseProgress.findOne({ user: userId, course: courseId });

    if (!progress || !progress.certificate.issued) {
      throw new NotFoundError('Certificate not found');
    }

    logger.info('Certificate requested', {
      userId,
      courseId,
      certificateId: progress.certificate.certificateId
    });

    const certificatePDF = await createCertificatePDF(userId, courseId, progress.certificate.certificateId);
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=certificate-${progress.certificate.certificateId}.pdf`);
    res.send(certificatePDF);
  } catch (error) {
    logger.error('Error getting certificate', error); // Log error
    return errorResponse(res, error);
  }
};

export {
  updateLessonProgress,
  getProgress,
  issueCertificate,
  getCertificate
};