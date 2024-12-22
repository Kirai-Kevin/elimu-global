import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
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

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<LoginSignUp />} />
        <Route path="/all-students" element={<AllStudentsDashboard />} />

        {/* Protected Routes */}
        <Route path="/" element={<Layout />}>
          {/* Main Dashboard */}
          <Route index element={<MainDashboard />} />
          
          {/* Core Features */}
          <Route path="select-instructor" element={<SelectInstructor />} />
          <Route path="achievements" element={<Achievements />} />
          <Route path="classes" element={<Classes />} />
          <Route path="assignments" element={<Assignments />} />
          <Route path="lessons" element={<Lessons />} />
          <Route path="calendar" element={<Calendar />} />
          <Route path="materials" element={<Materials />} />
          <Route path="library" element={<Library />} />
          <Route path="progress" element={<Progress />} />
          
          {/* More Options and Settings */}
          <Route path="more" element={<MoreOptions />} />
          <Route path="more/account" element={<AccountSettings />} />
          <Route path="more/notifications" element={<NotificationPreferences />} />
          <Route path="more/privacy" element={<PrivacySettings />} />
          <Route path="more/language" element={<LanguagePreferences />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
