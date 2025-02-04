import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  UnifiedAssessmentService, 
  CourseService, 
  Assignment, 
  Assessment, 
  Course 
} from '../types/assessment';
import LearningMode from './LearningMode'; 

const AssessmentDashboard: React.FC = () => {
  const [items, setItems] = useState<(Assignment | Assessment)[]>([]);
  const [currentCourse, setCurrentCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeType, setActiveType] = useState<'assignments' | 'assessments'>('assignments');
  const [isLearningModalOpen, setIsLearningModalOpen] = useState(false);
  const navigate = useNavigate();
  const unifiedService = new UnifiedAssessmentService();
  const courseService = new CourseService();

  useEffect(() => {
    const fetchItemsAndCourse = async () => {
      try {
        // First, fetch the current course
        const course = await courseService.getCurrentCourse();
        
        // If no course found, set error
        if (!course || !course._id) {
          setError('No active course found. Please select a course.');
          setItems([]);
          setCurrentCourse(null);
          setLoading(false);
          return;
        }

        // Set the current course
        setCurrentCourse(course);

        // Fetch items for the current course
        const fetchedItems = await unifiedService.getItems(course._id, activeType);
        
        // Ensure fetchedItems is an array
        setItems(Array.isArray(fetchedItems) ? fetchedItems : []);
      } catch (error) {
        console.error(`Failed to fetch ${activeType}:`, error);
        setError(`Failed to load ${activeType}. Please try again.`);
        setItems([]);
        setCurrentCourse(null);
      } finally {
        setLoading(false);
      }
    };

    fetchItemsAndCourse();
  }, [activeType]);

  const handleStartItem = (courseId: string, itemId: string) => {
    navigate(`/dashboard/${activeType}/${courseId}/${itemId}`);
  };

  const openLearningMode = () => {
    setIsLearningModalOpen(true);
  };

  const closeLearningMode = () => {
    setIsLearningModalOpen(false);
  };

  // Render error state
  if (error) {
    return (
      <div className="w-full h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 text-xl mb-4">{error}</p>
          <button 
            onClick={() => navigate('/courses')} 
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Select a Course
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <div className="p-6 max-w-4xl mx-auto">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-blue-600">Loading {activeType}...</div>
          </div>
        ) : (
          <>
            {currentCourse && (
              <div className="mb-8 bg-white rounded-lg shadow-md p-6">
                <h1 className="text-2xl font-bold text-blue-600 mb-2">{currentCourse.title}</h1>
                {currentCourse.description && (
                  <p className="text-gray-600">{currentCourse.description}</p>
                )}
              </div>
            )}

            {/* Type Toggle */}
            <div className="flex mb-6">
              <button 
                onClick={() => setActiveType('assignments')}
                className={`px-4 py-2 mr-2 rounded-lg ${
                  activeType === 'assignments' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 text-gray-700'
                }`}
              >
                Assignments
              </button>
              <button 
                onClick={() => setActiveType('assessments')}
                className={`px-4 py-2 rounded-lg ${
                  activeType === 'assessments' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 text-gray-700'
                }`}
              >
                Assessments
              </button>
            </div>

            <h2 className="text-xl font-semibold text-blue-600 mb-6">
              {activeType.charAt(0).toUpperCase() + activeType.slice(1)}
            </h2>

            {items && items.length === 0 ? (
              <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center justify-center">
                <p className="text-gray-600 mb-4 text-center">
                  Currently no {activeType} available for this course.
                </p>
                <button 
                  onClick={openLearningMode}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Continue Learning
                </button>
              </div>
            ) : (
              <div className="grid gap-6">
                {items?.map((item) => (
                  <div 
                    key={item._id} 
                    className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer"
                    onClick={() => handleStartItem(currentCourse!._id, item._id)}
                  >
                    <h3 className="text-lg font-semibold text-blue-600 mb-2">{item.title}</h3>
                    <p className="text-gray-600 mb-4">{item.description}</p>
                    {item.dueDate && (
                      <p className="text-sm text-gray-500">
                        Due: {new Date(item.dueDate).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* Learning Modal */}
      {isLearningModalOpen && currentCourse && (
        <LearningMode 
          courseId={currentCourse._id} 
          onClose={closeLearningMode} 
        />
      )}
    </div>
  );
};

export default AssessmentDashboard;
