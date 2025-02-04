import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BookOpen, 
  Trophy, 
  Flame, 
  BookmarkCheck, 
  ClipboardList, 
  Target, 
  Star, 
  Award, 
  Calendar, 
  TrendingUp,
  Rocket,
  CheckCircle2,
  Loader2,
  AlertTriangle,
  Users
} from 'lucide-react';

// Create axios instance with base URL from .env
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Dashboard Interfaces matching actual API response
interface StudentDashboard {
  _id: string;
  studentId: string;
  enrolledCourses: string[];
  totalStreak: number;
  lastUpdated: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface DashboardOverview {
  courses: any[];
  learningPaths: any[];
  quizzes: any[];
  assignments: any[];
}

interface RecentActivity {
  recentQuizzes: any[];
  recentAssignments: any[];
  recentCourseProgress: any[];
}

const MainDashboard: React.FC = () => {
  // State for user data
  const [userData, setUserData] = useState<{
    id: string;
    email: string;
    name: string;
    role: string;
    token: string;
  } | null>(null);
  
  // State for dashboard data
  const [dashboardData, setDashboardData] = useState<StudentDashboard | null>(null);
  const [overviewData, setOverviewData] = useState<DashboardOverview | null>(null);
  const [recentActivity, setRecentActivity] = useState<RecentActivity | null>(null);
  
  // Loading and error states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Default fallback data
  const defaultDashboardData: StudentDashboard = {
    _id: '',
    studentId: '',
    enrolledCourses: [],
    totalStreak: 0,
    lastUpdated: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    __v: 0
  };

  const defaultOverviewData: DashboardOverview = {
    courses: [],
    learningPaths: [],
    quizzes: [],
    assignments: []
  };

  const defaultRecentActivity: RecentActivity = {
    recentQuizzes: [],
    recentAssignments: [],
    recentCourseProgress: []
  };

  // Framer Motion Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1, 
      transition: { 
        delayChildren: 0.3, 
        staggerChildren: 0.2 
      } 
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 200
      }
    }
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Retrieve token from localStorage
        const userString = localStorage.getItem('user');
        if (!userString) {
          console.error('No user data found in localStorage');
          setError('No user data found');
          setLoading(false);
          return;
        }

        let parsedUserData;
        try {
          parsedUserData = JSON.parse(userString);
          setUserData(parsedUserData);
        } catch (parseError) {
          console.error('Failed to parse user data:', parseError);
          setError('Invalid user data');
          setLoading(false);
          return;
        }

        const token = parsedUserData?.token;
        if (!token) {
          console.error('No authentication token found');
          setError('Authentication required');
          setLoading(false);
          return;
        }

        // Fetch dashboard data with comprehensive error handling
        try {
          const dashboardResponse = await apiClient.get('/student/dashboard', {
            headers: { 
              'Authorization': `Bearer ${token}` 
            }
          });
          
          const dashboardData = dashboardResponse.data;
          setDashboardData(dashboardData || defaultDashboardData);
        } catch (dashboardError) {
          console.error('Dashboard Fetch Error:', dashboardError);
          setDashboardData(defaultDashboardData);
        }

        // Fetch dashboard overview
        try {
          const overviewResponse = await apiClient.get('/student/dashboard/overview', {
            headers: { 
              'Authorization': `Bearer ${token}` 
            }
          });
          
          const overviewData = overviewResponse.data;
          setOverviewData(overviewData || defaultOverviewData);
        } catch (overviewError) {
          console.error('Overview Fetch Error:', overviewError);
          setOverviewData(defaultOverviewData);
        }

        // Fetch recent activity
        try {
          const activityResponse = await apiClient.get('/student/dashboard/recent-activity', {
            headers: { 
              'Authorization': `Bearer ${token}` 
            }
          });
          
          const activityData = activityResponse.data;
          setRecentActivity(activityData || defaultRecentActivity);
        } catch (activityError) {
          console.error('Activity Fetch Error:', activityError);
          setRecentActivity(defaultRecentActivity);
        }
      } catch (err) {
        console.error('Complete Dashboard Fetch Error:', err);
        setError(err instanceof Error ? err.message : 'Failed to load dashboard data');
        
        // Set default data in case of complete failure
        setDashboardData(defaultDashboardData);
        setOverviewData(defaultOverviewData);
        setRecentActivity(defaultRecentActivity);
      }
    };

    fetchDashboardData();
  }, []);

  // Set loading to false once we have data
  useEffect(() => {
    if (dashboardData && overviewData && recentActivity) {
      setLoading(false);
    }
  }, [dashboardData, overviewData, recentActivity]);

  // Render content
  const renderContent = () => (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="min-h-screen w-full bg-gray-50 p-8"
    >
      <motion.div className="max-w-6xl mx-auto">
        <motion.h1 
          variants={itemVariants}
          className="text-3xl font-bold mb-8 flex items-center"
        >
          <Trophy className="mr-4 text-yellow-500" /> 
          Welcome, {userData?.name?.split(' ')[0] || 'Student'}!
        </motion.h1>

        {/* User Overview */}
        <motion.div 
          variants={itemVariants}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
        >
          {/* Total Streak */}
          <div className="bg-white p-6 rounded-lg shadow-md flex items-center">
            <Flame className="mr-4 text-orange-500" size={48} />
            <div>
              <h3 className="text-lg font-semibold">Total Streak</h3>
              <p className="text-2xl font-bold">
                {dashboardData?.totalStreak || 0} Days
              </p>
            </div>
          </div>

          {/* Total Courses */}
          <div className="bg-white p-6 rounded-lg shadow-md flex items-center">
            <BookOpen className="mr-4 text-green-500" size={48} />
            <div>
              <h3 className="text-lg font-semibold">Enrolled Courses</h3>
              <p className="text-2xl font-bold">
                {dashboardData?.enrolledCourses?.length || 0}
              </p>
            </div>
          </div>

          {/* Last Updated */}
          <div className="bg-white p-6 rounded-lg shadow-md flex items-center">
            <Calendar className="mr-4 text-blue-500" size={48} />
            <div>
              <h3 className="text-lg font-semibold">Last Updated</h3>
              <p className="text-sm">
                {dashboardData?.lastUpdated 
                  ? new Date(dashboardData.lastUpdated).toLocaleDateString() 
                  : 'Not available'}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Recent Activity Section */}
        <motion.div 
          variants={itemVariants}
          className="bg-white shadow-lg rounded-lg p-6 mb-8"
        >
          <div className="flex items-center mb-6">
            <TrendingUp className="mr-3 text-purple-500" />
            <h2 className="text-xl font-semibold">Recent Activity</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Quizzes */}
            <div className="bg-green-50 p-6 rounded-lg">
              <div className="flex items-center mb-4">
                <ClipboardList className="mr-3 text-green-500" />
                <h3 className="font-semibold">Quizzes</h3>
              </div>
              <div className="text-center">
                <p className="text-gray-500">
                  No quizzes completed yet
                </p>
                <p className="text-sm text-gray-400 mt-2">
                  Complete quizzes to track your progress
                </p>
              </div>
            </div>

            {/* Assignments */}
            <div className="bg-blue-50 p-6 rounded-lg">
              <div className="flex items-center mb-4">
                <Award className="mr-3 text-blue-500" />
                <h3 className="font-semibold">Assignments</h3>
              </div>
              <div className="text-center">
                <p className="text-gray-500">
                  No assignments submitted yet
                </p>
                <p className="text-sm text-gray-400 mt-2">
                  Submit assignments to see them here
                </p>
              </div>
            </div>

            {/* Course Progress */}
            <div className="bg-yellow-50 p-6 rounded-lg">
              <div className="flex items-center mb-4">
                <TrendingUp className="mr-3 text-yellow-500" />
                <h3 className="font-semibold">Course Progress</h3>
              </div>
              <div className="text-center">
                <p className="text-gray-500">
                  No course progress yet
                </p>
                <p className="text-sm text-gray-400 mt-2">
                  Start a course to track your progress
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );

  // Always render content, with loading indicator if needed
  return (
    <>
      {renderContent()}
      {loading && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-4 rounded-lg shadow-lg">
            <Loader2 className="animate-spin" size={32} />
            <p className="mt-2">Loading...</p>
          </div>
        </div>
      )}
    </>
  );
};

export default MainDashboard;
