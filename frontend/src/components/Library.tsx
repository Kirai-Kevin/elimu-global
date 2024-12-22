import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import PageContainer from './PageContainer';

interface LibraryItem {
  id: number;
  title: string;
  author: string;
  type: 'eBook' | 'Article' | 'Video' | 'Research Paper';
  subject: string;
  url: string;
}

function Library() {
  const [libraryItems, setLibraryItems] = useState<LibraryItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Simulating API call to fetch library items
    const fetchLibraryItems = async () => {
      // In a real application, this would be an API call
      const mockLibraryItems: LibraryItem[] = [
        { id: 1, title: 'Introduction to Calculus', author: 'John Smith', type: 'eBook', subject: 'Math', url: '/library/calculus_intro.pdf' },
        { id: 2, title: 'The Impact of Climate Change', author: 'Jane Doe', type: 'Article', subject: 'Environmental Science', url: '/library/climate_change_impact.html' },
        { id: 3, title: 'Understanding Quantum Physics', author: 'Albert Einstein', type: 'Video', subject: 'Physics', url: '/library/quantum_physics.mp4' },
        { id: 4, title: 'Advancements in Machine Learning', author: 'Alan Turing', type: 'Research Paper', subject: 'Computer Science', url: '/library/machine_learning_advancements.pdf' },
      ];
      setLibraryItems(mockLibraryItems);
    };

    fetchLibraryItems();
  }, []);

  const filteredItems = libraryItems.filter(item =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getIcon = (type: LibraryItem['type']) => {
    switch (type) {
      case 'eBook':
        return '📚';
      case 'Article':
        return '📰';
      case 'Video':
        return '🎥';
      case 'Research Paper':
        return '📄';
    }
  };

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
        <h2 className="text-2xl font-semibold mb-6 text-blue-600">Library</h2>
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search by title, author, or subject"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredItems.map((item) => (
            <motion.div key={item.id} variants={itemVariants}>
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center mb-4">
                  <span className="text-2xl mr-2">{getIcon(item.type)}</span>
                  <h3 className="text-lg font-semibold text-blue-800">{item.title}</h3>
                </div>
                <p className="text-sm text-gray-600 mb-2">Author: {item.author}</p>
                <p className="text-sm text-gray-600 mb-2">Type: {item.type}</p>
                <p className="text-sm text-gray-600 mb-4">Subject: {item.subject}</p>
                <motion.a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors inline-block"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  View
                </motion.a>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </PageContainer>
  );
}

export default Library;

