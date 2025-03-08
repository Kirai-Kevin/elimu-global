import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Trophy, Medal, Star, Target, Crown, Award, BookOpen, Zap,
  Flag, RocketIcon, CheckCircle2, TrendingUp, Users, ArrowUp,
  Calendar, Clock, Zap as Lightning, Flame, Gift, Sparkles
} from 'lucide-react';

// Log the API URL for debugging
console.log('API URL from VITE_API_URL:', import.meta.env.VITE_API_URL);
console.log('API URL from VITE_BACKEND_URL:', import.meta.env.VITE_BACKEND_URL);

// Use VITE_BACKEND_URL to match what's used in LoginSignUp.tsx
const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL || import.meta.env.VITE_API_URL || 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json'
  }
});

interface CourseActivity {
  id: string;
  title: string;
  progress: number;
}

interface QuizActivity {
  id: string;
  title: string;
  score: number;
  date: string;
}

interface AssignmentActivity {
  id: string;
  title: string;
  status: string;
  dueDate: string;
}

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  earned: boolean;
  progress?: number;
  maxProgress?: number;
}

interface DashboardData {
  studentId: string;
  recentCourses: CourseActivity[];
  recentQuizzes: QuizActivity[];
  recentAssignments: AssignmentActivity[];
  upcomingMeetings: Array<{
    id: string;
    title: string;
    date: string;
  }>;
  totalCoursesEnrolled: number;
  completedCourses: number;
  assignmentsCompleted: number;
  averageQuizScore: number;
  totalXPEarned: number;
  createdAt: string;
  updatedAt: string;
  // Gamification elements (with default values if not provided by API)
  level?: number;
  streakDays?: number;
  badges?: Badge[];
  nextLevelXP?: number;
}

interface Activity {
  id: string;
  title: string;
  type: string;
  timestamp: string;
  score?: number;
  status?: string;
  progress?: number;
}

interface UserData {
  id: string;
  email: string;
  name: string;
  role: string;
  token: string;
  expiryTime: string;
  instructorStatus?: string;
}

const getUserFromLocalStorage = (): UserData | null => {
  const userString = localStorage.getItem('user');
  const userToken = localStorage.getItem('userToken');

  console.log('Getting user from localStorage:', { userString, userToken });

  if (!userString) return null;

  try {
    const userData = JSON.parse(userString);

    // If the token is missing in the user object but exists in localStorage,
    // add it to the user object
    if (!userData.token && userToken) {
      console.log('Adding missing token to user data');
      userData.token = userToken;
    }

    return userData;
  } catch (error) {
    console.error('Error parsing user data from localStorage:', error);
    return null;
  }
};

interface UpdateNotification {
  type: 'xp' | 'level' | 'badge';
  message: string;
  timestamp: number;
  data?: any;
}

