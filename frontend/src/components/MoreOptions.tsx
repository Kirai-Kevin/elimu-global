import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  User,
  LogOut,
  ChevronRight,
  Music,
  Puzzle,
  BookOpen,
  Palette,
  Brain,
  AlignLeft, // Replacing Abc with AlignLeft for alphabet
  Calculator,
  Square, // Replacing Shapes with Square
  Volume2,
  VolumeX
} from 'lucide-react';

// Game components
import AlphabetMatchingGame from './games/AlphabetMatchingGame';
import NumberCountingGame from './games/NumberCountingGame';
import ColorMatchingGame from './games/ColorMatchingGame';
import ShapeRecognitionGame from './games/ShapeRecognitionGame';
import WordAssociationGame from './games/WordAssociationGame';
import LogicPuzzleGame from './games/LogicPuzzleGame';

function MoreOptions() {
  const [activeGame, setActiveGame] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const backgroundMusicRef = useRef<HTMLAudioElement | null>(null);

  // Settings links - only keeping account settings
  const settingsLinks = [
    {
      name: "Account Settings",
      path: "/dashboard/account-settings",
      icon: User,
      description: "Manage your account details and preferences"
    }
  ];

  // Learning games for all ages
  const learningGames = [
    // Kids Games (Ages 3-7)
    {
      id: "alphabet-matching",
      name: "Alphabet Adventure",
      description: "Learn letters and sounds through fun matching activities",
      icon: AlignLeft, // Using AlignLeft icon for alphabet
      color: "bg-pink-100",
      iconColor: "text-pink-600",
      component: AlphabetMatchingGame,
      ageGroup: "kids"
    },
    {
      id: "number-counting",
      name: "Number Ninjas",
      description: "Count objects and learn numbers in an interactive way",
      icon: Calculator,
      color: "bg-blue-100",
      iconColor: "text-blue-600",
      component: NumberCountingGame,
      ageGroup: "kids"
    },
    {
      id: "color-matching",
      name: "Color Explorers",
      description: "Discover and match colors in a vibrant world",
      icon: Palette,
      color: "bg-purple-100",
      iconColor: "text-purple-600",
      component: ColorMatchingGame,
      ageGroup: "kids"
    },
    {
      id: "shape-recognition",
      name: "Shape Safari",
      description: "Identify and match different shapes in a fun environment",
      icon: Square, // Using Square icon for shapes
      color: "bg-green-100",
      iconColor: "text-green-600",
      component: ShapeRecognitionGame,
      ageGroup: "kids"
    },

    // Teen Games (Ages 12-17)
    {
      id: "word-association",
      name: "Word Connections",
      description: "Test your vocabulary by identifying relationships between words",
      icon: BookOpen,
      color: "bg-indigo-100",
      iconColor: "text-indigo-600",
      component: WordAssociationGame,
      ageGroup: "teens"
    },

    // Adult Games (Ages 18+)
    {
      id: "logic-puzzle",
      name: "Brain Teasers",
      description: "Challenge your logical thinking with puzzles and riddles",
      icon: Brain,
      color: "bg-amber-100",
      iconColor: "text-amber-600",
      component: LogicPuzzleGame,
      ageGroup: "adults"
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100
      }
    }
  };

  // Sound URLs from online sources
  const soundUrls = {
    'background-music': 'https://cdn.pixabay.com/download/audio/2022/03/10/audio_c8c8a73467.mp3?filename=fun-life-112188.mp3',
    'button-click': 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8a41bb0ae.mp3?filename=click-button-140881.mp3',
    'card-flip': 'https://cdn.pixabay.com/download/audio/2022/03/10/audio_bf3620f48d.mp3?filename=flipcard-91468.mp3',
    'match-success': 'https://cdn.pixabay.com/download/audio/2021/08/04/audio_0625c6a882.mp3?filename=success-1-6297.mp3',
    'match-fail': 'https://cdn.pixabay.com/download/audio/2021/08/04/audio_c8634af968.mp3?filename=negative_beeps-6008.mp3',
    'correct-answer': 'https://cdn.pixabay.com/download/audio/2021/08/04/audio_12b0c7443c.mp3?filename=success-fanfare-trumpets-6185.mp3',
    'wrong-answer': 'https://cdn.pixabay.com/download/audio/2021/08/04/audio_d3b28f3ce0.mp3?filename=wah-wah-sad-trombone-6347.mp3',
    'game-select': 'https://cdn.pixabay.com/download/audio/2022/03/22/audio_fcf5a1a68d.mp3?filename=interface-124464.mp3',
    'game-complete': 'https://cdn.pixabay.com/download/audio/2021/08/04/audio_88447e769f.mp3?filename=success-fanfare-trumpets-6185.mp3',
    'bonus': 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_942d18e5a1.mp3?filename=bonus-collect-140017.mp3',
    'logout': 'https://cdn.pixabay.com/download/audio/2021/08/04/audio_c8634af968.mp3?filename=negative_beeps-6008.mp3'
  };

  // Play sound effect
  const playSound = (soundName: string) => {
    if (isMuted) {
      console.log('Sound is muted, not playing:', soundName);
      return;
    }

    const soundUrl = soundUrls[soundName as keyof typeof soundUrls];
    if (!soundUrl) {
      console.warn(`Sound "${soundName}" not found`);
      return;
    }

    console.log('Attempting to play sound:', soundName, 'URL:', soundUrl);

    try {
      // Create a new audio instance each time for more reliable playback
      const audio = new Audio(soundUrl);
      audio.volume = 0.5; // Set appropriate volume

      // Play the sound with comprehensive error handling
      audio.play()
        .then(() => console.log('Sound playing successfully:', soundName))
        .catch(e => {
          console.error("Error playing sound:", soundName, e);
          // Fallback attempt with audioRef
          if (audioRef.current) {
            console.log('Trying fallback with audioRef');
            audioRef.current.src = soundUrl;
            audioRef.current.volume = 0.5;
            audioRef.current.play().catch(err => console.error("Fallback also failed:", err));
          }
        });
    } catch (error) {
      console.error("Exception trying to play sound:", error);
    }
  };

  // Toggle background music and sound effects
  const toggleMute = () => {
    const newMutedState = !isMuted;
    console.log('Toggling mute state to:', newMutedState ? 'Muted' : 'Unmuted');

    setIsMuted(newMutedState);

    if (backgroundMusicRef.current) {
      try {
        if (newMutedState) {
          // Muting - pause background music
          console.log('Pausing background music');
          backgroundMusicRef.current.pause();
        } else {
          // Unmuting - play background music
          console.log('Attempting to play background music');
          backgroundMusicRef.current.play()
            .then(() => console.log('Background music resumed successfully'))
            .catch(e => {
              console.error("Error playing background music:", e);

              // Try creating a new audio instance as fallback
              console.log('Trying to create new audio instance as fallback');
              backgroundMusicRef.current = new Audio(soundUrls['background-music']);
              backgroundMusicRef.current.loop = true;
              backgroundMusicRef.current.volume = 0.2;
              backgroundMusicRef.current.play()
                .catch(err => console.error("Fallback also failed:", err));
            });
        }
      } catch (error) {
        console.error('Error in toggle mute:', error);
      }
    }

    // Play a sound to confirm the toggle worked (only when unmuting)
    if (!newMutedState) {
      // Small delay to ensure state is updated
      setTimeout(() => {
        console.log('Playing test sound after unmute');
        // Create a one-time audio instance for immediate feedback
        const testAudio = new Audio(soundUrls['button-click']);
        testAudio.volume = 0.5;
        testAudio.play().catch(e => console.error('Test sound failed:', e));
      }, 100);
    }
  };

  // Handle game selection
  const handleGameSelect = (gameId: string) => {
    playSound('game-select');
    setActiveGame(gameId);
  };

  // Return to game selection
  const handleBackToGames = () => {
    playSound('button-click');
    setActiveGame(null);
  };

  const handleLogout = () => {
    playSound('logout');
    // Clear user data from localStorage
    localStorage.clear();
    // Redirect to login page
    window.location.href = '/login';
  };

  // Initialize background music
  useEffect(() => {
    try {
      console.log('Initializing background music');

      if (!backgroundMusicRef.current) {
        backgroundMusicRef.current = new Audio(soundUrls['background-music']);
        backgroundMusicRef.current.loop = true;
        backgroundMusicRef.current.volume = 0.2; // Lower volume for background music

        // Add event listeners for debugging
        backgroundMusicRef.current.addEventListener('play', () => {
          console.log('Background music started playing');
        });

        backgroundMusicRef.current.addEventListener('error', (e) => {
          console.error('Background music error:', e);
        });

        // Try to play background music if not muted
        if (!isMuted) {
          console.log('Attempting to play background music on init');
          backgroundMusicRef.current.play()
            .then(() => console.log('Background music playing successfully'))
            .catch(e => console.error('Failed to play background music:', e));
        }
      }
    } catch (error) {
      console.error('Error setting up background music:', error);
    }

    return () => {
      if (backgroundMusicRef.current) {
        console.log('Cleaning up background music');
        backgroundMusicRef.current.pause();
      }
    };
  }, []);

  // Render active game or game selection
  const renderContent = () => {
    if (activeGame) {
      const selectedGame = learningGames.find(game => game.id === activeGame);
      if (selectedGame) {
        const GameComponent = selectedGame.component;
        return (
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">{selectedGame.name}</h2>
              <button
                onClick={handleBackToGames}
                className="px-4 py-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
              >
                Back to Games
              </button>
            </div>
            <GameComponent playSound={playSound} isMuted={isMuted} />
          </div>
        );
      }
    }

    return (
      <>
        {/* Header with Illustration */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-8 bg-white rounded-xl p-6 shadow-lg">
          <div className="md:w-1/2 mb-6 md:mb-0">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">Fun Learning Games</h1>
            <p className="text-gray-600">
              Explore interactive games designed for kindergarten learning. Have fun while developing essential skills!
            </p>
          </div>
          <div className="md:w-1/2 flex justify-center">
            <img
              src="https://img.freepik.com/free-vector/happy-diverse-students-celebrating-graduation-from-school_74855-5853.jpg"
              alt="Kids Learning"
              className="w-full max-w-md h-auto rounded-lg"
              onError={(e) => {
                console.error('Failed to load primary image, trying fallback');
                const target = e.target as HTMLImageElement;
                target.src = "https://img.freepik.com/free-vector/children-learning-together-concept_23-2148630598.jpg";
              }}
            />
          </div>
        </div>

        {/* Learning Games Grid - Kids */}
        <h2 className="text-2xl font-bold text-blue-800 mb-4">Kids Learning Games</h2>
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {learningGames
            .filter(game => game.ageGroup === 'kids')
            .map((game) => (
              <motion.div
                key={game.id}
                variants={itemVariants}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer"
                onClick={() => handleGameSelect(game.id)}
              >
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <div className={`w-16 h-16 ${game.color} rounded-lg flex items-center justify-center mr-4`}>
                      <game.icon className={`w-8 h-8 ${game.iconColor}`} />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-800">{game.name}</h3>
                      <p className="text-gray-600">{game.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center text-blue-600">
                    <span className="mr-2">Play Now</span>
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              </motion.div>
            ))}
        </div>

        {/* Learning Games Grid - Teens */}
        <h2 className="text-2xl font-bold text-indigo-800 mb-4">Teen Learning Games</h2>
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {learningGames
            .filter(game => game.ageGroup === 'teens')
            .map((game) => (
              <motion.div
                key={game.id}
                variants={itemVariants}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer border-l-4 border-indigo-400"
                onClick={() => handleGameSelect(game.id)}
              >
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <div className={`w-16 h-16 ${game.color} rounded-lg flex items-center justify-center mr-4`}>
                      <game.icon className={`w-8 h-8 ${game.iconColor}`} />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-800">{game.name}</h3>
                      <p className="text-gray-600">{game.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center text-indigo-600">
                    <span className="mr-2">Play Now</span>
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              </motion.div>
            ))}
        </div>

        {/* Learning Games Grid - Adults */}
        <h2 className="text-2xl font-bold text-amber-800 mb-4">Adult Brain Games</h2>
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {learningGames
            .filter(game => game.ageGroup === 'adults')
            .map((game) => (
              <motion.div
                key={game.id}
                variants={itemVariants}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer border-l-4 border-amber-400"
                onClick={() => handleGameSelect(game.id)}
              >
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <div className={`w-16 h-16 ${game.color} rounded-lg flex items-center justify-center mr-4`}>
                      <game.icon className={`w-8 h-8 ${game.iconColor}`} />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-800">{game.name}</h3>
                      <p className="text-gray-600">{game.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center text-amber-600">
                    <span className="mr-2">Play Now</span>
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              </motion.div>
            ))}
        </div>

        {/* Settings Section */}
        <h2 className="text-2xl font-bold text-blue-800 mb-4">Settings</h2>
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {settingsLinks.map((link) => (
            <motion.div
              key={link.path}
              variants={itemVariants}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
              <Link to={link.path} className="block">
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                      <link.icon className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-800">{link.name}</h3>
                      <p className="text-gray-600">{link.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center text-blue-600">
                    <span className="mr-2">Configure</span>
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Sound Toggle and Logout */}
        <div className="flex flex-col md:flex-row gap-4">
          <motion.button
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={toggleMute}
            className="flex-1 p-4 bg-blue-50 rounded-xl border border-blue-100 hover:shadow-lg transition-all duration-300 flex items-center justify-center"
          >
            {isMuted ? (
              <>
                <VolumeX className="w-6 h-6 mr-2 text-blue-600" />
                <span className="text-lg font-semibold text-blue-600">Unmute Sounds</span>
              </>
            ) : (
              <>
                <Volume2 className="w-6 h-6 mr-2 text-blue-600" />
                <span className="text-lg font-semibold text-blue-600">Mute Sounds</span>
              </>
            )}
          </motion.button>

          <motion.button
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleLogout}
            className="flex-1 p-4 bg-red-50 rounded-xl border border-red-100 hover:shadow-lg transition-all duration-300 flex items-center justify-center text-red-600"
          >
            <LogOut className="w-6 h-6 mr-2" />
            <span className="text-lg font-semibold">Log Out</span>
          </motion.button>
        </div>
      </>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <motion.div
        className="container mx-auto px-4 py-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {renderContent()}

        {/* Audio elements for sound effects */}
        <audio ref={audioRef} />
      </motion.div>
    </div>
  );
}

export default MoreOptions;