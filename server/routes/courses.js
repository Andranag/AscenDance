import express from 'express';
import {
  getAllCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
  getFeaturedCourses
} from '../controllers/courseController.js';
import { auth, adminAuth } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getAllCourses);
router.get('/featured', getFeaturedCourses);
router.get('/:id', getCourseById);
router.post('/', [auth, adminAuth], createCourse);
router.put('/:id', [auth, adminAuth], updateCourse);
router.delete('/:id', [auth, adminAuth], deleteCourse);

export const courseRoutes = router;