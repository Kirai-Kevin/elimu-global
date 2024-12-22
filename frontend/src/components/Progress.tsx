import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import PageContainer from './PageContainer';

interface ProgressData {
  subject: string;
  completionRate: number;
  averageGrade: number;
  timeSpent: number;
}

function Progress() {
  const [progressData, setProgressData] = useState<ProgressData[]>([]);
  const [performanceData, setPerformanceData] = useState<{ date: string; grade: number }[]>([]);

  useEffect(() => {
    // Simulating API call to fetch progress data
    const fetchProgressData = async () => {
      // In a real application, this would be an API call
      const mockProgressData: ProgressData[] = [
        { subject: 'Math', completionRate: 75, averageGrade: 85, timeSpent: 1200 },
        { subject: 'English', completionRate: 60, averageGrade: 78, timeSpent: 900 },
        { subject: 'Science', completionRate: 80, averageGrade: 92, timeSpent: 1500 },
        { subject: 'History', completionRate: 50, averageGrade: 70, timeSpent: 800 },
      ];
      setProgressData(mockProgressData);
    };

    // Simulating API call to fetch performance data
    const fetchPerformanceData = async () => {
      // In a real application, this would be an API call
      const mockPerformanceData = [
        { date: '2023-01', grade: 75 },
        { date: '2023-02', grade: 80 },
        { date: '2023-03', grade: 78 },
        { date: '2023-04', grade: 85 },
        { date: '2023-05', grade: 88 },
        { date: '2023-06', grade: 92 },
      ];
      setPerformanceData(mockPerformanceData);
    };

    fetchProgressData();
    fetchPerformanceData();
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
    <div className="min-h-screen bg-gray-50">
      <motion.div
        className="container mx-auto px-4 py-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header with Illustration */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-8 bg-white rounded-xl p-6 shadow-lg">
          <div className="md:w-1/2 mb-6 md:mb-0">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">Learning Progress</h1>
            <p className="text-gray-600">
              Track your academic journey and see how far you've come in your studies.
            </p>
          </div>
          <div className="md:w-1/2 flex justify-center">
            <img
              src="/images/progress-illustration.svg"
              alt="Progress Tracking Illustration"
              className="w-full max-w-md h-auto"
            />
          </div>
        </div>

        {/* Progress Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Overall Progress */}
          <motion.div
            variants={itemVariants}
            className="bg-white rounded-xl shadow-md p-6"
          >
            <h2 className="text-xl font-semibold mb-4">Overall Progress</h2>
            <div className="relative pt-1">
              <div className="flex mb-2 items-center justify-between">
                <div>
                  <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-blue-600 bg-blue-200">
                    Course Completion
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-semibold inline-block text-blue-600">
                    {progressData.reduce((acc, current) => acc + current.completionRate, 0) / progressData.length}%
                  </span>
                </div>
              </div>
              <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-blue-200">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progressData.reduce((acc, current) => acc + current.completionRate, 0) / progressData.length}%` }}
                  transition={{ duration: 1 }}
                  className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"
                />
              </div>
            </div>
          </motion.div>

          {/* Recent Achievements */}
          <motion.div
            variants={itemVariants}
            className="bg-white rounded-xl shadow-md p-6"
          >
            <h2 className="text-xl font-semibold mb-4">Recent Achievements</h2>
            <div className="space-y-4">
              {progressData.map((data, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg"
                >
                  <div className="flex-shrink-0">
                    {/* <Award className="w-6 h-6 text-blue-500" /> */}
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">{data.subject}</h3>
                    <p className="text-sm text-gray-500">Completion: {data.completionRate}%</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Subject Progress */}
        <motion.div
          variants={itemVariants}
          className="mt-6 bg-white rounded-xl shadow-md p-6"
        >
          <h2 className="text-xl font-semibold mb-4">Subject Progress</h2>
          <div className="grid gap-4">
            {progressData.map((subject, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-gray-700">{subject.subject}</span>
                  <span className="text-sm font-medium text-gray-700">{subject.completionRate}%</span>
                </div>
                <div className="overflow-hidden h-2 text-xs flex rounded bg-blue-200">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${subject.completionRate}%` }}
                    transition={{ duration: 1 }}
                    className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Study Time */}
        <motion.div
          variants={itemVariants}
          className="mt-6 bg-white rounded-xl shadow-md p-6"
        >
          <h2 className="text-xl font-semibold mb-4">Study Time</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <h3 className="text-sm font-medium text-gray-500">Today</h3>
              <p className="text-2xl font-bold text-blue-600">{Math.floor(progressData.reduce((acc, current) => acc + current.timeSpent, 0) / 60 / progressData.length)}h</p>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <h3 className="text-sm font-medium text-gray-500">This Week</h3>
              <p className="text-2xl font-bold text-blue-600">{Math.floor(progressData.reduce((acc, current) => acc + current.timeSpent, 0) / 60 / progressData.length * 7)}h</p>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <h3 className="text-sm font-medium text-gray-500">Total</h3>
              <p className="text-2xl font-bold text-blue-600">{Math.floor(progressData.reduce((acc, current) => acc + current.timeSpent, 0) / 60)}h</p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default Progress;
