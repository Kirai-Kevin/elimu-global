import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Lesson, CourseProgress } from '../types/lesson';
import lessonService from '../services/lessonService';
import courseService from '../services/courseService';

const CourseLessons: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  
  const [course, setCourse] = useState<any>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
  const [progress, setProgress] = useState<CourseProgress | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Load course and lessons
  useEffect(() => {
    const loadCourseAndLessons = async () => {
      if (!courseId) {
        setError('Course ID is missing');
        setLoading(false);
        return;
      }

      try {
        // Load course details
        const courseData = await courseService.getCourseById(courseId);
        setCourse(courseData);

        // Check if lessons exist for this course
        let courseLessons = lessonService.getLessons(courseId);
        
        // If no lessons found, generate them
        if (courseLessons.length === 0) {
          courseLessons = lessonService.generateLessons(courseData);
        }
        
        setLessons(courseLessons);
        
        // Get course progress
        const courseProgress = lessonService.getCourseProgress(courseId);
        setProgress(courseProgress);
        
        // Set current lesson based on last accessed or first lesson
        if (courseProgress.lastAccessedLessonId) {
          const lastLesson = courseLessons.find(
            lesson => lesson.id === courseProgress.lastAccessedLessonId
          );
          setCurrentLesson(lastLesson || courseLessons[0] || null);
        } else if (courseLessons.length > 0) {
          setCurrentLesson(courseLessons[0]);
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error loading course and lessons:', err);
        setError('Failed to load course content');
        setLoading(false);
      }
    };

    loadCourseAndLessons();
  }, [courseId]);

  // Handle lesson selection
  const handleLessonSelect = (lesson: Lesson) => {
    setCurrentLesson(lesson);
    
    // Update progress to track last accessed lesson
    if (progress && courseId) {
      const updatedProgress = { 
        ...progress, 
        lastAccessedLessonId: lesson.id 
      };
      lessonService.saveCourseProgress(courseId, updatedProgress);
      setProgress(updatedProgress);
    }
  };

  // Mark lesson as completed
  const handleMarkAsCompleted = () => {
    if (!courseId || !currentLesson) return;
    
    const updatedProgress = lessonService.markLessonAsCompleted(
      courseId, 
      currentLesson.id
    );
    
    setProgress(updatedProgress);
    
    // Refresh lessons to update completion status
    setLessons(lessonService.getLessons(courseId));
    
    // Move to next lesson if available
    const nextLesson = lessonService.getNextLesson(courseId, currentLesson.id);
    if (nextLesson) {
      setCurrentLesson(nextLesson);
    }
  };

  // Navigate to next lesson
  const handleNextLesson = () => {
    if (!courseId || !currentLesson) return;
    
    const nextLesson = lessonService.getNextLesson(courseId, currentLesson.id);
    if (nextLesson) {
      setCurrentLesson(nextLesson);
      
      // Update progress to track last accessed lesson
      if (progress) {
        const updatedProgress = { 
          ...progress, 
          lastAccessedLessonId: nextLesson.id 
        };
        lessonService.saveCourseProgress(courseId, updatedProgress);
        setProgress(updatedProgress);
      }
    }
  };

  // Navigate to previous lesson
  const handlePreviousLesson = () => {
    if (!courseId || !currentLesson) return;
    
    const prevLesson = lessonService.getPreviousLesson(courseId, currentLesson.id);
    if (prevLesson) {
      setCurrentLesson(prevLesson);
      
      // Update progress to track last accessed lesson
      if (progress) {
        const updatedProgress = { 
          ...progress, 
          lastAccessedLessonId: prevLesson.id 
        };
        lessonService.saveCourseProgress(courseId, updatedProgress);
        setProgress(updatedProgress);
      }
    }
  };

  // Reset course progress
  const handleResetProgress = () => {
    if (!courseId) return;
    
    const resetProgress = lessonService.resetCourseProgress(courseId);
    setProgress(resetProgress);
    
    // Refresh lessons to update completion status
    setLessons(lessonService.getLessons(courseId));
    
    // Set current lesson to first lesson
    if (lessons.length > 0) {
      setCurrentLesson(lessons[0]);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative m-4">
        <strong className="font-bold">Error: </strong>
        <span className="block sm:inline">{error}</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-100">
      {/* Sidebar with lesson list */}
      <div className="w-full md:w-1/4 bg-white p-4 shadow-md overflow-y-auto">
        <div className="mb-4">
          <h2 className="text-xl font-bold">{course?.title}</h2>
          {progress && (
            <div className="mt-2">
              <div className="text-sm text-gray-600">
                Progress: {progress.overallProgress}%
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1">
                <div 
                  className="bg-blue-600 h-2.5 rounded-full" 
                  style={{ width: `${progress.overallProgress}%` }}
                ></div>
              </div>
            </div>
          )}
        </div>
        
        <div className="mb-4">
          <button 
            onClick={() => navigate(`/courses/${courseId}`)}
            className="text-blue-600 hover:text-blue-800 text-sm flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Course
          </button>
        </div>
        
        <h3 className="font-semibold text-lg mb-2">Lessons</h3>
        <ul className="space-y-2">
          {lessons.map((lesson) => (
            <li 
              key={lesson.id}
              className={`
                p-2 rounded cursor-pointer
                ${currentLesson?.id === lesson.id ? 'bg-blue-100' : 'hover:bg-gray-100'}
                ${lesson.completed ? 'border-l-4 border-green-500' : ''}
              `}
              onClick={() => handleLessonSelect(lesson)}
            >
              <div className="flex items-center">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center mr-2 ${
                  lesson.completed 
                    ? 'bg-green-500 text-white' 
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {lesson.completed ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    lesson.order
                  )}
                </div>
                <div>
                  <div className="font-medium">{lesson.title}</div>
                  <div className="text-xs text-gray-500">{lesson.duration}</div>
                </div>
              </div>
            </li>
          ))}
        </ul>
        
        <button
          onClick={handleResetProgress}
          className="mt-6 text-sm text-red-600 hover:text-red-800"
        >
          Reset Progress
        </button>
      </div>
      
      {/* Main content area */}
      <div className="flex-1 p-4 md:p-8">
        {currentLesson ? (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h1 className="text-2xl font-bold mb-2">{currentLesson.title}</h1>
            <div className="text-sm text-gray-500 mb-4">
              {currentLesson.duration} • Lesson {currentLesson.order} of {lessons.length}
            </div>
            
            <div className="mb-6">
              <p className="text-gray-700 font-medium mb-2">{currentLesson.description}</p>
              <div className="prose max-w-none">
                {/* Render lesson content - could be HTML or markdown */}
                <div dangerouslySetInnerHTML={{ __html: currentLesson.content }} />
              </div>
            </div>
            
            {/* Resources section if available */}
            {currentLesson.resources && currentLesson.resources.length > 0 && (
              <div className="mt-8 border-t pt-4">
                <h3 className="font-semibold text-lg mb-2">Resources</h3>
                <ul className="space-y-2">
                  {currentLesson.resources.map((resource) => (
                    <li key={resource.id}>
                      <a 
                        href={resource.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 flex items-center"
                      >
                        {resource.type === 'pdf' && (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                          </svg>
                        )}
                        {resource.type === 'video' && (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        )}
                        {resource.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {/* Navigation buttons */}
            <div className="mt-8 flex justify-between">
              <button
                onClick={handlePreviousLesson}
                disabled={currentLesson.order === 1}
                className={`
                  px-4 py-2 rounded flex items-center
                  ${currentLesson.order === 1 
                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                    : 'bg-gray-200 text-gray-800 hover:bg-gray-300'}
                `}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Previous
              </button>
              
              {currentLesson.completed ? (
                <button
                  onClick={handleNextLesson}
                  disabled={currentLesson.order === lessons.length}
                  className={`
                    px-4 py-2 rounded flex items-center
                    ${currentLesson.order === lessons.length 
                      ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                      : 'bg-blue-600 text-white hover:bg-blue-700'}
                  `}
                >
                  Next
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              ) : (
                <button
                  onClick={handleMarkAsCompleted}
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 flex items-center"
                >
                  Mark as Completed
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <p className="text-gray-600">Select a lesson to begin</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseLessons;