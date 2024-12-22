import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { config } from '../config/env';
import PageContainer from './PageContainer';
import { BarChart3, Clock, Calendar, BookOpen, GraduationCap, Target } from 'lucide-react';

interface Lesson {
  id: number;
  title: string;
  progress: number;
  timeSpent: number;
  grade: number | null;
}

interface UpcomingClass {
  id: number;
  subject: string;
  instructor: string;
  date: string;
  time: string;
  duration: number;
  zoomLink: string;
}

interface ProgressStats {
  subject: string;
  completedLessons: number;
  totalLessons: number;
  averageGrade: number;
}

function MainDashboard() {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const [upcomingClasses, setUpcomingClasses] = useState<UpcomingClass[]>([]);
  const [progressStats, setProgressStats] = useState<ProgressStats[]>([]);

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

    // Simulating API call to fetch upcoming classes
    const fetchUpcomingClasses = async () => {
      const mockClasses: UpcomingClass[] = [
        {
          id: 1,
          subject: 'Mathematics',
          instructor: 'Mr. John Smith',
          date: '2024-12-23',
          time: '09:00 AM',
          duration: 60,
          zoomLink: 'https://zoom.us/j/123456789'
        },
        {
          id: 2,
          subject: 'Biology',
          instructor: 'Ms. Sarah Johnson',
          date: '2024-12-23',
          time: '11:00 AM',
          duration: 45,
          zoomLink: 'https://zoom.us/j/987654321'
        },
        {
          id: 3,
          subject: 'Physics',
          instructor: 'Dr. Michael Brown',
          date: '2024-12-24',
          time: '10:00 AM',
          duration: 60,
          zoomLink: 'https://zoom.us/j/456789123'
        }
      ];
      setUpcomingClasses(mockClasses);
    };

    // Simulating API call to fetch progress stats
    const fetchProgressStats = async () => {
      const mockStats: ProgressStats[] = [
        { subject: 'Mathematics', completedLessons: 15, totalLessons: 20, averageGrade: 88 },
        { subject: 'Science', completedLessons: 12, totalLessons: 18, averageGrade: 92 },
        { subject: 'History', completedLessons: 8, totalLessons: 15, averageGrade: 85 },
        { subject: 'English', completedLessons: 10, totalLessons: 12, averageGrade: 90 }
      ];
      setProgressStats(mockStats);
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
    fetchUpcomingClasses();
    fetchProgressStats();
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
          <div className="flex items-center mb-6">
            <BookOpen className="w-6 h-6 text-blue-600 mr-2" />
            <h2 className="text-2xl font-bold text-blue-600">Recent Lessons</h2>
          </div>
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
          <div className="flex items-center mb-6">
            <BarChart3 className="w-6 h-6 text-blue-600 mr-2" />
            <h2 className="text-2xl font-bold text-blue-600">Progress Overview</h2>
          </div>
          <div className="space-y-6">
            {progressStats.map((stat, index) => (
              <motion.div
                key={index}
                className="p-4 bg-blue-50 rounded-xl"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-semibold text-blue-800">{stat.subject}</h3>
                  <span className="text-sm text-blue-600 font-medium">
                    {Math.round((stat.completedLessons / stat.totalLessons) * 100)}% Complete
                  </span>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center">
                    <BookOpen className="w-4 h-4 text-blue-500 mr-1" />
                    <span className="text-sm text-blue-600">
                      {stat.completedLessons}/{stat.totalLessons} Lessons
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Target className="w-4 h-4 text-green-500 mr-1" />
                    <span className="text-sm text-green-600 font-medium">
                      {stat.averageGrade}% Avg
                    </span>
                  </div>
                </div>
                <div className="mt-2 bg-blue-200 rounded-full h-2 overflow-hidden">
                  <motion.div
                    className="bg-blue-600 h-2 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${(stat.completedLessons / stat.totalLessons) * 100}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Upcoming Classes */}
        <motion.div 
          className="bg-white rounded-2xl shadow-lg p-6 border border-blue-100"
          variants={itemVariants}
        >
          <div className="flex items-center mb-6">
            <Calendar className="w-6 h-6 text-blue-600 mr-2" />
            <h2 className="text-2xl font-bold text-blue-600">Upcoming Classes</h2>
          </div>
          <div className="space-y-4">
            {upcomingClasses.map((class_) => (
              <motion.div
                key={class_.id}
                className="p-4 bg-blue-50 rounded-xl hover:shadow-md transition-all duration-300"
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-blue-800">{class_.subject}</h3>
                    <p className="text-sm text-blue-600 mt-1">{class_.instructor}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-blue-600">{class_.time}</p>
                    <p className="text-sm text-blue-500">{class_.duration} mins</p>
                  </div>
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <div className="flex items-center text-sm text-blue-600">
                    <Clock className="w-4 h-4 mr-1" />
                    <span>{new Date(class_.date).toLocaleDateString()}</span>
                  </div>
                  <a
                    href={class_.zoomLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    Join Class
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* AI Recommendations */}
        <motion.div 
          className="bg-white rounded-2xl shadow-lg p-6 border border-blue-100"
          variants={itemVariants}
        >
          <div className="flex items-center mb-6">
            <GraduationCap className="w-6 h-6 text-blue-600 mr-2" />
            <h2 className="text-2xl font-bold text-blue-600">AI Recommendations</h2>
          </div>
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
