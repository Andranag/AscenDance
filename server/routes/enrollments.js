import express from 'express';
import {
  enrollInCourse,
  getUserEnrollments,
  updateEnrollmentStatus
} from '../controllers/enrollmentController.js';
import { auth, adminAuth } from '../middleware/auth.js';

const router = express.Router();

router.post('/courses/:courseId', auth, enrollInCourse);
router.get('/user', auth, getUserEnrollments);
router.patch('/:enrollmentId', [auth, adminAuth], updateEnrollmentStatus);

export const enrollmentRoutes = router;