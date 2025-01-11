import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
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
  ArrowLeft
} from 'lucide-react';
import { FreeCourseService, FreeCourse } from '../../services/freeCourseService';
import { useNavigate } from 'react-router-dom';

interface CourseCardProps {
  course: {
    title: string;
    description: string;
    platform: string;
    category: string;
    level: string;
    rating: string;
    htmlContent?: string;
    courseId: string;
    modules: any[];
    requirements: string[];
    curriculum: string[];
    learningObjectives: string[];
    instructor: {
      name: string;
      title: string;
    };
    enrollmentCount: number;
  };
}

const CourseCard: React.FC<CourseCardProps> = ({ course }) => {
  const navigate = useNavigate();

  return (
    <motion.div 
      whileHover={{ scale: 1.02 }}
      className="course-card"
    >
      <div className="course-card-header">
        <h2>{course.title}</h2>
        {course.isFeatured && (
          <motion.span 
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="course-badge"
          >
            Featured
          </motion.span>
        )}
      </div>
      <div className="course-card-body">
        <div className="course-details">
          <div className="course-details-item">
            <Book size={16} />
            <span>{course.category}</span>
          </div>
          <div className="course-details-item">
            <GraduationCap size={16} />
            <span>{course.level}</span>
          </div>
          <div className="course-details-item">
            <Clock size={16} />
            <span>{course.estimatedHours} hours</span>
          </div>
          <div className="course-details-item">
            <Users size={16} />
            <span>{course.enrollmentCount} enrolled</span>
          </div>
          <div className="course-details-item">
            <Star size={16} />
            <span>{course.rating} Rating</span>
          </div>
        </div>
        <button 
          className="course-link"
          onClick={() => navigate(`/courses/${course.courseId}`)}
        >
          View Course
          <ChevronRight size={16} />
        </button>
      </div>
    </motion.div>
  );
};

