import CourseProgress from '../models/CourseProgress.js';
import Certificate from '../models/Certificate.js';
import { generateCertificateId, createCertificatePDF } from '../utils/certificateUtils.js';

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
    if (progress.isCompleted() && !progress.completedAt) {
      progress.completedAt = new Date();
      await issueCertificate(userId, courseId);
    }

    await progress.save();
    res.json(progress);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getProgress = async (req, res) => {
  try {
    const { userId, courseId } = req.params;
    const progress = await CourseProgress.findOne({ user: userId, course: courseId })
      .populate('course', 'title lessons')
      .populate('completedLessons.lesson', 'title');

    if (!progress) {
      return res.status(404).json({ message: 'Progress not found' });
    }

    res.json({
      progress: progress.getProgressPercentage(),
      completedLessons: progress.completedLessons,
      startedAt: progress.startedAt,
      lastAccessedAt: progress.lastAccessedAt,
      completedAt: progress.completedAt,
      certificate: progress.certificate
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const issueCertificate = async (userId, courseId) => {
  try {
    const progress = await CourseProgress.findOne({ user: userId, course: courseId });
    
    if (!progress || !progress.isCompleted() || progress.certificate.issued) {
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
    console.error('Error issuing certificate:', error);
    return null;
  }
};

const getCertificate = async (req, res) => {
  try {
    const { userId, courseId } = req.params;
    const progress = await CourseProgress.findOne({ user: userId, course: courseId });

    if (!progress || !progress.certificate.issued) {
      return res.status(404).json({ message: 'Certificate not found' });
    }

    const certificatePDF = await createCertificatePDF(userId, courseId, progress.certificate.certificateId);
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=certificate-${progress.certificate.certificateId}.pdf`);
    res.send(certificatePDF);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export {
  updateLessonProgress,
  getProgress,
  issueCertificate,
  getCertificate
};