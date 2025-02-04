import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Trophy, Medal, Star, Target, Crown, Award, BookOpen, Zap, Flag, 
  RocketIcon, CheckCircle2, TrendingUp, Users, ArrowUp 
} from 'lucide-react';
import { authenticatedGet } from '../utils/api';
import { formatDistanceToNow, parseISO } from 'date-fns';

interface Badge {
  type: string;
  name: string;
  description: string;
  icon: string;
}

interface RecentXPHistory {
  source: string;
  amount: number;
  createdAt: string;
}

interface Achievements {
  courses: number;
  quizzes: number;
  aiInteractions: number;
  _id?: string;
}

interface GamificationData {
  totalXP: number;
  level: number;
  badges: Badge[];
  achievements: Achievements;
  recentXPHistory: RecentXPHistory[];
  leaderboardPoints: number;
}

const calculateXPForNextLevel = (currentLevel: number): number => {
  return Math.floor(100 * Math.pow(1.5, currentLevel));
};

function Achievements() {
  const [gamificationData, setGamificationData] = useState<GamificationData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGamificationData = async () => {
      try {
        setLoading(true);
        const gamificationResponse = await authenticatedGet<GamificationData>('/student/gamification/gamification-data');
        setGamificationData(gamificationResponse.data);
        setLoading(false);
      } catch (err) {
        console.error('Failed to fetch gamification data:', err);
        setError('Failed to load gamification details. Please try again later.');
        setLoading(false);
      }
    };

    fetchGamificationData();
  }, []);

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

  const getSourceIcon = (source: string) => {
    const sourceIcons = {
      'course': <Trophy className="w-5 h-5 text-green-500" />,
      'quiz': <BookOpen className="w-5 h-5 text-blue-500" />,
      'ai_interaction': <Zap className="w-5 h-5 text-purple-500" />,
      'default': <Star className="w-5 h-5 text-gray-500" />
    };
    return sourceIcons[source] || sourceIcons['default'];
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <motion.div
          animate={{ 
            rotate: [0, 360],
            scale: [1, 1.2, 1]
          }}
          transition={{ 
            duration: 2, 
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <Trophy className="w-16 h-16 text-blue-500" />
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 p-8">
        {error}
      </div>
    );
  }

  // If no achievements or XP, show professional onboarding view
  if (gamificationData && 
      gamificationData.totalXP === 0 && 
      gamificationData.level === 1 && 
      gamificationData.badges.length === 0 && 
      gamificationData.recentXPHistory.length === 0
  ) {
    return (
      <div className="min-h-screen w-full bg-gradient-to-br from-blue-50 to-white flex items-center justify-center p-8">
        <motion.div 
          className="max-w-4xl w-full bg-white rounded-2xl shadow-2xl overflow-hidden"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="grid md:grid-cols-2">
            {/* Illustration Side */}
            <div className="bg-blue-500 text-white p-12 flex flex-col justify-center items-center">
              <RocketIcon className="w-32 h-32 mb-6 text-white" strokeWidth={1} />
              <h2 className="text-3xl font-bold mb-4 text-center">
                Your Learning Journey Begins
              </h2>
              <p className="text-center text-blue-100 mb-6">
                Every great achievement starts with a single step. 
                Get ready to unlock your potential!
              </p>
              <div className="space-y-3 w-full">
                <div className="flex items-center bg-white/10 p-3 rounded-lg">
                  <CheckCircle2 className="w-6 h-6 mr-3 text-yellow-300" />
                  <span>Track Your Progress</span>
                </div>
                <div className="flex items-center bg-white/10 p-3 rounded-lg">
                  <TrendingUp className="w-6 h-6 mr-3 text-green-300" />
                  <span>Earn XP and Levels</span>
                </div>
                <div className="flex items-center bg-white/10 p-3 rounded-lg">
                  <Users className="w-6 h-6 mr-3 text-purple-300" />
                  <span>Join the Leaderboard</span>
                </div>
              </div>
            </div>

            {/* Action Side */}
            <div className="p-12 flex flex-col justify-center">
              <h3 className="text-2xl font-bold text-gray-800 mb-6">
                Start Earning XP Today!
              </h3>
              
              <div className="space-y-4 mb-8">
                <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
                  <div className="flex items-center mb-2">
                    <BookOpen className="w-6 h-6 mr-3 text-green-600" />
                    <h4 className="font-semibold text-green-800">Complete Courses</h4>
                  </div>
                  <p className="text-green-700">
                    Finish your first course and start accumulating XP immediately.
                  </p>
                </div>
                
                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                  <div className="flex items-center mb-2">
                    <Trophy className="w-6 h-6 mr-3 text-blue-600" />
                    <h4 className="font-semibold text-blue-800">Take Quizzes</h4>
                  </div>
                  <p className="text-blue-700">
                    Challenge yourself with quizzes to boost your XP and skills.
                  </p>
                </div>
                
                <div className="bg-purple-50 border-l-4 border-purple-500 p-4 rounded">
                  <div className="flex items-center mb-2">
                    <Zap className="w-6 h-6 mr-3 text-purple-600" />
                    <h4 className="font-semibold text-purple-800">Engage Actively</h4>
                  </div>
                  <p className="text-purple-700">
                    Participate in AI interactions and community activities.
                  </p>
                </div>
              </div>

              <button 
                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
                onClick={() => {
                  // TODO: Add navigation or action to start learning
                  console.log('Start Learning Journey');
                }}
              >
                <RocketIcon className="w-5 h-5 mr-2" />
                Start Your Learning Journey
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  const xpForNextLevel = calculateXPForNextLevel(gamificationData?.level || 1);
  const xpProgressPercentage = Math.min(
    (gamificationData?.totalXP || 0 / xpForNextLevel) * 100, 
    100
  );

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-50 to-white p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* XP and Level Overview */}
        <motion.div 
          className="bg-white rounded-2xl shadow-lg p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <Trophy className="w-10 h-10 text-blue-600 mr-4" />
              <div>
                <h2 className="text-2xl font-bold text-gray-800">
                  Level {gamificationData?.level}
                </h2>
                <p className="text-gray-600">
                  {gamificationData?.totalXP} / {xpForNextLevel} XP
                </p>
              </div>
            </div>
            <div className="flex items-center text-green-600">
              <ArrowUp className="w-6 h-6 mr-2" />
              <span className="font-semibold">
                {Math.round(xpProgressPercentage)}% to Next Level
              </span>
            </div>
          </div>
          
          {/* XP Progress Bar */}
          <div className="w-full bg-blue-100 rounded-full h-4 overflow-hidden">
            <motion.div 
              className="bg-blue-600 h-full rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${xpProgressPercentage}%` }}
              transition={{ duration: 1, type: 'spring' }}
            />
          </div>
        </motion.div>

        {/* Achievements Grid */}
        <motion.div 
          className="grid md:grid-cols-3 gap-6"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                delayChildren: 0.3,
                staggerChildren: 0.2
              }
            }
          }}
        >
          {/* Courses Achievement */}
          <motion.div 
            className="bg-white rounded-2xl shadow-lg p-6"
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 }
            }}
          >
            <div className="flex items-center mb-4">
              <BookOpen className="w-8 h-8 text-green-600 mr-4" />
              <h3 className="text-xl font-bold text-gray-800">Courses</h3>
            </div>
            <div className="w-full bg-green-100 rounded-full h-4 mb-2 overflow-hidden">
              <div 
                className="bg-green-600 h-full rounded-full" 
                style={{ width: `${Math.min(gamificationData?.achievements.courses * 10, 100)}%` }}
              />
            </div>
            <p className="text-gray-600">
              {gamificationData?.achievements.courses} Courses Completed
            </p>
          </motion.div>

          {/* Quizzes Achievement */}
          <motion.div 
            className="bg-white rounded-2xl shadow-lg p-6"
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 }
            }}
          >
            <div className="flex items-center mb-4">
              <Trophy className="w-8 h-8 text-blue-600 mr-4" />
              <h3 className="text-xl font-bold text-gray-800">Quizzes</h3>
            </div>
            <div className="w-full bg-blue-100 rounded-full h-4 mb-2 overflow-hidden">
              <div 
                className="bg-blue-600 h-full rounded-full" 
                style={{ width: `${Math.min(gamificationData?.achievements.quizzes * 10, 100)}%` }}
              />
            </div>
            <p className="text-gray-600">
              {gamificationData?.achievements.quizzes} Quizzes Completed
            </p>
          </motion.div>

          {/* AI Interactions Achievement */}
          <motion.div 
            className="bg-white rounded-2xl shadow-lg p-6"
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 }
            }}
          >
            <div className="flex items-center mb-4">
              <Zap className="w-8 h-8 text-purple-600 mr-4" />
              <h3 className="text-xl font-bold text-gray-800">AI Interactions</h3>
            </div>
            <div className="w-full bg-purple-100 rounded-full h-4 mb-2 overflow-hidden">
              <div 
                className="bg-purple-600 h-full rounded-full" 
                style={{ width: `${Math.min(gamificationData?.achievements.aiInteractions * 10, 100)}%` }}
              />
            </div>
            <p className="text-gray-600">
              {gamificationData?.achievements.aiInteractions} AI Interactions
            </p>
          </motion.div>
        </motion.div>

        {/* Badges Section */}
        {gamificationData?.badges.length > 0 && (
          <motion.div 
            className="bg-white rounded-2xl shadow-lg p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h3 className="text-2xl font-bold text-gray-800 mb-6">
              Earned Badges
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {gamificationData?.badges.map((badge, index) => (
                <div 
                  key={index} 
                  className="flex flex-col items-center bg-gray-100 p-4 rounded-lg"
                >
                  <img 
                    src={badge.icon} 
                    alt={badge.name} 
                    className="w-16 h-16 mb-2"
                  />
                  <h4 className="font-semibold text-gray-800">{badge.name}</h4>
                  <p className="text-gray-600 text-sm text-center">
                    {badge.description}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default Achievements;
