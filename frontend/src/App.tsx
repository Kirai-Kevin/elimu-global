import { BrowserRouter as Router, Route, Routes, Navigate, useLocation, Outlet } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Layout from './components/Layout';
import LoginSignUp from './components/LoginSignUp';
import MainDashboard from './components/MainDashboard';
import SelectInstructor from './components/SelectInstructor';
import Achievements from './components/Achievements';
import Classes from './components/Classes';
import Lessons from './components/Lessons';
import Progress from './components/Progress';
import MoreOptions from './components/MoreOptions';
import AccountSettings from './components/AccountSettings';
import NotificationPreferences from './components/NotificationPreferences';
import PrivacySettings from './components/PrivacySettings';
import LanguagePreferences from './components/LanguagePreferences';
import PageTransition from './components/PageTransition';
import AllCourses from './components/FreeCourses/FreeCoursesList';
import FeaturedCourses from './components/FreeCourses/FeaturedCourses';
import CourseDetail from './components/FreeCourses/CourseDetail';
import CourseLessons from './components/CourseLessons';
import Quizzes from './components/Quizzes';
import AssessmentPage from './components/AssessmentPage';
import AssessmentDashboard from './components/AssessmentDashboard';
import InteractiveResources from './components/InteractiveResources';
import LearningMode from './components/LearningMode/LearningMode';
import './components/FreeCourses/FreeCourses.css';

// Auth checks
const isAuthenticated = () => {
  const userToken = localStorage.getItem('userToken');
  const userString = localStorage.getItem('user');

  console.log('Checking authentication:', { userToken, userString });

  // Check both userToken and user object
  if (userToken) return true;

  // If no userToken, check if user object has a token
  if (userString) {
    try {
      const userData = JSON.parse(userString);
      return !!userData.token;
    } catch (error) {
      console.error('Error parsing user data during auth check:', error);
      return false;
    }
  }

  return false;
};

// Protected Route wrapper component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();

  if (!isAuthenticated()) {
    // Redirect to login if not authenticated
    sessionStorage.setItem('redirectUrl', location.pathname);
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

// Auth Route wrapper component (for login/signup)
const AuthRoute = ({ children }: { children: React.ReactNode }) => {
  if (isAuthenticated()) {
    // If authenticated, go to dashboard
    return <Navigate to="/dashboard" replace />;
  }
  return <>{children}</>;
};

// We need this wrapper to access location for AnimatePresence
function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Public Routes */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route 
          path="/login" 
          element={
            <AuthRoute>
              <PageTransition>
                <LoginSignUp />
              </PageTransition>
            </AuthRoute>
          } 
        />

        {/* Main Dashboard and nested routes - requires authentication */}
        <Route 
          path="/dashboard"
          element={
            <ProtectedRoute>
              <PageTransition>
                <Layout />
              </PageTransition>
            </ProtectedRoute>
          }
        >
          <Route index element={<MainDashboard />} />
          <Route path="select-instructor" element={<SelectInstructor />} />
          <Route path="achievements" element={<Achievements />} />
          <Route path="classes" element={<Classes />} />
          <Route path="lessons" element={<Lessons />} />
          <Route path="more" element={<MoreOptions />} />
          <Route path="account-settings" element={<AccountSettings />} />
          <Route path="notification-preferences" element={<NotificationPreferences />} />
          <Route path="privacy-settings" element={<PrivacySettings />} />
          <Route path="language-preferences" element={<LanguagePreferences />} />
          <Route path="quizzes" element={<Quizzes />} />
          <Route path="assessment" element={<AssessmentDashboard />} />
          <Route path="assessment/:courseId/:assessmentId" element={<AssessmentPage />} />
          <Route path="interactive-resources" element={<InteractiveResources />} />
        </Route>

        {/* Free Courses Routes */}
        <Route 
          path="/free-courses" 
          element={
            <ProtectedRoute>
              <PageTransition>
                <Layout />
              </PageTransition>
            </ProtectedRoute>
          }
        >
          <Route index element={<AllCourses />} />
        </Route>
        <Route 
          path="/featured-courses" 
          element={
            <ProtectedRoute>
              <PageTransition>
                <Layout />
              </PageTransition>
            </ProtectedRoute>
          }
        >
          <Route index element={<FeaturedCourses />} />
        </Route>
        <Route
          path="/courses/:courseId"
          element={
            <ProtectedRoute>
              <PageTransition>
                <Layout />
              </PageTransition>
            </ProtectedRoute>
          }
        >
          <Route index element={<CourseDetail />} />
        </Route>
        <Route
          path="/courses/:courseId/lessons"
          element={
            <ProtectedRoute>
              <PageTransition>
                <Layout />
              </PageTransition>
            </ProtectedRoute>
          }
        >
          <Route index element={<CourseLessons />} />
        </Route>
        <Route
          path="/learning/:courseId"
          element={
            <ProtectedRoute>
              <PageTransition>
                <Layout />
              </PageTransition>
            </ProtectedRoute>
          }
        >
          <Route index element={<LearningMode />} />
        </Route>

        {/* Catch all route - redirect to login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <Router>
      <AnimatedRoutes />
    </Router>
  );
}

export default App;
