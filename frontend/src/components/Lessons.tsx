import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import PageContainer from './PageContainer';

interface Lesson {
  id: number;
  title: string;
  subject: string;
  progress: number;
}

function Lessons() {
  const [lessons, setLessons] = useState<Lesson[]>([]);

  useEffect(() => {
    // Simulating API call to fetch lessons
    const fetchLessons = async () => {
      // In a real application, this would be an API call
      const mockLessons: Lesson[] = [
        { id: 1, title: 'Introduction to Algebra', subject: 'Math', progress: 75 },
        { id: 2, title: 'Shakespeare\'s Plays', subject: 'English', progress: 50 },
        { id: 3, title: 'Cell Biology', subject: 'Biology', progress: 25 },
        { id: 4, title: 'World War II', subject: 'History', progress: 0 },
      ];
      setLessons(mockLessons);
    };

    fetchLessons();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100
      }
    }
  };

  return (
    <PageContainer>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <h2 className="text-2xl font-semibold mb-6 text-blue-600">Your Lessons</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {lessons.map((lesson) => (
            <motion.div key={lesson.id} variants={itemVariants}>
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold mb-2 text-blue-800">{lesson.title}</h3>
                <p className="text-sm text-gray-600 mb-4">Subject: {lesson.subject}</p>
                <div className="mb-2">
                  <div className="text-sm font-medium text-gray-500 mb-1">Progress</div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <motion.div
                      className="bg-blue-600 h-2.5 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${lesson.progress}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                    />
                  </div>
                </div>
                <p className="text-sm text-right">{lesson.progress}% Complete</p>
                <motion.button 
                  className="mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {lesson.progress === 0 ? 'Start Lesson' : 'Continue Lesson'}
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </PageContainer>
  );
}

export default Lessons;

