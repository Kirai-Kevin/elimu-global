import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Video, Users, Clock, Calendar, BookOpen, Star, Search, Filter, ChevronRight, GraduationCap, Book } from 'lucide-react';

interface Class {
  id: number;
  title: string;
  subject: string;
  instructor: {
    name: string;
    rating: number;
    image: string;
  };
  schedule: {
    day: string;
    time: string;
    duration: number;
  };
  enrolled: number;
  maxCapacity: number;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  description: string;
  topics: string[];
  nextSession: string;
  zoomLink?: string;
}

function Classes() {
  const [classes, setClasses] = useState<Class[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [selectedLevel, setSelectedLevel] = useState<string>('all');

  useEffect(() => {
    // Simulated classes data
    const mockClasses: Class[] = [
      {
        id: 1,
        title: 'Advanced Mathematics',
        subject: 'Mathematics',
        instructor: {
          name: 'Dr. John Smith',
          rating: 4.8,
          image: '/images/instructor1.jpg'
        },
        schedule: {
          day: 'Monday, Wednesday',
          time: '09:00 AM',
          duration: 60
        },
        enrolled: 15,
        maxCapacity: 20,
        level: 'Advanced',
        description: 'Deep dive into advanced mathematical concepts including calculus and linear algebra.',
        topics: ['Calculus', 'Linear Algebra', 'Differential Equations'],
        nextSession: '2024-12-23T09:00:00',
        zoomLink: 'https://zoom.us/j/123456789'
      },
      {
        id: 2,
        title: 'Introduction to Physics',
        subject: 'Physics',
        instructor: {
          name: 'Prof. Sarah Johnson',
          rating: 4.9,
          image: '/images/instructor2.jpg'
        },
        schedule: {
          day: 'Tuesday, Thursday',
          time: '11:00 AM',
          duration: 90
        },
        enrolled: 18,
        maxCapacity: 25,
        level: 'Beginner',
        description: 'Fundamental concepts of physics including mechanics and thermodynamics.',
        topics: ['Mechanics', 'Thermodynamics', 'Wave Motion'],
        nextSession: '2024-12-24T11:00:00'
      },
      {
        id: 3,
        title: 'English Literature',
        subject: 'English',
        instructor: {
          name: 'Dr. Emily Davis',
          rating: 4.7,
          image: '/images/instructor3.jpg'
        },
        schedule: {
          day: 'Wednesday, Friday',
          time: '02:00 PM',
          duration: 75
        },
        enrolled: 12,
        maxCapacity: 15,
        level: 'Intermediate',
        description: 'Analysis of classic literature and contemporary works.',
        topics: ['Classic Literature', 'Poetry', 'Literary Analysis'],
        nextSession: '2024-12-23T14:00:00'
      },
      {
        id: 4,
        title: 'Chemistry Fundamentals',
        subject: 'Chemistry',
        instructor: {
          name: 'Dr. Michael Brown',
          rating: 4.6,
          image: '/images/instructor4.jpg'
        },
        schedule: {
          day: 'Monday, Thursday',
          time: '10:00 AM',
          duration: 90
        },
        enrolled: 20,
        maxCapacity: 25,
        level: 'Beginner',
        description: 'Introduction to basic chemistry concepts and lab practices.',
        topics: ['Atomic Structure', 'Chemical Bonds', 'Reactions'],
        nextSession: '2024-12-23T10:00:00'
      }
    ];

    setClasses(mockClasses);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
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

  const filteredClasses = classes.filter(cls => {
    const matchesSearch = cls.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         cls.instructor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         cls.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSubject = selectedSubject === 'all' || cls.subject === selectedSubject;
    const matchesLevel = selectedLevel === 'all' || cls.level === selectedLevel;
    return matchesSearch && matchesSubject && matchesLevel;
  });

  const getLevelColor = (level: Class['level']) => {
    switch (level) {
      case 'Beginner': return 'bg-green-100 text-green-600';
      case 'Intermediate': return 'bg-blue-100 text-blue-600';
      case 'Advanced': return 'bg-purple-100 text-purple-600';
      default: return 'bg-gray-100 text-gray-600';
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
            <h1 className="text-3xl font-bold text-gray-800 mb-4">Your Classes</h1>
            <p className="text-gray-600 mb-6">
              Join interactive live classes with expert instructors. Learn, engage,
              and excel in your favorite subjects with our comprehensive curriculum.
            </p>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center bg-blue-50 px-4 py-2 rounded-lg">
                <Video className="w-5 h-5 text-blue-600 mr-2" />
                <span className="text-blue-600">Live Sessions</span>
              </div>
              <div className="flex items-center bg-green-50 px-4 py-2 rounded-lg">
                <Users className="w-5 h-5 text-green-600 mr-2" />
                <span className="text-green-600">Interactive Learning</span>
              </div>
              <div className="flex items-center bg-purple-50 px-4 py-2 rounded-lg">
                <Book className="w-5 h-5 text-purple-600 mr-2" />
                <span className="text-purple-600">Expert Teachers</span>
              </div>
            </div>
          </div>
          <div className="md:w-1/2 flex justify-center">
            <img
              src="/images/classes-illustration.svg"
              alt="Classes Illustration"
              className="w-full max-w-md h-auto"
            />
          </div>
        </div>

        {/* Search and Filters */}
        <motion.div variants={itemVariants} className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="grid md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search classes or instructors..."
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
              <option value="all">All Subjects</option>
              <option value="Mathematics">Mathematics</option>
              <option value="Physics">Physics</option>
              <option value="Chemistry">Chemistry</option>
              <option value="English">English</option>
            </select>
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-transparent"
            >
              <option value="all">All Levels</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>
        </motion.div>

        {/* Classes Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredClasses.map((cls) => (
            <motion.div
              key={cls.id}
              variants={itemVariants}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800">{cls.title}</h3>
                    <p className="text-gray-600">{cls.subject}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getLevelColor(cls.level)}`}>
                    {cls.level}
                  </span>
                </div>

                <div className="flex items-center mb-4">
                  <img
                    src={cls.instructor.image}
                    alt={cls.instructor.name}
                    className="w-10 h-10 rounded-full mr-3"
                  />
                  <div>
                    <p className="font-medium text-gray-800">{cls.instructor.name}</p>
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="ml-1 text-sm text-gray-600">{cls.instructor.rating}</span>
                    </div>
                  </div>
                </div>

                <p className="text-gray-600 mb-4">{cls.description}</p>

                <div className="space-y-3 mb-4">
                  <div className="flex items-center text-gray-600">
                    <Calendar className="w-5 h-5 mr-2 text-blue-500" />
                    <span>{cls.schedule.day}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Clock className="w-5 h-5 mr-2 text-green-500" />
                    <span>{cls.schedule.time} ({cls.schedule.duration} mins)</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Users className="w-5 h-5 mr-2 text-purple-500" />
                    <span>{cls.enrolled}/{cls.maxCapacity} Students</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  {cls.topics.map((topic, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm"
                    >
                      {topic}
                    </span>
                  ))}
                </div>

                {cls.zoomLink ? (
                  <a
                    href={cls.zoomLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors text-center"
                  >
                    Join Class
                  </a>
                ) : (
                  <button
                    className="w-full px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors"
                  >
                    Enroll Now
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

export default Classes;
