import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import courseService, { EnrolledCourseRecord } from '../../services/courseService';

interface CourseSidebarProps {
  onSelectCourse: (courseId: string) => void;
  selectedCourseId?: string;
}

const CourseSidebar: React.FC<CourseSidebarProps> = ({ onSelectCourse, selectedCourseId }) => {
  const [courses, setCourses] = useState<EnrolledCourseRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEnrolledCourses = async () => {
      try {
        const userString = localStorage.getItem('user');
        if (!userString) {
          setError('Please log in to view your courses');
          setLoading(false);
          return;
        }

        console.log('Fetching enrolled courses...'); // Debug log
        const enrolledResponse = await courseService.getEnrolledCourses();
        console.log('Enrolled courses response:', enrolledResponse); // Debug log
        setCourses(enrolledResponse || []);

        // If we have courses and a selected course is not set, select the first one
        if (enrolledResponse?.length > 0 && !selectedCourseId) {
          onSelectCourse(enrolledResponse[0]._id);
        }
      } catch (err) {
        console.error('Error fetching enrolled courses:', err);
        setError('Failed to fetch enrolled courses');
      } finally {
        setLoading(false);
      }
    };

    fetchEnrolledCourses();
  }, [onSelectCourse, selectedCourseId]);

  const handleCourseClick = (course: EnrolledCourseRecord) => {
    onSelectCourse(course.courseId._id);
  };

  if (loading) {
    return (
      <div className="w-80 h-screen bg-gray-50 border-r border-gray-200 p-4">
        <div className="animate-pulse space-y-4">
          <div className="h-12 bg-gray-200 rounded"></div>
          <div className="h-16 bg-gray-200 rounded"></div>
          <div className="h-16 bg-gray-200 rounded"></div>
          <div className="h-16 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-80 h-screen bg-gray-50 border-r border-gray-200 p-4">
        <div className="text-red-600 text-center">
          <p>{error}</p>
          <button 
            onClick={() => navigate('/courses')}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            View All Courses
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-80 h-screen bg-gray-50 border-r border-gray-200 flex flex-col">
      <div className="p-4 bg-white border-b border-gray-200 flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-800">Enrolled Courses</h2>
        <span className="text-sm text-gray-500">{courses.length} courses</span>
      </div>

      <div className="overflow-y-auto flex-grow">
        {courses.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            <p className="mb-4">No enrolled courses found</p>
            <button 
              onClick={() => navigate('/courses')}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Browse Courses
            </button>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {courses.map((course) => (
              <div
                key={course._id}
                onClick={() => handleCourseClick(course)}
                className={`p-4 cursor-pointer transition-colors ${
                  selectedCourseId === course.courseId._id
                    ? 'bg-blue-50 border-l-4 border-blue-600'
                    : 'hover:bg-gray-100'
                }`}
              >
                <h3 className="font-medium text-gray-900 mb-1">
                  {course.courseId.title}
                </h3>
                <p className="text-sm text-gray-500 line-clamp-2">
                  {course.courseId.description}
                </p>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-xs text-gray-500">
                    Enrolled: {new Date(course.enrolledAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseSidebar;
