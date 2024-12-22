import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import PageContainer from './PageContainer';
import Card from './Card';

interface Instructor {
  id: number;
  name: string;
  subjects: string[];
  rating: number;
}

function SelectInstructor() {
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<string>('');

  useEffect(() => {
    const fetchInstructors = async () => {
      const mockInstructors: Instructor[] = [
        { id: 1, name: 'John Doe', subjects: ['Math', 'Physics'], rating: 4.8 },
        { id: 2, name: 'Jane Smith', subjects: ['English', 'Literature'], rating: 4.6 },
        { id: 3, name: 'Bob Johnson', subjects: ['History', 'Geography'], rating: 4.7 },
      ];
      setInstructors(mockInstructors);
    };

    fetchInstructors();
  }, []);

  const filteredInstructors = selectedSubject
    ? instructors.filter(instructor => instructor.subjects.includes(selectedSubject))
    : instructors;

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
        <h2 className="text-2xl font-bold text-blue-600">Select an Instructor</h2>
        
        <Card>
          <div className="p-6">
            <label htmlFor="subject" className="block text-xl font-semibold text-blue-500 mb-4">Filter by Subject</label>
            <select
              id="subject"
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="w-full px-4 py-3 text-gray-600 border-2 border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200"
            >
              <option value="">All Subjects</option>
              <option value="Math">Math</option>
              <option value="Physics">Physics</option>
              <option value="English">English</option>
              <option value="Literature">Literature</option>
              <option value="History">History</option>
              <option value="Geography">Geography</option>
            </select>
          </div>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredInstructors.map((instructor) => (
            <motion.div key={instructor.id} variants={itemVariants}>
              <Card>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-blue-500 mb-4">{instructor.name}</h3>
                  <div className="space-y-3">
                    <p className="text-gray-600">
                      {instructor.subjects.join(' • ')}
                    </p>
                    <div className="flex items-center">
                      <span className="text-yellow-400 text-xl">★</span>
                      <span className="ml-2 text-gray-600">{instructor.rating}</span>
                    </div>
                  </div>
                  <motion.button
                    className="mt-6 w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold rounded-xl transition-all duration-200"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Select Instructor
                  </motion.button>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </PageContainer>
  );
}

export default SelectInstructor;

