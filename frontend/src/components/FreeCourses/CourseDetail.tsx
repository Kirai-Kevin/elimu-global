import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FreeCourseService, FreeCourse } from '../../services/freeCourseService';
import { 
  Book, 
  BookOpen, 
  GraduationCap, 
  ChevronRight,
  Clock,
  Users,
  Star,
  ArrowLeft,
  FileText
} from 'lucide-react';

const CourseDetail: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const [course, setCourse] = useState<FreeCourse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pdfContent, setPdfContent] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        if (courseId) {
          const courseDetails = await FreeCourseService.getCourseById(courseId);
          setCourse(courseDetails);

          // Fetch PDF content if available
          const pdfText = await FreeCourseService.getPDFContent(courseId);
          setPdfContent(pdfText);
        }
      } catch (err) {
        console.error('Error fetching course details:', err);
        setError('Failed to load course details');
      } finally {
        setLoading(false);
      }
    };

    fetchCourseDetails();
  }, [courseId]);

  if (loading) return <div>Loading course details...</div>;
  if (error) return <div>{error}</div>;
  if (!course) return <div>Course not found</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <button 
        onClick={() => navigate('/free-courses')}
        className="mb-4 flex items-center text-gray-600 hover:text-gray-800"
      >
        <ArrowLeft className="mr-2" /> Back to Courses
      </button>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Course Overview */}
        <div className="md:col-span-2">
          <h1 className="text-3xl font-bold mb-4">{course.title}</h1>
          <p className="text-gray-600 mb-6">{course.description}</p>

          {/* Learning Objectives */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-3">What You'll Learn</h2>
            <ul className="space-y-2">
              {course.learningObjectives?.map((objective, index) => (
                <li key={index} className="flex items-start space-x-2">
                  <ChevronRight className="text-blue-500 mt-1" size={16} />
                  <span>{objective}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Course Modules */}
          <div>
            <h2 className="text-xl font-semibold mb-3">Course Modules</h2>
            {course.modules && course.modules.length > 0 ? (
              <div className="space-y-4">
                {course.modules.map((module, index) => (
                  <div key={index} className="bg-white border rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
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
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 italic">No module details available</p>
            )}
          </div>

          {/* PDF Content Section */}
          {pdfContent && (
            <div className="mt-8 bg-gray-50 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <FileText className="mr-2 text-blue-500" size={24} />
                Additional Course Information
              </h2>
              <div 
                className="prose prose-sm max-h-96 overflow-y-auto bg-white p-4 rounded-md text-gray-700"
                style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}
              >
                {pdfContent}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div>
          <div className="bg-white border rounded-lg p-6 sticky top-8">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center space-x-2">
                <GraduationCap className="text-green-600" size={24} />
                <span className="font-semibold">{course.difficulty}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="text-purple-600" size={24} />
                <span>{course.estimatedHours} hours</span>
              </div>
            </div>

            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center space-x-2">
                <Star className="text-yellow-500" size={24} />
                <span>{course.rating?.toFixed(1)}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Users className="text-blue-600" size={24} />
                <span>{course.enrollmentCount} enrolled</span>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Instructor</h3>
              <div className="flex items-center space-x-3">
                <div>
                  <p className="font-medium">{course.instructor?.name || 'Elimu Global Instructor'}</p>
                  <p className="text-sm text-gray-500">{course.instructor?.title || 'Course Facilitator'}</p>
                </div>
              </div>
            </div>

            <button 
              className="w-full mt-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
            >
              Start Course
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;
