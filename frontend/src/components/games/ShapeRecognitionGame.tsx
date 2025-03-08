import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface ShapeRecognitionGameProps {
  playSound: (sound: string) => void;
  isMuted: boolean;
}

interface ShapeQuestion {
  id: number;
  shape: string;
  options: string[];
  correctAnswer: string;
}

const ShapeRecognitionGame: React.FC<ShapeRecognitionGameProps> = ({ playSound, isMuted }) => {
  const [level, setLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [questions, setQuestions] = useState<ShapeQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [streak, setStreak] = useState(0);

  // Shape data
  const shapeData = [
    { name: 'Circle', svg: (color: string) => `<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="40" fill="${color}" /></svg>` },
    { name: 'Square', svg: (color: string) => `<svg viewBox="0 0 100 100"><rect x="10" y="10" width="80" height="80" fill="${color}" /></svg>` },
    { name: 'Triangle', svg: (color: string) => `<svg viewBox="0 0 100 100"><polygon points="50,10 90,90 10,90" fill="${color}" /></svg>` },
    { name: 'Rectangle', svg: (color: string) => `<svg viewBox="0 0 100 100"><rect x="10" y="25" width="80" height="50" fill="${color}" /></svg>` },
    { name: 'Oval', svg: (color: string) => `<svg viewBox="0 0 100 100"><ellipse cx="50" cy="50" rx="45" ry="30" fill="${color}" /></svg>` },
    { name: 'Diamond', svg: (color: string) => `<svg viewBox="0 0 100 100"><polygon points="50,10 90,50 50,90 10,50" fill="${color}" /></svg>` },
    { name: 'Star', svg: (color: string) => `<svg viewBox="0 0 100 100">
      <polygon points="50,10 61,35 90,35 65,55 75,80 50,65 25,80 35,55 10,35 39,35" fill="${color}" />
    </svg>` },
    { name: 'Heart', svg: (color: string) => `<svg viewBox="0 0 100 100">
      <path d="M50,80 C35,65 10,50 10,30 C10,15 25,10 35,10 C45,10 50,20 50,20 C50,20 55,10 65,10 C75,10 90,15 90,30 C90,50 65,65 50,80 Z" fill="${color}" />
    </svg>` },
    { name: 'Pentagon', svg: (color: string) => `<svg viewBox="0 0 100 100">
      <polygon points="50,10 90,40 75,85 25,85 10,40" fill="${color}" />
    </svg>` },
    { name: 'Hexagon', svg: (color: string) => `<svg viewBox="0 0 100 100">
      <polygon points="25,10 75,10 95,50 75,90 25,90 5,50" fill="${color}" />
    </svg>` },
  ];

  // Colors for shapes
  const shapeColors = [
    '#FF5252', // Red
    '#4CAF50', // Green
    '#2196F3', // Blue
    '#FFC107', // Yellow
    '#9C27B0', // Purple
    '#FF9800', // Orange
  ];

  // Generate questions based on level
  const generateQuestions = () => {
    const newQuestions: ShapeQuestion[] = [];
    const questionsPerLevel = 5;
    
    // Determine available shapes based on level
    let availableShapes = [...shapeData];
    if (level === 1) {
      // Level 1: Basic shapes only
      availableShapes = shapeData.slice(0, 4);
    } else if (level === 2) {
      // Level 2: Add oval and diamond
      availableShapes = shapeData.slice(0, 6);
    } else if (level === 3) {
      // Level 3: Add star
      availableShapes = shapeData.slice(0, 7);
    } else if (level === 4) {
      // Level 4: Add heart
      availableShapes = shapeData.slice(0, 8);
    }
    // Level 5: All shapes
    
    for (let i = 0; i < questionsPerLevel; i++) {
      // Shuffle shapes
      const shuffledShapes = [...availableShapes].sort(() => Math.random() - 0.5);
      
      // Select a shape for the question
      const selectedShape = shuffledShapes[0];
      
      // Select a random color
      const color = shapeColors[Math.floor(Math.random() * shapeColors.length)];
      
      // Create shape SVG
      const shapeSvg = selectedShape.svg(color);
      
      // Generate options (3 wrong + 1 correct)
      const correctAnswer = selectedShape.name;
      const wrongOptions = shuffledShapes.slice(1, 4).map(shape => shape.name);
      
      // Combine and shuffle options
      const options = [...wrongOptions, correctAnswer].sort(() => Math.random() - 0.5);
      
      newQuestions.push({
        id: i,
        shape: shapeSvg,
        options,
        correctAnswer
      });
    }
    
    setQuestions(newQuestions);
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setIsCorrect(null);
    setGameCompleted(false);
    setShowCelebration(false);
  };

  // Initialize game when level changes
  useEffect(() => {
    generateQuestions();
  }, [level]);

  // Handle answer selection
  const handleAnswerSelect = (answer: string) => {
    if (selectedAnswer !== null) return; // Prevent multiple selections
    
    setSelectedAnswer(answer);
    
    const currentQuestion = questions[currentQuestionIndex];
    const correct = answer === currentQuestion.correctAnswer;
    
    setIsCorrect(correct);
    
    if (correct) {
      playSound('correct-answer');
      setScore(prev => prev + (level * 10));
      setStreak(prev => prev + 1);
      
      // Bonus points for streak
      if (streak > 0 && streak % 3 === 0) {
        playSound('bonus');
        setScore(prev => prev + 20);
      }
    } else {
      playSound('wrong-answer');
      setStreak(0);
    }
    
    // Move to next question after delay
    setTimeout(() => {
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
        setSelectedAnswer(null);
        setIsCorrect(null);
      } else {
        // Game completed
        setGameCompleted(true);
        playSound('game-complete');
        setShowCelebration(true);
        
        // Hide celebration after 3 seconds
        setTimeout(() => {
          setShowCelebration(false);
        }, 3000);
      }
    }, 1500);
  };

  // Handle level change
  const handleLevelChange = (newLevel: number) => {
    setLevel(newLevel);
    setScore(0);
    setStreak(0);
  };

  // Start next level
  const handleNextLevel = () => {
    if (level < 5) {
      setLevel(prev => prev + 1);
      setScore(0);
      setStreak(0);
    }
  };

  // Reset game
  const handleResetGame = () => {
    generateQuestions();
    setScore(0);
    setStreak(0);
  };

  // Current question
  const currentQuestion = questions[currentQuestionIndex];

  // Render game instructions
  const renderInstructions = () => (
    <div className="mb-6 p-4 bg-yellow-50 rounded-lg border border-yellow-100">
      <h3 className="text-lg font-semibold text-yellow-800 mb-2">How to Play:</h3>
      <ul className="list-disc list-inside text-yellow-700 space-y-1">
        <li>Look at the shape shown on the screen</li>
        <li>Select the correct name of the shape from the options</li>
        <li>Complete all questions to finish the level</li>
        <li>Higher levels introduce more complex shapes!</li>
      </ul>
    </div>
  );

  // Render level selector
  const renderLevelSelector = () => (
    <div className="mb-6">
      <h3 className="text-lg font-semibold mb-3">Select Level:</h3>
      <div className="flex gap-2">
        {[1, 2, 3, 4, 5].map(lvl => (
          <button
            key={lvl}
            onClick={() => handleLevelChange(lvl)}
            className={`
              w-10 h-10 rounded-full flex items-center justify-center
              ${level === lvl ? 'bg-blue-500 text-white' : 'bg-blue-100 text-blue-700'}
              hover:bg-blue-400 hover:text-white transition-colors
            `}
          >
            {lvl}
          </button>
        ))}
      </div>
    </div>
  );

  // Render game controls
  const renderGameControls = () => (
    <div className="flex justify-between items-center mb-6">
      <div className="flex items-center gap-3">
        <div className="bg-blue-100 px-4 py-2 rounded-lg">
          <span className="font-semibold text-blue-800">Level: {level}</span>
        </div>
        <div className="bg-green-100 px-4 py-2 rounded-lg">
          <span className="font-semibold text-green-800">Score: {score}</span>
        </div>
        <div className="bg-purple-100 px-4 py-2 rounded-lg">
          <span className="font-semibold text-purple-800">
            Question: {currentQuestionIndex + 1}/{questions.length}
          </span>
        </div>
      </div>
      
      <button
        onClick={handleResetGame}
        className="px-4 py-2 bg-yellow-100 text-yellow-700 rounded-lg hover:bg-yellow-200 transition-colors"
      >
        Reset
      </button>
    </div>
  );

  // Render shape display
  const renderShapeDisplay = () => {
    if (!currentQuestion) return null;
    
    return (
      <div className="mb-8 p-6 bg-white rounded-xl border-2 border-blue-200 shadow-md">
        <h3 className="text-xl font-semibold text-center mb-4 text-blue-800">
          What shape is this?
        </h3>
        
        <div className="flex justify-center mb-4">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ 
              type: "spring",
              stiffness: 260,
              damping: 20
            }}
            className="w-40 h-40"
            dangerouslySetInnerHTML={{ __html: currentQuestion.shape }}
          />
        </div>
      </div>
    );
  };

  // Render answer options
  const renderAnswerOptions = () => {
    if (!currentQuestion) return null;
    
    return (
      <div className="grid grid-cols-2 gap-4 mb-6">
        {currentQuestion.options.map((option, index) => (
          <motion.button
            key={index}
            whileHover={{ scale: selectedAnswer === null ? 1.05 : 1 }}
            whileTap={{ scale: selectedAnswer === null ? 0.95 : 1 }}
            onClick={() => selectedAnswer === null && handleAnswerSelect(option)}
            className={`
              py-4 text-lg font-bold rounded-xl
              ${selectedAnswer === null 
                ? 'bg-blue-100 text-blue-700 hover:bg-blue-200' 
                : selectedAnswer === option
                  ? isCorrect
                    ? 'bg-green-500 text-white'
                    : 'bg-red-500 text-white'
                  : option === currentQuestion.correctAnswer && selectedAnswer !== null
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-100 text-gray-400'
              }
              transition-colors
            `}
            disabled={selectedAnswer !== null}
          >
            {option}
          </motion.button>
        ))}
      </div>
    );
  };

  // Render feedback
  const renderFeedback = () => {
    if (isCorrect === null) return null;
    
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`
          p-4 rounded-lg text-center mb-6
          ${isCorrect ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}
        `}
      >
        {isCorrect ? (
          <>
            <h3 className="text-xl font-bold mb-1">Correct!</h3>
            <p>That's right, it's a {currentQuestion.correctAnswer}!</p>
            {streak > 0 && streak % 3 === 0 && (
              <p className="mt-1 font-semibold">Streak bonus: +20 points!</p>
            )}
          </>
        ) : (
          <>
            <h3 className="text-xl font-bold mb-1">Not quite right</h3>
            <p>This is a {currentQuestion.correctAnswer}</p>
          </>
        )}
      </motion.div>
    );
  };

  // Render game completion
  const renderGameCompletion = () => {
    if (!gameCompleted) return null;
    
    return (
      <div className="mt-6 p-6 bg-green-100 rounded-lg border border-green-200 text-center">
        <h3 className="text-2xl font-bold text-green-700 mb-2">
          Level {level} Completed!
        </h3>
        <p className="text-green-600 text-lg mb-4">
          Your final score: {score} points
        </p>
        
        {level < 5 ? (
          <button
            onClick={handleNextLevel}
            className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
          >
            Next Level
          </button>
        ) : (
          <p className="text-green-600 font-semibold">
            Congratulations! You've completed all levels!
          </p>
        )}
      </div>
    );
  };

  // Render celebration overlay
  const renderCelebration = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10"
    >
      <motion.div
        initial={{ scale: 0.5 }}
        animate={{ 
          scale: [0.5, 1.2, 1],
          rotate: [0, 10, -10, 0]
        }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-xl p-8 text-center"
      >
        <h2 className="text-3xl font-bold text-green-600 mb-4">Shape Master!</h2>
        <p className="text-xl text-gray-700 mb-4">You completed level {level}!</p>
        <div className="flex justify-center gap-4">
          {['🔶', '🔷', '⭐', '⬛'].map((emoji, index) => (
            <motion.div
              key={index}
              animate={{ 
                y: [0, -20, 0],
                rotate: [0, 15, -15, 0]
              }}
              transition={{ 
                repeat: Infinity,
                duration: 1.5,
                delay: index * 0.2
              }}
              className="text-5xl"
            >
              {emoji}
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );

  // Progress bar
  const renderProgressBar = () => (
    <div className="mb-6">
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div 
          className="bg-blue-600 h-2.5 rounded-full transition-all duration-300" 
          style={{ width: `${((currentQuestionIndex) / questions.length) * 100}%` }}
        ></div>
      </div>
    </div>
  );

  return (
    <div className="relative">
      {renderInstructions()}
      {renderLevelSelector()}
      {renderGameControls()}
      {renderProgressBar()}
      
      {!gameCompleted ? (
        <>
          {renderShapeDisplay()}
          {renderAnswerOptions()}
          {renderFeedback()}
        </>
      ) : (
        renderGameCompletion()
      )}
      
      {showCelebration && renderCelebration()}
    </div>
  );
};

export default ShapeRecognitionGame;