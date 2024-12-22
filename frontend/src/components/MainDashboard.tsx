import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { config } from '../config/env';
import PageContainer from './PageContainer';

interface Lesson {
  id: number;
  title: string;
  progress: number;
  timeSpent: number;
  grade: number | null;
}

function MainDashboard() {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [recommendations, setRecommendations] = useState<string[]>([]);

  useEffect(() => {
    // Simulating API call to fetch lessons
    const fetchLessons = async () => {
      const mockLessons: Lesson[] = [
        { id: 1, title: 'Introduction to Algebra', progress: 75, timeSpent: 120, grade: 85 },
        { id: 2, title: 'World History: Ancient Civilizations', progress: 50, timeSpent: 90, grade: null },
        { id: 3, title: 'Biology: Cell Structure', progress: 25, timeSpent: 60, grade: 92 },
      ];
      setLessons(mockLessons);
    };

    // Simulating API call to fetch AI recommendations
    const fetchRecommendations = async () => {
      try {
        const response = await fetch(config.apiUrl, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${config.groqApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'mixtral-8x7b-32768',
            messages: [
              {
                role: 'system',
                content: 'You are an AI that provides personalized learning recommendations based on student data.',
              },
              {
                role: 'user',
                content: 'Provide 3 personalized learning recommendations for a student who has shown interest in algebra and biology.',
              },
            ],
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to get AI recommendations');
        }

        const data = await response.json();
        const recommendationsText = data.choices[0].message.content;
        setRecommendations(recommendationsText.split('\n').filter((rec: string) => rec.trim() !== ''));
      } catch (error) {
        console.error('Error getting AI recommendations:', error);
      }
    };

    fetchLessons();
    fetchRecommendations();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
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
        className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 h-full"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Recent Lessons */}
        <motion.div 
          className="bg-white rounded-2xl shadow-lg p-6 border border-blue-100 overflow-hidden"
          variants={itemVariants}
        >
          <h2 className="text-2xl font-bold text-blue-600 mb-6">Recent Lessons</h2>
          <div className="space-y-4">
            {lessons.map((lesson) => (
              <motion.div 
                key={lesson.id} 
                className="p-4 bg-blue-50 rounded-xl transition-all duration-300 hover:shadow-md"
                whileHover={{ scale: 1.02 }}
              >
                <h3 className="font-semibold text-blue-800">{lesson.title}</h3>
                <div className="mt-2 flex items-center">
                  <div className="flex-1 bg-blue-200 rounded-full h-2 overflow-hidden">
                    <motion.div
                      className="bg-blue-600 h-2 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${lesson.progress}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                    />
                  </div>
                  <span className="ml-2 text-sm text-blue-600 font-medium">{lesson.progress}%</span>
                </div>
                <div className="mt-2 text-sm text-blue-600">
                  Time spent: {lesson.timeSpent} minutes
                </div>
                {lesson.grade && (
                  <div className="mt-1 text-sm text-green-600 font-semibold">
                    Grade: {lesson.grade}%
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Progress Overview */}
        <motion.div 
          className="bg-white rounded-2xl shadow-lg p-6 border border-blue-100"
          variants={itemVariants}
        >
          <h2 className="text-2xl font-bold text-blue-600 mb-6">Progress Overview</h2>
          {/* Add your progress charts/stats here */}
        </motion.div>

        {/* Upcoming Classes */}
        <motion.div 
          className="bg-white rounded-2xl shadow-lg p-6 border border-blue-100"
          variants={itemVariants}
        >
          <h2 className="text-2xl font-bold text-blue-600 mb-6">Upcoming Classes</h2>
          {/* Add your upcoming classes list here */}
        </motion.div>

        {/* AI Recommendations */}
        <motion.div 
          className="bg-white rounded-2xl shadow-lg p-6 border border-blue-100"
          variants={itemVariants}
        >
          <h2 className="text-2xl font-bold text-blue-600 mb-6">AI Recommendations</h2>
          <ul className="space-y-2">
            {recommendations.map((rec, index) => (
              <motion.li 
                key={index} 
                className="flex items-start"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.2 }}
              >
                <span className="text-blue-500 mr-2">•</span>
                <span className="text-blue-800">{rec}</span>
              </motion.li>
            ))}
          </ul>
        </motion.div>
      </motion.div>
    </PageContainer>
  );
}

export default MainDashboard;

