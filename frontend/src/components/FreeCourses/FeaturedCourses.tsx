import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Rocket, 
  Star, 
  Zap, 
  Award, 
  BookOpen, 
  Play,
  Sparkles,
  TrendingUp,
  CheckCircle,
  AlertTriangle,
  Clock,
  ExternalLink
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import FreeCourseService from '../../services/freeCourseService';
import { FreeCourse } from '../../services/freeCourseService';

const CourseCard: React.FC<{ course: FreeCourse }> = ({ course }) => {
  const navigate = useNavigate();

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { 
        type: "spring", 
        stiffness: 300, 
        damping: 20 
      }
    },
    hover: { 
      scale: 1.05,
      boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.1)",
      transition: { 
        type: "spring", 
        stiffness: 300 
      }
    }
  };

  return (
    <motion.div 
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      className="bg-white rounded-2xl shadow-lg overflow-hidden 
        transform transition-all duration-300 
        border border-blue-50 hover:border-blue-100
        flex flex-col"
    >
      <div className="relative">
        {/* Playful course badge */}
        <div className="absolute top-2 right-2 z-10">
          <motion.span 
            initial={{ rotate: 0 }}
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ 
              repeat: Infinity, 
              duration: 1.5,
              ease: "easeInOut"
            }}
            className="bg-yellow-400 text-white px-2 py-1 rounded-full 
              text-xs flex items-center gap-1"
          >
            <Sparkles size={14} /> Featured
          </motion.span>
        </div>

        {/* Course Image Placeholder with Gradient */}
        <div className="h-48 w-full bg-gradient-to-br 
          from-blue-400 to-purple-600 
          flex items-center justify-center">
          <BookOpen className="text-white" size={64} />
        </div>
      </div>

      <div className="p-4 flex-grow flex flex-col">
        <h2 className="text-xl font-bold mb-2 text-gray-800 line-clamp-2">
          {course.title}
        </h2>
        
        <p className="text-sm text-gray-600 mb-4 flex-grow line-clamp-3">
          {course.description}
        </p>

        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <TrendingUp size={16} />
              <span>{course.difficulty || 'Beginner'}</span>
            </div>
            {course.duration && (
              <div className="flex items-center gap-2">
                <Clock size={16} />
                <span>{course.duration}</span>
              </div>
            )}
          </div>

          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate(`/courses/${course._id}`)}
            className="w-full bg-blue-500 text-white px-4 py-2 rounded-full 
              flex items-center justify-center gap-2 hover:bg-blue-600 
              transition-colors duration-300"
          >
            <Play size={16} /> Start Course
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

