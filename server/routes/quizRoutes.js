import express from 'express';
import { quizController } from '../controllers/quizController.js';

const router = express.Router();

// Quiz submission route
router.post('/:lessonId/submit', quizController.submitQuiz);

export default router;
