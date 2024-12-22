import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import PageContainer from './PageContainer';

interface Achievement {
  id: number;
  title: string;
  description: string;
  icon: string;
}

function Achievements() {
  const [achievements, setAchievements] = useState<Achievement[]>([]);

  useEffect(() => {
    // Simulating API call to fetch achievements
    const fetchAchievements = async () => {
      // In a real application, this would be an API call
      const mockAchievements: Achievement[] = [
        { id: 1, title: 'First Lesson Completed', description: 'You completed your first lesson!', icon: '🏆' },
        { id: 2, title: 'Perfect Score', description: 'You got 100% on an exam!', icon: '🌟' },
        { id: 3, title: 'Study Streak', description: 'You studied for 7 days in a row!', icon: '🔥' },
      ];
      setAchievements(mockAchievements);
    };

    fetchAchievements();
  }, []);

  const containerVariants = {
    hidden: {opacity: 0},
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
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

  return (
    <PageContainer>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <h2 className="text-2xl font-semibold mb-6 text-blue-600">Your Achievements</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {achievements.map((achievement) => (
            <motion.div key={achievement.id} variants={itemVariants}>
              <div className="bg-white rounded-lg shadow-md p-6 flex items-center">
                <div className="text-4xl mr-4">{achievement.icon}</div>
                <div>
                  <h3 className="text-lg font-semibold mb-2 text-blue-800">{achievement.title}</h3>
                  <p className="text-sm text-gray-600">{achievement.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </PageContainer>
  );
}

export default Achievements;

