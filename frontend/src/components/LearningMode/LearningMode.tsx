import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, 
  Pause, 
  BookOpen, 
  ChevronLeft, 
  CheckCircle,
  ChevronRight, 
  Lock, 
  Clock,
  X,
  Loader2,
  Lightbulb
} from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import FreeCourseService from '../../services/freeCourseService';
import { FreeCourse } from '../../services/freeCourseService';
import { getChatResponse } from '../../services/groqService';
import { addMessageToChat } from '../ChatBot';

// AI-Powered Learning Assistant
const LearningAssistant: React.FC<{ 
  currentTopic: string, 
  onAIHint: () => void 
}> = ({ currentTopic, onAIHint }) => {
  const [isListening, setIsListening] = useState(false);

  return (
    <div className="bg-blue-50 p-4 rounded-lg flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <Lightbulb className="text-yellow-500" size={32} />
        <div>
          <h3 className="font-semibold text-blue-800">AI Learning Assistant</h3>
          <p className="text-sm text-blue-600">Helping you learn {currentTopic}</p>
        </div>
      </div>
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={onAIHint}
        className="px-6 py-3 
          bg-gradient-to-r from-blue-500 to-blue-600 
          text-white 
          rounded-xl 
          shadow-md 
          hover:shadow-lg 
          focus:outline-none 
          focus:ring-2 
          focus:ring-blue-400 
          focus:ring-opacity-50 
          transition-all 
          duration-300 
          ease-in-out 
          transform 
          hover:-translate-y-1 
          flex 
          items-center 
          justify-center 
          mx-auto 
          relative 
          overflow-hidden 
          before:absolute 
          before:inset-0 
          before:bg-white 
          before:opacity-0 
          hover:before:opacity-10"
      >
        <Lightbulb size={16} />
        <span>Get AI Hint</span>
      </motion.button>
    </div>
  );
};