const MainDashboard = () => {
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [notifications, setNotifications] = useState<UpdateNotification[]>([]);
  const [showUpdateIndicator, setShowUpdateIndicator] = useState(false);

  // Get user data on component mount and whenever localStorage changes
  useEffect(() => {
    const handleStorageChange = () => {
      const user = getUserFromLocalStorage();
      console.log('Storage changed, reloading user data:', user);
      setUserData(user);
    };

    // Initial load
    const user = getUserFromLocalStorage();
    console.log('Initial user data load:', user);
    setUserData(user);

    // Listen for storage events (in case another tab updates localStorage)
    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Define the fetchDashboardData function outside the useEffect for reuse
  const fetchDashboardData = async (isInitialLoad = false) => {
    // Only show loading indicator on initial load
    if (isInitialLoad) {
      setLoading(true);
    }
    setError(null);

    try {
      // Log user data for debugging
      console.log('User data from state:', userData);
      console.log('User data from localStorage:', localStorage.getItem('user'));
      console.log('User token from localStorage:', localStorage.getItem('userToken'));

      // Get user data directly from localStorage if state is null
      const currentUserData = userData || getUserFromLocalStorage();
      console.log('Current user data for API request:', currentUserData);

      if (!currentUserData?.token) {
        console.log('No token found in user data, redirecting to login');
        // Redirect to login page instead of throwing an error
        localStorage.removeItem('user');
        localStorage.removeItem('userToken');
        // Save the current path to redirect back after login
        sessionStorage.setItem('redirectUrl', '/dashboard');
        navigate('/login');
        return; // Stop execution after redirect
      }

      // Use currentUserData instead of userData for the rest of the function
      if (!userData && currentUserData) {
        console.log('Setting user data from localStorage');
        setUserData(currentUserData);
      }

      // Check token expiry
      if (currentUserData.expiryTime && new Date(currentUserData.expiryTime) < new Date()) {
        console.log('Token expired, redirecting to login');
        // Redirect to login page for expired token
        localStorage.removeItem('user');
        localStorage.removeItem('userToken');
        // Save the current path to redirect back after login
        sessionStorage.setItem('redirectUrl', '/dashboard');
        navigate('/login');
        return; // Stop execution after redirect
      }

      console.log('Using token for API request:', currentUserData.token);

      const headers = {
        Authorization: `Bearer ${currentUserData.token}`,
        'Content-Type': 'application/json'
      };

      const [enrolledCoursesRes, activitiesRes] = await Promise.all([
        api.get('/student/dashboard', { headers }),
        api.get('/student/dashboard/recent-activity', {
          headers,
          params: { page: 1, limit: 20 }
        })
      ]);

      // Log raw responses
      console.log('Raw Enrolled Courses Response:', {
        status: enrolledCoursesRes.status,
        headers: enrolledCoursesRes.headers,
        data: enrolledCoursesRes.data
      });

      // Ensure we have default values for all arrays
      const dashboardResponse = {
        studentId: enrolledCoursesRes.data?.studentId || '',
        recentCourses: enrolledCoursesRes.data?.recentCourses || [],
        recentQuizzes: enrolledCoursesRes.data?.recentQuizzes || [],
        recentAssignments: enrolledCoursesRes.data?.recentAssignments || [],
        upcomingMeetings: enrolledCoursesRes.data?.upcomingMeetings || [],
        totalCoursesEnrolled: enrolledCoursesRes.data?.totalCoursesEnrolled || 0,
        completedCourses: enrolledCoursesRes.data?.completedCourses || 0,
        assignmentsCompleted: enrolledCoursesRes.data?.assignmentsCompleted || 0,
        averageQuizScore: enrolledCoursesRes.data?.averageQuizScore || 0,
        totalXPEarned: enrolledCoursesRes.data?.totalXPEarned || 0,
        createdAt: enrolledCoursesRes.data?.createdAt || new Date().toISOString(),
        updatedAt: enrolledCoursesRes.data?.updatedAt || new Date().toISOString(),
        // Add gamification elements with default values
        level: enrolledCoursesRes.data?.level || Math.max(1, Math.floor((enrolledCoursesRes.data?.totalXPEarned || 0) / 100)),
        streakDays: enrolledCoursesRes.data?.streakDays || Math.floor(Math.random() * 7) + 1, // Placeholder
        nextLevelXP: enrolledCoursesRes.data?.nextLevelXP || 100 * (Math.floor((enrolledCoursesRes.data?.totalXPEarned || 0) / 100) + 1),
        // Default badges if not provided by API
        badges: enrolledCoursesRes.data?.badges || [
          {
            id: 'first-course',
            name: 'Course Explorer',
            description: 'Started your first course',
            icon: 'trophy',
            earned: (enrolledCoursesRes.data?.totalCoursesEnrolled || 0) > 0,
            progress: enrolledCoursesRes.data?.totalCoursesEnrolled || 0,
            maxProgress: 1
          },
          {
            id: 'quiz-master',
            name: 'Quiz Master',
            description: 'Complete 5 quizzes with high scores',
            icon: 'star',
            earned: (enrolledCoursesRes.data?.averageQuizScore || 0) > 80 &&
                   (enrolledCoursesRes.data?.recentQuizzes?.length || 0) >= 5,
            progress: Math.min(enrolledCoursesRes.data?.recentQuizzes?.length || 0, 5),
            maxProgress: 5
          },
          {
            id: 'streak-hero',
            name: 'Streak Hero',
            description: 'Login for 7 days in a row',
            icon: 'fire',
            earned: (enrolledCoursesRes.data?.streakDays || 0) >= 7,
            progress: enrolledCoursesRes.data?.streakDays || Math.floor(Math.random() * 7) + 1,
            maxProgress: 7
          },
          {
            id: 'assignment-ace',
            name: 'Assignment Ace',
            description: 'Complete 10 assignments on time',
            icon: 'check',
            earned: (enrolledCoursesRes.data?.assignmentsCompleted || 0) >= 10,
            progress: enrolledCoursesRes.data?.assignmentsCompleted || 0,
            maxProgress: 10
          }
        ]
      };

      // Format activities from recent quizzes and assignments
      const recentActivities: Activity[] = [
        ...(dashboardResponse.recentQuizzes || []).map((quiz: QuizActivity): Activity => ({
          id: quiz?.id || '',
          title: quiz?.title || '',
          type: 'quiz',
          timestamp: quiz?.date || new Date().toISOString(),
          score: quiz?.score || 0
        })),
        ...(dashboardResponse.recentAssignments || []).map((assignment: AssignmentActivity): Activity => ({
          id: assignment?.id || '',
          title: assignment?.title || '',
          type: 'assignment',
          timestamp: assignment?.dueDate || new Date().toISOString(),
          status: assignment?.status || 'pending'
        })),
        ...(dashboardResponse.recentCourses || []).map((course: CourseActivity): Activity => ({
          id: course?.id || '',
          title: course?.title || '',
          type: 'course_progress',
          timestamp: new Date().toISOString(),
          progress: course?.progress || 0
        }))
      ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

      // Animate updates if this is not the initial load and there are changes
      if (!isInitialLoad && dashboardData) {
        const newNotifications: UpdateNotification[] = [];
        let hasUpdates = false;

        // Check if XP has changed
        if (dashboardData.totalXPEarned !== dashboardResponse.totalXPEarned) {
          console.log('XP updated from', dashboardData.totalXPEarned, 'to', dashboardResponse.totalXPEarned);

          // Only notify if XP increased
          if (dashboardResponse.totalXPEarned > dashboardData.totalXPEarned) {
            const xpGained = dashboardResponse.totalXPEarned - dashboardData.totalXPEarned;
            newNotifications.push({
              type: 'xp',
              message: `You earned ${xpGained} XP!`,
              timestamp: Date.now(),
              data: {
                oldXP: dashboardData.totalXPEarned,
                newXP: dashboardResponse.totalXPEarned,
                gained: xpGained
              }
            });
            hasUpdates = true;
          }
        }

        // Check if level has changed
        if (dashboardData.level !== dashboardResponse.level && dashboardResponse.level > dashboardData.level) {
          console.log('Level up! From', dashboardData.level, 'to', dashboardResponse.level);

          newNotifications.push({
            type: 'level',
            message: `Level Up! You're now level ${dashboardResponse.level}!`,
            timestamp: Date.now(),
            data: {
              oldLevel: dashboardData.level,
              newLevel: dashboardResponse.level
            }
          });
          hasUpdates = true;
        }

        // Check if new badges were earned
        if (dashboardData.badges && dashboardResponse.badges) {
          const newlyEarnedBadges = dashboardResponse.badges.filter(
            newBadge => {
              const oldBadge = dashboardData.badges?.find(b => b.id === newBadge.id);
              return newBadge.earned && oldBadge && !oldBadge.earned;
            }
          );

          if (newlyEarnedBadges.length > 0) {
            console.log('New badges earned:', newlyEarnedBadges);

            newlyEarnedBadges.forEach(badge => {
              newNotifications.push({
                type: 'badge',
                message: `New Badge Unlocked: ${badge.name}!`,
                timestamp: Date.now(),
                data: { badge }
              });
            });
            hasUpdates = true;
          }
        }

        // If we have new notifications, add them and show the update indicator
        if (newNotifications.length > 0) {
          setNotifications(prev => [...newNotifications, ...prev].slice(0, 10)); // Keep only the 10 most recent
          setShowUpdateIndicator(true);

          // Auto-hide the indicator after 5 seconds
          setTimeout(() => {
            setShowUpdateIndicator(false);
          }, 5000);
        }
      }

      setDashboardData(dashboardResponse);
      setActivities(recentActivities);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      if (axios.isAxiosError(error)) {
        const isAuthError = error.response?.status === 401 || error.response?.status === 403;

        if (isAuthError) {
          // Redirect to login for authentication errors
          localStorage.removeItem('user');
          localStorage.removeItem('userToken');
          // Save the current path to redirect back after login
          sessionStorage.setItem('redirectUrl', '/dashboard');
          navigate('/login');
          return; // Stop execution after redirect
        }

        setError(error.response?.data?.message || 'Failed to fetch dashboard data');
      } else {
        const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';

        // Check if the error message indicates authentication issues
        if (errorMessage.includes('login') || errorMessage.includes('session') ||
            errorMessage.includes('token') || errorMessage.includes('auth')) {
          // Redirect to login for authentication-related errors
          localStorage.removeItem('user');
          localStorage.removeItem('userToken');
          // Save the current path to redirect back after login
          sessionStorage.setItem('redirectUrl', '/dashboard');
          navigate('/login');
          return; // Stop execution after redirect
        }

        setError(errorMessage);
      }
    } finally {
      if (isInitialLoad) {
        setLoading(false);
      }
    }
  };

  // Initial data fetch when component mounts or userData changes
  useEffect(() => {
    fetchDashboardData(true); // true indicates this is the initial load
  }, [userData, navigate]);

  // Set up real-time polling for updates
  useEffect(() => {
    // Only set up polling if we have user data and initial data has loaded
    if (!userData || loading || error) return;

    // Define polling interval (in milliseconds)
    const POLLING_INTERVAL = 15000; // 15 seconds

    console.log('Setting up real-time dashboard updates every', POLLING_INTERVAL/1000, 'seconds');

    // Set up the interval for polling
    const intervalId = setInterval(() => {
      console.log('Polling for dashboard updates...');
      fetchDashboardData(false); // false indicates this is not the initial load
    }, POLLING_INTERVAL);

    // Clean up the interval when the component unmounts
    return () => {
      console.log('Cleaning up dashboard polling interval');
      clearInterval(intervalId);
    };
  }, [userData, loading, error, navigate]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex justify-center items-center">
        <motion.div
          className="flex flex-col items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 10, -10, 0]
            }}
            transition={{
              repeat: Infinity,
              duration: 1.5
            }}
            className="mb-4"
          >
            <RocketIcon className="w-16 h-16 text-blue-600" />
          </motion.div>
          <h2 className="text-xl font-bold text-blue-800 mb-2">Preparing Your Learning Adventure!</h2>
          <div className="w-64 h-3 bg-blue-200 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-blue-600 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: '100%' }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          </div>
        </motion.div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex justify-center items-center p-4">
        <motion.div
          className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="mb-4 inline-block"
          >
            <Award className="w-20 h-20 text-orange-500 mx-auto" />
          </motion.div>
          <h2 className="text-2xl font-bold text-blue-800 mb-4">Oops! Something's Not Right</h2>
          <p className="text-gray-600 mb-6">
            We're having trouble loading your adventure dashboard. Let's try again!
          </p>
          <p className="text-sm text-red-500 mb-6 bg-red-50 p-3 rounded-lg">
            {error}
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-6 py-3 rounded-xl font-medium shadow-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </motion.button>
        </motion.div>
      </div>
    );
  }

  // Data validation check
  if (!dashboardData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex justify-center items-center p-4">
        <motion.div
          className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="mb-4 inline-block"
          >
            <BookOpen className="w-20 h-20 text-blue-500 mx-auto" />
          </motion.div>
          <h2 className="text-2xl font-bold text-blue-800 mb-4">Your Adventure Awaits!</h2>
          <p className="text-gray-600 mb-6">
            We're setting up your learning dashboard. It looks like we don't have any data yet.
            Let's start your learning journey!
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/courses')}
            className="bg-blue-600 text-white px-6 py-3 rounded-xl font-medium shadow-lg hover:bg-blue-700 transition-colors"
          >
            Explore Courses
          </motion.button>
        </motion.div>
      </div>
    );
  }

  // Helper function to get the appropriate icon for badges
  const getBadgeIcon = (iconName: string) => {

    const icons: { [key: string]: JSX.Element } = {
      'trophy': <Trophy className="w-8 h-8 text-yellow-500" />,
      'star': <Star className="w-8 h-8 text-purple-500" />,
      'fire': <Flame className="w-8 h-8 text-orange-500" />,
      'check': <CheckCircle2 className="w-8 h-8 text-green-500" />,
      'medal': <Medal className="w-8 h-8 text-blue-500" />,
      'target': <Target className="w-8 h-8 text-red-500" />,
      'crown': <Crown className="w-8 h-8 text-yellow-600" />,
      'rocket': <RocketIcon className="w-8 h-8 text-blue-600" />,
      'zap': <Zap className="w-8 h-8 text-purple-600" />,
      'flag': <Flag className="w-8 h-8 text-green-600" />,
    };
    return icons[iconName] || <Award className="w-8 h-8 text-gray-500" />;
  };

  // Calculate XP progress percentage
  const xpProgressPercentage = dashboardData.nextLevelXP
    ? Math.min(Math.round((dashboardData.totalXPEarned / dashboardData.nextLevelXP) * 100), 100)
    : 0;

  // Function to render notification icon based on type
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'xp':
        return <Sparkles className="w-5 h-5 text-yellow-500" />;
      case 'level':
        return <Trophy className="w-5 h-5 text-yellow-600" />;
      case 'badge':
        return <Medal className="w-5 h-5 text-blue-500" />;
      default:
        return <Star className="w-5 h-5 text-purple-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 relative">
      {/* Real-time update notifications */}
      <AnimatePresence>
        {showUpdateIndicator && notifications.length > 0 && (
          <motion.div
            className="fixed top-4 right-4 z-50"
            initial={{ opacity: 0, y: -20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.8 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="bg-white rounded-xl shadow-lg p-4 max-w-xs w-full border-2 border-indigo-200"
              animate={{
                boxShadow: ['0 4px 6px rgba(0, 0, 0, 0.1)', '0 10px 15px rgba(0, 0, 0, 0.2)', '0 4px 6px rgba(0, 0, 0, 0.1)']
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-bold text-gray-800">New Updates!</h3>
                <button
                  onClick={() => setShowUpdateIndicator(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <span className="sr-only">Close</span>
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-2 max-h-60 overflow-y-auto">
                {notifications.slice(0, 3).map((notification, index) => (
                  <motion.div
                    key={notification.timestamp + index}
                    className="flex items-center p-2 bg-indigo-50 rounded-lg"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="mr-3">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <p className="text-sm font-medium text-gray-700">{notification.message}</p>
                  </motion.div>
                ))}

                {notifications.length > 3 && (
                  <p className="text-xs text-center text-gray-500 mt-2">
                    +{notifications.length - 3} more updates
                  </p>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section with Level and XP */}
        <motion.div
          className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl shadow-xl p-6 mb-8 text-white overflow-hidden relative"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Decorative elements */}
          <motion.div
            className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full"
            style={{ top: '-20px', right: '-20px' }}
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 3, repeat: Infinity }}
          />
          <motion.div
            className="absolute bottom-0 left-0 w-32 h-32 bg-white opacity-5 rounded-full"
            style={{ bottom: '-10px', left: '-10px' }}
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
          />

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center relative z-10">
            <div>
              <motion.h1
                className="text-3xl md:text-4xl font-bold mb-2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                Welcome back, {userData?.name?.trim() || getUserFromLocalStorage()?.name?.trim() || 'Explorer'}!
              </motion.h1>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                {(userData?.email || getUserFromLocalStorage()?.email) && (
                  <span className="block text-sm text-blue-200 mb-2">{userData?.email || getUserFromLocalStorage()?.email}</span>
                )}
                <div className="flex items-center">
                  <Sparkles className="w-5 h-5 text-yellow-300 mr-2" />
                  <span className="font-semibold text-yellow-300">Level {dashboardData.level || 1}</span>
                </div>
              </motion.div>
            </div>

            <motion.div
              className="mt-4 md:mt-0 bg-white/10 p-4 rounded-xl backdrop-blur-sm w-full md:w-auto"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">XP: {dashboardData.totalXPEarned} / {dashboardData.nextLevelXP}</span>
                <span className="text-sm font-medium">{xpProgressPercentage}%</span>
              </div>
              <div className="w-full md:w-64 h-3 bg-white/20 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-yellow-300 to-yellow-500 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${xpProgressPercentage}%` }}
                  transition={{ duration: 1, type: 'spring' }}
                />
              </div>
              {dashboardData.streakDays && (
                <div className="flex items-center mt-2 text-sm">
                  <Flame className="w-4 h-4 text-orange-300 mr-1" />
                  <span>{dashboardData.streakDays} day streak!</span>
                </div>
              )}
            </motion.div>
          </div>
        </motion.div>

        {/* Badges Section */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h2 className="text-2xl font-bold text-blue-800 mb-4 flex items-center">
            <Medal className="w-6 h-6 mr-2 text-blue-600" />
            Your Achievements
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {dashboardData.badges?.map((badge) => (
              <motion.div
                key={badge.id}
                className={`bg-white rounded-xl shadow-md p-4 text-center ${!badge.earned ? 'opacity-60' : ''}`}
                whileHover={{ scale: 1.03, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex justify-center mb-2">
                  {getBadgeIcon(badge.icon)}
                </div>
                <h3 className="font-bold text-gray-800 mb-1">{badge.name}</h3>
                <p className="text-xs text-gray-600 mb-2">{badge.description}</p>

                {badge.maxProgress && badge.progress !== undefined && (
                  <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${badge.earned ? 'bg-green-500' : 'bg-blue-500'}`}
                      style={{ width: `${Math.min(100, (badge.progress / badge.maxProgress) * 100)}%` }}
                    />
                  </div>
                )}
                {badge.earned && (
                  <span className="inline-block mt-2 px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                    Unlocked!
                  </span>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Stats Grid - More playful and colorful */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          variants={{
            hidden: { opacity: 0 },
            show: {
              opacity: 1,
              transition: {
                staggerChildren: 0.1
              }
            }
          }}
        >
          <motion.div
            className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-xl shadow-lg text-white"
            whileHover={{
              scale: 1.05,
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
            }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex items-center mb-2">
              <BookOpen className="w-6 h-6 mr-2 text-blue-200" />
              <h3 className="text-sm font-medium text-blue-100">Courses Enrolled</h3>
            </div>
            <p className="text-3xl font-bold">
              {dashboardData.totalCoursesEnrolled}
            </p>
          </motion.div>

          <motion.div
            className="bg-gradient-to-br from-green-500 to-green-600 p-6 rounded-xl shadow-lg text-white"
            whileHover={{
              scale: 1.05,
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
            }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex items-center mb-2">
              <CheckCircle2 className="w-6 h-6 mr-2 text-green-200" />
              <h3 className="text-sm font-medium text-green-100">Completed Courses</h3>
            </div>
            <p className="text-3xl font-bold">
              {dashboardData.completedCourses}
            </p>
          </motion.div>

          <motion.div
            className="bg-gradient-to-br from-purple-500 to-purple-600 p-6 rounded-xl shadow-lg text-white"
            whileHover={{
              scale: 1.05,
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
            }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex items-center mb-2">
              <Star className="w-6 h-6 mr-2 text-purple-200" />
              <h3 className="text-sm font-medium text-purple-100">Average Score</h3>
            </div>
            <p className="text-3xl font-bold">
              {dashboardData.averageQuizScore}%
            </p>
          </motion.div>

          <motion.div
            className="bg-gradient-to-br from-orange-500 to-orange-600 p-6 rounded-xl shadow-lg text-white"
            whileHover={{
              scale: 1.05,
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
            }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex items-center mb-2">
              <Flag className="w-6 h-6 mr-2 text-orange-200" />
              <h3 className="text-sm font-medium text-orange-100">Assignments</h3>
            </div>
            <p className="text-3xl font-bold">
              {dashboardData.assignmentsCompleted}
            </p>
          </motion.div>
        </motion.div>

        {/* Tasks and Activities Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Upcoming Tasks */}
          <motion.div
            className="bg-white rounded-xl shadow-lg overflow-hidden border-2 border-blue-100"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <div className="px-6 py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white">
              <div className="flex items-center">
                <Calendar className="w-5 h-5 mr-2" />
                <h2 className="text-xl font-bold">Your Quest Log</h2>
              </div>
            </div>
            <div className="divide-y divide-blue-100">
              {!dashboardData?.recentAssignments?.length ? (
                <div className="px-6 py-8 text-center">
                  <motion.div
                    animate={{ y: [0, -5, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="mb-2 inline-block"
                  >
                    <Flag className="w-12 h-12 text-blue-300 mx-auto" />
                  </motion.div>
                  <p className="text-gray-500">No quests available right now!</p>
                  <p className="text-sm text-blue-500 mt-2">Check back soon for new adventures</p>
                </div>
              ) : (
                (dashboardData.recentAssignments || []).map((assignment) => (
                  <motion.div
                    key={assignment.id}
                    className="px-6 py-4 hover:bg-blue-50 transition-colors duration-200 cursor-pointer"
                    whileHover={{ backgroundColor: 'rgba(239, 246, 255, 0.6)' }}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-base font-medium text-gray-900">{assignment.title}</h4>
                        <div className="flex items-center text-sm text-gray-500 mt-1">
                          <Clock className="w-4 h-4 mr-1 text-blue-500" />
                          <p>Due {new Date(assignment.dueDate).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium
                        ${assignment.status === 'completed' ? 'bg-green-100 text-green-800' :
                          assignment.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                          'bg-orange-100 text-orange-800'}`}>
                        {assignment.status}
                      </span>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </motion.div>

          {/* Recent Activities */}
          <motion.div
            className="bg-white rounded-xl shadow-lg overflow-hidden border-2 border-purple-100"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <div className="px-6 py-4 bg-gradient-to-r from-purple-500 to-purple-600 text-white">
              <div className="flex items-center">
                <Zap className="w-5 h-5 mr-2" />
                <h2 className="text-xl font-bold">Adventure Log</h2>
              </div>
            </div>
            <div className="divide-y divide-purple-100">
              {!activities?.length ? (
                <div className="px-6 py-8 text-center">
                  <motion.div
                    animate={{ rotate: [0, 5, -5, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="mb-2 inline-block"
                  >
                    <BookOpen className="w-12 h-12 text-purple-300 mx-auto" />
                  </motion.div>
                  <p className="text-gray-500">Your adventure is just beginning!</p>
                  <p className="text-sm text-purple-500 mt-2">Complete activities to see them here</p>
                </div>
              ) : (
                activities.map((activity) => (
                  <motion.div
                    key={`${activity.type}-${activity.timestamp}`}
                    className="px-6 py-4 hover:bg-purple-50 transition-colors duration-200 cursor-pointer"
                    whileHover={{ backgroundColor: 'rgba(243, 232, 255, 0.6)' }}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-base font-medium text-gray-900">{activity.title}</h4>
                        <div className="flex items-center text-sm text-gray-500 mt-1">
                          {activity.type === 'quiz' && <Star className="w-4 h-4 mr-1 text-purple-500" />}
                          {activity.type === 'assignment' && <Flag className="w-4 h-4 mr-1 text-orange-500" />}
                          {activity.type === 'course_progress' && <BookOpen className="w-4 h-4 mr-1 text-blue-500" />}
                          <p>{activity.type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}</p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        {activity.score !== undefined && (
                          <span className="px-2 py-1 text-xs font-medium text-purple-700 bg-purple-100 rounded-full">
                            {activity.score}%
                          </span>
                        )}
                        {activity.progress !== undefined && (
                          <span className="px-2 py-1 text-xs font-medium text-green-700 bg-green-100 rounded-full">
                            {activity.progress}%
                          </span>
                        )}
                        {activity.status && (
                          <span className="px-2 py-1 text-xs font-medium text-orange-700 bg-orange-100 rounded-full">
                            {activity.status}
                          </span>
                        )}
                        <span className="ml-2 text-xs text-gray-500">
                          {new Date(activity.timestamp).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </motion.div>
        </div>

        {/* Quick Actions */}
        <motion.div
          className="mt-8 bg-white rounded-xl shadow-lg p-6 border-2 border-indigo-100"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
            <RocketIcon className="w-5 h-5 mr-2 text-indigo-600" />
            Continue Your Adventure
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-4 rounded-xl shadow-md flex flex-col items-center justify-center text-center"
              onClick={() => navigate('/courses')}
            >
              <BookOpen className="w-8 h-8 mb-2" />
              <span className="font-medium">Explore Courses</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-4 rounded-xl shadow-md flex flex-col items-center justify-center text-center"
              onClick={() => navigate('/dashboard/quizzes')}
            >
              <Star className="w-8 h-8 mb-2" />
              <span className="font-medium">Take a Quiz</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-br from-green-500 to-green-600 text-white p-4 rounded-xl shadow-md flex flex-col items-center justify-center text-center"
              onClick={() => navigate('/dashboard/achievements')}
            >
              <Trophy className="w-8 h-8 mb-2" />
              <span className="font-medium">Achievements</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-br from-orange-500 to-orange-600 text-white p-4 rounded-xl shadow-md flex flex-col items-center justify-center text-center"
              onClick={() => navigate('/dashboard/interactive-resources')}
            >
              <Zap className="w-8 h-8 mb-2" />
              <span className="font-medium">Interactive</span>
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default MainDashboard;
