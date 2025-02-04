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
  ArrowLeft,
  PlusCircle
} from 'lucide-react';
import FreeCourseService from '../../services/freeCourseService';
import { FreeCourse } from '../../services/freeCourseService';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

interface CourseCardProps {
  course: FreeCourse;
  onEnroll: (courseId: string) => void;
}

const CourseCard: React.FC<CourseCardProps> = ({ course, onEnroll }) => {
  const navigate = useNavigate();

  return (
    <motion.div 
      whileHover={{ scale: 1.02 }}
      className="course-card"
    >
      <div className="course-card-header">
        <h2>{course.title}</h2>
        {course.sourceContent?.platform === 'Featured' && (
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
            <span>{course.difficulty}</span>
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
        <div className="course-actions">
          <button 
            className="course-link"
            onClick={() => navigate(`/courses/${course.courseId}`)}
          >
            View Course
            <ChevronRight size={16} />
          </button>
          <button 
            className="course-enroll"
            onClick={() => onEnroll(course.courseId)}
          >
            Enroll
            <PlusCircle size={16} />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

const AllCourses: React.FC = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState<FreeCourse[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
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
      } catch (error) {
        console.error('Failed to fetch courses:', error);
        setError('Unable to load courses. Please check your connection.');
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const handleEnrollCourse = async (courseId: string) => {
    try {
      // TODO: Replace with actual enrollment API
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000'}/student/courses/enroll`, { 
        courseId 
      }, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('userToken')}`
        }
      });

      if (response.data.success) {
        // Optimistic UI update
        const updatedCourses = courses.map(course => 
          course.courseId === courseId 
            ? { 
                ...course, 
                enrollmentCount: (course.enrollmentCount || 0) + 1,
                userEnrolled: true 
              } 
            : course
        );
        setCourses(updatedCourses);

        // Show success notification
        alert(`Successfully enrolled in ${courses.find(c => c.courseId === courseId)?.title}`);
      }
    } catch (error) {
      console.error('Enrollment failed:', error);
      alert('Failed to enroll. Course might be full or you may already be enrolled.');
    }
  };

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

  if (loading) return (
    <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-blue-500"></div>
    </div>
  );

  if (error) return (
    <div className="flex justify-center items-center h-screen">
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Oops! </strong>
        <span className="block sm:inline">{error}</span>
      </div>
    </div>
  );

  return (
    <div className="all-courses-container p-6 bg-gradient-to-br from-blue-50 to-white min-h-screen">
      <div className="courses-header mb-6">
        <h1 className="text-3xl font-bold text-blue-600 mb-4">Explore Free Courses</h1>
        <div className="courses-filters grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="search-bar col-span-2 flex items-center bg-white rounded-lg shadow-md">
            <Search size={16} className="ml-3 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search courses by title or description..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
          </div>
          <select 
            value={selectedCategory} 
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="p-3 bg-white rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-300"
          >
            {categories.map(category => (
              <option key={category} value={category}>
                {category === 'all' ? 'All Categories' : category}
              </option>
            ))}
          </select>
          <select 
            value={selectedLevel} 
            onChange={(e) => setSelectedLevel(e.target.value)}
            className="p-3 bg-white rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-300"
          >
            {levels.map(level => (
              <option key={level} value={level}>
                {level === 'all' ? 'All Levels' : level}
              </option>
            ))}
          </select>
        </div>
      </div>

      {filteredCourses.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-xl text-gray-500">No courses found matching your filters.</p>
          <p className="text-sm text-gray-400 mt-2">Try adjusting your search or filters.</p>
        </div>
      ) : (
        <div className="courses-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map(course => (
            <CourseCard 
              key={course._id || course.title?.replace(/\s+/g, '-') || Math.random().toString(36).substring(2, 10)} 
              course={course} 
              onEnroll={handleEnrollCourse} 
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default AllCourses;