const FreeCoursesList: React.FC = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState<FreeCourse[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<FreeCourse>({
    title: '',
    description: '',
    courseId: '',
    modules: [],
    requirements: [],
    curriculum: [],
    learningObjectives: [],
    instructor: {
      name: 'Elimu Global Instructor',
      title: 'Course Facilitator',
    },
    rating: 0,
    enrollmentCount: 0,
  });
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedPlatform, setSelectedPlatform] = useState<string>('all');
  const [selectedLevel, setSelectedLevel] = useState<string>('all');

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        setError(null);
        const fetchedCourses = await FreeCourseService.getAllCourses();
        setCourses(fetchedCourses || []);
        
        // Set first course as default if available
        if (fetchedCourses && fetchedCourses.length > 0) {
          setSelectedCourse({
            ...fetchedCourses[0],
            modules: fetchedCourses[0].modules || [],
            requirements: fetchedCourses[0].requirements || [],
            curriculum: fetchedCourses[0].curriculum || [],
            learningObjectives: fetchedCourses[0].learningObjectives || [],
            instructor: fetchedCourses[0].instructor || {
              name: 'Elimu Global Instructor',
              title: 'Course Facilitator',
            },
            rating: fetchedCourses[0].rating || 0,
            enrollmentCount: fetchedCourses[0].enrollmentCount || 0,
          });
        }
      } catch (error) {
        console.error('Failed to fetch courses:', error);
        setError(error.response?.data?.message || error.message || 'Failed to fetch courses');
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  // Filtering logic
  const filteredCourses = courses.filter(course => 
    (searchQuery === '' || 
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      course.description.toLowerCase().includes(searchQuery.toLowerCase())) &&
    (selectedCategory === 'all' || course.category === selectedCategory) &&
    (selectedPlatform === 'all' || course.sourceContent?.platform === selectedPlatform) &&
    (selectedLevel === 'all' || course.difficulty === selectedLevel)
  );

  const categories = ['all', ...new Set(courses.map(c => c.category).filter(Boolean))];
  const platforms = ['all', ...new Set(courses.map(c => c.sourceContent?.platform).filter(Boolean))];
  const levels = ['all', ...new Set(courses.map(c => c.difficulty).filter(Boolean))];

  const handleCourseView = (course: FreeCourse) => {
    setSelectedCourse({
      ...course,
      modules: course.modules || [],
      requirements: course.requirements || [],
      curriculum: course.curriculum || [],
      learningObjectives: course.learningObjectives || [],
      instructor: course.instructor || {
        name: 'Elimu Global Instructor',
        title: 'Course Facilitator',
      },
      rating: course.rating || 0,
      enrollmentCount: course.enrollmentCount || 0,
    });
  };

  const closeInlineCourse = () => {
    setSelectedCourse({
      title: '',
      description: '',
      courseId: '',
      modules: [],
      requirements: [],
      curriculum: [],
      learningObjectives: [],
      instructor: {
        name: 'Elimu Global Instructor',
        title: 'Course Facilitator',
      },
      rating: 0,
      enrollmentCount: 0,
    });
  };

  const handleStartLearning = () => {
    if (selectedCourse && selectedCourse.courseId) {
      navigate(`/courses/${selectedCourse.courseId}`);
    }
  };

  if (loading) return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="flex justify-center items-center h-screen"
    >
      <div className="loader">Loading courses...</div>
    </motion.div>
  );

  if (error) return (
    <div className="flex justify-center items-center h-screen bg-red-50">
      <div className="text-center p-6 bg-white rounded-lg shadow-md">
        <AlertCircle className="mx-auto mb-4 text-red-500" size={48} />
        <h2 className="text-xl font-semibold text-red-700 mb-2">Error Loading Courses</h2>
        <p className="text-gray-600 mb-4">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
        >
          Retry
        </button>
      </div>
    </div>
  );

  return (
    <div className="w-full min-h-screen p-4 flex">
      {/* Courses List Column */}
      <div className={`w-full ${selectedCourse.title !== '' ? 'md:w-1/2' : 'w-full'} transition-all duration-300`}>
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col space-y-4">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold flex items-center">
                <Book className="mr-2 text-blue-600" /> Free Courses
              </h1>
            </div>

            {/* Search and Filter Section */}
            <div className="flex flex-wrap gap-2 items-center">
              <div className="relative flex-grow min-w-[200px]">
                <input 
                  type="text" 
                  placeholder="Search courses..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full p-2 pl-8 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              </div>

              <select 
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category === 'all' ? 'All Categories' : category}
                  </option>
                ))}
              </select>

              <select 
                value={selectedPlatform}
                onChange={(e) => setSelectedPlatform(e.target.value)}
                className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {platforms.map(platform => (
                  <option key={platform} value={platform}>
                    {platform === 'all' ? 'All Platforms' : platform}
                  </option>
                ))}
              </select>

              <select 
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
                className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {levels.map(level => (
                  <option key={level} value={level}>
                    {level === 'all' ? 'All Levels' : level}
                  </option>
                ))}
              </select>
            </div>

            {/* Courses Grid */}
            {filteredCourses.length === 0 ? (
              <div className="text-center text-gray-500 py-10">
                No courses found matching your criteria.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredCourses.map(course => (
                  <CourseCard key={course._id} course={course} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Course Details Sidebar */}
      {selectedCourse.title !== '' && (
        <motion.div 
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'tween' }}
          className="fixed top-0 right-0 w-full md:w-1/2 h-full bg-white shadow-lg overflow-y-auto"
        >
          <div className="p-6">
            <button 
              onClick={closeInlineCourse}
              className="mb-4 flex items-center text-gray-600 hover:text-gray-800"
            >
              <ArrowLeft size={20} className="mr-1" /> Back to Courses
            </button>

            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-bold mb-2">{selectedCourse.title}</h1>
                <p className="text-gray-600">{selectedCourse.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm text-gray-500">Instructor</p>
                  <p className="font-semibold">
                    {selectedCourse.instructor?.name || 'Elimu Global Instructor'}
                  </p>
                  <p className="text-sm text-gray-600">
                    {selectedCourse.instructor?.title || 'Course Facilitator'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Course Stats</p>
                  <div className="flex items-center space-x-2">
                    <Star className="text-yellow-500" size={16} />
                    <span>{selectedCourse.rating || 'Not Rated'}</span>
                    <span className="text-gray-400">|</span>
                    <Users size={16} />
                    <span>
                      {selectedCourse.enrollmentCount ? 
                        `${selectedCourse.enrollmentCount} enrolled` : 
                        'Enrollment not available'
                      }
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-3">What You'll Learn</h2>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {selectedCourse.learningObjectives.map((objective, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <ChevronRight className="text-green-500 mt-1" size={16} />
                      <span>{objective}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-3">Course Content</h2>
                {selectedCourse.modules && selectedCourse.modules.length > 0 ? (
                  <div className="space-y-3">
                    {selectedCourse.modules.map((module, index) => (
                      <div key={index} className="border rounded-lg p-3">
                        <div className="flex justify-between items-center">
                          <h3 className="font-semibold">{module.title || `Module ${index + 1}`}</h3>
                          <span className="text-sm text-gray-500">{module.duration || 'Not specified'}</span>
                        </div>
                        {module.topics && module.topics.length > 0 && (
                          <div className="mt-2">
                            <p className="text-xs text-gray-400 mb-1">Topics:</p>
                            <div className="flex flex-wrap gap-1">
                              {module.topics.map((topic, topicIndex) => (
                                <span 
                                  key={topicIndex} 
                                  className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded"
                                >
                                  {topic}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                        <div className="mt-2 flex space-x-2">
                          {module.hasQuiz && (
                            <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded">
                              Quiz
                            </span>
                          )}
                          {module.hasProject && (
                            <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded">
                              Project
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 italic">No module details available</p>
                )}
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-3">Requirements</h2>
                <ul className="space-y-2">
                  {selectedCourse.requirements.map((req, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <ChevronRight className="text-blue-500 mt-1" size={16} />
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-4 border-t">
                <button 
                  onClick={handleStartLearning}
                  className="w-full py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition flex items-center justify-center"
                >
                  Start Learning
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default FreeCoursesList;
