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

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginSignUp />} />
        <Route path="/all-students" element={<AllStudentsDashboard />} />
        <Route path="/" element={<Layout />}>
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
        </Route>
      </Routes>
    </Router>
  );
}

export default App;

