import express from 'express';
import {
  createLesson,
  getLesson,
  updateLesson,
  deleteLesson,
  submitQuiz
} from '../controllers/lessonController.js';
import { auth, adminAuth } from '../middleware/auth.js';

const router = express.Router();

router.post('/', [auth, adminAuth], createLesson);
router.get('/:id', auth, getLesson);
router.put('/:id', [auth, adminAuth], updateLesson);
router.delete('/:id', [auth, adminAuth], deleteLesson);
router.post('/:lessonId/quiz', auth, submitQuiz);

export default router;