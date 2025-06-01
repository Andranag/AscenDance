import { Lesson, CourseProgress } from '../models/index.js';
import { validateQuizSubmission } from '../utils/quizUtils.js';
import { NotFoundError, successResponse, errorResponse } from '../utils/errorUtils.js';
import { logger } from '../utils/logger.js';

const createLesson = async (req, res) => {
  try {
    const lesson = new Lesson(req.body);
    await lesson.save();
    return successResponse(res, lesson, 'Lesson created successfully', 201);
  } catch (error) {
    logger.error('Error creating lesson', error);
    return errorResponse(res, error);
  }
};

const getLesson = async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.id);
    if (!lesson) {
      throw new NotFoundError('Lesson not found');
    }
    return successResponse(res, lesson);
  } catch (error) {
    logger.error('Error getting lesson', error);
    return errorResponse(res, error);
  }
};

const submitQuiz = async (req, res) => {
  try {
    const { lessonId } = req.params;
    const { answers } = req.body;
    const userId = req.user.id;

    const lesson = await Lesson.findById(lessonId);
    if (!lesson || !lesson.quiz) {
      throw new NotFoundError('Quiz not found');
    }

    const { score, feedback } = validateQuizSubmission(lesson.quiz, answers);
    const passed = score >= lesson.quiz.passingScore;

    // Update progress if passed
    if (passed) {
      await CourseProgress.findOneAndUpdate(
        { user: userId, 'lessons.lesson': lessonId },
        { 
          $set: { 
            'lessons.$.completed': true,
            'lessons.$.quizScore': score,
            'lessons.$.completedAt': new Date()
          }
        }
      );
    }

    logger.info('Quiz submitted successfully', { lessonId, userId });
    return successResponse(res, { score, passed, feedback });
  } catch (error) {
    logger.error('Error submitting quiz', error);
    return errorResponse(res, error);
  }
};

const updateLesson = async (req, res) => {
  try {
    const lesson = await Lesson.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!lesson) {
      throw new NotFoundError('Lesson not found');
    }
    logger.info('Lesson updated successfully', { lessonId: req.params.id });
    return successResponse(res, lesson, 'Lesson updated successfully');
  } catch (error) {
    logger.error('Error updating lesson', error);
    return errorResponse(res, error);
  }
};

const deleteLesson = async (req, res) => {
  try {
    const lesson = await Lesson.findByIdAndDelete(req.params.id);
    if (!lesson) {
      throw new NotFoundError('Lesson not found');
    }
    logger.info('Lesson deleted successfully', { lessonId: req.params.id });
    return successResponse(res, null, 'Lesson deleted successfully');
  } catch (error) {
    logger.error('Error deleting lesson', error);
    return errorResponse(res, error);
  }
};

export {
  createLesson,
  getLesson,
  submitQuiz,
  updateLesson,
  deleteLesson
};