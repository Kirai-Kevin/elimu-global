import React, { useEffect, useState } from 'react';
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
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
  if (!userString) return null;
  try {
    return JSON.parse(userString);
  } catch {
    return null;
  }
};

const MainDashboard = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);

  useEffect(() => {
    const user = getUserFromLocalStorage();
    setUserData(user);
  }, []);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      setError(null);
      try {
        if (!userData?.token) {
          throw new Error('Please login to view your dashboard');
        }

        // Check token expiry
        if (userData.expiryTime && new Date(userData.expiryTime) < new Date()) {
          throw new Error('Your session has expired. Please login again.');
        }

        const headers = { 
          Authorization: `Bearer ${userData.token}`,
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
          updatedAt: enrolledCoursesRes.data?.updatedAt || new Date().toISOString()
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

        setDashboardData(dashboardResponse);
        setActivities(recentActivities);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        if (axios.isAxiosError(error)) {
          setError(
          error.response?.status === 401 || error.response?.status === 403
            ? 'Authentication failed. Please login again.' 
              : error.response?.data?.message || 'Failed to fetch dashboard data'
          );
        } else {
          setError(error instanceof Error ? error.message : 'An unexpected error occurred');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [userData]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  // Data validation check
  if (!dashboardData) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded">
          No dashboard data available
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="bg-blue-600 rounded-lg shadow-lg p-6 mb-8 text-white">
          <h1 className="text-3xl font-bold mb-2">
            Welcome back, {userData?.name?.trim() || 'Student'}!
          </h1>
          <p className="text-blue-100">
            {userData?.email && (
              <span className="block text-sm text-blue-200 mb-2">{userData.email}</span>
            )}
            XP Earned: {dashboardData.totalXPEarned} points
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
            <h3 className="text-gray-500 text-sm font-medium">Courses Enrolled</h3>
            <p className="mt-2 text-3xl font-bold text-blue-600">
              {dashboardData.totalCoursesEnrolled}
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
            <h3 className="text-gray-500 text-sm font-medium">Completed Courses</h3>
            <p className="mt-2 text-3xl font-bold text-blue-600">
              {dashboardData.completedCourses}
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
            <h3 className="text-gray-500 text-sm font-medium">Average Score</h3>
            <p className="mt-2 text-3xl font-bold text-blue-600">
              {dashboardData.averageQuizScore}%
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
            <h3 className="text-gray-500 text-sm font-medium">Assignments</h3>
            <p className="mt-2 text-3xl font-bold text-blue-600">
              {dashboardData.assignmentsCompleted}
            </p>
          </div>
        </div>

        {/* Tasks and Activities Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Upcoming Tasks */}
          <div className="bg-white rounded-lg shadow hover:shadow-lg transition-all duration-300">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800">Upcoming Tasks</h2>
            </div>
            <div className="divide-y divide-gray-200">
              {!dashboardData?.recentAssignments?.length ? (
                <div className="px-6 py-4 text-gray-500">
                  No upcoming tasks
                </div>
              ) : (
                (dashboardData.recentAssignments || []).map((assignment) => (
                  <div key={assignment.id} className="px-6 py-4 hover:bg-blue-50 transition-colors duration-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-medium text-gray-900">{assignment.title}</h4>
                        <p className="text-sm text-gray-500">
                          Due {new Date(assignment.dueDate).toLocaleDateString()}
                        </p>
                      </div>
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {assignment.status}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Recent Activities */}
          <div className="bg-white rounded-lg shadow hover:shadow-lg transition-all duration-300">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800">Recent Activity</h2>
            </div>
            <div className="divide-y divide-gray-200">
              {!activities?.length ? (
                <div className="px-6 py-4 text-gray-500">
                  No recent activities
                </div>
              ) : (
                activities.map((activity) => (
                  <div key={`${activity.type}-${activity.timestamp}`} className="px-6 py-4 hover:bg-blue-50 transition-colors duration-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-medium text-gray-900">{activity.title}</h4>
                        <p className="text-sm text-gray-500">
                          {activity.type.replace('_', ' ').toUpperCase()}
                        </p>
                      </div>
                      <div className="flex items-center">
                        {activity.score !== undefined && (
                          <span className="px-2 py-1 text-xs font-medium text-blue-700 bg-blue-100 rounded-full">
                            Score: {activity.score}%
                          </span>
                        )}
                        {activity.progress !== undefined && (
                          <span className="px-2 py-1 text-xs font-medium text-green-700 bg-green-100 rounded-full">
                            Progress: {activity.progress}%
                          </span>
                        )}
                        {activity.status && (
                          <span className="px-2 py-1 text-xs font-medium text-orange-700 bg-orange-100 rounded-full">
                            {activity.status}
                          </span>
                        )}
                        <span className="ml-2 text-sm text-gray-500">
                          {new Date(activity.timestamp).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainDashboard;
