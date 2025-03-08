import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface AlphabetMatchingGameProps {
  playSound: (sound: string) => void;
  isMuted: boolean;
}

interface AlphabetCard {
  id: string;
  letter: string;
  image: string;
  word: string;
  flipped: boolean;
  matched: boolean;
}

const AlphabetMatchingGame: React.FC<AlphabetMatchingGameProps> = ({ playSound, isMuted }) => {
  const [cards, setCards] = useState<AlphabetCard[]>([]);
  const [flippedCards, setFlippedCards] = useState<string[]>([]);
  const [matchedPairs, setMatchedPairs] = useState<string[]>([]);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [level, setLevel] = useState(1);
  const [showCelebration, setShowCelebration] = useState(false);

  // Alphabet data with images and words
  const alphabetData = [
    { letter: 'A', word: 'Apple', image: 'https://cdn-icons-png.flaticon.com/128/415/415682.png' },
    { letter: 'B', word: 'Ball', image: 'https://cdn-icons-png.flaticon.com/128/3097/3097008.png' },
    { letter: 'C', word: 'Cat', image: 'https://cdn-icons-png.flaticon.com/128/616/616430.png' },
    { letter: 'D', word: 'Dog', image: 'https://cdn-icons-png.flaticon.com/128/616/616408.png' },
    { letter: 'E', word: 'Elephant', image: 'https://cdn-icons-png.flaticon.com/128/2395/2395796.png' },
    { letter: 'F', word: 'Fish', image: 'https://cdn-icons-png.flaticon.com/128/1998/1998610.png' },
    { letter: 'G', word: 'Giraffe', image: 'https://cdn-icons-png.flaticon.com/128/371/371633.png' },
    { letter: 'H', word: 'House', image: 'https://cdn-icons-png.flaticon.com/128/619/619153.png' },
    { letter: 'I', word: 'Ice Cream', image: 'https://cdn-icons-png.flaticon.com/128/938/938063.png' },
    { letter: 'J', word: 'Jellyfish', image: 'https://cdn-icons-png.flaticon.com/128/4442/4442016.png' },
    { letter: 'K', word: 'Kite', image: 'https://cdn-icons-png.flaticon.com/128/2965/2965253.png' },
    { letter: 'L', word: 'Lion', image: 'https://cdn-icons-png.flaticon.com/128/2395/2395765.png' },
    { letter: 'M', word: 'Monkey', image: 'https://cdn-icons-png.flaticon.com/128/616/616434.png' },
    { letter: 'N', word: 'Nest', image: 'https://cdn-icons-png.flaticon.com/128/2395/2395860.png' },
    { letter: 'O', word: 'Orange', image: 'https://cdn-icons-png.flaticon.com/128/415/415733.png' },
    { letter: 'P', word: 'Penguin', image: 'https://cdn-icons-png.flaticon.com/128/371/371744.png' },
    { letter: 'Q', word: 'Queen', image: 'https://cdn-icons-png.flaticon.com/128/2271/2271092.png' },
    { letter: 'R', word: 'Rabbit', image: 'https://cdn-icons-png.flaticon.com/128/3069/3069172.png' },
    { letter: 'S', word: 'Sun', image: 'https://cdn-icons-png.flaticon.com/128/869/869869.png' },
    { letter: 'T', word: 'Tree', image: 'https://cdn-icons-png.flaticon.com/128/490/490091.png' },
    { letter: 'U', word: 'Umbrella', image: 'https://cdn-icons-png.flaticon.com/128/2942/2942909.png' },
    { letter: 'V', word: 'Violin', image: 'https://cdn-icons-png.flaticon.com/128/2907/2907253.png' },
    { letter: 'W', word: 'Whale', image: 'https://cdn-icons-png.flaticon.com/128/616/616513.png' },
    { letter: 'X', word: 'Xylophone', image: 'https://cdn-icons-png.flaticon.com/128/3659/3659784.png' },
    { letter: 'Y', word: 'Yo-yo', image: 'https://cdn-icons-png.flaticon.com/128/3718/3718930.png' },
    { letter: 'Z', word: 'Zebra', image: 'https://cdn-icons-png.flaticon.com/128/371/371771.png' },
  ];

  // Initialize game with enhanced randomization
  const initializeGame = () => {
    // Determine how many pairs based on level
    const pairsCount = Math.min(level + 3, 8); // Level 1: 4 pairs, Level 2: 5 pairs, etc.

    // Completely randomize the alphabet data each time
    const randomizedAlphabet = [...alphabetData]
      .sort(() => Math.random() - 0.5) // First shuffle
      .map(item => ({ ...item, randomValue: Math.random() })) // Add random values
      .sort((a, b) => a.randomValue - b.randomValue) // Sort by random values
      .slice(0, pairsCount); // Take only what we need

    // Create pairs of cards with randomized styles
    const letterCards = randomizedAlphabet.map(item => {
      // Random background colors for letter cards
      const hue = Math.floor(Math.random() * 360);
      const bgColor = `hsla(${hue}, 80%, 90%, 1)`;

      return {
        id: `letter-${item.letter}-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
        letter: item.letter,
        image: '',
        word: item.word,
        flipped: false,
        matched: false,
        bgColor
      };
    });

    const imageCards = randomizedAlphabet.map(item => {
      // Random border styles for image cards
      const borderWidth = Math.floor(Math.random() * 3) + 2; // 2-4px
      const hue = Math.floor(Math.random() * 360);
      const borderColor = `hsla(${hue}, 70%, 60%, 1)`;

      return {
        id: `image-${item.letter}-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
        letter: item.letter,
        image: item.image,
        word: item.word,
        flipped: false,
        matched: false,
        borderWidth,
        borderColor
      };
    });

    // Combine and apply multiple shuffle techniques for true randomness
    let allCards = [...letterCards, ...imageCards];

    // Fisher-Yates shuffle algorithm
    for (let i = allCards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [allCards[i], allCards[j]] = [allCards[j], allCards[i]];
    }

    // Additional randomization by splitting and recombining
    const midpoint = Math.floor(allCards.length / 2);
    const firstHalf = allCards.slice(0, midpoint).sort(() => Math.random() - 0.5);
    const secondHalf = allCards.slice(midpoint).sort(() => Math.random() - 0.5);

    // Randomly decide whether to put first half first or second half first
    allCards = Math.random() > 0.5
      ? [...firstHalf, ...secondHalf]
      : [...secondHalf, ...firstHalf];

    setCards(allCards);
    setFlippedCards([]);
    setMatchedPairs([]);
    setGameCompleted(false);
    setScore(0);
    setAttempts(0);
    setGameStarted(true);
    setShowCelebration(false);
  };

  // Handle card click
  const handleCardClick = (id: string) => {
    // Ignore clicks if already flipped or matched
    const clickedCard = cards.find(card => card.id === id);
    if (!clickedCard || clickedCard.flipped || clickedCard.matched || flippedCards.length >= 2) {
      return;
    }
    
    // Play flip sound
    playSound('card-flip');
    
    // Flip the card
    const updatedCards = cards.map(card => 
      card.id === id ? { ...card, flipped: true } : card
    );
    setCards(updatedCards);
    
    // Add to flipped cards
    const newFlippedCards = [...flippedCards, id];
    setFlippedCards(newFlippedCards);
    
    // Check for match if two cards are flipped
    if (newFlippedCards.length === 2) {
      setAttempts(prev => prev + 1);
      
      const firstCardId = newFlippedCards[0];
      const secondCardId = newFlippedCards[1];
      
      const firstCard = cards.find(card => card.id === firstCardId);
      const secondCard = cards.find(card => card.id === secondCardId);
      
      if (firstCard && secondCard && firstCard.letter === secondCard.letter) {
        // Match found
        setTimeout(() => {
          playSound('match-success');
          
          // Mark cards as matched
          const updatedCards = cards.map(card => 
            card.id === firstCardId || card.id === secondCardId
              ? { ...card, matched: true }
              : card
          );
          setCards(updatedCards);
          
          // Add to matched pairs
          const newMatchedPairs = [...matchedPairs, firstCard.letter];
          setMatchedPairs(newMatchedPairs);
          
          // Update score
          setScore(prev => prev + 10);
          
          // Reset flipped cards
          setFlippedCards([]);
          
          // Check if game is completed
          if (newMatchedPairs.length === updatedCards.length / 2) {
            playSound('game-complete');
            setGameCompleted(true);
            setShowCelebration(true);
            
            // Hide celebration after 3 seconds
            setTimeout(() => {
              setShowCelebration(false);
            }, 3000);
          }
        }, 500);
      } else {
        // No match
        setTimeout(() => {
          playSound('match-fail');
          
          // Flip cards back
          const updatedCards = cards.map(card => 
            card.id === firstCardId || card.id === secondCardId
              ? { ...card, flipped: false }
              : card
          );
          setCards(updatedCards);
          
          // Reset flipped cards
          setFlippedCards([]);
        }, 1000);
      }
    }
  };

  // Handle level change
  const handleLevelChange = (newLevel: number) => {
    setLevel(newLevel);
    setGameStarted(false);
  };

  // Start next level
  const handleNextLevel = () => {
    if (level < 5) {
      setLevel(prev => prev + 1);
      setGameStarted(false);
    }
  };

  // Reset game
  const handleResetGame = () => {
    setGameStarted(false);
  };

  // Initialize game when level changes or game starts
  useEffect(() => {
    if (!gameStarted) {
      initializeGame();
    }
  }, [level, gameStarted]);

  // Render game instructions
  const renderInstructions = () => (
    <div className="mb-6 p-4 bg-yellow-50 rounded-lg border border-yellow-100">
      <h3 className="text-lg font-semibold text-yellow-800 mb-2">How to Play:</h3>
      <ul className="list-disc list-inside text-yellow-700 space-y-1">
        <li>Find matching pairs of letters and images</li>
        <li>Click on cards to flip them</li>
        <li>Match all pairs to complete the level</li>
        <li>Try to complete with fewer attempts for a higher score!</li>
      </ul>
    </div>
  );

  // Render game board
  const renderGameBoard = () => (
    <div className="mb-6">
      <div className="grid grid-cols-4 gap-3">
        {cards.map(card => (
          <motion.div
            key={card.id}
            whileHover={{ scale: card.flipped || card.matched ? 1 : 1.05 }}
            whileTap={{ scale: card.flipped || card.matched ? 1 : 0.95 }}
            className={`
              aspect-square rounded-lg cursor-pointer
              ${card.flipped || card.matched ? 'pointer-events-none' : 'cursor-pointer'}
              ${card.matched ? 'opacity-70' : 'opacity-100'}
            `}
            onClick={() => handleCardClick(card.id)}
          >
            <div
              style={{
                backgroundColor: card.matched
                  ? '#d1fae5' // green-100
                  : card.flipped
                    ? (card.bgColor || '#dbeafe') // Use random color or default blue-100
                    : '#dbeafe', // blue-100
                borderWidth: card.borderWidth ? `${card.borderWidth}px` : '2px',
                borderColor: card.matched
                  ? '#86efac' // green-300
                  : card.borderColor || '#93c5fd', // Use random color or default blue-300
                transform: (card.flipped || card.matched) ? 'rotateY(180deg)' : 'none',
                transition: 'all 0.3s ease'
              }}
              className={`
              w-full h-full rounded-lg flex items-center justify-center
              shadow-md hover:shadow-lg
            `}>
              {(card.flipped || card.matched) ? (
                <div className="flex flex-col items-center justify-center p-2">
                  {card.id.startsWith('letter') ? (
                    <span className="text-4xl font-bold text-blue-600">{card.letter}</span>
                  ) : (
                    <>
                      <img 
                        src={card.image} 
                        alt={card.word} 
                        className="w-12 h-12 object-contain mb-1"
                      />
                      <span className="text-xs text-center font-medium text-blue-700">{card.word}</span>
                    </>
                  )}
                </div>
              ) : (
                <span className="text-2xl font-bold text-blue-500">?</span>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );

  // Render game controls
  const renderGameControls = () => (
    <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
      <div className="flex items-center gap-3">
        <div className="bg-blue-100 px-4 py-2 rounded-lg">
          <span className="font-semibold text-blue-800">Level: {level}</span>
        </div>
        <div className="bg-green-100 px-4 py-2 rounded-lg">
          <span className="font-semibold text-green-800">Score: {score}</span>
        </div>
        <div className="bg-purple-100 px-4 py-2 rounded-lg">
          <span className="font-semibold text-purple-800">Attempts: {attempts}</span>
        </div>
      </div>
      
      <div className="flex gap-2">
        <button
          onClick={handleResetGame}
          className="px-4 py-2 bg-yellow-100 text-yellow-700 rounded-lg hover:bg-yellow-200 transition-colors"
        >
          Reset
        </button>
        
        {gameCompleted && (
          <button
            onClick={handleNextLevel}
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
            disabled={level >= 5}
          >
            {level >= 5 ? 'Max Level' : 'Next Level'}
          </button>
        )}
      </div>
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
        <h2 className="text-3xl font-bold text-green-600 mb-4">Great Job!</h2>
        <p className="text-xl text-gray-700 mb-4">You completed level {level}!</p>
        <div className="flex justify-center">
          <motion.div
            animate={{ 
              y: [0, -20, 0],
              scale: [1, 1.2, 1]
            }}
            transition={{ 
              repeat: Infinity,
              duration: 1
            }}
            className="text-5xl"
          >
            🎉
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );

  return (
    <div className="relative">
      {renderInstructions()}
      {renderLevelSelector()}
      {renderGameControls()}
      {renderGameBoard()}
      
      {showCelebration && renderCelebration()}
      
      {gameCompleted && (
        <div className="mt-6 p-4 bg-green-100 rounded-lg border border-green-200 text-center">
          <h3 className="text-xl font-bold text-green-700 mb-2">
            Level {level} Completed!
          </h3>
          <p className="text-green-600">
            You matched all pairs in {attempts} attempts with a score of {score}!
          </p>
          {level < 5 ? (
            <p className="mt-2 text-green-600">
              Click "Next Level" to continue your adventure!
            </p>
          ) : (
            <p className="mt-2 text-green-600">
              Congratulations! You've completed all levels!
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default AlphabetMatchingGame;