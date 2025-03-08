import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { BookOpen, Video, FileText, Clock, Star, Search, Filter, Play, Download, ChevronRight, Users, PlusCircle, AlertTriangle, ArrowLeft, Check } from 'lucide-react';
import { getAuthToken } from '../utils/api';
import LearningMode from './LearningMode'; // Import the new LearningMode component

interface PaginationMetadata {
  total: number;
  page: number;
  limit: number;
}

interface Course {
  _id: string;
  title: string;
  description: string;
  subject: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  instructor: {
    name?: string;
    image?: string;
  } | string | null;
  progress?: number;
  enrollmentStatus?: 'Not Enrolled' | 'Enrolled' | 'In Progress';
}

interface Lesson {
  _id: string;
  title: string;
  subject: string;
  courseId: string;
  instructorId: {
    name: string;
    image: string;
  };
  duration: number;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  description: string;
  topics: string[];
  type: 'video' | 'interactive' | 'reading';
  progress: number;
  resources: {
    name: string;
    type: string;
    size: string;
  }[];
  nextLesson?: {
    _id: string;
    title: string;
  };
}

interface PaginatedCoursesResponse {
  courses: Course[];
  metadata: PaginationMetadata;
}

interface PaginatedLessonsResponse {
  lessons: Lesson[];
  metadata: PaginationMetadata;
}

interface EnrolledCourseRecord {
  _id: string;
  studentId: string;
  courseId: {
    _id: string;
    title: string;
    description: string;
    subject: string;
    level: 'Beginner' | 'Intermediate' | 'Advanced';
    instructor?: {
      name?: string;
      image?: string;
    } | string | null;
  };
  status: string;
  enrolledAt: string;
}

