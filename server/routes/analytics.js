import express from 'express';
import { getOverview, getCourseStats, getUserStats } from '../controllers/analyticsController.js';
import { auth, adminAuth } from '../middleware/auth.js';

const router = express.Router();

router.get('/overview', [auth, adminAuth], getOverview);
router.get('/courses', [auth, adminAuth], getCourseStats);
router.get('/users', [auth, adminAuth], getUserStats);

export const analyticsRoutes = router;