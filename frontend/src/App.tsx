import { BrowserRouter as Router, Route, Routes, Navigate, useLocation } from 'react-router-dom';
import Layout from './components/Layout';
import LoginSignUp from './components/LoginSignUp';
import AllStudentsDashboard from './components/AllStudentsDashboard';
import MainDashboard from './components/MainDashboard';
import SelectInstructor from './components/SelectInstructor';
import Achievements from './components/Achievements';
import Classes from './components/Classes';
import Assignments from './components/Assignments';
import Lessons from './components/Lessons';
import Calendar from './components/Calendar';
import Materials from './components/Materials';
import Library from './components/Library';
import Progress from './components/Progress';
import MoreOptions from './components/MoreOptions';
import AccountSettings from './components/AccountSettings';
import NotificationPreferences from './components/NotificationPreferences';
import PrivacySettings from './components/PrivacySettings';
import LanguagePreferences from './components/LanguagePreferences';
import Schedule from './components/Schedule';
import Resources from './components/Resources';

// Auth checks
const isAuthenticated = () => {
  return localStorage.getItem('userToken') !== null;
};

const hasSelectedPlan = () => {
  return localStorage.getItem('selectedPlan') !== null;
};

// Protected Route wrapper component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();

  if (!isAuthenticated()) {
    // Redirect to signup if not authenticated
    sessionStorage.setItem('redirectUrl', location.pathname);
    return <Navigate to="/login" replace />;
  }

  // If authenticated but no plan selected, and trying to access dashboard
  if (!hasSelectedPlan() && location.pathname.startsWith('/dashboard')) {
    return <Navigate to="/all-students" replace />;
  }

  return <>{children}</>;
};

// Auth Route wrapper component (for login/signup)
const AuthRoute = ({ children }: { children: React.ReactNode }) => {
  if (isAuthenticated()) {
    // If authenticated but no plan selected
    if (!hasSelectedPlan()) {
      return <Navigate to="/all-students" replace />;
    }
    
    // If has plan, go to dashboard
    return <Navigate to="/dashboard" replace />;
  }
  return <>{children}</>;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route 
          path="/login" 
          element={
            <AuthRoute>
              <LoginSignUp />
            </AuthRoute>
          } 
        />
        
        {/* Plan Selection Route */}
        <Route 
          path="/all-students" 
          element={
            <ProtectedRoute>
              <AllStudentsDashboard />
            </ProtectedRoute>
          } 
        />

        {/* Main Dashboard and nested routes - requires both auth and plan selection */}
        <Route 
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<MainDashboard />} />
          <Route path="select-instructor" element={<SelectInstructor />} />
          <Route path="achievements" element={<Achievements />} />
          <Route path="classes" element={<Classes />} />
          <Route path="assignments" element={<Assignments />} />
          <Route path="lessons" element={<Lessons />} />
          <Route path="schedule" element={<Schedule />} />
          <Route path="resources" element={<Resources />} />
          <Route path="calendar" element={<Calendar />} />
          <Route path="materials" element={<Materials />} />
          <Route path="library" element={<Library />} />
          <Route path="progress" element={<Progress />} />
          <Route path="more" element={<MoreOptions />} />
          <Route path="account-settings" element={<AccountSettings />} />
          <Route path="notification-preferences" element={<NotificationPreferences />} />
          <Route path="privacy-settings" element={<PrivacySettings />} />
          <Route path="language-preferences" element={<LanguagePreferences />} />
        </Route>

        {/* Catch all route - redirect to login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
