  import express from 'express';
import { courseController } from '../controllers/courseController.js';
import { auth, adminAuth } from '../middleware/auth.js';

const router = express.Router();

router.get('/', courseController.getAll);
router.get('/featured', courseController.getFeaturedCourses);
router.get('/:id', courseController.getById);
router.post('/', [auth, adminAuth], courseController.create);
router.put('/:id', [auth, adminAuth], courseController.update);
router.delete('/:id', [auth, adminAuth], courseController.delete);

export const courseRoutes = router;