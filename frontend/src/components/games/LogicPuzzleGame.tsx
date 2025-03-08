import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface LogicPuzzleGameProps {
  playSound: (sound: string) => void;
  isMuted: boolean;
}

interface Puzzle {
  id: string;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard' | 'expert';
  category: 'sequence' | 'pattern' | 'deduction' | 'spatial' | 'mathematical';
  hint?: string;
}

const LogicPuzzleGame: React.FC<LogicPuzzleGameProps> = ({ playSound, isMuted }) => {
  const [level, setLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [puzzles, setPuzzles] = useState<Puzzle[]>([]);
  const [currentPuzzleIndex, setCurrentPuzzleIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [hintUsed, setHintUsed] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [showExplanation, setShowExplanation] = useState(false);

  // Logic puzzles data
  const puzzlesData: Puzzle[] = [
    // Sequence puzzles - Easy
    {
      id: 'seq-easy-1',
      question: 'What comes next in the sequence: 2, 4, 6, 8, ?',
      options: ['9', '10', '12', '16'],
      correctAnswer: '10',
      explanation: 'This is a simple arithmetic sequence where each number increases by 2.',
      difficulty: 'easy',
      category: 'sequence',
      hint: 'Look at the difference between consecutive numbers.'
    },
    {
      id: 'seq-easy-2',
      question: 'What comes next in the sequence: 1, 4, 9, 16, ?',
      options: ['20', '25', '36', '49'],
      correctAnswer: '25',
      explanation: 'These are perfect squares: 1², 2², 3², 4², and next is 5² = 25.',
      difficulty: 'easy',
      category: 'sequence',
      hint: 'Think about square numbers.'
    },
    
    // Pattern puzzles - Easy
    {
      id: 'pat-easy-1',
      question: 'If RED = 27, GREEN = 50, then BLUE = ?',
      options: ['27', '33', '40', '50'],
      correctAnswer: '33',
      explanation: 'Each letter has a value equal to its position in the alphabet (A=1, B=2, etc.). The sum of the letters in RED is 18+5+4=27, GREEN is 7+18+5+5+14=50, and BLUE is 2+12+21+5=40.',
      difficulty: 'easy',
      category: 'pattern',
      hint: 'Consider the position of each letter in the alphabet.'
    },
    
    // Deduction puzzles - Easy
    {
      id: 'ded-easy-1',
      question: 'All roses have thorns. Some flowers are roses. Therefore:',
      options: [
        'All flowers have thorns',
        'Some flowers have thorns',
        'No flowers have thorns',
        'Cannot be determined'
      ],
      correctAnswer: 'Some flowers have thorns',
      explanation: 'Since some flowers are roses, and all roses have thorns, it follows that some flowers (specifically, those that are roses) have thorns.',
      difficulty: 'easy',
      category: 'deduction',
      hint: 'Think about the relationship between roses and flowers.'
    },
    
    // Sequence puzzles - Medium
    {
      id: 'seq-med-1',
      question: 'What comes next in the sequence: 3, 6, 11, 18, ?',
      options: ['24', '27', '29', '31'],
      correctAnswer: '27',
      explanation: 'The differences between consecutive terms form an arithmetic sequence: 3, 5, 7, 9. So the next difference is 9, and 18 + 9 = 27.',
      difficulty: 'medium',
      category: 'sequence',
      hint: 'Look at the differences between consecutive numbers.'
    },
    
    // Pattern puzzles - Medium
    {
      id: 'pat-med-1',
      question: 'If JAVA = 10, PYTHON = 26, then JAVASCRIPT = ?',
      options: ['20', '36', '42', '52'],
      correctAnswer: '36',
      explanation: 'The value of each word is the sum of the positions of its unique letters in the alphabet. JAVA has J(10) + A(1) + V(22) + A(1) = 34, but counting A only once: 10+1+22=33. Similarly, JAVASCRIPT = 10+1+22+1+19+3+18+9+16+20 = 119, but counting each letter only once: J(10) + A(1) + V(22) + S(19) + C(3) + R(18) + I(9) + P(16) + T(20) = 118.',
      difficulty: 'medium',
      category: 'pattern',
      hint: 'Count the position of each unique letter in the alphabet.'
    },
    
    // Deduction puzzles - Medium
    {
      id: 'ded-med-1',
      question: 'All mammals are warm-blooded. All whales are mammals. All warm-blooded animals have hearts. Which statement must be true?',
      options: [
        'All whales are warm-blooded',
        'All warm-blooded animals are mammals',
        'All animals with hearts are mammals',
        'All whales are animals with hearts'
      ],
      correctAnswer: 'All whales are warm-blooded',
      explanation: 'Since all whales are mammals, and all mammals are warm-blooded, it follows that all whales are warm-blooded.',
      difficulty: 'medium',
      category: 'deduction',
      hint: 'Use syllogistic reasoning to connect the statements.'
    },
    
    // Sequence puzzles - Hard
    {
      id: 'seq-hard-1',
      question: 'What comes next in the sequence: 1, 11, 21, 1211, 111221, ?',
      options: ['312211', '1231', '12311', '121121'],
      correctAnswer: '312211',
      explanation: 'This is the "look and say" sequence. Each term describes the previous term: 1 is "one 1" (11), 11 is "two 1s" (21), 21 is "one 2, one 1" (1211), 1211 is "one 1, one 2, two 1s" (111221), and 111221 is "three 1s, two 2s, one 1" (312211).',
      difficulty: 'hard',
      category: 'sequence',
      hint: 'Try reading each number aloud, describing the digits you see.'
    },
    
    // Pattern puzzles - Hard
    {
      id: 'pat-hard-1',
      question: 'If PEACH = 50 and PEAR = 44, then APPLE = ?',
      options: ['40', '45', '50', '55'],
      correctAnswer: '50',
      explanation: 'The value of each word is the product of the positions of its letters in the alphabet. PEACH = 16×5×1×3×8 = 1920, PEAR = 16×5×1×18 = 1440. Similarly, APPLE = 1×16×16×12×5 = 15360.',
      difficulty: 'hard',
      category: 'pattern',
      hint: 'Consider operations other than addition on the letter positions.'
    },
    
    // Mathematical puzzles - Hard
    {
      id: 'math-hard-1',
      question: 'If 3 cats can catch 3 mice in 3 minutes, how many cats would be needed to catch 100 mice in 100 minutes?',
      options: ['3', '33', '100', '300'],
      correctAnswer: '3',
      explanation: 'If 3 cats can catch 3 mice in 3 minutes, then 1 cat can catch 1 mouse in 3 minutes. So in 100 minutes, 1 cat can catch 33.33 mice. Therefore, 3 cats can catch 100 mice in 100 minutes.',
      difficulty: 'hard',
      category: 'mathematical',
      hint: 'Think about the rate at which cats catch mice.'
    },
    
    // Sequence puzzles - Expert
    {
      id: 'seq-exp-1',
      question: 'What comes next in the sequence: 1, 1, 2, 3, 5, 8, 13, ?',
      options: ['18', '20', '21', '24'],
      correctAnswer: '21',
      explanation: 'This is the Fibonacci sequence, where each number is the sum of the two preceding ones. So 13 + 8 = 21.',
      difficulty: 'expert',
      category: 'sequence',
      hint: 'Look at how each number relates to the previous two numbers.'
    },
    
    // Deduction puzzles - Expert
    {
      id: 'ded-exp-1',
      question: 'Five people – Alex, Blake, Casey, Dana, and Eli – are sitting in a row. Alex is not sitting next to Blake or Casey. Eli is sitting next to Dana. Blake is sitting next to Casey. Who is sitting in the middle?',
      options: ['Alex', 'Blake', 'Casey', 'Dana', 'Eli'],
      correctAnswer: 'Casey',
      explanation: 'Since Blake is sitting next to Casey, and Alex is not sitting next to either of them, Alex must be at one end. Eli is sitting next to Dana, so they must be adjacent. The only arrangement that satisfies all conditions is: Alex, Dana, Casey, Blake, Eli (or the reverse).',
      difficulty: 'expert',
      category: 'deduction',
      hint: 'Try to place Alex first, then work with the other constraints.'
    }
  ];

  // Additional expert puzzles
  const expertPuzzles: Puzzle[] = [
    {
      id: 'math-exp-1',
      question: 'A stick is broken into three pieces of random length. What is the probability that the three pieces can form a triangle?',
      options: ['1/4', '1/2', '3/4', '1'],
      correctAnswer: '1/4',
      explanation: 'For three segments to form a triangle, the sum of the lengths of any two sides must be greater than the length of the third side. When breaking a stick randomly into three pieces, this condition is satisfied with probability 1/4.',
      difficulty: 'expert',
      category: 'mathematical',
      hint: 'Consider the conditions for three line segments to form a triangle.'
    },
    {
      id: 'pat-exp-1',
      question: 'If you have a 3x3x3 cube made up of 27 smaller cubes, and you paint the outside of the large cube, how many of the smaller cubes have paint on exactly two faces?',
      options: ['8', '12', '24', '36'],
      correctAnswer: '12',
      explanation: 'The cubes with paint on exactly two faces are the edge cubes that are not corner cubes. There are 12 such cubes: 4 on each of the 3 pairs of parallel edges.',
      difficulty: 'expert',
      category: 'spatial',
      hint: 'Think about the different positions of the smaller cubes: corners, edges, faces, and interior.'
    }
  ];

  // Generate puzzles based on level
  const generatePuzzles = () => {
    // Filter puzzles based on difficulty level
    let availablePuzzles = [...puzzlesData];
    
    if (level === 1) {
      availablePuzzles = availablePuzzles.filter(p => p.difficulty === 'easy');
    } else if (level === 2) {
      availablePuzzles = availablePuzzles.filter(p => p.difficulty === 'easy' || p.difficulty === 'medium');
    } else if (level === 3) {
      availablePuzzles = availablePuzzles.filter(p => p.difficulty === 'medium' || p.difficulty === 'hard');
    } else if (level === 4) {
      availablePuzzles = availablePuzzles.filter(p => p.difficulty === 'hard' || p.difficulty === 'expert');
    } else {
      // Level 5: Include all expert puzzles
      availablePuzzles = [...availablePuzzles, ...expertPuzzles];
      availablePuzzles = availablePuzzles.filter(p => p.difficulty === 'expert');
    }
    
    // Shuffle and select puzzles
    const shuffledPuzzles = availablePuzzles
      .sort(() => Math.random() - 0.5)
      .slice(0, 5); // 5 puzzles per level
    
    setPuzzles(shuffledPuzzles);
    setCurrentPuzzleIndex(0);
    setSelectedAnswer(null);
    setIsCorrect(null);
    setGameCompleted(false);
    setShowCelebration(false);
    setShowHint(false);
    setHintUsed(false);
    setTimeLeft(60); // Reset timer
    setShowExplanation(false);
  };

  // Initialize game when level changes
  useEffect(() => {
    generatePuzzles();
  }, [level]);

  // Timer effect
  useEffect(() => {
    if (selectedAnswer !== null || gameCompleted) return;
    
    if (timeLeft > 0) {
      const timer = setTimeout(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
      
      return () => clearTimeout(timer);
    } else {
      // Time's up - move to next puzzle
      handleTimeUp();
    }
  }, [timeLeft, selectedAnswer, gameCompleted]);

  // Handle time up
  const handleTimeUp = () => {
    playSound('wrong-answer');
    setSelectedAnswer(puzzles[currentPuzzleIndex].correctAnswer);
    setIsCorrect(false);
    
    // Show explanation
    setShowExplanation(true);
    
    // Move to next puzzle after delay
    setTimeout(() => {
      if (currentPuzzleIndex < puzzles.length - 1) {
        setCurrentPuzzleIndex(prev => prev + 1);
        setSelectedAnswer(null);
        setIsCorrect(null);
        setTimeLeft(60); // Reset timer
        setShowHint(false);
        setHintUsed(false);
        setShowExplanation(false);
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
    }, 5000);
  };

  // Handle answer selection
  const handleAnswerSelect = (answer: string) => {
    if (selectedAnswer !== null) return; // Prevent multiple selections
    
    setSelectedAnswer(answer);
    
    const currentPuzzle = puzzles[currentPuzzleIndex];
    const correct = answer === currentPuzzle.correctAnswer;
    
    setIsCorrect(correct);
    
    if (correct) {
      playSound('correct-answer');
      
      // Calculate score based on level, time left, and hint usage
      const levelMultiplier = level;
      const timeBonus = Math.floor(timeLeft / 10);
      const hintPenalty = hintUsed ? 0.5 : 1; // 50% penalty if hint was used
      
      const pointsEarned = Math.floor((20 + timeBonus) * levelMultiplier * hintPenalty);
      
      setScore(prev => prev + pointsEarned);
    } else {
      playSound('wrong-answer');
    }
    
    // Show explanation
    setShowExplanation(true);
    
    // Move to next puzzle after delay
    setTimeout(() => {
      if (currentPuzzleIndex < puzzles.length - 1) {
        setCurrentPuzzleIndex(prev => prev + 1);
        setSelectedAnswer(null);
        setIsCorrect(null);
        setTimeLeft(60); // Reset timer
        setShowHint(false);
        setHintUsed(false);
        setShowExplanation(false);
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
    }, 5000);
  };

  // Toggle hint
  const handleToggleHint = () => {
    if (!showHint && !hintUsed) {
      setHintUsed(true);
      playSound('button-click');
    }
    setShowHint(!showHint);
  };

  // Handle level change
  const handleLevelChange = (newLevel: number) => {
    setLevel(newLevel);
    setScore(0);
  };

  // Start next level
  const handleNextLevel = () => {
    if (level < 5) {
      setLevel(prev => prev + 1);
      setScore(0);
    }
  };

  // Reset game
  const handleResetGame = () => {
    generatePuzzles();
    setScore(0);
  };

  // Current puzzle
  const currentPuzzle = puzzles[currentPuzzleIndex];

  // Render game instructions
  const renderInstructions = () => (
    <div className="mb-6 p-4 bg-purple-50 rounded-lg border border-purple-100">
      <h3 className="text-lg font-semibold text-purple-800 mb-2">How to Play:</h3>
      <ul className="list-disc list-inside text-purple-700 space-y-1">
        <li>Solve each logic puzzle by selecting the correct answer</li>
        <li>You have 60 seconds per puzzle</li>
        <li>Use hints if needed, but they will reduce your score</li>
        <li>Higher levels have more challenging puzzles</li>
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
              ${level === lvl ? 'bg-purple-500 text-white' : 'bg-purple-100 text-purple-700'}
              hover:bg-purple-400 hover:text-white transition-colors
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
        <div className="bg-purple-100 px-4 py-2 rounded-lg">
          <span className="font-semibold text-purple-800">Level: {level}</span>
        </div>
        <div className="bg-green-100 px-4 py-2 rounded-lg">
          <span className="font-semibold text-green-800">Score: {score}</span>
        </div>
        <div className="bg-blue-100 px-4 py-2 rounded-lg">
          <span className="font-semibold text-blue-800">
            Puzzle: {currentPuzzleIndex + 1}/{puzzles.length}
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

  // Render timer
  const renderTimer = () => {
    const timerColor = 
      timeLeft > 30 ? 'text-green-600' :
      timeLeft > 15 ? 'text-yellow-600' :
      'text-red-600';
    
    return (
      <div className="mb-4 flex justify-between items-center">
        <div className={`text-2xl font-bold ${timerColor}`}>
          Time: {timeLeft}s
        </div>
        
        {currentPuzzle?.hint && (
          <button
            onClick={handleToggleHint}
            className={`
              px-4 py-2 rounded-lg
              ${showHint 
                ? 'bg-yellow-200 text-yellow-800' 
                : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'}
              transition-colors
            `}
          >
            {showHint ? 'Hide Hint' : hintUsed ? 'Show Hint Again' : 'Use Hint (-50% points)'}
          </button>
        )}
      </div>
    );
  };

  // Render puzzle
  const renderPuzzle = () => {
    if (!currentPuzzle) return null;
    
    return (
      <div className="mb-8 p-6 bg-white rounded-xl border-2 border-purple-200 shadow-md">
        <div className="flex justify-between items-start mb-4">
          <div className="px-3 py-1 bg-purple-100 text-purple-700 rounded-lg text-sm">
            {currentPuzzle.category.charAt(0).toUpperCase() + currentPuzzle.category.slice(1)}
          </div>
          <div className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-sm">
            {currentPuzzle.difficulty.charAt(0).toUpperCase() + currentPuzzle.difficulty.slice(1)}
          </div>
        </div>
        
        <h3 className="text-xl font-semibold text-center mb-6 text-purple-800">
          {currentPuzzle.question}
        </h3>
        
        {renderTimer()}
        
        {showHint && currentPuzzle.hint && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-800"
          >
            <span className="font-semibold">Hint:</span> {currentPuzzle.hint}
          </motion.div>
        )}
      </div>
    );
  };

  // Render answer options
  const renderAnswerOptions = () => {
    if (!currentPuzzle) return null;
    
    return (
      <div className="grid grid-cols-2 gap-4 mb-6">
        {currentPuzzle.options.map((option, index) => {
          // Determine if this option is selected or correct
          const isSelected = selectedAnswer === option;
          const isCorrectOption = option === currentPuzzle.correctAnswer;
          const showAsCorrect = isCorrectOption && selectedAnswer !== null;
          const showAsIncorrect = isSelected && !isCorrect;
          
          return (
            <motion.button
              key={index}
              whileHover={{ scale: selectedAnswer === null ? 1.05 : 1 }}
              whileTap={{ scale: selectedAnswer === null ? 0.95 : 1 }}
              onClick={() => selectedAnswer === null && handleAnswerSelect(option)}
              className={`
                py-4 px-4 text-lg font-medium rounded-xl
                ${selectedAnswer === null 
                  ? 'bg-purple-100 text-purple-700 hover:bg-purple-200' 
                  : showAsCorrect
                    ? 'bg-green-500 text-white'
                    : showAsIncorrect
                      ? 'bg-red-500 text-white'
                      : 'bg-gray-100 text-gray-400'
                }
                transition-colors
              `}
              disabled={selectedAnswer !== null}
            >
              {option}
            </motion.button>
          );
        })}
      </div>
    );
  };

  // Render explanation
  const renderExplanation = () => {
    if (!showExplanation || !currentPuzzle) return null;
    
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-100"
      >
        <h3 className="text-lg font-semibold text-blue-800 mb-2">Explanation:</h3>
        <p className="text-blue-700">{currentPuzzle.explanation}</p>
      </motion.div>
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
            <p>Well done! You solved the puzzle.</p>
          </>
        ) : (
          <>
            <h3 className="text-xl font-bold mb-1">Incorrect</h3>
            <p>The correct answer is "{currentPuzzle.correctAnswer}"</p>
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
        <h2 className="text-3xl font-bold text-green-600 mb-4">Logic Master!</h2>
        <p className="text-xl text-gray-700 mb-4">You completed level {level}!</p>
        <div className="flex justify-center gap-4">
          {['🧠', '🔍', '💡', '🎯'].map((emoji, index) => (
            <motion.div
              key={index}
              animate={{ 
                y: [0, -20, 0],
                scale: [1, 1.2, 1]
              }}
              transition={{ 
                repeat: Infinity,
                duration: 1,
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
          className="bg-purple-600 h-2.5 rounded-full transition-all duration-300" 
          style={{ width: `${((currentPuzzleIndex) / puzzles.length) * 100}%` }}
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
          {renderPuzzle()}
          {renderAnswerOptions()}
          {renderFeedback()}
          {renderExplanation()}
        </>
      ) : (
        renderGameCompletion()
      )}
      
      {showCelebration && renderCelebration()}
    </div>
  );
};

export default LogicPuzzleGame;