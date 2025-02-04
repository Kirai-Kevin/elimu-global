import { useState, useEffect, useMemo, useCallback } from 'react';
import { authenticatedGet } from '../utils/api';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Star, Search, BookOpen, Clock, Award, Users, Info, AlertTriangle, 
  BookmarkPlus, BookmarkCheck, X, ChevronRight, Menu, ArrowLeft, ArrowRight
} from 'lucide-react';
import { Course } from '../types/course';
import { DEFAULT_USER_AVATAR } from '../utils/avatars';

interface Instructor {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  profilePicture?: string;
  specialization: string;
  socialLinks?: {
    linkedin?: string;
    twitter?: string;
  };
  courses?: Course[];
}

function SelectInstructor() {
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  
  // Mobile-specific states
  const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth <= 768);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [activeView, setActiveView] = useState<'instructors' | 'courses'>('instructors');

  // Instructor and Courses States
  const [selectedInstructor, setSelectedInstructor] = useState<Instructor | null>(null);
  const [instructorCourses, setInstructorCourses] = useState<Course[]>([]);
  const [courseLoading, setCourseLoading] = useState<boolean>(false);
  const [coursePagination, setCoursePagination] = useState({
    total: 0,
    page: 1,
    totalPages: 0
  });

  // Responsive Design Handler
  const handleResize = useCallback(() => {
    const mobile = window.innerWidth <= 768;
    setIsMobile(mobile);
    
    // Reset sidebar and view on resize
    if (!mobile) {
      setIsSidebarOpen(false);
      setActiveView('instructors');
    }
  }, []);

  // Add event listener for responsive design
  useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [handleResize]);

  // Fetch Instructor Courses
  const fetchInstructorCourses = async (instructorId: string) => {
    try {
      setCourseLoading(true);
      const response = await authenticatedGet(`/instructors/${instructorId}/courses`, {
        page: coursePagination.page,
        limit: 10
      });

      setInstructorCourses(response.data.courses);
      setCoursePagination({
        total: response.data.total,
        page: response.data.page,
        totalPages: response.data.totalPages
      });
      setCourseLoading(false);

      // For mobile, switch to courses view
      if (isMobile) {
        setActiveView('courses');
        setIsSidebarOpen(true);
      }
    } catch (err) {
      console.error('Courses fetch error:', err);
      setCourseLoading(false);
      setInstructorCourses([]);
    }
  };

  const handleInstructorSelect = (instructor: Instructor) => {
    setSelectedInstructor(instructor);
    
    // Use courses from the instructor if available, otherwise fetch
    if (instructor.courses && instructor.courses.length > 0) {
      setInstructorCourses(instructor.courses);
    } else {
      fetchInstructorCourses(instructor._id);
    }
  };

  // Main Instructors Fetch
  useEffect(() => {
    const fetchInstructors = async () => {
      try {
        const response = await authenticatedGet('/instructors', {
          page,
          limit: 9,
          search: searchQuery,
          sortBy: 'lastName',
          includeCourses: true
        });

        const validInstructors = response.data.instructors.map((instructor: any) => ({
          _id: instructor._id,
          firstName: instructor.firstName || 'Unknown',
          lastName: instructor.lastName || 'Instructor',
          email: instructor.email,
          specialization: instructor.specialization || 'No Specialization',
          profilePicture: instructor.profilePicture,
          socialLinks: instructor.socialLinks,
          courses: instructor.courses || []
        }));

        setInstructors(validInstructors);
        setTotalPages(response.data.totalPages);
        setLoading(false);
      } catch (err) {
        console.error('Instructors fetch error:', err);
        setError(err instanceof Error ? err.message : 'Failed to load instructors');
        setLoading(false);
      }
    };

    fetchInstructors();
  }, [page, searchQuery]);

  // Memoized filtered instructors
  const filteredInstructors = useMemo(() => {
    return instructors.filter(instructor => {
      const matchesSubject = selectedSubject 
        ? instructor.specialization.toLowerCase().includes(selectedSubject.toLowerCase())
        : true;
      const matchesSearch = searchQuery
        ? `${instructor.firstName} ${instructor.lastName}`.toLowerCase().includes(searchQuery.toLowerCase())
        : true;
      return matchesSubject && matchesSearch;
    });
  }, [instructors, selectedSubject, searchQuery]);

  // Render Method
  return (
    <div className="min-h-screen w-full bg-gray-50 flex flex-col">
      {/* Mobile Header */}
      {isMobile && (
        <div className="sticky top-0 z-50 bg-white shadow-sm flex justify-between items-center p-4">
          {activeView === 'courses' ? (
            <button 
              onClick={() => setActiveView('instructors')}
              className="text-gray-600 hover:text-gray-800"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
          ) : (
            <h1 className="text-xl font-bold text-gray-800">Instructors</h1>
          )}
          
          {activeView === 'instructors' && (
            <button 
              onClick={() => {
                setActiveView('courses');
                setIsSidebarOpen(true);
              }}
              className="text-gray-600 hover:text-gray-800"
            >
              <Menu className="w-6 h-6" />
            </button>
          )}
        </div>
      )}

      {/* Main Content */}
      <div className={`flex flex-1 ${isMobile ? 'flex-col' : 'flex-row'}`}>
        {/* Instructors Column */}
        <div 
          className={`
            ${isMobile 
              ? (activeView === 'instructors' ? 'block' : 'hidden') 
              : 'block'
            } 
            w-full ${!isMobile && selectedInstructor ? 'md:w-2/3' : ''} 
            p-4 overflow-y-auto
          `}
        >
          {/* Instructors Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredInstructors.map((instructor) => (
              <motion.div
                key={instructor._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`
                  bg-white rounded-xl shadow-md overflow-hidden 
                  hover:shadow-lg transition-all cursor-pointer
                  ${selectedInstructor?._id === instructor._id ? 'border-2 border-blue-500' : ''}
                `}
                onClick={() => handleInstructorSelect(instructor)}
              >
                {/* Instructor Card Content */}
                <div className="p-4">
                  <div className="flex items-center mb-4">
                    <img 
                      src={instructor.profilePicture || DEFAULT_USER_AVATAR} 
                      alt={`${instructor.firstName} ${instructor.lastName}`}
                      className="w-12 h-12 md:w-16 md:h-16 rounded-full object-cover mr-4"
                    />
                    <div>
                      <h3 className="text-base md:text-lg font-semibold">
                        {instructor.firstName} {instructor.lastName}
                      </h3>
                      <p className="text-xs md:text-sm text-gray-500">
                        {instructor.specialization}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Courses Sidebar */}
        <AnimatePresence>
          {(selectedInstructor || isSidebarOpen) && (
            <motion.div
              initial={{ 
                opacity: 0, 
                x: isMobile ? (activeView === 'courses' ? 0 : '100%') : 50 
              }}
              animate={{ 
                opacity: 1, 
                x: 0 
              }}
              exit={{ 
                opacity: 0, 
                x: isMobile ? '100%' : 50 
              }}
              className={`
                ${isMobile 
                  ? (activeView === 'courses' ? 'block' : 'hidden') 
                  : 'block'
                }
                w-full md:w-1/3 bg-white p-4 
                ${!isMobile ? 'border-l' : ''}
                overflow-y-auto
              `}
            >
              {selectedInstructor && (
                <>
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl md:text-2xl font-bold">
                      {selectedInstructor.firstName}'s Courses
                    </h2>
                    {!isMobile && (
                      <button 
                        onClick={() => setSelectedInstructor(null)}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        <X className="w-6 h-6" />
                      </button>
                    )}
                  </div>

                  {courseLoading ? (
                    <div className="flex justify-center items-center h-48">
                      <BookOpen className="w-12 h-12 text-blue-500 animate-pulse" />
                    </div>
                  ) : instructorCourses.length === 0 ? (
                    <div className="text-center text-gray-500 py-8">
                      No courses available for this instructor.
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {instructorCourses.map((course) => (
                        <motion.div
                          key={course._id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="bg-gray-100 p-4 rounded-lg"
                        >
                          <div className="flex justify-between items-center">
                            <div>
                              <h3 className="font-semibold text-base md:text-lg">
                                {course.title}
                              </h3>
                              <p className="text-xs md:text-sm text-gray-600">
                                {course.category} | {course.difficulty} Level
                              </p>
                            </div>
                            <BookmarkPlus className="text-blue-500 w-5 h-5 md:w-6 md:h-6" />
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}

                  {/* Course Pagination */}
                  {coursePagination.totalPages > 1 && (
                    <div className="flex justify-center mt-4 space-x-2">
                      {[...Array(coursePagination.totalPages)].map((_, index) => (
                        <button
                          key={index}
                          onClick={() => {
                            setCoursePagination(prev => ({ ...prev, page: index + 1 }));
                            fetchInstructorCourses(selectedInstructor._id);
                          }}
                          className={`
                            w-8 h-8 rounded-full text-xs
                            ${coursePagination.page === index + 1 
                              ? 'bg-blue-500 text-white' 
                              : 'bg-gray-200 text-gray-700'}
                          `}
                        >
                          {index + 1}
                        </button>
                      ))}
                    </div>
                  )}
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-8">
          <div className="flex space-x-2">
            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index}
                onClick={() => setPage(index + 1)}
                className={`w-10 h-10 rounded-full ${
                  page === index + 1 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-200 text-gray-700'
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default SelectInstructor;
