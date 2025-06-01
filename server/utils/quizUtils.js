import { calculateScore } from './quizScoring.js';
import { validationError } from './responseUtils.js';
import { showInfoToast, showErrorToast } from './toastUtils.js';
import { z } from 'zod';

// Define validation schemas
const quizSubmissionSchema = z.object({
  answers: z.array(z.number(), {
    errorMap: () => ({ message: 'Answers must be an array of numbers' })
  })
});

const quizSchema = z.object({
  questions: z.array(z.object({
    _id: z.string(),
    correctAnswer: z.number(),
    passingScore: z.number().min(0).max(100)
  }))
});

/**
 * Validates a quiz submission and calculates the score
 * @param {Object} submission - The quiz submission data
 * @param {Object} quiz - The quiz object containing questions and answers
 * @param {Object} io - Socket.io instance
 * @param {string} roomId - Room ID for notifications
 * @returns {Promise<Object>} - Result object containing score and feedback
 */
export const validateQuizSubmission = async (submission, quiz, io, roomId) => {
  try {
    // Validate quiz submission
    const validatedSubmission = quizSubmissionSchema.parse(submission);
    const validatedQuiz = quizSchema.parse(quiz);

    // Calculate score
    const score = await calculateScore(validatedSubmission.answers, validatedQuiz.questions);

    // Generate feedback
    const feedback = validatedQuiz.questions.map((question, index) => {
      const userAnswer = validatedSubmission.answers[index];
      const isCorrect = userAnswer === question.correctAnswer;
      return {
        questionId: question._id,
        isCorrect,
        userAnswer,
        correctAnswer: question.correctAnswer,
        feedback: isCorrect 
          ? 'Correct! Well done.' 
          : `Incorrect. The correct answer was: ${question.correctAnswer}`
      };
    });

    // Send success notification
    showInfoToast(io, roomId, 'Quiz submitted successfully');

    return {
      score,
      feedback,
      passed: score >= validatedQuiz.passingScore,
      totalQuestions: validatedQuiz.questions.length
    };
  } catch (error) {
    // Send error notification
    showErrorToast(io, roomId, error.message);
    throw validationError(error);
  }
};
