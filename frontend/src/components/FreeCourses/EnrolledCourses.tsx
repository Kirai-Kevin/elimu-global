import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Book, Clock, ChevronRight, Star, Users } from 'lucide-react';
import axios from 'axios';
import { FreeCourse } from '../../services/freeCourseService';

const CourseCard: React.FC<{ course: FreeCourse }> = ({ course }) => {
  const navigate = useNavigate();

  return (
    <motion.div 
      whileHover={{ scale: 1.02 }}
      className="course-card bg-white rounded-lg shadow-md p-4"
    >
      <div className="course-card-header">
        <h2 className="text-xl font-semibold mb-2">{course.title}</h2>
      </div>
      <div className="course-card-body">
        <div className="course-details space-y-2 mb-4">
          <div className="course-details-item flex items-center text-gray-600">
            <Book size={16} className="mr-2" />
            <span>{course.category}</span>
          </div>
          <div className="course-details-item flex items-center text-gray-600">
            <Clock size={16} className="mr-2" />
            <span>{course.estimatedHours} hours</span>
          </div>
          <div className="course-details-item flex items-center text-gray-600">
            <Users size={16} className="mr-2" />
            <span>{course.enrollmentCount} enrolled</span>
          </div>
          <div className="course-details-item flex items-center text-gray-600">
            <Star size={16} className="mr-2" />
            <span>{course.rating} Rating</span>
          </div>
        </div>
        <button 
          onClick={() => navigate(`/courses/${course.courseId}`)}
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg 
            hover:bg-blue-600 transition flex items-center justify-center"
        >
          Continue Learning
          <ChevronRight size={16} className="ml-2" />
        </button>
      </div>
    </motion.div>
  );
};

const EnrolledCourses: React.FC = () => {
  const [enrolledCourses, setEnrolledCourses] = useState<FreeCourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEnrolledCourses = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000'}/student/courses/enrolled`,
          {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('userToken')}`
            }
          }
        );
        setEnrolledCourses(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching enrolled courses:', err);
        setError('Failed to fetch enrolled courses');
        setLoading(false);
      }
    };

    fetchEnrolledCourses();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        <p><strong>Error:</strong> {error}</p>
      </div>
    );
  }

  if (enrolledCourses.length === 0) {
    return (
      <div className="text-center py-10">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">No Enrolled Courses</h2>
        <p className="text-gray-500">You haven't enrolled in any courses yet.</p>
      </div>
    );
  }

  return (
    <div className="enrolled-courses p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">My Enrolled Courses</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {enrolledCourses.map((course) => (
          <CourseCard key={course.courseId} course={course} />
        ))}
      </div>
    </div>
  );
};

export default EnrolledCourses;
