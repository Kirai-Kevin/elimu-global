import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Video, FileText, Clock, Star, Search, Filter, Play, Download, ChevronRight, Users } from 'lucide-react';

interface Lesson {
  id: number;
  title: string;
  subject: string;
  instructor: {
    name: string;
    image: string;
    rating: number;
  };
  duration: number;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  description: string;
  topics: string[];
  type: 'video' | 'interactive' | 'reading';
  progress: number;
  resources: {
    name: string;
    type: string;
    size: string;
  }[];
  nextLesson?: {
    id: number;
    title: string;
  };
}

function Lessons() {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [selectedLevel, setSelectedLevel] = useState<string>('all');

  useEffect(() => {
    // Simulated lessons data
    const mockLessons: Lesson[] = [
      {
        id: 1,
        title: 'Introduction to Calculus',
        subject: 'Mathematics',
        instructor: {
          name: 'Dr. John Smith',
          image: '/images/instructor1.jpg',
          rating: 4.8
        },
        duration: 45,
        level: 'Intermediate',
        description: 'Learn the fundamentals of calculus including limits, derivatives, and basic integration.',
        topics: ['Limits', 'Derivatives', 'Integration'],
        type: 'video',
        progress: 75,
        resources: [
          { name: 'Lecture Notes', type: 'pdf', size: '2.3 MB' },
          { name: 'Practice Problems', type: 'pdf', size: '1.1 MB' }
        ],
        nextLesson: {
          id: 2,
          title: 'Understanding Derivatives'
        }
      },
      {
        id: 2,
        title: 'Chemical Bonding',
        subject: 'Chemistry',
        instructor: {
          name: 'Prof. Sarah Johnson',
          image: '/images/instructor2.jpg',
          rating: 4.9
        },
        duration: 60,
        level: 'Beginner',
        description: 'Explore different types of chemical bonds and their properties.',
        topics: ['Ionic Bonds', 'Covalent Bonds', 'Metallic Bonds'],
        type: 'interactive',
        progress: 30,
        resources: [
          { name: 'Interactive Models', type: 'html', size: '5.2 MB' },
          { name: 'Study Guide', type: 'pdf', size: '1.8 MB' }
        ]
      },
      {
        id: 3,
        title: 'Shakespeare\'s Macbeth',
        subject: 'English Literature',
        instructor: {
          name: 'Dr. Emily Davis',
          image: '/images/instructor3.jpg',
          rating: 4.7
        },
        duration: 55,
        level: 'Advanced',
        description: 'Analysis of themes, characters, and symbolism in Macbeth.',
        topics: ['Themes', 'Character Analysis', 'Symbolism'],
        type: 'reading',
        progress: 90,
        resources: [
          { name: 'Full Text', type: 'pdf', size: '3.1 MB' },
          { name: 'Analysis Guide', type: 'pdf', size: '2.4 MB' }
        ]
      },
      {
        id: 4,
        title: 'Forces and Motion',
        subject: 'Physics',
        instructor: {
          name: 'Dr. Michael Brown',
          image: '/images/instructor4.jpg',
          rating: 4.6
        },
        duration: 50,
        level: 'Beginner',
        description: 'Understanding Newton\'s laws of motion and their applications.',
        topics: ['Newton\'s Laws', 'Force Diagrams', 'Applications'],
        type: 'video',
        progress: 15,
        resources: [
          { name: 'Simulation Software', type: 'exe', size: '15.6 MB' },
          { name: 'Problem Set', type: 'pdf', size: '1.2 MB' }
        ]
      }
    ];

    setLessons(mockLessons);
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

  const getLevelColor = (level: Lesson['level']) => {
    switch (level) {
      case 'Beginner': return 'bg-green-100 text-green-800';
      case 'Intermediate': return 'bg-blue-100 text-blue-800';
      case 'Advanced': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: Lesson['type']) => {
    switch (type) {
      case 'video': return <Video className="w-5 h-5 text-blue-500" />;
      case 'interactive': return <Users className="w-5 h-5 text-green-500" />;
      case 'reading': return <BookOpen className="w-5 h-5 text-purple-500" />;
      default: return <FileText className="w-5 h-5 text-gray-500" />;
    }
  };

  const filteredLessons = lessons
    .filter(lesson => {
      if (selectedSubject !== 'all' && lesson.subject !== selectedSubject) return false;
      if (selectedLevel !== 'all' && lesson.level !== selectedLevel) return false;
      return lesson.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
             lesson.description.toLowerCase().includes(searchQuery.toLowerCase());
    });

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
            <h1 className="text-3xl font-bold text-gray-800 mb-4">Your Lessons</h1>
            <p className="text-gray-600 mb-6">
              Explore interactive lessons, video tutorials, and comprehensive study materials.
              Learn at your own pace with our expert-led content.
            </p>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center bg-blue-50 px-4 py-2 rounded-lg">
                <Video className="w-5 h-5 text-blue-600 mr-2" />
                <span className="text-blue-600">Video Lessons</span>
              </div>
              <div className="flex items-center bg-green-50 px-4 py-2 rounded-lg">
                <Users className="w-5 h-5 text-green-600 mr-2" />
                <span className="text-green-600">Interactive</span>
              </div>
              <div className="flex items-center bg-purple-50 px-4 py-2 rounded-lg">
                <BookOpen className="w-5 h-5 text-purple-600 mr-2" />
                <span className="text-purple-600">Reading</span>
              </div>
            </div>
          </div>
          <div className="md:w-1/2 flex justify-center">
            <img
              src="/images/lessons-illustration.svg"
              alt="Lessons Illustration"
              className="w-full max-w-md h-auto"
            />
          </div>
        </div>

        {/* Filters and Search */}
        <motion.div variants={itemVariants} className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="grid md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search lessons..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-transparent"
              />
            </div>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-transparent"
            >
              <option value="all">All Subjects</option>
              <option value="Mathematics">Mathematics</option>
              <option value="Physics">Physics</option>
              <option value="Chemistry">Chemistry</option>
              <option value="English Literature">English Literature</option>
            </select>
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-transparent"
            >
              <option value="all">All Levels</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>
        </motion.div>

        {/* Lessons Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredLessons.map((lesson) => (
            <motion.div
              key={lesson.id}
              variants={itemVariants}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800">{lesson.title}</h3>
                    <p className="text-gray-600">{lesson.subject}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getLevelColor(lesson.level)}`}>
                    {lesson.level}
                  </span>
                </div>

                <div className="flex items-center mb-4">
                  <img
                    src={lesson.instructor.image}
                    alt={lesson.instructor.name}
                    className="w-10 h-10 rounded-full mr-3"
                  />
                  <div>
                    <p className="font-medium text-gray-800">{lesson.instructor.name}</p>
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="ml-1 text-sm text-gray-600">{lesson.instructor.rating}</span>
                    </div>
                  </div>
                </div>

                <p className="text-gray-600 mb-4">{lesson.description}</p>

                <div className="space-y-3 mb-4">
                  <div className="flex items-center text-gray-600">
                    {getTypeIcon(lesson.type)}
                    <span className="ml-2 capitalize">{lesson.type} Lesson</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Clock className="w-5 h-5 mr-2 text-gray-500" />
                    <span>{lesson.duration} minutes</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  {lesson.topics.map((topic, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm"
                    >
                      {topic}
                    </span>
                  ))}
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Progress</span>
                    <span>{lesson.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${lesson.progress}%` }}
                    />
                  </div>
                </div>

                {/* Resources */}
                <div className="space-y-2 mb-4">
                  <h4 className="font-medium text-gray-800">Resources</h4>
                  {lesson.resources.map((resource, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-2 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center">
                        <FileText className="w-4 h-4 text-gray-500 mr-2" />
                        <span className="text-sm text-gray-600">{resource.name}</span>
                      </div>
                      <button className="flex items-center text-blue-600 hover:text-blue-700">
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between items-center">
                  <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center">
                    <Play className="w-4 h-4 mr-2" />
                    Continue Learning
                  </button>
                  {lesson.nextLesson && (
                    <button className="flex items-center text-gray-600 hover:text-gray-800">
                      <span className="mr-2">Next: {lesson.nextLesson.title}</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

export default Lessons;
