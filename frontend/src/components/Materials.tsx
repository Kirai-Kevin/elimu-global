import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Book, Video, FileText, Headphones, Download, Star, Filter, Plus, ChevronRight, ExternalLink } from 'lucide-react';

interface Material {
  id: number;
  title: string;
  type: 'book' | 'video' | 'document' | 'audio';
  subject: string;
  description: string;
  author: string;
  uploadDate: string;
  size: string;
  duration?: string;
  format: string;
  downloads: number;
  rating: number;
  thumbnail?: string;
  featured?: boolean;
}

function Materials() {
  const [materials, setMaterials] = useState<Material[]>([
    {
      id: 1,
      title: 'Advanced Mathematics Textbook',
      type: 'book',
      subject: 'Mathematics',
      description: 'Comprehensive guide covering calculus, algebra, and trigonometry with practice problems.',
      author: 'Dr. Sarah Johnson',
      uploadDate: '2024-12-15',
      size: '25.4 MB',
      format: 'PDF',
      downloads: 1250,
      rating: 4.8,
      thumbnail: '/images/math-textbook.jpg',
      featured: true
    },
    {
      id: 2,
      title: 'Chemistry Lab Techniques',
      type: 'video',
      subject: 'Chemistry',
      description: 'Video series demonstrating essential laboratory procedures and safety protocols.',
      author: 'Prof. Michael Chen',
      uploadDate: '2024-12-18',
      size: '450 MB',
      duration: '45:30',
      format: 'MP4',
      downloads: 856,
      rating: 4.9
    },
    {
      id: 3,
      title: 'World History Notes',
      type: 'document',
      subject: 'History',
      description: 'Detailed notes covering major historical events and their impact on modern society.',
      author: 'Dr. Emily Williams',
      uploadDate: '2024-12-20',
      size: '8.2 MB',
      format: 'PDF',
      downloads: 2100,
      rating: 4.7
    },
    {
      id: 4,
      title: 'English Literature Audiobook',
      type: 'audio',
      subject: 'English',
      description: 'Audio narration of classic literature with expert commentary.',
      author: 'James Anderson',
      uploadDate: '2024-12-21',
      size: '180 MB',
      duration: '2:15:00',
      format: 'MP3',
      downloads: 645,
      rating: 4.6
    }
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('date');

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

  const getTypeIcon = (type: Material['type']) => {
    switch (type) {
      case 'book': return <Book className="w-6 h-6" />;
      case 'video': return <Video className="w-6 h-6" />;
      case 'document': return <FileText className="w-6 h-6" />;
      case 'audio': return <Headphones className="w-6 h-6" />;
      default: return null;
    }
  };

  const getTypeColor = (type: Material['type']) => {
    switch (type) {
      case 'book': return 'bg-blue-100 text-blue-600';
      case 'video': return 'bg-green-100 text-green-600';
      case 'document': return 'bg-purple-100 text-purple-600';
      case 'audio': return 'bg-orange-100 text-orange-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const filteredMaterials = materials
    .filter(material => {
      if (selectedSubject !== 'all' && material.subject !== selectedSubject) return false;
      if (selectedType !== 'all' && material.type !== selectedType) return false;
      return material.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
             material.description.toLowerCase().includes(searchQuery.toLowerCase());
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'downloads':
          return b.downloads - a.downloads;
        case 'rating':
          return b.rating - a.rating;
        case 'date':
        default:
          return new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime();
      }
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
            <h1 className="text-3xl font-bold text-gray-800 mb-4">Learning Materials</h1>
            <p className="text-gray-600 mb-6">
              Access a comprehensive collection of educational resources including textbooks,
              video lectures, study notes, and audio materials.
            </p>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center bg-blue-50 px-4 py-2 rounded-lg">
                <Book className="w-5 h-5 text-blue-600 mr-2" />
                <span className="text-blue-600">Books</span>
              </div>
              <div className="flex items-center bg-green-50 px-4 py-2 rounded-lg">
                <Video className="w-5 h-5 text-green-600 mr-2" />
                <span className="text-green-600">Videos</span>
              </div>
              <div className="flex items-center bg-purple-50 px-4 py-2 rounded-lg">
                <FileText className="w-5 h-5 text-purple-600 mr-2" />
                <span className="text-purple-600">Documents</span>
              </div>
              <div className="flex items-center bg-orange-50 px-4 py-2 rounded-lg">
                <Headphones className="w-5 h-5 text-orange-600 mr-2" />
                <span className="text-orange-600">Audio</span>
              </div>
            </div>
          </div>
          <div className="md:w-1/2 flex justify-center">
            <img
              src="/images/materials-illustration.svg"
              alt="Materials Illustration"
              className="w-full max-w-md h-auto"
            />
          </div>
        </div>

        {/* Search and Filters */}
        <motion.div variants={itemVariants} className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="grid md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search materials..."
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
              <option value="Chemistry">Chemistry</option>
              <option value="Physics">Physics</option>
              <option value="Biology">Biology</option>
              <option value="History">History</option>
              <option value="English">English</option>
            </select>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-transparent"
            >
              <option value="all">All Types</option>
              <option value="book">Books</option>
              <option value="video">Videos</option>
              <option value="document">Documents</option>
              <option value="audio">Audio</option>
            </select>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-transparent"
            >
              <option value="date">Latest</option>
              <option value="downloads">Most Downloaded</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>
        </motion.div>

        {/* Featured Materials */}
        {materials.some(m => m.featured) && (
          <motion.div variants={itemVariants} className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Featured Materials</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {materials.filter(m => m.featured).map((material) => (
                <div
                  key={material.id}
                  className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="md:flex">
                    {material.thumbnail && (
                      <div className="md:flex-shrink-0">
                        <img
                          className="h-48 w-full md:w-48 object-cover"
                          src={material.thumbnail}
                          alt={material.title}
                        />
                      </div>
                    )}
                    <div className="p-6">
                      <div className="flex items-center mb-2">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getTypeColor(material.type)}`}>
                          {material.type.charAt(0).toUpperCase() + material.type.slice(1)}
                        </span>
                      </div>
                      <h3 className="text-xl font-semibold text-gray-800 mb-2">{material.title}</h3>
                      <p className="text-gray-600 mb-4">{material.description}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Star className="w-5 h-5 text-yellow-400 fill-current" />
                          <span className="ml-1 text-gray-600">{material.rating}</span>
                        </div>
                        <button className="flex items-center text-blue-600 hover:text-blue-700">
                          Learn More
                          <ChevronRight className="w-4 h-4 ml-1" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Materials Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMaterials.map((material) => (
            <motion.div
              key={material.id}
              variants={itemVariants}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className={`p-3 rounded-lg ${getTypeColor(material.type)}`}>
                    {getTypeIcon(material.type)}
                  </div>
                  <div className="flex items-center">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="ml-1 text-sm text-gray-600">{material.rating}</span>
                  </div>
                </div>

                <h3 className="text-lg font-semibold text-gray-800 mb-2">{material.title}</h3>
                <p className="text-gray-600 text-sm mb-4">{material.description}</p>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-500">
                    <span className="font-medium mr-2">Author:</span>
                    {material.author}
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <span className="font-medium mr-2">Format:</span>
                    {material.format}
                  </div>
                  {material.duration && (
                    <div className="flex items-center text-sm text-gray-500">
                      <span className="font-medium mr-2">Duration:</span>
                      {material.duration}
                    </div>
                  )}
                  <div className="flex items-center text-sm text-gray-500">
                    <span className="font-medium mr-2">Size:</span>
                    {material.size}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="text-sm text-gray-500">
                    <Download className="w-4 h-4 inline mr-1" />
                    {material.downloads} downloads
                  </div>
                  <div className="flex gap-2">
                    <button className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors">
                      Preview
                    </button>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center">
                      <Download className="w-4 h-4 mr-1" />
                      Download
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Add Material Button */}
        <motion.button
          className="fixed bottom-8 right-8 bg-blue-500 text-white p-4 rounded-full shadow-lg hover:bg-blue-600 transition-colors"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <Plus className="w-6 h-6" />
        </motion.button>
      </motion.div>
    </div>
  );
}

export default Materials;
