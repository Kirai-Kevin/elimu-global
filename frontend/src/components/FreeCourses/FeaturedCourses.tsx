import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Star, 
  BookOpen, 
  GraduationCap, 
  ChevronRight,
  AlertCircle
} from 'lucide-react';
import { FreeCourseService, FreeCourse } from '../../services/freeCourseService';

const FeaturedCourses: React.FC = () => {
  const [featuredCourses, setFeaturedCourses] = useState<FreeCourse[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFeaturedCourses = async () => {
      try {
        setLoading(true);
        setError(null);
        const courses = await FreeCourseService.getFeaturedCourses();
        setFeaturedCourses(courses);
      } catch (err: any) {
        console.error('Error in fetchFeaturedCourses:', err);
        setError(err.response?.data?.message || err.message || 'Failed to fetch featured courses');
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedCourses();
  }, []);

  if (loading) return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="flex justify-center items-center h-screen"
    >
      <div className="loader">Loading featured courses...</div>
    </motion.div>
  );

  if (error) return (
    <div className="flex justify-center items-center h-screen bg-red-50">
      <div className="text-center p-6 bg-white rounded-lg shadow-md">
        <AlertCircle className="mx-auto mb-4 text-red-500" size={48} />
        <h2 className="text-xl font-semibold text-red-700 mb-2">Error Loading Featured Courses</h2>
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
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full min-h-screen p-4"
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col space-y-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold flex items-center">
              <Star className="mr-2 text-yellow-500" /> Featured Free Courses
            </h1>
          </div>

          {featuredCourses.length === 0 ? (
            <div className="text-center text-gray-500 py-10">
              No featured courses available at the moment.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {featuredCourses.map(course => (
                <motion.div 
                  key={course._id}
                  whileHover={{ scale: 1.05 }}
                  className="bg-white border rounded-lg shadow-sm overflow-hidden"
                >
                  <div className="p-4 flex flex-col h-full">
                    <div className="flex justify-between items-start mb-2">
                      <h2 className="text-lg font-semibold">{course.title}</h2>
                      <span className="bg-yellow-500 text-white text-xs px-2 py-1 rounded-full">
                        Featured
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 flex-grow mb-2">{course.description}</p>
                    
                    <div className="flex items-center justify-between text-sm mb-2">
                      <div className="flex items-center space-x-1">
                        <BookOpen className="text-blue-600" size={16} />
                        <span>{course.category}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <GraduationCap className="text-green-600" size={16} />
                        <span>{course.level}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">{course.platform}</span>
                      <a 
                        href={course.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 flex items-center text-sm"
                      >
                        Start <ChevronRight size={16} />
                      </a>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default FeaturedCourses;
