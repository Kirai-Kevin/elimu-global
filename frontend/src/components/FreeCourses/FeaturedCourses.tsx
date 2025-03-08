import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import {
  Rocket,
  Star,
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

interface EnrollmentDetails {
  _id: string;
  status: string;
  enrolledAt: string;
}

interface FreeCourse {
  _id: string;
  title: string;
  description: string;
  difficulty?: string;
  duration?: string;
  category?: string;
  enrollmentDetails?: EnrollmentDetails;
  sourceContent?: {
    originalUrl?: string;
    platform?: string;
  };
}

const FeaturedCourses: React.FC = () => {
  const navigate = useNavigate();
  const [allCourses, setAllCourses] = useState<FreeCourse[]>([]);
  const [enrolledCourses, setEnrolledCourses] = useState<FreeCourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'enrolled'>('all');
  const [enrollingCourseId, setEnrollingCourseId] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        // Fetch all available courses
        const coursesResponse = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/student/courses`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('userToken')}`
          }
        });

        // Safely extract the courses array with fallback to empty array
        const allCoursesData = coursesResponse.data && coursesResponse.data.courses
          ? coursesResponse.data.courses
          : [];

        console.log('API Response:', coursesResponse.data);
        setAllCourses(allCoursesData);

        // Fetch enrolled courses
        const enrolledResponse = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/student/courses/enrolled`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('userToken')}`
          }
        });

        // Log the raw response for debugging
        console.log('Enrolled courses response:', enrolledResponse.data);

        // Safely extract the enrollment records with fallback to empty array
        const enrollmentRecords = enrolledResponse.data || [];

        // Transform enrollment records into course objects
        const enrolledCoursesData = Array.isArray(enrollmentRecords)
          ? enrollmentRecords.map(record => {
              // Check if the record has a nested course object
              if (record.course) {
                // Return the course with enrollment details
                return {
                  ...record.course,
                  _id: record.course._id || record.courseId?._id || record._id,
                  enrollmentDetails: {
                    _id: record._id,
                    status: record.status,
                    enrolledAt: record.enrolledAt
                  }
                };
              } else if (record.courseId) {
                // If course is not directly available but courseId is, use that
                return {
                  ...record.courseId,
                  _id: record.courseId._id || record._id,
                  title: record.courseId.title || 'Unknown Course',
                  description: record.courseId.description || 'No description available',
                  enrollmentDetails: {
                    _id: record._id,
                    status: record.status,
                    enrolledAt: record.enrolledAt
                  }
                };
              }
              return null;
            }).filter(Boolean) // Remove any null entries
          : [];

        console.log('Transformed enrolled courses:', enrolledCoursesData);
        setEnrolledCourses(enrolledCoursesData);
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
    // Safety check - ensure course exists and has an ID
    if (!course || !course._id) {
      console.error('Invalid course object in handleEnroll:', course);
      toast.error('Unable to enroll in course. Invalid course data.');
      return;
    }

    try {
      setEnrollingCourseId(course._id);

      // Call the enrollment endpoint
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/student/courses/${course._id}/enroll`,
        {},
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('userToken')}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.status === 201) {
        // Refresh enrolled courses
        const updatedEnrolled = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/student/courses/enrolled`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('userToken')}`
          }
        });

        // Log the raw response for debugging
        console.log('Updated enrolled courses:', updatedEnrolled.data);

        // Safely extract the enrollment records with fallback to empty array
        const enrollmentRecords = updatedEnrolled.data || [];

        // Transform enrollment records into course objects
        const updatedCoursesData = Array.isArray(enrollmentRecords)
          ? enrollmentRecords.map(record => {
              // Check if the record has a nested course object
              if (record.course) {
                // Return the course with enrollment details
                return {
                  ...record.course,
                  _id: record.course._id || record.courseId?._id || record._id,
                  enrollmentDetails: {
                    _id: record._id,
                    status: record.status,
                    enrolledAt: record.enrolledAt
                  }
                };
              } else if (record.courseId) {
                // If course is not directly available but courseId is, use that
                return {
                  ...record.courseId,
                  _id: record.courseId._id || record._id,
                  title: record.courseId.title || 'Unknown Course',
                  description: record.courseId.description || 'No description available',
                  enrollmentDetails: {
                    _id: record._id,
                    status: record.status,
                    enrolledAt: record.enrolledAt
                  }
                };
              }
              return null;
            }).filter(Boolean) // Remove any null entries
          : [];

        console.log('Transformed updated courses:', updatedCoursesData);
        setEnrolledCourses(updatedCoursesData);

        toast.success(`Successfully enrolled in ${course.title}!`, {
          position: "top-right",
          autoClose: 3000,
          icon: <CheckCircle className="text-green-500" />,
        });

        setActiveTab('enrolled');
      }
    } catch (error: any) {
      console.error('Enrollment failed:', error);
      toast.error(
        (error.response?.data?.message as string) || `Failed to enroll in ${course.title}`,
        {
          position: "top-right",
          autoClose: 5000,
          icon: <AlertTriangle className="text-red-500" />,
        }
      );
    } finally {
      setEnrollingCourseId(null);
    }
  };

  const handleCourseNavigation = (course: FreeCourse) => {
    // Safety check - ensure course exists and has an ID
    if (!course || !course._id) {
      console.error('Invalid course object:', course);
      toast.error('Unable to navigate to course details. Invalid course data.');
      return;
    }

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
    // Safety check - ensure course exists and has an ID
    if (!course || !course._id) {
      console.error('Invalid course object in renderCourseCard:', course);
      return null;
    }

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
            ) : (
              <>
                {hasExternalLink ? (
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleCourseNavigation(course)}
                    className="w-full bg-purple-500 text-white px-4 py-2 rounded-full
                      flex items-center justify-center gap-2 hover:opacity-90
                      transition-colors duration-300 mb-2"
                  >
                    <ExternalLink size={16} /> Open Course
                  </motion.button>
                ) : (
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleCourseNavigation(course)}
                    className="w-full bg-blue-500 text-white px-4 py-2 rounded-full
                      flex items-center justify-center gap-2 hover:bg-blue-600
                      transition-colors duration-300 mb-2"
                  >
                    <Play size={16} /> Start Course
                  </motion.button>
                )}
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleEnroll(course)}
                  disabled={enrollingCourseId === course._id}
                  className={`w-full px-4 py-2 rounded-full
                    flex items-center justify-center gap-2
                    transition-colors duration-300
                    ${enrollingCourseId === course._id
                      ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                      : 'bg-green-500 text-white hover:bg-green-600'
                    }`}
                >
                  {enrollingCourseId === course._id ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{
                        repeat: Infinity,
                        duration: 1,
                        ease: "linear"
                      }}
                    >
                      <Rocket size={16} />
                    </motion.div>
                  ) : (
                    <Star size={16} />
                  )}
                  {enrollingCourseId === course._id ? 'Enrolling...' : 'Enroll Now'}
                </motion.button>
              </>
            )}
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
          {Array.isArray(allCourses) && allCourses.map(course =>
            course && course._id ? renderCourseCard(course) : null
          )}
        </motion.div>
      )}

      {activeTab === 'enrolled' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {Array.isArray(enrolledCourses) && enrolledCourses.length > 0 ? (
            enrolledCourses.map(course =>
              course && course._id ? renderCourseCard(course, true) : null
            )
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
