import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
  Book, 
  GraduationCap, 
  ChevronRight,
  Clock,
  Users,
  Star
} from 'lucide-react';
import FreeCourseService from '../../services/freeCourseService';
import { FreeCourse } from '../../services/freeCourseService';
import { useNavigate } from 'react-router-dom';

interface CourseCardProps {
  course: FreeCourse;
}

const CourseCard: React.FC<CourseCardProps> = ({ course }) => {
  const navigate = useNavigate();

  return (
    <motion.div 
      whileHover={{ scale: 1.02 }}
      className="relative backdrop-blur-md bg-white/30 rounded-xl shadow-lg border border-white/20 overflow-hidden hover:shadow-xl transition-all duration-300"
    >
      <div className="bg-blue-500/80 backdrop-blur-sm p-4">
        <h2 className="text-white font-semibold text-lg truncate">{course.title}</h2>
        {course.sourceContent?.platform === 'Featured' && (
          <motion.span 
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="absolute top-4 right-4 bg-yellow-400 text-xs font-bold px-2 py-1 rounded-full"
          >
            Featured
          </motion.span>
        )}
      </div>
      <div className="p-4 space-y-4">
        <div className="space-y-2">
          <div className="flex items-center text-gray-600 space-x-2">
            <Book size={16} className="text-blue-500" />
            <span className="text-sm">{course.category}</span>
          </div>
          <div className="flex items-center text-gray-600 space-x-2">
            <GraduationCap size={16} className="text-blue-500" />
            <span className="text-sm">{course.difficulty}</span>
          </div>
          <div className="flex items-center text-gray-600 space-x-2">
            <Clock size={16} className="text-blue-500" />
            <span className="text-sm">{course.estimatedHours} hours</span>
          </div>
          <div className="flex items-center text-gray-600 space-x-2">
            <Users size={16} className="text-blue-500" />
            <span className="text-sm">{course.enrollmentCount} enrolled</span>
          </div>
          <div className="flex items-center text-gray-600 space-x-2">
            <Star size={16} className="text-yellow-400" />
            <span className="text-sm">{course.rating} Rating</span>
          </div>
        </div>
        <div className="pt-4">
          <button 
            className="w-full flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
            onClick={() => navigate(`/courses/${course.courseId}`)}
          >
            View Course
            <ChevronRight size={16} />
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
        const fetchedCourses = await FreeCourseService.getAllCourses();
        setCourses(fetchedCourses);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching courses:', err);
        setError('Failed to fetch courses');
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 p-4 sm:p-6 backdrop-blur-3xl">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-blue-600 mb-6">Explore Free Courses</h1>
          <div className="space-y-4">
            <div className="relative backdrop-blur-md bg-white/50 rounded-xl shadow-md border border-white/20 overflow-hidden">
              <Search size={16} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-blue-500" />
              <input 
                type="text" 
                placeholder="Search courses by title or description..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-300 text-gray-700 placeholder-gray-400"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <select 
                value={selectedCategory} 
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full p-3 rounded-xl backdrop-blur-md bg-white/50 border border-white/20 shadow-md focus:outline-none focus:ring-2 focus:ring-blue-300 text-gray-700"
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
                className="w-full p-3 rounded-xl backdrop-blur-md bg-white/50 border border-white/20 shadow-md focus:outline-none focus:ring-2 focus:ring-blue-300 text-gray-700"
              >
                {levels.map(level => (
                  <option key={level} value={level}>
                    {level === 'all' ? 'All Levels' : level}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {filteredCourses.length === 0 ? (
          <div className="text-center py-10 backdrop-blur-md bg-white/30 rounded-xl shadow-lg border border-white/20">
            <p className="text-xl text-gray-600">No courses found matching your filters.</p>
            <p className="text-sm text-gray-500 mt-2">Try adjusting your search or filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            {filteredCourses.map(course => (
              <CourseCard 
                key={course._id || course.title?.replace(/\s+/g, '-') || Math.random().toString(36).substring(2, 10)} 
                course={course}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AllCourses;
