import { Lesson, LessonProgress } from '../models/index.js';
import { validateQuizSubmission } from '../utils/quizUtils.js';
import { BaseController } from '../utils/baseController.js';

export class QuizController extends BaseController {
  constructor() {
    super();
  }

  submitQuiz = async (req, res) => {
    try {
      const { lessonId } = req.params;
      const { answers } = req.body;

      const lesson = await Lesson.findById(lessonId);
      if (!lesson || !lesson.quiz) {
        throw new NotFoundError('Quiz not found');
      }

      const result = await validateQuizSubmission({ answers }, lesson.quiz, req.io, `lesson-${lessonId}`);

      await LessonProgress.updateOne(
        { user: req.user.id, lesson: lessonId },
        { $set: { quizScore: result.score, quizPassed: result.passed } }
      );

      this.logger.info('Quiz submitted successfully', { 
        lessonId,
        userId: req.user.id,
        score: result.score 
      });

      return this.successResponse(res, result, 'Quiz submitted successfully');
    } catch (error) {
      this.logger.error('Error submitting quiz', error);
      return this.errorResponse(res, error);
    }
  };
}

// Export instance of controller
export const quizController = new QuizController();

export default router;
