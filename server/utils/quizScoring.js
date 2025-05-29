/**
 * Calculates the score for a quiz based on user answers
 * @param {Array} userAnswers - Array of user's answers
 * @param {Array} questions - Array of question objects with correct answers
 * @returns {number} - The calculated score
 */
export const calculateScore = async (userAnswers, questions) => {
  if (!userAnswers || !Array.isArray(userAnswers)) {
    throw new Error('User answers must be an array');
  }

  if (!questions || !Array.isArray(questions)) {
    throw new Error('Questions must be an array');
  }

  // Calculate raw score (number of correct answers)
  const correctAnswers = questions.reduce((count, question, index) => {
    if (userAnswers[index] === question.correctAnswer) {
      return count + 1;
    }
    return count;
  }, 0);

  // Calculate percentage score
  const score = (correctAnswers / questions.length) * 100;

  return Math.round(score);
};
