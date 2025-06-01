import express from 'express';
import { AnalyticsController } from '../controllers/analyticsController.js';
import { auth, adminAuth } from '../middleware/auth.js';

const router = express.Router();

router.get('/overview', [auth, adminAuth], AnalyticsController.getOverview);
router.get('/courses', [auth, adminAuth], AnalyticsController.getCourseStats);
router.get('/users', [auth, adminAuth], AnalyticsController.getUserStats);

export const analyticsRoutes = router;