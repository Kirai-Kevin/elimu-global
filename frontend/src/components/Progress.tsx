import { useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Award, Target, Clock, Calendar, BookOpen, Brain, Star, ChevronRight, BarChart2, PieChart, Activity } from 'lucide-react';

interface Course {
  id: number;
  name: string;
  progress: number;
  totalModules: number;
  completedModules: number;
  grade: string;
  lastAccessed: string;
  timeSpent: string;
  nextMilestone: string;
  category: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  achievements: number;
}

interface Skill {
  name: string;
  level: number;
  progress: number;
  category: string;
}

function Progress() {
  const [courses, setCourses] = useState<Course[]>([
    {
      id: 1,
      name: "Advanced Mathematics",
      progress: 75,
      totalModules: 12,
      completedModules: 9,
      grade: "A",
      lastAccessed: "2024-12-22",
      timeSpent: "45h 30m",
      nextMilestone: "Complete Calculus Module",
      category: "Mathematics",
      difficulty: "Advanced",
      achievements: 8
    },
    {
      id: 2,
      name: "World History",
      progress: 60,
      totalModules: 10,
      completedModules: 6,
      grade: "B+",
      lastAccessed: "2024-12-21",
      timeSpent: "32h 15m",
      nextMilestone: "Complete Medieval Era",
      category: "History",
      difficulty: "Intermediate",
      achievements: 5
    },
    {
      id: 3,
      name: "Biology Fundamentals",
      progress: 90,
      totalModules: 8,
      completedModules: 7,
      grade: "A+",
      lastAccessed: "2024-12-22",
      timeSpent: "28h 45m",
      nextMilestone: "Final Module Review",
      category: "Science",
      difficulty: "Intermediate",
      achievements: 12
    },
    {
      id: 4,
      name: "Computer Science Basics",
      progress: 40,
      totalModules: 15,
      completedModules: 6,
      grade: "B",
      lastAccessed: "2024-12-20",
      timeSpent: "20h 30m",
      nextMilestone: "Complete Programming Basics",
      category: "Technology",
      difficulty: "Beginner",
      achievements: 4
    }
  ]);

  const [skills, setSkills] = useState<Skill[]>([
    { name: "Problem Solving", level: 4, progress: 85, category: "Critical Thinking" },
    { name: "Data Analysis", level: 3, progress: 70, category: "Analytics" },
    { name: "Research", level: 4, progress: 90, category: "Academic" },
    { name: "Communication", level: 5, progress: 95, category: "Soft Skills" },
    { name: "Time Management", level: 3, progress: 65, category: "Organization" }
  ]);

  const [selectedTimeframe, setSelectedTimeframe] = useState<string>('week');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

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

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'bg-green-500';
    if (progress >= 60) return 'bg-blue-500';
    if (progress >= 40) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getDifficultyColor = (difficulty: Course['difficulty']) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-100 text-green-600';
      case 'Intermediate': return 'bg-blue-100 text-blue-600';
      case 'Advanced': return 'bg-purple-100 text-purple-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const filteredCourses = courses.filter(course => 
    selectedCategory === 'all' || course.category === selectedCategory
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
            <h1 className="text-3xl font-bold text-gray-800 mb-4">Learning Progress</h1>
            <p className="text-gray-600 mb-6">
              Track your educational journey, monitor course completion, and view your skill development.
              Stay motivated with achievements and milestones.
            </p>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center bg-blue-50 px-4 py-2 rounded-lg">
                <TrendingUp className="w-5 h-5 text-blue-600 mr-2" />
                <span className="text-blue-600">Progress Tracking</span>
              </div>
              <div className="flex items-center bg-green-50 px-4 py-2 rounded-lg">
                <Award className="w-5 h-5 text-green-600 mr-2" />
                <span className="text-green-600">Achievements</span>
              </div>
              <div className="flex items-center bg-purple-50 px-4 py-2 rounded-lg">
                <Target className="w-5 h-5 text-purple-600 mr-2" />
                <span className="text-purple-600">Goals</span>
              </div>
              <div className="flex items-center bg-orange-50 px-4 py-2 rounded-lg">
                <Brain className="w-5 h-5 text-orange-600 mr-2" />
                <span className="text-orange-600">Skills</span>
              </div>
            </div>
          </div>
          <div className="md:w-1/2 flex justify-center">
            <img
              src="/images/progress-illustration.svg"
              alt="Progress Illustration"
              className="w-full max-w-md h-auto"
            />
          </div>
        </div>

        {/* Overview Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <motion.div
            variants={itemVariants}
            className="bg-white rounded-xl p-6 shadow-md"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <BookOpen className="w-6 h-6 text-blue-600" />
              </div>
              <span className="text-sm text-gray-500">Courses</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-800">{courses.length}</h3>
            <p className="text-sm text-gray-600">Active Courses</p>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="bg-white rounded-xl p-6 shadow-md"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <Award className="w-6 h-6 text-green-600" />
              </div>
              <span className="text-sm text-gray-500">Total</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-800">
              {courses.reduce((sum, course) => sum + course.achievements, 0)}
            </h3>
            <p className="text-sm text-gray-600">Achievements Earned</p>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="bg-white rounded-xl p-6 shadow-md"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Clock className="w-6 h-6 text-purple-600" />
              </div>
              <span className="text-sm text-gray-500">Time</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-800">126h 45m</h3>
            <p className="text-sm text-gray-600">Total Study Time</p>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="bg-white rounded-xl p-6 shadow-md"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-orange-100 rounded-lg">
                <Target className="w-6 h-6 text-orange-600" />
              </div>
              <span className="text-sm text-gray-500">Average</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-800">85%</h3>
            <p className="text-sm text-gray-600">Completion Rate</p>
          </motion.div>
        </div>

        {/* Filters */}
        <motion.div variants={itemVariants} className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="grid md:grid-cols-3 gap-4">
            <select
              value={selectedTimeframe}
              onChange={(e) => setSelectedTimeframe(e.target.value)}
              className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-transparent"
            >
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="year">This Year</option>
              <option value="all">All Time</option>
            </select>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-transparent"
            >
              <option value="all">All Categories</option>
              <option value="Mathematics">Mathematics</option>
              <option value="Science">Science</option>
              <option value="History">History</option>
              <option value="Technology">Technology</option>
            </select>
            <div className="flex gap-2">
              <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors flex items-center justify-center">
                <BarChart2 className="w-5 h-5 mr-2" />
                View Analytics
              </button>
              <button className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors flex items-center justify-center">
                <PieChart className="w-5 h-5 mr-2" />
                View Reports
              </button>
            </div>
          </div>
        </motion.div>

        {/* Course Progress */}
        <motion.div variants={itemVariants} className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Course Progress</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {filteredCourses.map((course) => (
              <div
                key={course.id}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(course.difficulty)}`}>
                        {course.difficulty}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <Award className="w-5 h-5 text-yellow-400" />
                      <span className="ml-1 text-sm text-gray-600">{course.achievements} achievements</span>
                    </div>
                  </div>

                  <h3 className="text-lg font-semibold text-gray-800 mb-2">{course.name}</h3>
                  
                  <div className="mb-4">
                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                      <span>Progress</span>
                      <span>{course.progress}%</span>
                    </div>
                    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${getProgressColor(course.progress)}`}
                        style={{ width: `${course.progress}%` }}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="text-sm">
                      <span className="text-gray-500">Modules: </span>
                      <span className="font-medium">{course.completedModules}/{course.totalModules}</span>
                    </div>
                    <div className="text-sm">
                      <span className="text-gray-500">Grade: </span>
                      <span className="font-medium">{course.grade}</span>
                    </div>
                    <div className="text-sm">
                      <span className="text-gray-500">Time Spent: </span>
                      <span className="font-medium">{course.timeSpent}</span>
                    </div>
                    <div className="text-sm">
                      <span className="text-gray-500">Last Accessed: </span>
                      <span className="font-medium">{new Date(course.lastAccessed).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-100">
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-500">
                        <Target className="w-4 h-4 inline mr-1" />
                        Next: {course.nextMilestone}
                      </div>
                      <button className="flex items-center text-blue-600 hover:text-blue-700">
                        View Details
                        <ChevronRight className="w-4 h-4 ml-1" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Skills Development */}
        <motion.div variants={itemVariants}>
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Skills Development</h2>
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="grid md:grid-cols-2 gap-6">
              {skills.map((skill) => (
                <div key={skill.name} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-medium text-gray-800">{skill.name}</h4>
                      <span className="text-sm text-gray-500">{skill.category}</span>
                    </div>
                    <div className="flex items-center">
                      {[...Array(5)].map((_, index) => (
                        <Star
                          key={index}
                          className={`w-4 h-4 ${
                            index < skill.level
                              ? 'text-yellow-400 fill-current'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${getProgressColor(skill.progress)}`}
                      style={{ width: `${skill.progress}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Proficiency</span>
                    <span className="font-medium">{skill.progress}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

      </motion.div>
    </div>
  );
}

export default Progress;