function Lessons() {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCourses, setShowCourses] = useState(false);
  const [loadingCourses, setLoadingCourses] = useState<{[key: string]: boolean}>({});
  const [selectedItem, setSelectedItem] = useState<Course | Lesson | null>(null);
  const [learningModeCourseId, setLearningModeCourseId] = useState<string | null>(null);

  const filteredLessons = lessons.filter(lesson => {
    if (selectedSubject !== 'all' && lesson.subject !== selectedSubject) return false;
    if (selectedLevel !== 'all' && lesson.level !== selectedLevel) return false;
    if (!lesson.title || !lesson.description) return false;
    return lesson.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
           lesson.description.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const renderSearchAndFilterSection = () => (
    <div className="mb-8 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
      <div className="relative w-full md:w-1/2 mr-4">
        <input 
          type="text" 
          placeholder="Search lessons..." 
          className="w-full p-3 pl-10 border rounded-lg"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
      </div>

      <div className="flex space-x-4">
        <select 
          className="p-3 border rounded-lg"
          value={selectedSubject}
          onChange={(e) => setSelectedSubject(e.target.value)}
        >
          <option value="all">All Subjects</option>
          {[
            'Mathematics', 'Science', 'Computer Science', 'Physics', 'Chemistry', 
            'English Literature', 'Biology', 'History', 'Geography', 'Economics'
          ].map(subject => (
            <option key={subject} value={subject}>{subject}</option>
          ))}
        </select>

        <select 
          className="p-3 border rounded-lg"
          value={selectedLevel}
          onChange={(e) => setSelectedLevel(e.target.value)}
        >
          <option value="all">All Levels</option>
          <option value="Beginner">Beginner</option>
          <option value="Intermediate">Intermediate</option>
          <option value="Advanced">Advanced</option>
        </select>
      </div>
    </div>
  );

  const renderLessonsList = () => (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredLessons.map((lesson) => (
        <motion.div
          key={lesson._id}
          className="bg-white rounded-2xl shadow-lg overflow-hidden cursor-pointer"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setSelectedItem(lesson)}
        >
          <div className="p-6">
            <h3 className="text-xl font-bold">{lesson.title || 'Untitled Lesson'}</h3>
          </div>
        </motion.div>
      ))}
    </div>
  );

  const renderCoursesList = () => (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {courses.map((course) => (
        <motion.div
          key={course._id}
          className="bg-white rounded-2xl shadow-lg overflow-hidden cursor-pointer"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            setSelectedItem(course);
            setShowCourses(true);
          }}
        >
          <div className="p-6">
            <h3 className="text-xl font-bold mb-2">{course.title || 'Untitled Course'}</h3>
            <p className="text-gray-600 line-clamp-2">{course.description || 'No description available'}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );

  const renderDetailedItemView = () => {
    if (!selectedItem) return null;

    const isLesson = 'instructorId' in selectedItem;
    const isBackButtonVisible = selectedItem && (isLesson ? true : showCourses);

    return (
      <div className="relative">
        {isBackButtonVisible && (
          <button 
            onClick={() => {
              if (isLesson) {
                setSelectedItem(null);
              } else {
                setShowCourses(false);
                setSelectedItem(null);
              }
            }}
            className="absolute top-0 left-0 m-4 bg-gray-100 hover:bg-gray-200 p-2 rounded-full transition"
          >
            <ArrowLeft className="w-6 h-6 text-gray-700" />
          </button>
        )}

        <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden p-8 mt-10">
          <h2 className="text-3xl font-bold mb-4">{selectedItem.title || 'Untitled'}</h2>
          
          {isLesson ? (
            // Lesson Detailed View
            <>
              <p className="text-gray-600 mb-4">{selectedItem.description || 'No description available'}</p>
              <div className="space-y-4">
                <div className="flex items-center">
                  <span className="font-semibold mr-2">Instructor:</span>
                  <span>{getInstructorName(selectedItem.instructorId)}</span>
                </div>
                <div className="flex items-center">
                  <span className="font-semibold mr-2">Subject:</span>
                  <span>{selectedItem.subject || 'Unspecified'}</span>
                </div>
                <div className="flex items-center">
                  <span className="font-semibold mr-2">Level:</span>
                  <span>{selectedItem.level || 'Not Specified'}</span>
                </div>
                {selectedItem.progress !== undefined && (
                  <div className="flex items-center">
                    <span className="font-semibold mr-2">Progress:</span>
                    <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2">
                      <div 
                        className="bg-blue-600 h-2.5 rounded-full" 
                        style={{ width: `${selectedItem.progress || 0}%` }}
                      ></div>
                    </div>
                    <span>{selectedItem.progress || 0}%</span>
                  </div>
                )}
              </div>
            </>
          ) : (
            // Course Detailed View
            <>
              <p className="text-gray-600 mb-4">{selectedItem.description || 'No description available'}</p>
              <div className="space-y-4">
                <div className="flex items-center">
                  <span className="font-semibold mr-2">Instructor:</span>
                  <span>{getInstructorName(selectedItem.instructor)}</span>
                </div>
                <div className="flex items-center">
                  <span className="font-semibold mr-2">Subject:</span>
                  <span>{selectedItem.subject || 'Unspecified'}</span>
                </div>
                <div className="flex items-center">
                  <span className="font-semibold mr-2">Level:</span>
                  <span>{selectedItem.level || 'Not Specified'}</span>
                </div>
                {renderEnrollButton(selectedItem as Course)}
              </div>
            </>
          )}
        </div>
      </div>
    );
  };

  const getInstructorName = (instructor: {name?: string; image?: string} | string | null | undefined): string => {
    if (!instructor) return 'Unknown Instructor';
    
    if (typeof instructor === 'string') return instructor;
    
    if (typeof instructor === 'object') {
      return instructor.name || 'Unknown Instructor';
    }
    
    return 'Unknown Instructor';
  };

  const renderEnrollButton = (course: Course) => {
    // Check if the course is already in the enrolled courses
    const isAlreadyEnrolled = lessons.some(
      enrolledCourse => enrolledCourse._id === course._id
    );

    // If already enrolled, show Start Learning and View Lessons buttons
    if (isAlreadyEnrolled) {
      return (
        <div className="space-y-2">
          <button
            onClick={() => {
              // Enter learning mode for this course
              setLearningModeCourseId(course._id);
            }}
            className="w-full flex items-center justify-center px-4 py-2 rounded-lg transition bg-green-500 text-white hover:bg-green-600"
          >
            <Play className="mr-2 w-5 h-5" />
            Start Learning
          </button>

          <a
            href={`/courses/${course._id}/lessons`}
            className="w-full flex items-center justify-center px-4 py-2 rounded-lg transition bg-blue-500 text-white hover:bg-blue-600"
          >
            <BookOpen className="mr-2 w-5 h-5" />
            View Lessons
          </a>
        </div>
      );
    }

    // Render enrollment button if not already enrolled
    return (
      <button 
        onClick={() => handleEnrollCourse(course._id)}
        disabled={loadingCourses[course._id] === true}
        className={`w-full flex items-center justify-center px-4 py-2 rounded-lg transition ${
          loadingCourses[course._id]
            ? 'bg-gray-400 cursor-not-allowed' 
            : 'bg-blue-500 text-white hover:bg-blue-600'
        }`}
      >
        {loadingCourses[course._id] ? (
          <span className="flex items-center">
            <svg 
              className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" 
              xmlns="http://www.w3.org/2000/svg" 
              fill="none" 
              viewBox="0 0 24 24"
            >
              <circle 
                className="opacity-25" 
                cx="12" 
                cy="12" 
                r="10" 
                stroke="currentColor" 
                strokeWidth="4"
              ></circle>
              <path 
                className="opacity-75" 
                fill="currentColor" 
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Enrolling...
          </span>
        ) : (
          <>
            <PlusCircle className="mr-2" />
            Enroll in Course
          </>
        )}
      </button>
    );
  };

  const handleEnrollCourse = async (courseId: string) => {
    // Set loading state for this specific course
    setLoadingCourses(prev => ({...prev, [courseId]: true}));

    try {
      const token = getAuthToken();
      
      // Enroll in the course
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/student/courses/${courseId}/enroll`, 
        { courseId }, 
        {
          headers: { 
            'Authorization': `Bearer ${token}` 
          }
        }
      );

      // Log the enrollment response
      console.log('Enrollment Response:', {
        status: response.status,
        data: response.data
      });
      
      // Fetch enrolled courses after successful enrollment
      try {
        const enrolledCoursesResponse = await axios.get<EnrolledCourseRecord[]>(`${import.meta.env.VITE_BACKEND_URL}/student/courses/enrolled`, {
          headers: { 
            'Authorization': `Bearer ${token}` 
          }
        });

        console.log('Enrolled Courses Response:', {
          status: enrolledCoursesResponse.status,
          data: enrolledCoursesResponse.data
        });

        // Extract full course details from enrolled course records
        const enrolledCourseDetails = enrolledCoursesResponse.data.map(record => ({
          ...record.courseId,
          enrollmentId: record._id,
          enrolledAt: record.enrolledAt,
          enrollmentStatus: record.status
        }));

        // Update courses state to reflect enrollment
        if (enrolledCourseDetails.length > 0) {
          // Remove the enrolled courses from available courses
          const updatedCourses = courses.filter(course => 
            !enrolledCourseDetails.some(enrolled => enrolled._id === course._id)
          );

          setCourses(updatedCourses);
          
          // Update lessons to show enrolled courses
          setLessons(enrolledCourseDetails);
          
          // If no more available courses, switch back to lessons view
          if (updatedCourses.length === 0) {
            setShowCourses(false);
          }

          // Show success message
          alert('Successfully enrolled in the course!');
        }
      } catch (fetchError) {
        console.error('Failed to fetch enrolled courses:', fetchError);
        alert('Enrolled successfully, but failed to update course list');
      }
    } catch (error) {
      console.error('Enrollment Error:', error);
      
      // Detailed error handling
      let errorMessage = 'Failed to enroll in course';
      if (error.response) {
        errorMessage = error.response.data.message || errorMessage;
      } else if (error.request) {
        errorMessage = 'No response received from server';
      }

      // Show error to user
      alert(errorMessage);
    } finally {
      // Reset loading state for this specific course
      setLoadingCourses(prev => {
        const newState = {...prev};
        delete newState[courseId];
        return newState;
      });
    }
  };

  useEffect(() => {
    const fetchLessonsAndCourses = async () => {
      try {
        setLoading(true);
        const token = getAuthToken();

        // First, try to fetch enrolled courses
        try {
          const enrolledCoursesResponse = await axios.get<EnrolledCourseRecord[]>(`${import.meta.env.VITE_BACKEND_URL}/student/courses/enrolled`, {
            headers: { 
              'Authorization': `Bearer ${token}` 
            }
          });

          console.log('Initial Enrolled Courses Response:', {
            status: enrolledCoursesResponse.status,
            data: enrolledCoursesResponse.data
          });

          // Extract full course details from enrolled course records
          const enrolledCourseDetails = enrolledCoursesResponse.data.map(record => ({
            ...record.courseId,
            enrollmentId: record._id,
            enrolledAt: record.enrolledAt,
            enrollmentStatus: record.status
          }));

          // If there are enrolled courses, set them as lessons
          if (enrolledCourseDetails.length > 0) {
            setLessons(enrolledCourseDetails);
            setShowCourses(false);
          } else {
            // If no enrolled courses, fetch available courses
            const coursesResponse = await axios.get<PaginatedCoursesResponse>(`${import.meta.env.VITE_BACKEND_URL}/student/courses`, {
              headers: { 
                'Authorization': `Bearer ${token}` 
              }
            });

            console.log('Available Courses Response:', {
              status: coursesResponse.status,
              data: coursesResponse.data
            });

            setCourses(coursesResponse.data.courses);
            setShowCourses(true);
          }
        } catch (enrolledCoursesError) {
          console.error('Failed to fetch enrolled courses:', enrolledCoursesError);
          
          // Fallback to fetching available courses
          const coursesResponse = await axios.get<PaginatedCoursesResponse>(`${import.meta.env.VITE_BACKEND_URL}/student/courses`, {
            headers: { 
              'Authorization': `Bearer ${token}` 
            }
          });

          setCourses(coursesResponse.data.courses);
          setShowCourses(true);
        }
      } catch (error) {
        console.error('Error fetching courses:', error);
        setError('Failed to load courses');
      } finally {
        setLoading(false);
      }
    };

    fetchLessonsAndCourses();
  }, []);

  return (
    <div className="min-h-screen w-full bg-gray-50 p-6">
      {/* Learning Mode Modal */}
      {learningModeCourseId && (
        <LearningMode 
          courseId={learningModeCourseId}
          onClose={() => setLearningModeCourseId(null)}
        />
      )}

      {loading ? (
        <div className="flex justify-center items-center h-full">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-blue-500"></div>
        </div>
      ) : error ? (
        <div className="text-center text-red-500 mt-10">{error}</div>
      ) : (
        <div>
          {/* Detailed view takes precedence */}
          {selectedItem ? (
            renderDetailedItemView()
          ) : (
            // Otherwise, show courses or lessons list
            <>
              {renderSearchAndFilterSection()}
              {showCourses ? renderCoursesList() : renderLessonsList()}
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default Lessons;
