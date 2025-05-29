import React, { useState } from 'react';
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react';

const QuizCard = ({ quiz, onSubmit }) => {
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const handleAnswerSelect = (questionIndex, answerIndex) => {
    if (submitted) return;
    setSelectedAnswers(prev => ({
      ...prev,
      [questionIndex]: answerIndex
    }));
  };

  const handleSubmit = async () => {
    if (Object.keys(selectedAnswers).length !== quiz.questions.length) {
      setFeedback({
        type: 'warning',
        message: 'Please answer all questions before submitting'
      });
      return;
    }

    setSubmitted(true);
    const result = await onSubmit(selectedAnswers);
    setFeedback(result);
  };

  return (
    <div className="space-y-8">
      {quiz.questions.map((question, qIndex) => (
        <div key={qIndex} className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900">
            {qIndex + 1}. {question.question}
          </h3>
          
          <div className="space-y-2">
            {question.options.map((option, aIndex) => (
              <button
                key={aIndex}
                onClick={() => handleAnswerSelect(qIndex, aIndex)}
                className={`
                  w-full text-left p-4 rounded-lg transition-all duration-200
                  ${selectedAnswers[qIndex] === aIndex 
                    ? 'bg-primary/10 ring-2 ring-primary'
                    : 'bg-gray-50 hover:bg-gray-100'}
                `}
                disabled={submitted}
              >
                <div className="flex items-center gap-3">
                  <div className={`
                    w-6 h-6 rounded-full flex items-center justify-center
                    ${selectedAnswers[qIndex] === aIndex ? 'bg-primary text-white' : 'bg-white border-2'}
                  `}>
                    {String.fromCharCode(65 + aIndex)}
                  </div>
                  <span>{option}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      ))}

      {feedback && (
        <div className={`
          p-4 rounded-lg flex items-center gap-3
          ${feedback.type === 'success' ? 'bg-green-50 text-green-700' :
            feedback.type === 'warning' ? 'bg-yellow-50 text-yellow-700' :
            'bg-red-50 text-red-700'}
        `}>
          {feedback.type === 'success' ? <CheckCircle className="w-5 h-5" /> :
           feedback.type === 'warning' ? <AlertCircle className="w-5 h-5" /> :
           <XCircle className="w-5 h-5" />}
          <span>{feedback.message}</span>
        </div>
      )}

      {!submitted && (
        <button 
          onClick={handleSubmit}
          className="btn-primary w-full"
        >
          Submit Quiz
        </button>
      )}
    </div>
  );
};

export default QuizCard;