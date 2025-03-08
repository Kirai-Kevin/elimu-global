import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface NumberCountingGameProps {
  playSound: (sound: string) => void;
  isMuted: boolean;
}

interface CountingObject {
  emoji: string;
  scale: number;
  rotation: number;
  id: string;
}

interface CountingQuestion {
  id: string | number;
  objects: CountingObject[];
  correctAnswer: number;
  options: number[];
}

const NumberCountingGame: React.FC<NumberCountingGameProps> = ({ playSound, isMuted }) => {
  const [level, setLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [questions, setQuestions] = useState<CountingQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [streak, setStreak] = useState(0);

  // Object emojis for counting
  const objectEmojis = [
    '🍎', '🍌', '🍓', '🍕', '🍦', '🍪', '🧸', '🎈', 
    '🚗', '✏️', '📚', '🏀', '⚽', '🐶', '🐱', '🐰'
  ];

  // Generate questions based on level with enhanced randomization
  const generateQuestions = () => {
    const newQuestions: CountingQuestion[] = [];
    // Randomize the number of questions per level for variety
    const questionsPerLevel = Math.floor(Math.random() * 2) + 4; // 4-5 questions

    // Shuffle the emoji array each time for more variety
    const shuffledEmojis = [...objectEmojis]
      .map(value => ({ value, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ value }) => value);

    for (let i = 0; i < questionsPerLevel; i++) {
      // Determine max count based on level with some randomness
      const baseMaxCount = level * 3 + 2;
      const randomFactor = Math.floor(Math.random() * 3); // Add 0-2 to max count for variety
      const maxCount = Math.min(baseMaxCount + randomFactor, 20);

      // Generate random count of objects with weighted distribution
      // Higher levels have higher probability of larger numbers
      let count;
      if (level <= 2) {
        // Lower levels: more likely to have smaller numbers
        count = Math.max(1, Math.floor(Math.random() * maxCount * 0.7) + 1);
      } else if (level <= 4) {
        // Mid levels: more evenly distributed
        count = Math.max(1, Math.floor(Math.random() * maxCount * 0.9) + 2);
      } else {
        // Highest level: more likely to have larger numbers
        const minCount = Math.max(1, Math.floor(maxCount * 0.4));
        count = Math.floor(Math.random() * (maxCount - minCount + 1)) + minCount;
      }

      // Select random emoji from shuffled array
      const emojiIndex = (i + Math.floor(Math.random() * 3)) % shuffledEmojis.length;
      const emoji = shuffledEmojis[emojiIndex];

      // Create array of objects with random positions
      const objects = Array(count).fill(null).map(() => {
        // Add slight variations to each emoji instance
        const scale = 0.8 + Math.random() * 0.4; // Scale between 0.8 and 1.2
        const rotation = Math.floor(Math.random() * 40) - 20; // Rotation between -20 and 20 degrees

        return {
          emoji,
          scale,
          rotation,
          id: Math.random().toString(36).substring(2, 9)
        };
      });

      // Generate answer options with strategic distractors
      let options = [count]; // Correct answer

      // Add incorrect options that are more challenging
      // For example, include numbers close to the correct answer
      const closeOptions = [count - 1, count + 1, count - 2, count + 2];

      // Also include some random options
      while (options.length < 4) {
        let option;

        if (Math.random() < 0.7 && closeOptions.length > 0) {
          // 70% chance to use a close option if available
          const closeOptionIndex = Math.floor(Math.random() * closeOptions.length);
          option = closeOptions.splice(closeOptionIndex, 1)[0];

          // Ensure option is valid (positive number)
          if (option < 1) {
            option = count + 3;
          }
        } else {
          // Otherwise use a random option
          option = Math.max(1, Math.floor(Math.random() * (maxCount + 5)));
        }

        if (!options.includes(option)) {
          options.push(option);
        }
      }

      // Multiple shuffle techniques for true randomness
      options = options
        .map(value => ({ value, sort: Math.random() }))
        .sort((a, b) => a.sort - b.sort)
        .map(({ value }) => value);

      // Create unique ID for each question
      const uniqueId = Date.now() + i + Math.random().toString(36).substring(2, 9);

      newQuestions.push({
        id: uniqueId,
        objects,
        correctAnswer: count,
        options
      });
    }

    // Randomize question order
    const randomizedQuestions = newQuestions
      .map(value => ({ value, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ value }) => value);

    setQuestions(randomizedQuestions);
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
  const handleAnswerSelect = (answer: number) => {
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
        <li>Count the objects shown on the screen</li>
        <li>Select the correct number from the options</li>
        <li>Complete all questions to finish the level</li>
        <li>Higher levels have more objects to count!</li>
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

  // Render counting objects with enhanced randomization
  const renderCountingObjects = () => {
    if (!currentQuestion) return null;

    // Get the emoji for the question title
    const firstEmoji = currentQuestion.objects[0]?.emoji || '🔢';

    // Generate a random background color for each question
    const hue = (currentQuestionIndex * 60 + Math.floor(Math.random() * 30)) % 360;
    const bgColor = `hsla(${hue}, 85%, 97%, 1)`;
    const borderColor = `hsla(${hue}, 70%, 85%, 1)`;

    return (
      <div
        className="mb-8 p-6 rounded-xl border-2 shadow-md"
        style={{
          backgroundColor: bgColor,
          borderColor: borderColor,
          transition: 'all 0.5s ease'
        }}
      >
        <h3 className="text-xl font-semibold text-center mb-4 text-blue-800">
          How many {firstEmoji} do you see?
        </h3>

        <div className="flex flex-wrap justify-center gap-4 mb-4 min-h-[120px] p-4 bg-white bg-opacity-70 rounded-lg">
          {currentQuestion.objects.map((obj, index) => (
            <motion.div
              key={obj.id}
              initial={{ scale: 0, rotate: 0 }}
              animate={{
                scale: obj.scale,
                rotate: obj.rotation
              }}
              transition={{
                delay: index * 0.05,
                type: "spring",
                stiffness: 260,
                damping: 20
              }}
              className="text-3xl md:text-4xl"
              style={{
                display: 'inline-block',
                filter: `saturate(${1 + Math.random() * 0.5})`,
                margin: `${Math.floor(Math.random() * 8)}px`
              }}
            >
              {obj.emoji}
            </motion.div>
          ))}
        </div>

        {/* Add a fun fact or hint based on the level */}
        <div className="mt-4 text-center text-sm text-blue-600 italic">
          {level === 1 && "Tip: Count each item one by one!"}
          {level === 2 && "Tip: Try counting in groups of 2!"}
          {level === 3 && "Fun fact: Counting helps develop math skills!"}
          {level === 4 && "Challenge: Try to count quickly!"}
          {level === 5 && "Pro tip: Group items to count faster!"}
        </div>
      </div>
    );
  };

  // Render answer options with enhanced visual appeal
  const renderAnswerOptions = () => {
    if (!currentQuestion) return null;

    return (
      <div className="grid grid-cols-2 gap-4 mb-6">
        {currentQuestion.options.map((option, index) => {
          // Generate unique gradients for each option
          const startHue = (index * 90 + Math.floor(Math.random() * 20)) % 360;
          const endHue = (startHue + 20) % 360;

          // Determine if this option is selected or correct
          const isSelected = selectedAnswer === option;
          const isCorrectOption = option === currentQuestion.correctAnswer;
          const showAsCorrect = isCorrectOption && selectedAnswer !== null;
          const showAsIncorrect = isSelected && !isCorrect;

          // Determine the background style
          let backgroundStyle = {};
          let textColor = 'text-blue-700';

          if (selectedAnswer === null) {
            // Not answered yet - show gradient backgrounds
            backgroundStyle = {
              background: `linear-gradient(135deg, hsla(${startHue}, 85%, 90%, 1) 0%, hsla(${endHue}, 80%, 85%, 1) 100%)`,
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              border: '2px solid transparent'
            };
          } else if (showAsCorrect) {
            // Show as correct answer
            backgroundStyle = {
              background: 'linear-gradient(135deg, #86efac 0%, #4ade80 100%)',
              boxShadow: '0 4px 12px rgba(74, 222, 128, 0.4)',
              border: '2px solid #22c55e'
            };
            textColor = 'text-white';
          } else if (showAsIncorrect) {
            // Show as incorrect selection
            backgroundStyle = {
              background: 'linear-gradient(135deg, #fca5a5 0%, #ef4444 100%)',
              boxShadow: '0 4px 12px rgba(239, 68, 68, 0.4)',
              border: '2px solid #dc2626'
            };
            textColor = 'text-white';
          } else {
            // Unselected option after answer
            backgroundStyle = {
              background: 'linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)',
              opacity: 0.7
            };
            textColor = 'text-gray-400';
          }

          return (
            <motion.button
              key={index}
              whileHover={{
                scale: selectedAnswer === null ? 1.05 : 1,
                boxShadow: selectedAnswer === null ? '0 8px 15px rgba(0, 0, 0, 0.1)' : undefined
              }}
              whileTap={{
                scale: selectedAnswer === null ? 0.95 : 1
              }}
              onClick={() => selectedAnswer === null && handleAnswerSelect(option)}
              style={backgroundStyle}
              className={`
                py-4 text-2xl font-bold rounded-xl
                ${textColor}
                transition-all duration-300
                relative overflow-hidden
              `}
              disabled={selectedAnswer !== null}
            >
              {/* Number display */}
              <span className="relative z-10">{option}</span>

              {/* Add decorative elements for correct answers */}
              {showAsCorrect && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: [0, 1.2, 1] }}
                  transition={{ duration: 0.5 }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <div className="absolute w-full h-full opacity-20">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute text-white text-2xl"
                        initial={{
                          x: '50%',
                          y: '50%',
                          scale: 0,
                          opacity: 0.8
                        }}
                        animate={{
                          x: `${50 + (Math.random() * 60 - 30)}%`,
                          y: `${50 + (Math.random() * 60 - 30)}%`,
                          scale: Math.random() * 0.5 + 0.5,
                          opacity: 0
                        }}
                        transition={{
                          duration: 1.5,
                          delay: i * 0.1,
                          repeat: Infinity,
                          repeatDelay: 0.5
                        }}
                      >
                        ✨
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
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
            <p>Great job counting!</p>
            {streak > 0 && streak % 3 === 0 && (
              <p className="mt-1 font-semibold">Streak bonus: +20 points!</p>
            )}
          </>
        ) : (
          <>
            <h3 className="text-xl font-bold mb-1">Not quite right</h3>
            <p>The correct answer is {currentQuestion.correctAnswer}</p>
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
        <h2 className="text-3xl font-bold text-green-600 mb-4">Amazing!</h2>
        <p className="text-xl text-gray-700 mb-4">You completed level {level}!</p>
        <div className="flex justify-center gap-4">
          {['🎉', '🎊', '🥳', '👏'].map((emoji, index) => (
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
          {renderCountingObjects()}
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

export default NumberCountingGame;