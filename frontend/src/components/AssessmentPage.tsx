import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  UnifiedAssessmentService, 
  CourseService, 
  Assignment, 
  Assessment, 
  AssignmentSubmission, 
  AssessmentSubmission 
} from '../types/assessment';
import LearningMode from './LearningMode';

const AssessmentPage: React.FC = () => {
  const { courseId, itemId, type = 'assignments' } = useParams<{ 
    courseId: string; 
    itemId: string; 
    type?: 'assignments' | 'assessments' 
  }>();
  const navigate = useNavigate();
  const unifiedService = new UnifiedAssessmentService();
  const courseService = new CourseService();

  const [item, setItem] = useState<Assignment | Assessment | null>(null);
  const [course, setCourse] = useState<{ title: string } | null>(null);
  const [submissionData, setSubmissionData] = useState<AssignmentSubmission | AssessmentSubmission>({
    courseId: courseId || '',
    itemId: itemId || '',
    submissionUrl: '',
    submissionText: '',
    attachments: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submissionStatus, setSubmissionStatus] = useState<'NOT_STARTED' | 'SUBMITTING' | 'SUBMITTED'>('NOT_STARTED');
  const [isLearningModeOpen, setIsLearningModeOpen] = useState(false);

  const openLearningMode = () => {
    setIsLearningModeOpen(true);
  };

  const closeLearningMode = () => {
    setIsLearningModeOpen(false);
  };

  useEffect(() => {
    const fetchItemDetails = async () => {
      if (!courseId || !itemId) {
        setError('Missing course or item ID');
        setLoading(false);
        return;
      }

      try {
        // Fetch course details
        const fetchedCourse = await courseService.getCourseById(courseId);
        setCourse(fetchedCourse);

        // Fetch item details
        const fetchedItem = await unifiedService.getItem(courseId, itemId, type);
        
        if (!fetchedItem) {
          setError(`${type.charAt(0).toUpperCase() + type.slice(1)} not found`);
          setLoading(false);
          return;
        }

        setItem(fetchedItem);
      } catch (error) {
        console.error(`Failed to fetch ${type} details:`, error);
        setError(`Failed to load ${type} details`);
      } finally {
        setLoading(false);
      }
    };

    fetchItemDetails();
  }, [courseId, itemId, type]);

  const handleSubmit = async () => {
    if (!item || !courseId) return;

    try {
      setSubmissionStatus('SUBMITTING');
      
      const response = await unifiedService.submitItem(
        courseId, 
        item._id, 
        submissionData,
        type
      );

      // Handle successful submission
      setSubmissionStatus('SUBMITTED');
      
      // Optional: show success message or redirect
      setTimeout(() => {
        navigate(`/dashboard/${type}`);
      }, 2000);
    } catch (error) {
      console.error(`Failed to submit ${type}:`, error);
      setError(`Failed to submit ${type}`);
      setSubmissionStatus('NOT_STARTED');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setSubmissionData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      // Convert files to URLs or handle file upload logic
      const fileUrls = Array.from(files).map(file => URL.createObjectURL(file));
      setSubmissionData(prev => ({
        ...prev,
        attachments: fileUrls
      }));
    }
  };

  if (loading) {
    return (
      <div className="w-full h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center">
        <div className="text-blue-600">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center">
        <div className="text-red-600">{error}</div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="w-full h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600">{type.charAt(0).toUpperCase() + type.slice(1)} not found</div>
          <button 
            onClick={openLearningMode}
            className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Continue Learning
          </button>
        </div>
      </div>
    );
  }

  if (submissionStatus === 'SUBMITTED') {
    return (
      <div className="w-full h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-green-600 mb-4">{type.charAt(0).toUpperCase() + type.slice(1)} Submitted!</h2>
          <p className="text-gray-600">Your {type.charAt(0).toUpperCase() + type.slice(1)} has been successfully submitted.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-blue-50 to-white p-6">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-2xl font-bold text-blue-600 mb-6">{item.title}</h1>
        
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">{type.charAt(0).toUpperCase() + type.slice(1)} Details</h2>
          <p className="text-gray-600">{item.description}</p>
          
          {item.dueDate && (
            <p className="text-sm text-gray-500 mt-2">
              Due Date: {new Date(item.dueDate).toLocaleDateString()}
            </p>
          )}
        </div>

        <div className="space-y-4">
          <div>
            <label htmlFor="submissionUrl" className="block text-sm font-medium text-gray-700">
              Submission URL (Optional)
            </label>
            <input
              type="url"
              id="submissionUrl"
              name="submissionUrl"
              value={(submissionData as AssignmentSubmission).submissionUrl || ''}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200"
              placeholder="Enter submission URL (e.g., Google Docs, GitHub link)"
            />
          </div>

          <div>
            <label htmlFor="submissionText" className="block text-sm font-medium text-gray-700">
              Submission Text (Optional)
            </label>
            <textarea
              id="submissionText"
              name="submissionText"
              value={(submissionData as AssignmentSubmission).submissionText || ''}
              onChange={handleInputChange}
              rows={4}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200"
              placeholder="Provide additional details or explanation"
            />
          </div>

          <div>
            <label htmlFor="attachments" className="block text-sm font-medium text-gray-700">
              Attachments (Optional)
            </label>
            <input
              type="file"
              id="attachments"
              name="attachments"
              multiple
              onChange={handleFileUpload}
              className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:rounded-full file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:text-sm file:font-semibold hover:file:bg-blue-100"
            />
            {submissionData.attachments && submissionData.attachments.length > 0 && (
              <div className="mt-2">
                <p className="text-sm text-gray-500">
                  {submissionData.attachments.length} file(s) selected
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={handleSubmit}
            disabled={submissionStatus === 'SUBMITTING'}
            className={`px-6 py-2 rounded-lg transition-colors ${
              submissionStatus === 'SUBMITTING'
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {submissionStatus === 'SUBMITTING' ? 'Submitting...' : 'Submit'}
          </button>
        </div>
      </div>
      {isLearningModeOpen && (
        <LearningMode 
          courseId={courseId || ''} 
          onClose={closeLearningMode} 
        />
      )}
    </div>
  );
};

export default AssessmentPage;
