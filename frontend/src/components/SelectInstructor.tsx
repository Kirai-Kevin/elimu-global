import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star, Search, BookOpen, Clock, Award, Users } from 'lucide-react';

interface Instructor {
  id: number;
  name: string;
  subjects: string[];
  rating: number;
  experience: string;
  students: number;
  availability: string;
  imageUrl: string;
}

function SelectInstructor() {
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    const fetchInstructors = async () => {
      const mockInstructors: Instructor[] = [
        {
          id: 1,
          name: 'Dr. John Doe',
          subjects: ['Mathematics', 'Physics'],
          rating: 4.8,
          experience: '8 years',
          students: 120,
          availability: 'Weekdays',
          imageUrl: '/images/instructor1.jpg'
        },
        {
          id: 2,
          name: 'Prof. Jane Smith',
          subjects: ['English', 'Literature'],
          rating: 4.6,
          experience: '10 years',
          students: 150,
          availability: 'Flexible',
          imageUrl: '/images/instructor2.jpg'
        },
        {
          id: 3,
          name: 'Dr. Bob Johnson',
          subjects: ['History', 'Geography'],
          rating: 4.7,
          experience: '6 years',
          students: 90,
          availability: 'Evenings',
          imageUrl: '/images/instructor3.jpg'
        },
        {
          id: 4,
          name: 'Dr. Sarah Wilson',
          subjects: ['Biology', 'Chemistry'],
          rating: 4.9,
          experience: '12 years',
          students: 200,
          availability: 'Weekends',
          imageUrl: '/images/instructor4.jpg'
        },
        {
          id: 5,
          name: 'Prof. Michael Brown',
          subjects: ['Computer Science', 'Mathematics'],
          rating: 4.7,
          experience: '9 years',
          students: 130,
          availability: 'Flexible',
          imageUrl: '/images/instructor5.jpg'
        },
        {
          id: 6,
          name: 'Dr. Emily Davis',
          subjects: ['Physics', 'Chemistry'],
          rating: 4.8,
          experience: '7 years',
          students: 110,
          availability: 'Weekdays',
          imageUrl: '/images/instructor6.jpg'
        },
      ];
      setInstructors(mockInstructors);
    };

    fetchInstructors();
  }, []);

  const filteredInstructors = instructors.filter(instructor => {
    const matchesSubject = selectedSubject ? instructor.subjects.includes(selectedSubject) : true;
    const matchesSearch = searchQuery
      ? instructor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        instructor.subjects.some(subject => subject.toLowerCase().includes(searchQuery.toLowerCase()))
      : true;
    return matchesSubject && matchesSearch;
  });

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
    <div className="min-h-screen w-full bg-gray-50">
      <motion.div
        className="w-full px-4 py-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header with Illustration */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-8 bg-white rounded-xl p-6 shadow-lg">
          <div className="md:w-1/2 mb-6 md:mb-0">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">Find Your Perfect Instructor</h1>
            <p className="text-gray-600 mb-6">
              Connect with experienced educators who will guide you through your learning journey.
              Our instructors are carefully selected to ensure the highest quality of education.
            </p>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center bg-blue-50 px-4 py-2 rounded-lg">
                <Award className="w-5 h-5 text-blue-600 mr-2" />
                <span className="text-blue-600">Certified Teachers</span>
              </div>
              <div className="flex items-center bg-green-50 px-4 py-2 rounded-lg">
                <Clock className="w-5 h-5 text-green-600 mr-2" />
                <span className="text-green-600">Flexible Schedule</span>
              </div>
              <div className="flex items-center bg-purple-50 px-4 py-2 rounded-lg">
                <Users className="w-5 h-5 text-purple-600 mr-2" />
                <span className="text-purple-600">1-on-1 Sessions</span>
              </div>
            </div>
          </div>
          <div className="md:w-1/2 flex justify-center">
            <img
              src="/images/instructor-illustration.svg"
              alt="Instructor Illustration"
              className="w-full max-w-md h-auto"
            />
          </div>
        </div>

        {/* Search and Filter Section */}
        <motion.div variants={itemVariants} className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name or subject..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-transparent"
              />
            </div>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-transparent"
            >
              <option value="">All Subjects</option>
              <option value="Mathematics">Mathematics</option>
              <option value="Physics">Physics</option>
              <option value="English">English</option>
              <option value="Literature">Literature</option>
              <option value="History">History</option>
              <option value="Geography">Geography</option>
              <option value="Biology">Biology</option>
              <option value="Chemistry">Chemistry</option>
              <option value="Computer Science">Computer Science</option>
            </select>
          </div>
        </motion.div>

        {/* Instructors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredInstructors.map((instructor) => (
            <motion.div
              key={instructor.id}
              variants={itemVariants}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="relative h-48 bg-gradient-to-r from-blue-500 to-blue-600">
                <div className="absolute inset-0 flex items-center justify-center">
                  <img
                    src={instructor.imageUrl}
                    alt={instructor.name}
                    className="w-32 h-32 rounded-full border-4 border-white shadow-lg"
                  />
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{instructor.name}</h3>
                <div className="flex items-center mb-4">
                  <Star className="w-5 h-5 text-yellow-400 fill-current" />
                  <span className="ml-2 text-gray-600">{instructor.rating}</span>
                  <span className="mx-2 text-gray-300">•</span>
                  <Clock className="w-5 h-5 text-gray-400" />
                  <span className="ml-2 text-gray-600">{instructor.experience}</span>
                </div>
                <div className="space-y-3 mb-6">
                  <div className="flex items-center text-gray-600">
                    <BookOpen className="w-5 h-5 mr-2 text-blue-500" />
                    <span>{instructor.subjects.join(' • ')}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Users className="w-5 h-5 mr-2 text-green-500" />
                    <span>{instructor.students} students taught</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Clock className="w-5 h-5 mr-2 text-purple-500" />
                    <span>Available: {instructor.availability}</span>
                  </div>
                </div>
                <motion.button
                  className="w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Select Instructor
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

export default SelectInstructor;
