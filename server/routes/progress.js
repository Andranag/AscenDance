import express from 'express';
import { updateLessonProgress, getProgress, getCertificate } from '../controllers/progressController.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

router.post('/:userId/courses/:courseId/lessons/:lessonId', auth, updateLessonProgress);
router.get('/:userId/courses/:courseId', auth, getProgress);
router.get('/:userId/courses/:courseId/certificate', auth, getCertificate);

export default router;