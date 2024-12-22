import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
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

// Simple auth check - replace with your actual auth logic
const isAuthenticated = () => {
  return localStorage.getItem('user') !== null;
};

// Protected Route wrapper component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes - Login is the default route */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginSignUp />} />
        
        {/* All Students Dashboard - requires authentication */}
        <Route 
          path="/all-students" 
          element={
            <ProtectedRoute>
              <AllStudentsDashboard />
            </ProtectedRoute>
          } 
        />

        {/* Main Dashboard and other protected routes */}
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
          <Route path="calendar" element={<Calendar />} />
          <Route path="materials" element={<Materials />} />
          <Route path="library" element={<Library />} />
          <Route path="progress" element={<Progress />} />
          <Route path="more" element={<MoreOptions />} />
          <Route path="more/account" element={<AccountSettings />} />
          <Route path="more/notifications" element={<NotificationPreferences />} />
          <Route path="more/privacy" element={<PrivacySettings />} />
          <Route path="more/language" element={<LanguagePreferences />} />
        </Route>

        {/* Catch all route - redirect to login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
