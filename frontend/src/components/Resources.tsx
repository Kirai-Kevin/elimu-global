import { useState } from 'react';
import { motion } from 'framer-motion';
import { Book, Video, FileText, Download, Star } from 'react-feather';

interface Resource {
  id: string;
  title: string;
  type: 'book' | 'video' | 'document';
  subject: string;
  description: string;
  downloadUrl: string;
  rating: number;
}

function Resources() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [resources] = useState<Resource[]>([
    {
      id: '1',
      title: 'Mathematics Fundamentals',
      type: 'book',
      subject: 'Mathematics',
      description: 'A comprehensive guide to basic mathematical concepts',
      downloadUrl: '#',
      rating: 4.5,
    },
    {
      id: '2',
      title: 'Physics Lab Experiments',
      type: 'video',
      subject: 'Physics',
      description: 'Video demonstrations of key physics experiments',
      downloadUrl: '#',
      rating: 4.8,
    },
    {
      id: '3',
      title: 'Chemistry Study Notes',
      type: 'document',
      subject: 'Chemistry',
      description: 'Detailed notes covering all major chemistry topics',
      downloadUrl: '#',
      rating: 4.2,
    },
  ]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 10,
      },
    },
  };

  const filteredResources = resources.filter((resource) => {
    const matchesSearch = resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType === 'all' || resource.type === selectedType;
    return matchesSearch && matchesType;
  });

  const getResourceIcon = (type: Resource['type']) => {
    switch (type) {
      case 'book':
        return <Book className="w-6 h-6" />;
      case 'video':
        return <Video className="w-6 h-6" />;
      case 'document':
        return <FileText className="w-6 h-6" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <motion.div
        className="container mx-auto px-4 py-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header with Illustration */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-8 bg-white rounded-xl p-6 shadow-lg">
          <div className="md:w-1/2 mb-6 md:mb-0">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">Learning Resources</h1>
            <p className="text-gray-600">
              Access study materials, videos, and documents to enhance your learning experience.
            </p>
          </div>
          <div className="md:w-1/2 flex justify-center">
            <img
              src="/images/resources-illustration.svg"
              alt="Resources Illustration"
              className="w-full max-w-md h-auto"
            />
          </div>
        </div>

        {/* Search and Filters */}
        <motion.div
          variants={itemVariants}
          className="bg-white rounded-xl shadow-md p-6 mb-6"
        >
          <div className="flex flex-col md:flex-row md:items-center md:space-x-4 space-y-4 md:space-y-0">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search resources..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setSelectedType('all')}
                className={`px-4 py-2 rounded-lg ${
                  selectedType === 'all'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setSelectedType('book')}
                className={`px-4 py-2 rounded-lg ${
                  selectedType === 'book'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Books
              </button>
              <button
                onClick={() => setSelectedType('video')}
                className={`px-4 py-2 rounded-lg ${
                  selectedType === 'video'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Videos
              </button>
              <button
                onClick={() => setSelectedType('document')}
                className={`px-4 py-2 rounded-lg ${
                  selectedType === 'document'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Documents
              </button>
            </div>
          </div>
        </motion.div>

        {/* Resources Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredResources.map((resource) => (
            <motion.div
              key={resource.id}
              variants={itemVariants}
              className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                    {getResourceIcon(resource.type)}
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">{resource.title}</h3>
                    <p className="text-sm text-gray-500">{resource.subject}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Star className="w-4 h-4 text-yellow-400" />
                  <span className="ml-1 text-sm text-gray-600">{resource.rating}</span>
                </div>
              </div>
              <p className="text-gray-600 mb-4">{resource.description}</p>
              <div className="flex justify-end">
                <a
                  href={resource.downloadUrl}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </a>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {filteredResources.length === 0 && (
          <motion.div
            variants={itemVariants}
            className="text-center py-12"
          >
            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900">No resources found</h3>
            <p className="text-gray-500">Try adjusting your search or filter criteria</p>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}

export default Resources;