// Progress Tracker
const ProgressTracker: React.FC<{ 
  totalModules: number, 
  completedModules: number 
}> = ({ totalModules, completedModules }) => {
  const progressPercentage = (completedModules / totalModules) * 100;

  return (
    <div className="bg-white shadow-md rounded-lg p-4">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-gray-600">
          Course Progress
        </span>
        <span className="text-sm font-bold text-blue-600">
          {completedModules}/{totalModules} Modules
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${progressPercentage}%` }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="bg-blue-600 h-2.5 rounded-full"
        />
      </div>
    </div>
  );
};

const LearningMode: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();

  const [course, setCourse] = useState<FreeCourse | null>(null);
  const [currentModuleIndex, setCurrentModuleIndex] = useState(0);
  const [completedModules, setCompletedModules] = useState<number[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showExternalLink, setShowExternalLink] = useState(false);
  const [aiHint, setAiHint] = useState<string | null>(null);
  const [isAiHintLoading, setIsAiHintLoading] = useState(false);

  useEffect(() => {
    const fetchCourseDetails = async () => {
      console.log('LearningMode: Fetching course details');
      console.log('Course ID from params:', courseId);

      if (!courseId) {
        console.error('LearningMode: No course ID provided');
        setError('No course ID provided');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        console.log('Attempting to fetch course details...');
        
        const courseDetails = await FreeCourseService.getCourseById(courseId);
        console.log('Course details fetched:', courseDetails);
        
        if (!courseDetails) {
          console.error('LearningMode: No course details received');
          setError('Failed to load course details');
          return;
        }

        // Ensure modules exist
        const processedCourse = {
          ...courseDetails,
          modules: courseDetails.modules || [
            {
              title: courseDetails.title || 'Course Module',
              description: courseDetails.description || 'No description available',
              duration: courseDetails.duration || '1 hour',
              topics: courseDetails.tags || []
            }
          ]
        };

        setCourse(processedCourse);
      } catch (err: any) {
        console.error('LearningMode: Error fetching course details', err);
        
        // More detailed error logging
        if (err.response) {
          console.error('Error response data:', err.response.data);
          console.error('Error response status:', err.response.status);
          console.error('Error response headers:', err.response.headers);
        } else if (err.request) {
          console.error('No response received:', err.request);
        } else {
          console.error('Error message:', err.message);
        }

        setError(err.response?.data?.message || err.message || 'Failed to load course details');
      } finally {
        setLoading(false);
      }
    };

    fetchCourseDetails();
  }, [courseId]);

  const handlePreviousModule = () => {
    // Ensure we don't go below the first module
    const newIndex = Math.max(0, currentModuleIndex - 1);
    
    // Only update if there's a change
    if (newIndex !== currentModuleIndex) {
      setCurrentModuleIndex(newIndex);
    }
  };

  const handleNextModule = () => {
    // Ensure we don't exceed the total number of modules
    const maxIndex = (course.modules?.length || 0) - 1;
    const newIndex = Math.min(maxIndex, currentModuleIndex + 1);
    
    // Only update if there's a change
    if (newIndex !== currentModuleIndex) {
      setCurrentModuleIndex(newIndex);
    }
  };

  const handleModuleComplete = () => {
    // Check if the current module is already completed
    if (!completedModules.includes(currentModuleIndex)) {
      // Add current module to completed modules
      const updatedCompletedModules = [...completedModules, currentModuleIndex];
      setCompletedModules(updatedCompletedModules);

      // Optional: You might want to save this progress to backend
      // FreeCourseService.updateModuleProgress(courseId, currentModuleIndex);
    }

    // Automatically progress to next module if available
    const maxIndex = (course.modules?.length || 0) - 1;
    if (currentModuleIndex < maxIndex) {
      setCurrentModuleIndex(currentModuleIndex + 1);
    }
  };

  const handleAIHint = async () => {
    try {
      // Prepare context for AI hint
      const currentModule = course?.modules[currentModuleIndex];
      if (!currentModule) {
        console.error('No current module found');
        return;
      }

      // Construct messages for AI hint
      const messages = [
        {
          role: 'system',
          content: `You are an AI learning assistant helping a student understand a learning module. 
          Provide a concise, engaging, and educational hint or explanation about the module.
          Structure your response with clear, bold headings and avoid using markdown.
          Format your response in a way that is easy to read and understand.`
        },
        {
          role: 'user',
          content: `I'm studying the module: "${currentModule.title}". 
          Can you provide a helpful learning hint or explanation? 
          The module description is: "${currentModule.description || 'No description available'}".
          Help me understand the key concepts and provide a learning strategy.
          Ensure your response uses clear, bold headings and is formatted for easy readability.`
        }
      ];

      // Get AI hint using Groq service
      setIsAiHintLoading(true);
      const aiHint = await getChatResponse(messages);

      // Post-process the hint to ensure clean formatting
      const formattedHint = aiHint
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')  // Convert markdown bold to HTML
        .replace(/^#\s*(.*?)$/gm, '<h2 class="text-lg font-bold mb-2">$1</h2>')  // Convert markdown headings
        .replace(/\n/g, '<br />');  // Preserve line breaks

      setIsAiHintLoading(false);
      setAiHint(formattedHint);
    } catch (error) {
      console.error('Failed to get AI hint:', error);
      setIsAiHintLoading(false);
      setAiHint('Sorry, I could not generate an AI hint at the moment. Please try again later.');
    }
  };

  const handleOpenExternalCourse = () => {
    // Create a new window/tab that appears to be from our platform
    const externalWindow = window.open('', '_blank');
    
    if (externalWindow) {
      externalWindow.document.write(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <title>${course.title} | Elimu Global Learning</title>
          <style>
            body {
              font-family: 'Arial', sans-serif;
              max-width: 1200px;
              margin: 0 auto;
              padding: 20px;
              background-color: #f4f4f8;
            }
            .course-header {
              background-color: #3b82f6;
              color: white;
              padding: 20px;
              border-radius: 10px;
              margin-bottom: 20px;
            }
            .course-content {
              background-color: white;
              border-radius: 10px;
              padding: 20px;
              box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            }
            .external-link {
              color: #3b82f6;
              text-decoration: none;
              font-weight: bold;
            }
          </style>
        </head>
        <body>
          <div class="course-header">
            <h1>${course.title}</h1>
            <p>Powered by ${course.provider}</p>
          </div>
          <div class="course-content">
            <h2>Course Description</h2>
            <p>${course.description}</p>
            <h3>External Course Link</h3>
            <p>You are being redirected to the original course source. 
              <a href="${course.url}" class="external-link" target="_blank">
                Continue to ${course.provider} Course
              </a>
            </p>
          </div>
          <script>
            // Automatically redirect after a short delay
            setTimeout(() => {
              window.location.href = '${course.url}';
            }, 3000);
          </script>
        </body>
        </html>
      `);
      externalWindow.document.close();
    }
  };

  if (loading) return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex justify-center items-center h-screen bg-gray-50"
    >
      <motion.div
        animate={{ 
          scale: [1, 1.2, 1],
          rotate: [0, 10, -10, 0]
        }}
        transition={{ 
          repeat: Infinity, 
          duration: 1 
        }}
        className="text-4xl font-bold text-blue-500 flex items-center"
      >
        <BookOpen className="mr-2" /> Loading Learning Mode...
      </motion.div>
    </motion.div>
  );

  if (error) return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex justify-center items-center h-screen bg-red-50"
    >
      <div className="text-center p-6 bg-white rounded-lg shadow-md max-w-md w-full">
        <Award className="mx-auto mb-4 text-red-500" size={64} />
        <h2 className="text-2xl font-bold text-red-700 mb-2">Oops! Something Went Wrong</h2>
        <p className="text-gray-600 mb-4 break-words">{error}</p>
        <pre className="bg-gray-100 p-4 rounded-lg text-left text-xs mb-4 overflow-x-auto">
          Course ID: {courseId || 'Not provided'}
        </pre>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/free-courses')}
          className="px-6 py-3 
            bg-gradient-to-r from-blue-500 to-blue-600 
            text-white 
            rounded-xl 
            shadow-md 
            hover:shadow-lg 
            focus:outline-none 
            focus:ring-2 
            focus:ring-blue-400 
            focus:ring-opacity-50 
            transition-all 
            duration-300 
            ease-in-out 
            transform 
            hover:-translate-y-1 
            flex 
            items-center 
            justify-center 
            mx-auto 
            relative 
            overflow-hidden 
            before:absolute 
            before:inset-0 
            before:bg-white 
            before:opacity-0 
            hover:before:opacity-10"
        >
          <ChevronLeft className="mr-2" /> Back to Courses
        </motion.button>
      </div>
    </motion.div>
  );

  if (!course || !course.modules || course.modules.length === 0) return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex justify-center items-center h-screen bg-gray-50"
    >
      <div className="text-center p-6 bg-white rounded-lg shadow-md max-w-md w-full">
        <BookOpen className="mx-auto mb-4 text-blue-500" size={64} />
        <h2 className="text-2xl font-bold text-gray-800 mb-2">No Course Modules Found</h2>
        <p className="text-gray-600 mb-4">
          The course content is currently unavailable. 
          Please contact support or try again later.
        </p>
        <pre className="bg-gray-100 p-4 rounded-lg text-left text-xs mb-4 overflow-x-auto">
          Course ID: {courseId}
          Course Title: {course?.title || 'N/A'}
        </pre>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/free-courses')}
          className="px-6 py-3 
            bg-gradient-to-r from-blue-500 to-blue-600 
            text-white 
            rounded-xl 
            shadow-md 
            hover:shadow-lg 
            focus:outline-none 
            focus:ring-2 
            focus:ring-blue-400 
            focus:ring-opacity-50 
            transition-all 
            duration-300 
            ease-in-out 
            transform 
            hover:-translate-y-1 
            flex 
            items-center 
            justify-center 
            mx-auto 
            relative 
            overflow-hidden 
            before:absolute 
            before:inset-0 
            before:bg-white 
            before:opacity-0 
            hover:before:opacity-10"
        >
          <ChevronLeft className="mr-2" /> Back to Courses
        </motion.button>
      </div>
    </motion.div>
  );

  const currentModule = course.modules[currentModuleIndex];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gray-50 flex flex-col"
    >
      <div className="flex-grow container mx-auto px-4 py-4 space-y-4 lg:grid lg:grid-cols-3 lg:gap-8">
        {/* Left Sidebar - Module Navigation (Mobile: Collapsible) */}
        <div className="lg:col-span-1 space-y-4">
          <ProgressTracker 
            totalModules={course.modules.length} 
            completedModules={completedModules.length} 
          />

          {/* Modules List - Scrollable on Mobile, Fixed on Larger Screens */}
          <div className="bg-white shadow-md rounded-lg p-4 max-h-[50vh] lg:max-h-[70vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4 text-gray-800">Course Modules</h2>
            <div className="space-y-2">
              {course.modules.map((module, index) => (
                <motion.button
                  key={index}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setCurrentModuleIndex(index)}
                  className={`w-full text-left p-3 rounded-lg flex items-center justify-between transition
                    ${currentModuleIndex === index 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}
                    ${completedModules.includes(index) ? 'opacity-50' : ''}`}
                >
                  <span className="truncate mr-2">{module.title}</span>
                  {completedModules.includes(index) ? (
                    <CheckCircle size={20} className="flex-shrink-0" />
                  ) : (
                    index > currentModuleIndex ? <Lock size={20} className="flex-shrink-0" /> : null
                  )}
                </motion.button>
              ))}
            </div>
          </div>

          {/* AI Learning Assistant - Compact on Mobile */}
          <LearningAssistant 
            currentTopic={currentModule.title} 
            onAIHint={handleAIHint} 
          />
        </div>

        {/* Main Content Area - Full Width on Mobile */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg p-4 lg:p-8 relative">
          <motion.div 
            key={currentModuleIndex}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-4"
          >
            {/* Module Header - Responsive Layout */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-2 sm:mb-0">
                {currentModule.title}
              </h1>
              <div className="flex items-center space-x-2 text-gray-600 text-sm">
                <Clock size={16} />
                <span>{currentModule.duration}</span>
              </div>
            </div>

            {/* AI Hint Section */}
            {aiHint && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.3 }}
                className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg mb-4 relative"
              >
                <div className="flex items-start">
                  <Lightbulb className="text-blue-500 mr-3 mt-1" size={24} />
                  <div className="flex-1">
                    <h4 className="font-semibold text-blue-800 mb-2">AI Learning Hint</h4>
                    <div className="text-blue-700 text-sm" dangerouslySetInnerHTML={{ __html: aiHint }} />
                  </div>
                  <div className="flex flex-col space-y-2">
                    <button 
                      onClick={() => setAiHint(null)}
                      className="text-blue-500 hover:text-blue-700 transition-colors"
                    >
                      <X size={16} />
                    </button>
                    <button
                      onClick={() => {
                        addMessageToChat(aiHint, false);
                        setAiHint(null);
                      }}
                      className="px-3 py-1 bg-blue-500 text-white rounded-full text-xs hover:bg-blue-600 transition-colors"
                    >
                      Continue in Chat
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* AI Hint Loading State */}
            {isAiHintLoading && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gray-50 border-l-4 border-gray-300 p-4 rounded-r-lg mb-4 flex items-center"
              >
                <Loader2 className="mr-3 animate-spin text-gray-500" size={24} />
                <p className="text-gray-700">Generating AI hint...</p>
              </motion.div>
            )}

            {/* Dynamic Content Rendering */}
            <div className="prose max-w-none text-sm md:text-base">
              {currentModule.description && (
                <p className="text-gray-600 mb-4">{currentModule.description}</p>
              )}

              {currentModule.topics && (
                <div className="bg-blue-50 p-3 rounded-lg">
                  <h3 className="text-base lg:text-lg font-semibold mb-2 text-blue-800">
                    Key Topics
                  </h3>
                  <ul className="list-disc list-inside text-blue-600 text-sm md:text-base">
                    {currentModule.topics.map((topic, index) => (
                      <li key={index} className="mb-1">{topic}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* External Course Information */}
              <div className="bg-orange-50 p-4 rounded-lg mt-6 border border-orange-200">
                <div className="flex items-center mb-4">
                  <img 
                    src={course.thumbnail} 
                    alt={`${course.provider} Logo`} 
                    className="w-16 h-16 mr-4 rounded-lg object-cover"
                  />
                  <div>
                    <h4 className="text-lg font-bold text-orange-800">{course.provider} Course</h4>
                    <p className="text-orange-600">Level: {course.level}</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-orange-700">
                    <strong>Duration:</strong> {course.duration}
                  </p>
                  <p className="text-orange-700">
                    <strong>Subject:</strong> {course.subject}
                  </p>
                  <div className="flex space-x-2">
                    {course.tags?.map((tag, index) => (
                      <span 
                        key={index} 
                        className="bg-orange-200 text-orange-800 px-2 py-1 rounded-full text-xs"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Module Navigation - Responsive Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-center w-full max-w-2xl mx-auto mt-6">
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => handlePreviousModule()}
                disabled={currentModuleIndex === 0}
                className="w-full sm:w-auto px-6 py-3 
                  bg-gradient-to-r from-blue-500 to-blue-600 
                  text-white 
                  rounded-xl 
                  shadow-md 
                  hover:shadow-lg 
                  focus:outline-none 
                  focus:ring-2 
                  focus:ring-blue-400 
                  focus:ring-opacity-50 
                  transition-all 
                  duration-300 
                  ease-in-out 
                  transform 
                  hover:-translate-y-1 
                  flex 
                  items-center 
                  justify-center 
                  space-x-2
                  relative 
                  overflow-hidden 
                  before:absolute 
                  before:inset-0 
                  before:bg-white 
                  before:opacity-0 
                  hover:before:opacity-10
                  disabled:opacity-50 
                  disabled:cursor-not-allowed"
              >
                <ChevronLeft size={16} />
                <span>Previous</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleModuleComplete()}
                className="w-full sm:w-auto px-6 py-3 
                  bg-gradient-to-r from-green-500 to-green-600 
                  text-white 
                  rounded-xl 
                  shadow-md 
                  hover:shadow-lg 
                  focus:outline-none 
                  focus:ring-2 
                  focus:ring-green-400 
                  focus:ring-opacity-50 
                  transition-all 
                  duration-300 
                  ease-in-out 
                  transform 
                  hover:-translate-y-1 
                  flex 
                  items-center 
                  justify-center 
                  space-x-2
                  relative 
                  overflow-hidden 
                  before:absolute 
                  before:inset-0 
                  before:bg-white 
                  before:opacity-0 
                  hover:before:opacity-10"
              >
                <CheckCircle size={16} />
                <span>
                  {currentModule.completed ? 'Completed' : 'Mark as Complete'}
                </span>
              </motion.button>

              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => handleNextModule()}
                disabled={currentModuleIndex === (course.modules?.length || 0) - 1}
                className="w-full sm:w-auto px-6 py-3 
                  bg-gradient-to-r from-blue-500 to-blue-600 
                  text-white 
                  rounded-xl 
                  shadow-md 
                  hover:shadow-lg 
                  focus:outline-none 
                  focus:ring-2 
                  focus:ring-blue-400 
                  focus:ring-opacity-50 
                  transition-all 
                  duration-300 
                  ease-in-out 
                  transform 
                  hover:-translate-y-1 
                  flex 
                  items-center 
                  justify-center 
                  space-x-2
                  relative 
                  overflow-hidden 
                  before:absolute 
                  before:inset-0 
                  before:bg-white 
                  before:opacity-0 
                  hover:before:opacity-10
                  disabled:opacity-50 
                  disabled:cursor-not-allowed"
              >
                <span>Next</span>
                <ChevronRight size={16} />
              </motion.button>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleOpenExternalCourse()}
              className="w-full sm:w-auto mt-4 px-6 py-3 
                bg-gradient-to-r from-orange-500 to-orange-600 
                text-white 
                rounded-xl 
                shadow-md 
                hover:shadow-lg 
                focus:outline-none 
                focus:ring-2 
                focus:ring-orange-400 
                focus:ring-opacity-50 
                transition-all 
                duration-300 
                ease-in-out 
                transform 
                hover:-translate-y-1 
                flex 
                items-center 
                justify-center 
                space-x-2
                relative 
                overflow-hidden 
                before:absolute 
                before:inset-0 
                before:bg-white 
                before:opacity-0 
                hover:before:opacity-10
                mx-auto"
            >
              <span>Open External Course</span>
            </motion.button>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default LearningMode;
