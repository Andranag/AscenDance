import express from 'express';
import { validateQuizSubmission } from '../utils/quizUtils.js';
import { successResponse, errorResponse } from '../utils/responseUtils.js';
import { showSuccessToast, showErrorToast } from '../utils/toastUtils.js';

const router = express.Router();

router.post('/:lessonId/submit', async (req, res) => {
  try {
    const { lessonId } = req.params;
    const { answers } = req.body;

    // Get the quiz from the database
    const lesson = await Lesson.findById(lessonId);
    if (!lesson || !lesson.quiz) {
      return errorResponse(res, null, 'Quiz not found');
    }

    // Validate and submit quiz
    const result = await validateQuizSubmission({ answers }, lesson.quiz, req.io, `lesson-${lessonId}`);

    // Save result to database
    await LessonProgress.updateOne(
      { user: req.user.id, lesson: lessonId },
      { $set: { quizScore: result.score, quizPassed: result.passed } }
    );

    // Send success response
    return successResponse(res, result, 'Quiz submitted successfully');
  } catch (error) {
    return errorResponse(res, error);
  }
});

export default router;
