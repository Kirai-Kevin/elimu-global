import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, Clock, Calendar, BookOpen, GraduationCap, Target, Award, Users, Book } from 'lucide-react';
import { config } from '../config/env';

interface ProgressStats {
  subject: string;
  completedLessons: number;
  totalLessons: number;
  averageGrade: number;
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
  const [upcomingClasses, setUpcomingClasses] = useState<UpcomingClass[]>([]);
  const [progressStats, setProgressStats] = useState<ProgressStats[]>([]);

  useEffect(() => {
    // Fetch mock data
    const mockData = {
      lessons: [
        { id: 1, title: 'Introduction to Algebra', progress: 75, timeSpent: 120, grade: 85 },
        { id: 2, title: 'World History: Ancient Civilizations', progress: 50, timeSpent: 90, grade: null },
        { id: 3, title: 'Biology: Cell Structure', progress: 25, timeSpent: 60, grade: 92 },
      ],
      upcomingClasses: [
        {
          id: 1,
          subject: 'Mathematics',
          instructor: 'Dr. John Smith',
          date: '2024-12-23',
          time: '09:00 AM',
          duration: 60,
          zoomLink: 'https://zoom.us/j/123456789'
        },
        {
          id: 2,
          subject: 'Physics',
          instructor: 'Prof. Sarah Johnson',
          date: '2024-12-23',
          time: '11:00 AM',
          duration: 45,
          zoomLink: 'https://zoom.us/j/987654321'
        }
      ],
      progressStats: [
        { subject: 'Mathematics', completedLessons: 15, totalLessons: 20, averageGrade: 88 },
        { subject: 'Science', completedLessons: 12, totalLessons: 18, averageGrade: 92 },
        { subject: 'History', completedLessons: 8, totalLessons: 15, averageGrade: 85 },
        { subject: 'English', completedLessons: 10, totalLessons: 12, averageGrade: 90 }
      ]
    };

    setLessons(mockData.lessons);
    setUpcomingClasses(mockData.upcomingClasses);
    setProgressStats(mockData.progressStats);

    // Fetch AI recommendations
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
                content: 'You are an AI that provides personalized learning recommendations.',
              },
              {
                role: 'user',
                content: 'Provide 3 personalized learning recommendations based on current progress.',
              },
            ],
          }),
        });

        if (!response.ok) throw new Error('Failed to get recommendations');
        const data = await response.json();
        setRecommendations(data.choices[0].message.content.split('\n').filter(Boolean));
      } catch (error) {
        console.error('Error getting recommendations:', error);
        setRecommendations(['Focus on completing Algebra exercises', 'Review Biology notes', 'Practice History quizzes']);
      }
    };

    fetchRecommendations();
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

  return (
    <div className="min-h-screen w-full bg-gray-50">
      <motion.div
        className="w-full px-4 py-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Welcome Section with Illustration */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-8 bg-white rounded-xl p-6 shadow-lg">
          <div className="md:w-1/2 mb-6 md:mb-0">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">Welcome Back!</h1>
            <p className="text-gray-600 mb-6">
              Track your progress, manage your classes, and get personalized recommendations
              to enhance your learning journey.
            </p>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center bg-blue-50 px-4 py-2 rounded-lg">
                <Target className="w-5 h-5 text-blue-600 mr-2" />
                <span className="text-blue-600">Set Goals</span>
              </div>
              <div className="flex items-center bg-green-50 px-4 py-2 rounded-lg">
                <Award className="w-5 h-5 text-green-600 mr-2" />
                <span className="text-green-600">Track Progress</span>
              </div>
              <div className="flex items-center bg-purple-50 px-4 py-2 rounded-lg">
                <Book className="w-5 h-5 text-purple-600 mr-2" />
                <span className="text-purple-600">Learn Daily</span>
              </div>
            </div>
          </div>
          <div className="md:w-1/2 flex justify-center">
            <img
              src="/images/dashboard-illustration.svg"
              alt="Dashboard Illustration"
              className="w-full max-w-md h-auto"
            />
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {progressStats.map((stat, index) => (
            <motion.div
              key={stat.subject}
              variants={itemVariants}
              className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">{stat.subject}</h3>
                <div className="p-2 bg-blue-50 rounded-lg">
                  <GraduationCap className="w-6 h-6 text-blue-600" />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Progress</span>
                  <span className="font-medium text-blue-600">
                    {Math.round((stat.completedLessons / stat.totalLessons) * 100)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 rounded-full h-2"
                    style={{
                      width: `${(stat.completedLessons / stat.totalLessons) * 100}%`
                    }}
                  />
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Average Grade</span>
                  <span className="font-medium text-green-600">{stat.averageGrade}%</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Lessons */}
          <motion.div
            variants={itemVariants}
            className="lg:col-span-2 bg-white rounded-xl shadow-md p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-800">Recent Lessons</h2>
              <div className="p-2 bg-blue-50 rounded-lg">
                <BookOpen className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <div className="space-y-4">
              {lessons.map((lesson) => (
                <motion.div
                  key={lesson.id}
                  className="p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-medium text-gray-800">{lesson.title}</h3>
                    {lesson.grade && (
                      <span className="px-3 py-1 bg-green-100 text-green-600 rounded-full text-sm">
                        Grade: {lesson.grade}%
                      </span>
                    )}
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center text-gray-600">
                      <Clock className="w-4 h-4 mr-2" />
                      {lesson.timeSpent} mins
                    </div>
                    <div className="flex items-center">
                      <span className="text-gray-600 mr-2">Progress:</span>
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 rounded-full h-2"
                          style={{ width: `${lesson.progress}%` }}
                        />
                      </div>
                      <span className="ml-2 text-blue-600">{lesson.progress}%</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Upcoming Classes */}
          <motion.div
            variants={itemVariants}
            className="bg-white rounded-xl shadow-md p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-800">Upcoming Classes</h2>
              <div className="p-2 bg-blue-50 rounded-lg">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <div className="space-y-4">
              {upcomingClasses.map((class_) => (
                <motion.div
                  key={class_.id}
                  className="p-4 border border-gray-100 rounded-xl hover:border-blue-200 transition-colors"
                  whileHover={{ scale: 1.02 }}
                >
                  <h3 className="font-medium text-gray-800 mb-2">{class_.subject}</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center text-gray-600">
                      <Users className="w-4 h-4 mr-2" />
                      {class_.instructor}
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Calendar className="w-4 h-4 mr-2" />
                      {class_.date} at {class_.time}
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Clock className="w-4 h-4 mr-2" />
                      {class_.duration} minutes
                    </div>
                    <a
                      href={class_.zoomLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block w-full px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-center mt-2"
                    >
                      Join Class
                    </a>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* AI Recommendations */}
        <motion.div
          variants={itemVariants}
          className="mt-6 bg-white rounded-xl shadow-md p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-800">Personalized Recommendations</h2>
            <div className="p-2 bg-blue-50 rounded-lg">
              <Target className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            {recommendations.map((recommendation, index) => (
              <motion.div
                key={index}
                className="p-4 bg-blue-50 rounded-xl"
                whileHover={{ scale: 1.02 }}
              >
                <p className="text-blue-800">{recommendation}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default MainDashboard;
