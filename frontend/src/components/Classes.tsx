import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import PageContainer from './PageContainer';
import Card from './Card';

interface Class {
  id: number;
  title: string;
  instructor: string;
  date: string;
  time: string;
  zoomLink: string;
}

function Classes() {
  const [classes, setClasses] = useState<Class[]>([]);

  useEffect(() => {
    const fetchClasses = async () => {
      const mockClasses: Class[] = [
        { id: 1, title: 'Advanced Algebra', instructor: 'John Doe', date: '2023-06-15', time: '10:00 AM', zoomLink: 'https://zoom.us/j/123456789' },
        { id: 2, title: 'World Literature', instructor: 'Jane Smith', date: '2023-06-16', time: '2:00 PM', zoomLink: 'https://zoom.us/j/987654321' },
        { id: 3, title: 'Biology Lab', instructor: 'Bob Johnson', date: '2023-06-17', time: '11:00 AM', zoomLink: 'https://zoom.us/j/456789123' },
      ];
      setClasses(mockClasses);
    };

    fetchClasses();
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
        className="space-y-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <h2 className="text-2xl font-bold text-blue-600">Upcoming Classes</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {classes.map((classItem) => (
            <motion.div key={classItem.id} variants={itemVariants}>
              <Card>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-blue-500 mb-4">{classItem.title}</h3>
                  <div className="space-y-3">
                    <div className="flex items-center text-gray-600">
                      <span className="font-medium w-24">Instructor:</span>
                      <span>{classItem.instructor}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <span className="font-medium w-24">Date:</span>
                      <span>{classItem.date}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <span className="font-medium w-24">Time:</span>
                      <span>{classItem.time}</span>
                    </div>
                  </div>
                  <motion.a
                    href={classItem.zoomLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-6 inline-block w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white text-center font-semibold rounded-xl transition-all duration-200"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Join Class
                  </motion.a>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </PageContainer>
  );
}

export default Classes;

