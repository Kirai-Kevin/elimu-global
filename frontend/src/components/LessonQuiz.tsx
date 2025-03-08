import React, { useState } from 'react';
import { Quiz, Question } from '../types/lesson';

interface LessonQuizProps {
  quiz: Quiz;
  onComplete: (score: number) => void;
}

const LessonQuiz: React.FC<LessonQuizProps> = ({ quiz, onComplete }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const totalQuestions = quiz.questions.length;

  // Handle option selection
  const handleOptionSelect = (optionIndex: number) => {
    const newSelectedOptions = [...selectedOptions];
    newSelectedOptions[currentQuestionIndex] = optionIndex;
    setSelectedOptions(newSelectedOptions);
  };

  // Move to next question
  const handleNextQuestion = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // Calculate score
      calculateScore();
    }
  };

  // Move to previous question
  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  // Calculate final score
  const calculateScore = () => {
    let correctAnswers = 0;
    
    quiz.questions.forEach((question, index) => {
      if (selectedOptions[index] === question.correctOptionIndex) {
        correctAnswers++;
      }
    });
    
    const finalScore = Math.round((correctAnswers / totalQuestions) * 100);
    setScore(finalScore);
    setShowResults(true);
  };

  // Submit quiz
  const handleSubmitQuiz = () => {
    onComplete(score);
  };

  // Restart quiz
  const handleRestartQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedOptions([]);
    setShowResults(false);
    setScore(0);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold mb-4">{quiz.title}</h2>
      
      {!showResults ? (
        <div>
          {/* Progress indicator */}
          <div className="mb-4">
            <div className="text-sm text-gray-600 mb-1">
              Question {currentQuestionIndex + 1} of {totalQuestions}
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className="bg-blue-600 h-2.5 rounded-full" 
                style={{ width: `${((currentQuestionIndex + 1) / totalQuestions) * 100}%` }}
              ></div>
            </div>
          </div>
          
          {/* Question */}
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-3">{currentQuestion.text}</h3>
            <div className="space-y-2">
              {currentQuestion.options.map((option, index) => (
                <div 
                  key={index}
                  className={`
                    p-3 border rounded cursor-pointer
                    ${selectedOptions[currentQuestionIndex] === index 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-300 hover:bg-gray-50'}
                  `}
                  onClick={() => handleOptionSelect(index)}
                >
                  <div className="flex items-center">
                    <div className={`
                      w-5 h-5 rounded-full border flex items-center justify-center mr-3
                      ${selectedOptions[currentQuestionIndex] === index 
                        ? 'border-blue-500 bg-blue-500 text-white' 
                        : 'border-gray-400'}
                    `}>
                      {selectedOptions[currentQuestionIndex] === index && (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                    <span>{option}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Navigation buttons */}
          <div className="flex justify-between">
            <button
              onClick={handlePreviousQuestion}
              disabled={currentQuestionIndex === 0}
              className={`
                px-4 py-2 rounded
                ${currentQuestionIndex === 0 
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                  : 'bg-gray-200 text-gray-800 hover:bg-gray-300'}
              `}
            >
              Previous
            </button>
            
            <button
              onClick={handleNextQuestion}
              disabled={selectedOptions[currentQuestionIndex] === undefined}
              className={`
                px-4 py-2 rounded
                ${selectedOptions[currentQuestionIndex] === undefined 
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                  : currentQuestionIndex === totalQuestions - 1
                    ? 'bg-green-600 text-white hover:bg-green-700'
                    : 'bg-blue-600 text-white hover:bg-blue-700'}
              `}
            >
              {currentQuestionIndex === totalQuestions - 1 ? 'Finish Quiz' : 'Next'}
            </button>
          </div>
        </div>
      ) : (
        <div className="text-center">
          <div className="mb-6">
            <div className="text-5xl font-bold mb-2">{score}%</div>
            <div className="text-gray-600">
              {score >= 70 
                ? 'Congratulations! You passed the quiz.' 
                : 'You did not pass the quiz. Try again!'}
            </div>
          </div>
          
          {/* Results breakdown */}
          <div className="mb-6 text-left">
            <h3 className="font-semibold text-lg mb-3">Results Breakdown</h3>
            {quiz.questions.map((question, index) => (
              <div key={index} className="mb-4">
                <div className="flex items-start">
                  <div className={`
                    w-6 h-6 rounded-full flex items-center justify-center mr-2 mt-0.5
                    ${selectedOptions[index] === question.correctOptionIndex 
                      ? 'bg-green-500 text-white' 
                      : 'bg-red-500 text-white'}
                  `}>
                    {selectedOptions[index] === question.correctOptionIndex ? (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    )}
                  </div>
                  <div>
                    <div className="font-medium">{question.text}</div>
                    <div className="text-sm mt-1">
                      <span className="text-gray-600">Your answer: </span>
                      <span className={selectedOptions[index] === question.correctOptionIndex 
                        ? 'text-green-600 font-medium' 
                        : 'text-red-600 font-medium'
                      }>
                        {question.options[selectedOptions[index]]}
                      </span>
                    </div>
                    {selectedOptions[index] !== question.correctOptionIndex && (
                      <div className="text-sm mt-1">
                        <span className="text-gray-600">Correct answer: </span>
                        <span className="text-green-600 font-medium">
                          {question.options[question.correctOptionIndex]}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="flex justify-center space-x-4">
            <button
              onClick={handleRestartQuiz}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
            >
              Try Again
            </button>
            <button
              onClick={handleSubmitQuiz}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              {score >= 70 ? 'Continue to Next Lesson' : 'Save Result'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LessonQuiz;