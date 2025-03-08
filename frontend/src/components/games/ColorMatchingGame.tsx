import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface ColorMatchingGameProps {
  playSound: (sound: string) => void;
  isMuted: boolean;
}

interface ColorItem {
  id: string;
  color: string;
  name: string;
  matched: boolean;
}

const ColorMatchingGame: React.FC<ColorMatchingGameProps> = ({ playSound, isMuted }) => {
  const [level, setLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [colorItems, setColorItems] = useState<ColorItem[]>([]);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [matchedPairs, setMatchedPairs] = useState<string[]>([]);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [attempts, setAttempts] = useState(0);

  // Color data
  const colorData = [
    { color: '#FF0000', name: 'Red' },
    { color: '#0000FF', name: 'Blue' },
    { color: '#FFFF00', name: 'Yellow' },
    { color: '#008000', name: 'Green' },
    { color: '#FFA500', name: 'Orange' },
    { color: '#800080', name: 'Purple' },
    { color: '#FFC0CB', name: 'Pink' },
    { color: '#A52A2A', name: 'Brown' },
    { color: '#000000', name: 'Black' },
    { color: '#FFFFFF', name: 'White', border: true },
    { color: '#808080', name: 'Gray' },
    { color: '#00FFFF', name: 'Cyan' },
  ];

  // Initialize game
  const initializeGame = () => {
    // Determine how many pairs based on level
    const pairsCount = Math.min(level + 2, 8);
    
    // Shuffle and select colors
    const shuffledColors = [...colorData].sort(() => Math.random() - 0.5).slice(0, pairsCount);
    
    // Create color items (color blocks and color names)
    const colorBlocks = shuffledColors.map(item => ({
      id: `color-${item.name}`,
      color: item.color,
      name: item.name,
      matched: false,
    }));
    
    const colorNames = shuffledColors.map(item => ({
      id: `name-${item.name}`,
      color: item.color,
      name: item.name,
      matched: false,
    }));
    
    // Combine and shuffle all items
    const allItems = [...colorBlocks, ...colorNames].sort(() => Math.random() - 0.5);
    
    setColorItems(allItems);
    setSelectedItems([]);
    setMatchedPairs([]);
    setGameCompleted(false);
    setScore(0);
    setAttempts(0);
    setShowCelebration(false);
  };

  // Handle item click
  const handleItemClick = (id: string) => {
    // Ignore clicks if already matched or already selected
    const clickedItem = colorItems.find(item => item.id === id);
    if (!clickedItem || clickedItem.matched || selectedItems.includes(id) || selectedItems.length >= 2) {
      return;
    }
    
    // Play sound
    playSound('card-flip');
    
    // Add to selected items
    const newSelectedItems = [...selectedItems, id];
    setSelectedItems(newSelectedItems);
    
    // Check for match if two items are selected
    if (newSelectedItems.length === 2) {
      setAttempts(prev => prev + 1);
      
      const firstItemId = newSelectedItems[0];
      const secondItemId = newSelectedItems[1];
      
      const firstItem = colorItems.find(item => item.id === firstItemId);
      const secondItem = colorItems.find(item => item.id === secondItemId);
      
      if (firstItem && secondItem && firstItem.name === secondItem.name) {
        // Match found
        setTimeout(() => {
          playSound('match-success');
          
          // Mark items as matched
          const updatedItems = colorItems.map(item => 
            item.id === firstItemId || item.id === secondItemId
              ? { ...item, matched: true }
              : item
          );
          setColorItems(updatedItems);
          
          // Add to matched pairs
          const newMatchedPairs = [...matchedPairs, firstItem.name];
          setMatchedPairs(newMatchedPairs);
          
          // Update score
          setScore(prev => prev + 10);
          
          // Reset selected items
          setSelectedItems([]);
          
          // Check if game is completed
          if (newMatchedPairs.length === updatedItems.length / 2) {
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
          
          // Reset selected items
          setSelectedItems([]);
        }, 1000);
      }
    }
  };

  // Handle level change
  const handleLevelChange = (newLevel: number) => {
    setLevel(newLevel);
    initializeGame();
  };

  // Start next level
  const handleNextLevel = () => {
    if (level < 5) {
      setLevel(prev => prev + 1);
      initializeGame();
    }
  };

  // Reset game
  const handleResetGame = () => {
    initializeGame();
  };

  // Initialize game when level changes
  useEffect(() => {
    initializeGame();
  }, [level]);

  // Render game instructions
  const renderInstructions = () => (
    <div className="mb-6 p-4 bg-yellow-50 rounded-lg border border-yellow-100">
      <h3 className="text-lg font-semibold text-yellow-800 mb-2">How to Play:</h3>
      <ul className="list-disc list-inside text-yellow-700 space-y-1">
        <li>Match each color with its name</li>
        <li>Click on items to select them</li>
        <li>Find all matching pairs to complete the level</li>
        <li>Higher levels have more colors to match!</li>
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
          <span className="font-semibold text-purple-800">Attempts: {attempts}</span>
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

  // Render color matching grid
  const renderColorGrid = () => (
    <div className="grid grid-cols-4 gap-4 mb-6">
      {colorItems.map(item => (
        <motion.div
          key={item.id}
          whileHover={{ scale: item.matched ? 1 : 1.05 }}
          whileTap={{ scale: item.matched ? 1 : 0.95 }}
          className={`
            aspect-square rounded-lg cursor-pointer
            ${item.matched ? 'opacity-70 pointer-events-none' : 'cursor-pointer'}
            ${selectedItems.includes(item.id) ? 'ring-4 ring-blue-500' : ''}
          `}
          onClick={() => handleItemClick(item.id)}
        >
          {item.id.startsWith('color') ? (
            <div 
              className={`
                w-full h-full rounded-lg flex items-center justify-center
                ${item.color === '#FFFFFF' ? 'border-2 border-gray-300' : ''}
              `}
              style={{ backgroundColor: item.color }}
            ></div>
          ) : (
            <div className="w-full h-full rounded-lg bg-gray-100 border-2 border-gray-300 flex items-center justify-center">
              <span className="text-lg font-bold text-gray-800">{item.name}</span>
            </div>
          )}
        </motion.div>
      ))}
    </div>
  );

  // Render game completion
  const renderGameCompletion = () => {
    if (!gameCompleted) return null;
    
    return (
      <div className="mt-6 p-6 bg-green-100 rounded-lg border border-green-200 text-center">
        <h3 className="text-2xl font-bold text-green-700 mb-2">
          Level {level} Completed!
        </h3>
        <p className="text-green-600 text-lg mb-4">
          You matched all colors in {attempts} attempts with a score of {score}!
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
        <h2 className="text-3xl font-bold text-green-600 mb-4">Colorful Success!</h2>
        <p className="text-xl text-gray-700 mb-4">You completed level {level}!</p>
        <div className="flex justify-center">
          <div className="flex space-x-2">
            {['🌈', '🎨', '🖌️', '🎭'].map((emoji, index) => (
              <motion.div
                key={index}
                animate={{ 
                  y: [0, -15, 0],
                  rotate: [0, 10, -10, 0]
                }}
                transition={{ 
                  repeat: Infinity,
                  duration: 1.5,
                  delay: index * 0.2
                }}
                className="text-4xl"
              >
                {emoji}
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );

  // Progress indicator
  const renderProgressIndicator = () => (
    <div className="mb-6">
      <div className="flex justify-between mb-2">
        <span className="text-sm text-gray-600">Progress:</span>
        <span className="text-sm font-medium text-blue-600">
          {matchedPairs.length} / {colorItems.length / 2} pairs matched
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div 
          className="bg-blue-600 h-2.5 rounded-full transition-all duration-500" 
          style={{ width: `${(matchedPairs.length / (colorItems.length / 2)) * 100}%` }}
        ></div>
      </div>
    </div>
  );

  return (
    <div className="relative">
      {renderInstructions()}
      {renderLevelSelector()}
      {renderGameControls()}
      {renderProgressIndicator()}
      {renderColorGrid()}
      {renderGameCompletion()}
      
      {showCelebration && renderCelebration()}
    </div>
  );
};

export default ColorMatchingGame;