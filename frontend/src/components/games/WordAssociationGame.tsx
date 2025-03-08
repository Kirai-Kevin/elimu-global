import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface WordAssociationGameProps {
  playSound: (sound: string) => void;
  isMuted: boolean;
}

interface WordPair {
  id: string;
  word1: string;
  word2: string;
  relationship: string;
  options: string[];
  correctAnswer: string;
}

const WordAssociationGame: React.FC<WordAssociationGameProps> = ({ playSound, isMuted }) => {
  const [level, setLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [wordPairs, setWordPairs] = useState<WordPair[]>([]);
  const [currentPairIndex, setCurrentPairIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [streak, setStreak] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Word pairs data with relationships
  const wordPairsData = [
    // Synonyms
    { word1: 'Happy', word2: 'Joyful', relationship: 'Synonyms' },
    { word1: 'Brave', word2: 'Courageous', relationship: 'Synonyms' },
    { word1: 'Smart', word2: 'Intelligent', relationship: 'Synonyms' },
    { word1: 'Big', word2: 'Large', relationship: 'Synonyms' },
    { word1: 'Quick', word2: 'Fast', relationship: 'Synonyms' },
    { word1: 'Beautiful', word2: 'Gorgeous', relationship: 'Synonyms' },
    { word1: 'Tired', word2: 'Exhausted', relationship: 'Synonyms' },
    
    // Antonyms
    { word1: 'Hot', word2: 'Cold', relationship: 'Antonyms' },
    { word1: 'Light', word2: 'Dark', relationship: 'Antonyms' },
    { word1: 'Fast', word2: 'Slow', relationship: 'Antonyms' },
    { word1: 'Happy', word2: 'Sad', relationship: 'Antonyms' },
    { word1: 'Rich', word2: 'Poor', relationship: 'Antonyms' },
    { word1: 'Strong', word2: 'Weak', relationship: 'Antonyms' },
    { word1: 'Young', word2: 'Old', relationship: 'Antonyms' },
    
    // Cause and Effect
    { word1: 'Rain', word2: 'Wet', relationship: 'Cause and Effect' },
    { word1: 'Study', word2: 'Knowledge', relationship: 'Cause and Effect' },
    { word1: 'Exercise', word2: 'Fitness', relationship: 'Cause and Effect' },
    { word1: 'Fire', word2: 'Smoke', relationship: 'Cause and Effect' },
    { word1: 'Accident', word2: 'Injury', relationship: 'Cause and Effect' },
    
    // Part to Whole
    { word1: 'Wheel', word2: 'Car', relationship: 'Part to Whole' },
    { word1: 'Page', word2: 'Book', relationship: 'Part to Whole' },
    { word1: 'Pixel', word2: 'Image', relationship: 'Part to Whole' },
    { word1: 'Branch', word2: 'Tree', relationship: 'Part to Whole' },
    { word1: 'Key', word2: 'Keyboard', relationship: 'Part to Whole' },
    
    // Function
    { word1: 'Knife', word2: 'Cut', relationship: 'Function' },
    { word1: 'Pen', word2: 'Write', relationship: 'Function' },
    { word1: 'Phone', word2: 'Call', relationship: 'Function' },
    { word1: 'Hammer', word2: 'Nail', relationship: 'Function' },
    { word1: 'Brush', word2: 'Paint', relationship: 'Function' },
    
    // Category
    { word1: 'Apple', word2: 'Fruit', relationship: 'Category' },
    { word1: 'Dog', word2: 'Animal', relationship: 'Category' },
    { word1: 'Rose', word2: 'Flower', relationship: 'Category' },
    { word1: 'Oak', word2: 'Tree', relationship: 'Category' },
    { word1: 'Sedan', word2: 'Car', relationship: 'Category' },
    
    // Location
    { word1: 'Fish', word2: 'Ocean', relationship: 'Location' },
    { word1: 'Student', word2: 'School', relationship: 'Location' },
    { word1: 'Chef', word2: 'Kitchen', relationship: 'Location' },
    { word1: 'Doctor', word2: 'Hospital', relationship: 'Location' },
    { word1: 'Book', word2: 'Library', relationship: 'Location' },
    
    // Sequential
    { word1: 'Monday', word2: 'Tuesday', relationship: 'Sequential' },
    { word1: 'Spring', word2: 'Summer', relationship: 'Sequential' },
    { word1: 'Child', word2: 'Adult', relationship: 'Sequential' },
    { word1: 'Dawn', word2: 'Dusk', relationship: 'Sequential' },
    { word1: 'First', word2: 'Last', relationship: 'Sequential' },
  ];

  // Advanced word pairs for higher levels
  const advancedWordPairs = [
    // Advanced Synonyms
    { word1: 'Loquacious', word2: 'Verbose', relationship: 'Synonyms' },
    { word1: 'Ephemeral', word2: 'Transient', relationship: 'Synonyms' },
    { word1: 'Ubiquitous', word2: 'Omnipresent', relationship: 'Synonyms' },
    { word1: 'Sycophant', word2: 'Flatterer', relationship: 'Synonyms' },
    { word1: 'Pernicious', word2: 'Harmful', relationship: 'Synonyms' },
    
    // Advanced Antonyms
    { word1: 'Frugal', word2: 'Extravagant', relationship: 'Antonyms' },
    { word1: 'Benevolent', word2: 'Malevolent', relationship: 'Antonyms' },
    { word1: 'Taciturn', word2: 'Loquacious', relationship: 'Antonyms' },
    { word1: 'Magnanimous', word2: 'Petty', relationship: 'Antonyms' },
    { word1: 'Pragmatic', word2: 'Idealistic', relationship: 'Antonyms' },
    
    // Advanced Relationships
    { word1: 'Hypothesis', word2: 'Theory', relationship: 'Sequential Development' },
    { word1: 'Correlation', word2: 'Causation', relationship: 'Logical Fallacy' },
    { word1: 'Democracy', word2: 'Republic', relationship: 'Political Systems' },
    { word1: 'Algorithm', word2: 'Solution', relationship: 'Computational Process' },
    { word1: 'Quantum', word2: 'Relativity', relationship: 'Physics Theories' },
  ];

  // Generate word pairs based on level
  const generateWordPairs = () => {
    // Determine how many pairs based on level
    const pairsCount = 5 + level;
    
    // Select word pairs based on level
    let availablePairs = [...wordPairsData];
    
    // Add advanced pairs for higher levels
    if (level >= 3) {
      availablePairs = [...availablePairs, ...advancedWordPairs];
    }
    
    // Shuffle and select pairs
    const shuffledPairs = availablePairs
      .sort(() => Math.random() - 0.5)
      .slice(0, pairsCount);
    
    // Generate relationship options and create word pair objects
    const newWordPairs = shuffledPairs.map((pair, index) => {
      // Get all unique relationships for options
      const allRelationships = Array.from(
        new Set([...wordPairsData, ...advancedWordPairs].map(p => p.relationship))
      );
      
      // Create options including the correct answer
      let options = [pair.relationship];
      
      // Add incorrect options
      while (options.length < 4) {
        const randomRelationship = allRelationships[Math.floor(Math.random() * allRelationships.length)];
        if (!options.includes(randomRelationship)) {
          options.push(randomRelationship);
        }
      }
      
      // Shuffle options
      options = options.sort(() => Math.random() - 0.5);
      
      return {
        id: `pair-${index}-${Date.now()}`,
        word1: pair.word1,
        word2: pair.word2,
        relationship: pair.relationship,
        options,
        correctAnswer: pair.relationship
      };
    });
    
    setWordPairs(newWordPairs);
    setCurrentPairIndex(0);
    setSelectedAnswer(null);
    setIsCorrect(null);
    setGameCompleted(false);
    setShowCelebration(false);
    setTimeLeft(30); // Reset timer
    setIsPaused(false);
  };

  // Initialize game when level changes
  useEffect(() => {
    generateWordPairs();
  }, [level]);

  // Timer effect
  useEffect(() => {
    if (isPaused || gameCompleted) return;
    
    if (timeLeft > 0) {
      timerRef.current = setTimeout(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else {
      // Time's up - move to next question or end game
      handleTimeUp();
    }
    
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [timeLeft, isPaused, gameCompleted]);

  // Handle time up
  const handleTimeUp = () => {
    playSound('wrong-answer');
    setStreak(0);
    setSelectedAnswer(wordPairs[currentPairIndex].correctAnswer);
    setIsCorrect(false);
    
    // Move to next question after delay
    setTimeout(() => {
      if (currentPairIndex < wordPairs.length - 1) {
        setCurrentPairIndex(prev => prev + 1);
        setSelectedAnswer(null);
        setIsCorrect(null);
        setTimeLeft(30); // Reset timer
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
    }, 2000);
  };

  // Handle answer selection
  const handleAnswerSelect = (answer: string) => {
    if (selectedAnswer !== null) return; // Prevent multiple selections
    
    setSelectedAnswer(answer);
    setIsPaused(true); // Pause timer
    
    const currentPair = wordPairs[currentPairIndex];
    const correct = answer === currentPair.correctAnswer;
    
    setIsCorrect(correct);
    
    if (correct) {
      playSound('correct-answer');
      // Calculate score based on level and time left
      const timeBonus = Math.floor(timeLeft / 3);
      const levelMultiplier = level;
      const pointsEarned = 10 + timeBonus * levelMultiplier;
      
      setScore(prev => prev + pointsEarned);
      setStreak(prev => prev + 1);
      
      // Bonus points for streak
      if (streak > 0 && streak % 3 === 0) {
        playSound('bonus');
        setScore(prev => prev + 25);
      }
    } else {
      playSound('wrong-answer');
      setStreak(0);
    }
    
    // Move to next question after delay
    setTimeout(() => {
      if (currentPairIndex < wordPairs.length - 1) {
        setCurrentPairIndex(prev => prev + 1);
        setSelectedAnswer(null);
        setIsCorrect(null);
        setTimeLeft(30); // Reset timer
        setIsPaused(false); // Resume timer
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
    }, 2000);
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
    generateWordPairs();
    setScore(0);
    setStreak(0);
  };

  // Current word pair
  const currentPair = wordPairs[currentPairIndex];

  // Render game instructions
  const renderInstructions = () => (
    <div className="mb-6 p-4 bg-indigo-50 rounded-lg border border-indigo-100">
      <h3 className="text-lg font-semibold text-indigo-800 mb-2">How to Play:</h3>
      <ul className="list-disc list-inside text-indigo-700 space-y-1">
        <li>Identify the relationship between the two words</li>
        <li>Select the correct relationship from the options</li>
        <li>Answer quickly for bonus points</li>
        <li>Higher levels have more complex relationships</li>
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
              ${level === lvl ? 'bg-indigo-500 text-white' : 'bg-indigo-100 text-indigo-700'}
              hover:bg-indigo-400 hover:text-white transition-colors
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
        <div className="bg-indigo-100 px-4 py-2 rounded-lg">
          <span className="font-semibold text-indigo-800">Level: {level}</span>
        </div>
        <div className="bg-green-100 px-4 py-2 rounded-lg">
          <span className="font-semibold text-green-800">Score: {score}</span>
        </div>
        <div className="bg-purple-100 px-4 py-2 rounded-lg">
          <span className="font-semibold text-purple-800">
            Question: {currentPairIndex + 1}/{wordPairs.length}
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
      timeLeft > 20 ? 'text-green-600' :
      timeLeft > 10 ? 'text-yellow-600' :
      'text-red-600';
    
    return (
      <div className="mb-4 flex justify-center">
        <div className={`text-2xl font-bold ${timerColor}`}>
          Time: {timeLeft}s
        </div>
      </div>
    );
  };

  // Render word pair
  const renderWordPair = () => {
    if (!currentPair) return null;
    
    return (
      <div className="mb-8 p-6 bg-white rounded-xl border-2 border-indigo-200 shadow-md">
        <h3 className="text-xl font-semibold text-center mb-6 text-indigo-800">
          What is the relationship between these words?
        </h3>
        
        <div className="flex justify-center items-center gap-8 mb-6">
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="bg-indigo-100 px-6 py-4 rounded-lg shadow-md"
          >
            <span className="text-2xl font-bold text-indigo-700">{currentPair.word1}</span>
          </motion.div>
          
          <div className="text-indigo-400 text-xl">and</div>
          
          <motion.div
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="bg-indigo-100 px-6 py-4 rounded-lg shadow-md"
          >
            <span className="text-2xl font-bold text-indigo-700">{currentPair.word2}</span>
          </motion.div>
        </div>
        
        {renderTimer()}
      </div>
    );
  };

  // Render answer options
  const renderAnswerOptions = () => {
    if (!currentPair) return null;
    
    return (
      <div className="grid grid-cols-2 gap-4 mb-6">
        {currentPair.options.map((option, index) => {
          // Determine if this option is selected or correct
          const isSelected = selectedAnswer === option;
          const isCorrectOption = option === currentPair.correctAnswer;
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
                  ? 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200' 
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
            <p>The relationship is indeed "{currentPair.correctAnswer}"</p>
            {streak > 0 && streak % 3 === 0 && (
              <p className="mt-1 font-semibold">Streak bonus: +25 points!</p>
            )}
          </>
        ) : (
          <>
            <h3 className="text-xl font-bold mb-1">Not quite right</h3>
            <p>The correct relationship is "{currentPair.correctAnswer}"</p>
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
        <h2 className="text-3xl font-bold text-green-600 mb-4">Word Master!</h2>
        <p className="text-xl text-gray-700 mb-4">You completed level {level}!</p>
        <div className="flex justify-center gap-4">
          {['🧠', '📚', '🎓', '🔤'].map((emoji, index) => (
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
          className="bg-indigo-600 h-2.5 rounded-full transition-all duration-300" 
          style={{ width: `${((currentPairIndex) / wordPairs.length) * 100}%` }}
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
          {renderWordPair()}
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

export default WordAssociationGame;