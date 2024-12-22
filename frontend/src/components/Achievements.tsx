import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Medal, Star, Target, Crown, Award, BookOpen, Zap, Flag } from 'lucide-react';

interface Achievement {
  id: number;
  title: string;
  description: string;
  type: 'academic' | 'skill' | 'milestone';
  icon: 'trophy' | 'medal' | 'star' | 'crown';
  progress: number;
  maxProgress: number;
  xpPoints: number;
  dateEarned?: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

interface AchievementStats {
  totalAchievements: number;
  completedAchievements: number;
  totalXP: number;
  currentLevel: number;
  nextLevelXP: number;
  currentLevelXP: number;
}

function Achievements() {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [stats, setStats] = useState<AchievementStats>({
    totalAchievements: 0,
    completedAchievements: 0,
    totalXP: 0,
    currentLevel: 1,
    nextLevelXP: 1000,
    currentLevelXP: 0,
  });
  const [filter, setFilter] = useState<'all' | 'academic' | 'skill' | 'milestone'>('all');

  useEffect(() => {
    // Simulated achievements data
    const mockAchievements: Achievement[] = [
      {
        id: 1,
        title: 'Perfect Score',
        description: 'Achieve 100% on any test or assignment',
        type: 'academic',
        icon: 'trophy',
        progress: 3,
        maxProgress: 3,
        xpPoints: 500,
        dateEarned: '2024-12-20',
        rarity: 'epic'
      },
      {
        id: 2,
        title: 'Study Streak',
        description: 'Complete lessons for 7 consecutive days',
        type: 'milestone',
        icon: 'star',
        progress: 5,
        maxProgress: 7,
        xpPoints: 300,
        rarity: 'rare'
      },
      {
        id: 3,
        title: 'Knowledge Seeker',
        description: 'Complete 50 lessons',
        type: 'milestone',
        icon: 'medal',
        progress: 45,
        maxProgress: 50,
        xpPoints: 1000,
        rarity: 'legendary'
      },
      {
        id: 4,
        title: 'Math Master',
        description: 'Complete all math modules with at least 90%',
        type: 'academic',
        icon: 'crown',
        progress: 8,
        maxProgress: 10,
        xpPoints: 800,
        rarity: 'epic'
      },
      {
        id: 5,
        title: 'Quick Learner',
        description: 'Complete 5 lessons in one day',
        type: 'skill',
        icon: 'star',
        progress: 3,
        maxProgress: 5,
        xpPoints: 200,
        rarity: 'common'
      },
      {
        id: 6,
        title: 'Science Explorer',
        description: 'Complete all science experiments',
        type: 'academic',
        icon: 'medal',
        progress: 6,
        maxProgress: 8,
        xpPoints: 600,
        rarity: 'rare'
      }
    ];

    setAchievements(mockAchievements);

    // Calculate stats
    const completed = mockAchievements.filter(a => a.progress >= a.maxProgress).length;
    const totalXP = mockAchievements.reduce((sum, a) => 
      sum + (a.progress >= a.maxProgress ? a.xpPoints : Math.floor((a.progress / a.maxProgress) * a.xpPoints))
    , 0);

    setStats({
      totalAchievements: mockAchievements.length,
      completedAchievements: completed,
      totalXP: totalXP,
      currentLevel: Math.floor(totalXP / 1000) + 1,
      nextLevelXP: (Math.floor(totalXP / 1000) + 1) * 1000,
      currentLevelXP: totalXP % 1000,
    });
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

  const getIconComponent = (iconName: Achievement['icon']) => {
    switch (iconName) {
      case 'trophy': return <Trophy className="w-6 h-6" />;
      case 'medal': return <Medal className="w-6 h-6" />;
      case 'star': return <Star className="w-6 h-6" />;
      case 'crown': return <Crown className="w-6 h-6" />;
      default: return <Award className="w-6 h-6" />;
    }
  };

  const getRarityColor = (rarity: Achievement['rarity']) => {
    switch (rarity) {
      case 'common': return 'bg-gray-100 text-gray-600';
      case 'rare': return 'bg-blue-100 text-blue-600';
      case 'epic': return 'bg-purple-100 text-purple-600';
      case 'legendary': return 'bg-yellow-100 text-yellow-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const filteredAchievements = achievements.filter(
    achievement => filter === 'all' || achievement.type === filter
  );

  return (
    <div className="min-h-screen w-full bg-gray-50">
      <motion.div
        className="w-full px-4 py-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header with Illustration */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-8 bg-white rounded-xl p-6 shadow-lg">
          <div className="md:w-1/2 mb-6 md:mb-0">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">Your Achievements</h1>
            <p className="text-gray-600 mb-6">
              Track your progress, earn rewards, and showcase your accomplishments in your
              learning journey. Keep pushing forward to unlock more achievements!
            </p>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center bg-yellow-50 px-4 py-2 rounded-lg">
                <Trophy className="w-5 h-5 text-yellow-600 mr-2" />
                <span className="text-yellow-600">Level {stats.currentLevel}</span>
              </div>
              <div className="flex items-center bg-green-50 px-4 py-2 rounded-lg">
                <Target className="w-5 h-5 text-green-600 mr-2" />
                <span className="text-green-600">{stats.totalXP} XP</span>
              </div>
              <div className="flex items-center bg-blue-50 px-4 py-2 rounded-lg">
                <Award className="w-5 h-5 text-blue-600 mr-2" />
                <span className="text-blue-600">{stats.completedAchievements}/{stats.totalAchievements} Complete</span>
              </div>
            </div>
          </div>
          <div className="md:w-1/2 flex justify-center">
            <img
              src="/images/achievements-illustration.svg"
              alt="Achievements Illustration"
              className="w-full max-w-md h-auto"
            />
          </div>
        </div>

        {/* Level Progress */}
        <motion.div variants={itemVariants} className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-bold text-gray-800">Level {stats.currentLevel}</h2>
              <p className="text-gray-600">
                {stats.currentLevelXP} / {stats.nextLevelXP} XP to next level
              </p>
            </div>
            <div className="p-3 bg-yellow-50 rounded-full">
              <Crown className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-yellow-500 rounded-full h-3 transition-all duration-500"
              style={{ width: `${(stats.currentLevelXP / stats.nextLevelXP) * 100}%` }}
            />
          </div>
        </motion.div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-8">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filter === 'all' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('academic')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filter === 'academic' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            Academic
          </button>
          <button
            onClick={() => setFilter('skill')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filter === 'skill' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            Skills
          </button>
          <button
            onClick={() => setFilter('milestone')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filter === 'milestone' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            Milestones
          </button>
        </div>

        {/* Achievements Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAchievements.map((achievement) => (
            <motion.div
              key={achievement.id}
              variants={itemVariants}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className={`p-4 ${getRarityColor(achievement.rarity)}`}>
                <div className="flex items-center justify-between">
                  {getIconComponent(achievement.icon)}
                  <span className="text-sm font-medium capitalize">{achievement.rarity}</span>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">{achievement.title}</h3>
                <p className="text-gray-600 mb-4">{achievement.description}</p>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Progress</span>
                    <span className="font-medium text-blue-600">
                      {achievement.progress}/{achievement.maxProgress}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 rounded-full h-2 transition-all duration-500"
                      style={{ width: `${(achievement.progress / achievement.maxProgress) * 100}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">XP Reward</span>
                    <span className="font-medium text-green-600">+{achievement.xpPoints} XP</span>
                  </div>
                  {achievement.dateEarned && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Earned</span>
                      <span className="font-medium text-purple-600">{achievement.dateEarned}</span>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

export default Achievements;
