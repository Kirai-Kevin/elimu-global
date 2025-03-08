import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { 
  Play, Pause, BookOpen, Video, FileText, 
  CheckCircle, ArrowRight, ArrowLeft, 
  RefreshCw, HelpCircle, AlertTriangle 
} from 'lucide-react';
import { getAuthToken } from '../utils/api';

interface LessonContent {
  _id: string;
  title: string;
  type: 'video' | 'reading' | 'interactive' | 'quiz';
  content: string;
  videoUrl?: string;
  duration?: number;
}

interface LearningModeProps {
  courseId: string;
  onClose: () => void;
}

const LearningMode: React.FC<LearningModeProps> = ({ courseId, onClose }) => {
  const [lessons, setLessons] = useState<LessonContent[]>([]);
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const fetchCourseLessons = async () => {
      try {
        setIsLoading(true);
        const token = getAuthToken();
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/student/courses/${courseId}/lessons`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        setLessons(response.data.lessons || []);
        setIsLoading(false);
      } catch (err) {
        console.error('Failed to fetch course lessons:', err);
        setError('Failed to load course content. Please try again.');
        setIsLoading(false);
      }
    };

    fetchCourseLessons();
  }, [courseId]);

  const handleNextLesson = () => {
    if (currentLessonIndex < lessons.length - 1) {
      setCurrentLessonIndex(prev => prev + 1);
      updateProgress();
    }
  };

  const handlePreviousLesson = () => {
    if (currentLessonIndex > 0) {
      setCurrentLessonIndex(prev => prev - 1);
    }
  };

  const updateProgress = () => {
    const newProgress = Math.round(
      ((currentLessonIndex + 1) / lessons.length) * 100
    );
    setProgress(newProgress);
  };

  const renderLessonContent = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center h-full">
          <RefreshCw className="animate-spin text-blue-500" size={48} />
        </div>
      );
    }

    if (error) {
      return (
        <div className="text-center text-red-500 p-6">
          <AlertTriangle className="mx-auto mb-4" size={48} />
          {error}
        </div>
      );
    }

    if (lessons.length === 0) {
      return (
        <div className="text-center text-gray-500 p-6">
          <BookOpen className="mx-auto mb-4" size={48} />
          No lessons available for this course.
        </div>
      );
    }

    const currentLesson = lessons[currentLessonIndex];

    return (
      <motion.div 
        key={currentLesson._id}
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="p-6 bg-white rounded-lg shadow-md"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">{currentLesson.title}</h2>
          <div className="flex items-center space-x-2">
            {currentLesson.type === 'video' && (
              <button 
                onClick={() => setIsPlaying(!isPlaying)}
                className="bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600"
              >
                {isPlaying ? <Pause /> : <Play />}
              </button>
            )}
            <HelpCircle className="text-gray-500 cursor-pointer" />
          </div>
        </div>

        {/* Lesson Content Rendering */}
        {currentLesson.type === 'video' && currentLesson.videoUrl && (
          <div className="mb-6">
            <video 
              src={currentLesson.videoUrl} 
              controls={!isPlaying}
              autoPlay={isPlaying}
              className="w-full rounded-lg"
            />
          </div>
        )}

        {currentLesson.type === 'reading' && (
          <div className="prose max-w-none">
            <div dangerouslySetInnerHTML={{ __html: currentLesson.content }} />
          </div>
        )}

        {currentLesson.type === 'interactive' && (
          <div className="bg-gray-100 p-4 rounded-lg">
            Interactive content placeholder
          </div>
        )}

        {currentLesson.type === 'quiz' && (
          <div className="bg-gray-100 p-4 rounded-lg">
            Quiz content placeholder
          </div>
        )}

        {/* Navigation Controls */}
        <div className="flex justify-between items-center mt-6">
          <button 
            onClick={handlePreviousLesson}
            disabled={currentLessonIndex === 0}
            className="flex items-center space-x-2 bg-gray-200 p-2 rounded-lg disabled:opacity-50"
          >
            <ArrowLeft /> Previous
          </button>
          
          <div className="flex items-center space-x-2">
            <span>Progress:</span>
            <div className="w-32 bg-gray-200 rounded-full h-2.5">
              <div 
                className="bg-blue-600 h-2.5 rounded-full" 
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <span>{progress}%</span>
          </div>

          <button 
            onClick={handleNextLesson}
            disabled={currentLessonIndex === lessons.length - 1}
            className="flex items-center space-x-2 bg-blue-500 text-white p-2 rounded-lg disabled:opacity-50"
          >
            Next <ArrowRight />
          </button>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 bg-gray-900 bg-opacity-75 flex items-center justify-center">
      <div className="w-full max-w-4xl h-[90vh] bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="flex justify-between items-center p-4 border-b">
          <h1 className="text-3xl font-bold">Learning Mode</h1>
          <button 
            onClick={onClose}
            className="text-gray-600 hover:text-gray-900"
          >
            Close
          </button>
        </div>
        <div className="overflow-y-auto h-[calc(90vh-4rem)] p-6">
          {renderLessonContent()}
        </div>
      </div>
    </div>
  );
};

export default LearningMode;
