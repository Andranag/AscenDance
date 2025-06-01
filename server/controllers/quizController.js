import express from 'express';
import { validateQuizSubmission } from '../utils/quizUtils.js';
import { logger } from '../utils/logger.js';
import { NotFoundError, successResponse, errorResponse } from '../utils/errorUtils.js';
import Lesson from '../models/Lesson.js';
import LessonProgress from '../models/LessonProgress.js';

const router = express.Router();

router.post('/:lessonId/submit', async (req, res) => {
  try {
    const { lessonId } = req.params;
    const { answers } = req.body;

    // Get the quiz from the database
    const lesson = await Lesson.findById(lessonId);
    if (!lesson || !lesson.quiz) {
      throw new NotFoundError('Quiz not found');
    }

    // Validate and submit quiz
    const result = await validateQuizSubmission({ answers }, lesson.quiz, req.io, `lesson-${lessonId}`);

    // Save result to database
    await LessonProgress.updateOne(
      { user: req.user.id, lesson: lessonId },
      { $set: { quizScore: result.score, quizPassed: result.passed } }
    );

    logger.info('Quiz submitted successfully', { lessonId, userId: req.user.id, score: result.score });
    return successResponse(res, result, 'Quiz submitted successfully');
  } catch (error) {
    logger.error('Error submitting quiz', error);
    return errorResponse(res, error);
  }
});

export default router;
