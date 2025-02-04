import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { FreeCourse } from '../../services/freeCourseService';
import FreeCourseService from '../../services/freeCourseService';
import { 
  Book, 
  BookOpen, 
  GraduationCap, 
  ChevronRight,
  AlertCircle,
  ExternalLink,
  Video,
  Clock,
  Users,
  Star,
  ArrowLeft,
  FileText,
  Play,
  CheckCircle,
  TrendingUp
} from 'lucide-react';

const CourseDetail: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  
  const [course, setCourse] = useState<FreeCourse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<'overview' | 'curriculum' | 'instructor'>('overview');

  useEffect(() => {
    const fetchCourseDetails = async () => {
      if (!courseId) {
        setError('No course ID provided');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const courseDetails = await FreeCourseService.getCourseById(courseId);
        setCourse(courseDetails);
      } catch (err: any) {
        console.error('Error fetching course details:', err);
        setError(err.response?.data?.message || err.message || 'Failed to load course details');
      } finally {
        setLoading(false);
      }
    };

    fetchCourseDetails();
  }, [courseId]);

  const handleStartCourse = () => {
    // Log course details before navigation
    console.log('Starting course with ID:', courseId);
    console.log('Current course details:', course);

    // Validate course ID before navigation
    if (!courseId) {
      console.error('Cannot start course: No course ID available');
      // Optional: Show an error toast or alert
      return;
    }

    // Navigate to learning mode
    navigate(`/learning/${courseId}`);
  };

  if (loading) return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex justify-center items-center h-screen bg-gray-50"
    >
      <motion.div
        animate={{ 
          scale: [1, 1.2, 1],
          rotate: [0, 10, -10, 0]
        }}
        transition={{ 
          repeat: Infinity, 
          duration: 1 
        }}
        className="text-4xl font-bold text-blue-500 flex items-center"
      >
        <BookOpen className="mr-2" /> Loading Course Details...
      </motion.div>
    </motion.div>
  );

  if (error) return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex justify-center items-center h-screen bg-red-50"
    >
      <div className="text-center p-6 bg-white rounded-lg shadow-md max-w-md w-full">
        <AlertCircle className="mx-auto mb-4 text-red-500" size={64} />
        <h2 className="text-2xl font-bold text-red-700 mb-2">Oops! Something Went Wrong</h2>
        <p className="text-gray-600 mb-4">{error}</p>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/free-courses')}
          className="px-6 py-3 bg-blue-500 text-white rounded-full 
            hover:bg-blue-600 transition flex items-center justify-center mx-auto"
        >
          <ArrowLeft className="mr-2" /> Back to Courses
        </motion.button>
      </div>
    </motion.div>
  );

  if (!course) return null;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Course Image and Actions */}
        <div className="lg:col-span-1 space-y-6">
          {/* Course Image */}
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-gradient-to-br from-blue-400 to-purple-600 
              rounded-2xl overflow-hidden shadow-lg 
              h-64 flex items-center justify-center"
          >
            <BookOpen className="text-white" size={96} />
          </motion.div>

          {/* Course Meta Information */}
          <div className="bg-white rounded-2xl shadow-md p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-gray-600">
                <Clock size={20} />
                <span>{course.estimatedHours || '10'} Hours</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-600">
                <TrendingUp size={20} />
                <span>{course.difficulty || 'Beginner'}</span>
              </div>
            </div>

            {/* Start Course Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleStartCourse}
              className="w-full bg-blue-500 text-white 
                py-3 rounded-full 
                flex items-center justify-center 
                space-x-2 
                hover:bg-blue-600 
                transition-colors duration-300"
            >
              <Play size={20} />
              <span>Start Learning</span>
            </motion.button>
          </div>
        </div>

        {/* Right Column - Course Details */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-md p-8">
          {/* Course Title and Description */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">
              {course.title}
            </h1>
            <p className="text-gray-600 leading-relaxed">
              {course.description}
            </p>
          </div>

          {/* Navigation Tabs */}
          <div className="flex border-b mb-6">
            {['overview', 'curriculum', 'instructor'].map(section => (
              <button
                key={section}
                onClick={() => setActiveSection(section as any)}
                className={`px-4 py-2 text-sm font-medium 
                  ${activeSection === section 
                    ? 'text-blue-600 border-b-2 border-blue-600' 
                    : 'text-gray-500 hover:text-gray-700'}`}
              >
                {section.charAt(0).toUpperCase() + section.slice(1)}
              </button>
            ))}
          </div>

          {/* Dynamic Content Sections */}
          <AnimatePresence mode="wait">
            {activeSection === 'overview' && (
              <motion.div
                key="overview"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-4"
              >
                <div className="flex items-center space-x-2">
                  <CheckCircle className="text-green-500" />
                  <h3 className="font-semibold">Learning Objectives</h3>
                </div>
                <ul className="list-disc list-inside text-gray-600">
                  {course.learningObjectives?.map((obj, index) => (
                    <li key={index}>{obj}</li>
                  ))}
                </ul>
              </motion.div>
            )}

            {activeSection === 'curriculum' && (
              <motion.div
                key="curriculum"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-4"
              >
                <div className="flex items-center space-x-2">
                  <FileText className="text-blue-500" />
                  <h3 className="font-semibold">Course Modules</h3>
                </div>
                {course.modules?.map((module, index) => (
                  <div 
                    key={index} 
                    className="bg-gray-50 p-4 rounded-lg flex items-center justify-between"
                  >
                    <span>{module.title}</span>
                    <span className="text-sm text-gray-500">{module.duration}</span>
                  </div>
                ))}
              </motion.div>
            )}

            {activeSection === 'instructor' && (
              <motion.div
                key="instructor"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-4"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gray-200 rounded-full 
                    flex items-center justify-center">
                    <Users className="text-gray-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{course.instructor?.name}</h3>
                    <p className="text-gray-600">{course.instructor?.title}</p>
                  </div>
                </div>
                <p className="text-gray-600">{course.instructor?.bio}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};

export default CourseDetail;
