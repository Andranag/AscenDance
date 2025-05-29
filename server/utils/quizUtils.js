import { calculateScore } from './quizScoring.js';

/**
 * Validates a quiz submission and calculates the score
 * @param {Object} submission - The quiz submission data
 * @param {Object} quiz - The quiz object containing questions and answers
 * @returns {Object} - Result object containing score and feedback
 */
export const validateQuizSubmission = async (submission, quiz) => {
  try {
    // Validate submission format
    if (!submission || !Array.isArray(submission.answers)) {
      throw new Error('Invalid submission format');
    }

    // Calculate score
    const score = await calculateScore(submission.answers, quiz.questions);

    // Generate feedback
    const feedback = quiz.questions.map((question, index) => {
      const userAnswer = submission.answers[index];
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

    return {
      score,
      feedback,
      passed: score >= quiz.passingScore,
      totalQuestions: quiz.questions.length
    };
  } catch (error) {
    console.error('Error validating quiz submission:', error);
    throw error;
  }
};