const FeaturedCourses: React.FC = () => {
  const navigate = useNavigate();
  const [allCourses, setAllCourses] = useState<FreeCourse[]>([]);
  const [enrolledCourses, setEnrolledCourses] = useState<FreeCourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'enrolled'>('all');

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        // Fetch all available courses
        const coursesResponse = await FreeCourseService.getAllCourses();
        setAllCourses(coursesResponse);

        // Fetch enrolled courses
        const enrolledResponse = await FreeCourseService.getEnrolledCourses();
        
        // Detailed logging for enrolled courses
        console.group('Enrolled Courses Debug');
        console.log('Transformed Enrolled Courses:', enrolledResponse);
        console.log('Number of Enrolled Courses:', enrolledResponse.length);
        
        // Log details of each enrolled course
        enrolledResponse.forEach((course, index) => {
          console.log(`Course ${index + 1}:`, {
            id: course._id,
            title: course.title,
            description: course.description,
            difficulty: course.difficulty,
            category: course.category,
            enrollmentDetails: course.enrollmentDetails
          });
        });
        console.groupEnd();

        setEnrolledCourses(enrolledResponse);
      } catch (err) {
        console.error('Error fetching courses:', err);
        setError('Failed to load courses. Please try again later.');
        toast.error('Failed to load courses. Please try again later.', {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const handleEnroll = async (course: FreeCourse) => {
    try {
      // Enroll in the course
      const enrolled = await FreeCourseService.enrollInCourse(course._id || '');
      
      if (enrolled) {
        // Refresh enrolled courses
        const updatedEnrolled = await FreeCourseService.getEnrolledCourses();
        setEnrolledCourses(updatedEnrolled);

        // Show success toast
        toast.success(`Successfully enrolled in ${course.title}!`, {
          position: "top-right",
          autoClose: 3000,
          icon: <CheckCircle className="text-green-500" />,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });

        // Switch to enrolled tab
        setActiveTab('enrolled');
      } else {
        // Show error toast if enrollment fails
        toast.error(`Failed to enroll in ${course.title}. Please try again.`, {
          position: "top-right",
          autoClose: 3000,
          icon: <AlertTriangle className="text-red-500" />,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
    } catch (err) {
      console.error('Enrollment failed:', err);
      toast.error(`An error occurred while enrolling in ${course.title}.`, {
        position: "top-right",
        autoClose: 3000,
        icon: <AlertTriangle className="text-red-500" />,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  const handleCourseNavigation = (course: FreeCourse) => {
    // Check if the course is an enrolled course or a regular course
    if (course.enrollmentDetails) {
      // For enrolled courses, navigate to the course details
      navigate(`/courses/${course._id}`);
    } else {
      // For featured/all courses, handle navigation based on course type and availability
      if (course.sourceContent?.originalUrl) {
        // If there's an external URL, open it
        window.open(course.sourceContent.originalUrl, '_blank', 'noopener,noreferrer');
      } else if (course.sourceContent?.platform === 'Free') {
        // If it's a free course without an external link, navigate to its details
        navigate(`/free-courses/${course._id}`);
      } else {
        // For other courses without external links, navigate to course details
        navigate(`/courses/${course._id}`);
      }
    }
  };

  const renderCourseCard = (course: FreeCourse, isEnrolled: boolean = false) => {
    // Determine if the course has an external link
    const hasExternalLink = course.sourceContent?.originalUrl && course.sourceContent?.platform !== 'Internal';

    return (
      <motion.div 
        key={course._id}
        variants={{
          hidden: { opacity: 0, scale: 0.9 },
          visible: { 
            opacity: 1, 
            scale: 1,
            transition: { 
              type: "spring", 
              stiffness: 300, 
              damping: 20 
            }
          },
          hover: { 
            scale: 1.05,
            boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.1)",
            transition: { 
              type: "spring", 
              stiffness: 300 
            }
          }
        }}
        initial="hidden"
        animate="visible"
        whileHover="hover"
        className="bg-white rounded-2xl shadow-lg overflow-hidden 
          transform transition-all duration-300 
          border border-blue-50 hover:border-blue-100
          flex flex-col"
      >
        <div className="relative">
          {/* Course Badge */}
          <div className="absolute top-2 right-2 z-10">
            {isEnrolled ? (
              <motion.span 
                className="bg-green-400 text-white px-2 py-1 rounded-full 
                  text-xs flex items-center gap-1"
              >
                <Award size={14} /> Enrolled
              </motion.span>
            ) : (
              <motion.span 
                initial={{ rotate: 0 }}
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ 
                  repeat: Infinity, 
                  duration: 1.5,
                  ease: "easeInOut"
                }}
                className="bg-yellow-400 text-white px-2 py-1 rounded-full 
                  text-xs flex items-center gap-1"
              >
                <Sparkles size={14} /> Featured
              </motion.span>
            )}
          </div>

          {/* Course Image Placeholder with Gradient */}
          <div className="h-48 w-full bg-gradient-to-br 
            from-blue-400 to-purple-600 
            flex items-center justify-center">
            <BookOpen className="text-white" size={64} />
          </div>
        </div>

        <div className="p-4 flex-grow flex flex-col">
          <h2 className="text-xl font-bold mb-2 text-gray-800 line-clamp-2">
            {course.title}
          </h2>
          
          <p className="text-sm text-gray-600 mb-4 flex-grow line-clamp-3">
            {course.description}
          </p>

          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <TrendingUp size={16} />
                <span>{course.difficulty || 'Beginner'}</span>
              </div>
              {course.duration && (
                <div className="flex items-center gap-2">
                  <Clock size={16} />
                  <span>{course.duration}</span>
                </div>
              )}
            </div>

            {isEnrolled ? (
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => handleCourseNavigation(course)}
                className="w-full bg-green-500 text-white px-4 py-2 rounded-full 
                  flex items-center justify-center gap-2 hover:bg-green-600 
                  transition-colors duration-300"
              >
                <Play size={16} /> Continue Learning
              </motion.button>
            ) : hasExternalLink ? (
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => handleCourseNavigation(course)}
                className="w-full bg-purple-500 text-white px-4 py-2 rounded-full 
                  flex items-center justify-center gap-2 hover:opacity-90 
                  transition-colors duration-300"
              >
                <ExternalLink size={16} /> Open Course
              </motion.button>
            ) : null}
          </div>
        </div>
      </motion.div>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ 
            repeat: Infinity, 
            duration: 1, 
            ease: "linear" 
          }}
        >
          <Rocket className="text-blue-500" size={48} />
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 p-8">
        {error}
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <ToastContainer />
      
      <div className="flex justify-center mb-8">
        <div className="bg-gray-100 rounded-full p-1 flex items-center space-x-2">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-6 py-2 rounded-full transition-colors duration-300 ${
              activeTab === 'all' 
                ? 'bg-blue-500 text-white' 
                : 'text-gray-600 hover:bg-gray-200'
            }`}
          >
            All Courses
          </button>
          <button
            onClick={() => setActiveTab('enrolled')}
            className={`px-6 py-2 rounded-full transition-colors duration-300 ${
              activeTab === 'enrolled' 
                ? 'bg-blue-500 text-white' 
                : 'text-gray-600 hover:bg-gray-200'
            }`}
          >
            My Enrolled Courses
          </button>
        </div>
      </div>

      {activeTab === 'all' && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {allCourses.map(course => renderCourseCard(course))}
        </motion.div>
      )}

      {activeTab === 'enrolled' && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {enrolledCourses.length > 0 ? (
            enrolledCourses.map(course => renderCourseCard(course, true))
          ) : (
            <div className="col-span-full text-center text-gray-500">
              <BookOpen className="mx-auto mb-4 text-blue-500" size={48} />
              <p>You haven't enrolled in any courses yet.</p>
              <p>Explore our courses to get started!</p>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default FeaturedCourses;
