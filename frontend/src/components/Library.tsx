import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Book, BookOpen, Clock, Star, Heart, Share2, Download, Filter, Plus, ChevronRight, BookMarked, Bookmark } from 'lucide-react';

interface Book {
  id: number;
  title: string;
  author: string;
  coverImage: string;
  description: string;
  category: string;
  rating: number;
  reviews: number;
  pages: number;
  language: string;
  publishDate: string;
  isFavorite: boolean;
  isRecommended: boolean;
  readTime: string;
  format: string;
  isNew: boolean;
}

function Library() {
  const [books, setBooks] = useState<Book[]>([
    {
      id: 1,
      title: "The Art of Learning",
      author: "Dr. Sarah Johnson",
      coverImage: "/images/book-covers/learning.jpg",
      description: "A comprehensive guide to effective learning strategies and cognitive development.",
      category: "Education",
      rating: 4.8,
      reviews: 128,
      pages: 320,
      language: "English",
      publishDate: "2024-12-15",
      isFavorite: true,
      isRecommended: true,
      readTime: "6 hours",
      format: "PDF",
      isNew: true
    },
    {
      id: 2,
      title: "Digital Literacy in Modern Age",
      author: "Prof. Michael Chen",
      coverImage: "/images/book-covers/digital.jpg",
      description: "Explore the essential digital skills needed in today's interconnected world.",
      category: "Technology",
      rating: 4.7,
      reviews: 95,
      pages: 280,
      language: "English",
      publishDate: "2024-12-10",
      isFavorite: false,
      isRecommended: true,
      readTime: "5 hours",
      format: "EPUB",
      isNew: true
    },
    {
      id: 3,
      title: "Critical Thinking Essentials",
      author: "Dr. Emily Williams",
      coverImage: "/images/book-covers/thinking.jpg",
      description: "Develop your analytical and problem-solving skills with practical exercises.",
      category: "Self-Development",
      rating: 4.9,
      reviews: 156,
      pages: 400,
      language: "English",
      publishDate: "2024-12-05",
      isFavorite: true,
      isRecommended: false,
      readTime: "7 hours",
      format: "PDF",
      isNew: false
    },
    {
      id: 4,
      title: "Study Skills Mastery",
      author: "Prof. David Brown",
      coverImage: "/images/book-covers/study.jpg",
      description: "Master effective study techniques and time management strategies.",
      category: "Education",
      rating: 4.6,
      reviews: 82,
      pages: 250,
      language: "English",
      publishDate: "2024-12-01",
      isFavorite: false,
      isRecommended: true,
      readTime: "4 hours",
      format: "PDF",
      isNew: false
    }
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedFormat, setSelectedFormat] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('date');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

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

  const filteredBooks = books
    .filter(book => {
      if (selectedCategory !== 'all' && book.category !== selectedCategory) return false;
      if (selectedFormat !== 'all' && book.format !== selectedFormat) return false;
      return book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
             book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
             book.description.toLowerCase().includes(searchQuery.toLowerCase());
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return b.rating - a.rating;
        case 'reviews':
          return b.reviews - a.reviews;
        case 'date':
        default:
          return new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime();
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
            <h1 className="text-3xl font-bold text-gray-800 mb-4">Digital Library</h1>
            <p className="text-gray-600 mb-6">
              Explore our curated collection of educational resources. From textbooks to research papers,
              find everything you need to support your learning journey.
            </p>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center bg-blue-50 px-4 py-2 rounded-lg">
                <BookOpen className="w-5 h-5 text-blue-600 mr-2" />
                <span className="text-blue-600">E-Books</span>
              </div>
              <div className="flex items-center bg-green-50 px-4 py-2 rounded-lg">
                <Book className="w-5 h-5 text-green-600 mr-2" />
                <span className="text-green-600">Textbooks</span>
              </div>
              <div className="flex items-center bg-purple-50 px-4 py-2 rounded-lg">
                <BookMarked className="w-5 h-5 text-purple-600 mr-2" />
                <span className="text-purple-600">Research</span>
              </div>
              <div className="flex items-center bg-orange-50 px-4 py-2 rounded-lg">
                <Bookmark className="w-5 h-5 text-orange-600 mr-2" />
                <span className="text-orange-600">Bookmarks</span>
              </div>
            </div>
          </div>
          <div className="md:w-1/2 flex justify-center">
            <img
              src="/images/library-illustration.svg"
              alt="Library Illustration"
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
                placeholder="Search books..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-transparent"
              />
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-transparent"
            >
              <option value="all">All Categories</option>
              <option value="Education">Education</option>
              <option value="Technology">Technology</option>
              <option value="Self-Development">Self-Development</option>
              <option value="Research">Research</option>
            </select>
            <select
              value={selectedFormat}
              onChange={(e) => setSelectedFormat(e.target.value)}
              className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-transparent"
            >
              <option value="all">All Formats</option>
              <option value="PDF">PDF</option>
              <option value="EPUB">EPUB</option>
              <option value="MOBI">MOBI</option>
            </select>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-transparent"
            >
              <option value="date">Latest</option>
              <option value="rating">Highest Rated</option>
              <option value="reviews">Most Reviewed</option>
            </select>
          </div>
        </motion.div>

        {/* New Arrivals */}
        {books.some(b => b.isNew) && (
          <motion.div variants={itemVariants} className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">New Arrivals</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {books.filter(b => b.isNew).map((book) => (
                <div
                  key={book.id}
                  className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="md:flex">
                    <div className="md:flex-shrink-0">
                      <img
                        className="h-48 w-full md:w-48 object-cover"
                        src={book.coverImage}
                        alt={book.title}
                      />
                    </div>
                    <div className="p-6">
                      <div className="flex items-center mb-2">
                        <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-600">
                          New
                        </span>
                        <span className="ml-2 px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-600">
                          {book.category}
                        </span>
                      </div>
                      <h3 className="text-xl font-semibold text-gray-800 mb-2">{book.title}</h3>
                      <p className="text-gray-600 mb-4">{book.description}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Star className="w-5 h-5 text-yellow-400 fill-current" />
                          <span className="ml-1 text-gray-600">{book.rating}</span>
                          <span className="mx-2 text-gray-400">•</span>
                          <Clock className="w-4 h-4 text-gray-400" />
                          <span className="ml-1 text-gray-600">{book.readTime}</span>
                        </div>
                        <button className="flex items-center text-blue-600 hover:text-blue-700">
                          Read Now
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

        {/* All Books */}
        <motion.div variants={itemVariants}>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">All Books</h2>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg ${
                  viewMode === 'grid'
                    ? 'bg-blue-100 text-blue-600'
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                </svg>
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg ${
                  viewMode === 'list'
                    ? 'bg-blue-100 text-blue-600'
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </button>
            </div>
          </div>

          <div className={viewMode === 'grid' ? 'grid md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-6'}>
            {filteredBooks.map((book) => (
              <motion.div
                key={book.id}
                variants={itemVariants}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className={viewMode === 'grid' ? 'p-6' : 'md:flex'}>
                  {viewMode === 'list' && (
                    <div className="md:flex-shrink-0">
                      <img
                        className="h-48 w-full md:w-48 object-cover"
                        src={book.coverImage}
                        alt={book.title}
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center">
                        <Book className="w-6 h-6 text-blue-600" />
                        <span className="ml-2 px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-600">
                          {book.category}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button className="p-2 hover:bg-gray-100 rounded-full">
                          <Heart className={`w-5 h-5 ${book.isFavorite ? 'text-red-500 fill-current' : 'text-gray-400'}`} />
                        </button>
                        <button className="p-2 hover:bg-gray-100 rounded-full">
                          <Share2 className="w-5 h-5 text-gray-400" />
                        </button>
                      </div>
                    </div>

                    <h3 className="text-lg font-semibold text-gray-800 mb-2">{book.title}</h3>
                    <p className="text-gray-600 text-sm mb-4">{book.description}</p>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-sm text-gray-500">
                        <span className="font-medium mr-2">Author:</span>
                        {book.author}
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <span className="font-medium mr-2">Format:</span>
                        {book.format}
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <span className="font-medium mr-2">Pages:</span>
                        {book.pages}
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <span className="font-medium mr-2">Language:</span>
                        {book.language}
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <div className="flex items-center">
                        <Star className="w-5 h-5 text-yellow-400 fill-current" />
                        <span className="ml-1 text-gray-600">{book.rating}</span>
                        <span className="mx-2 text-gray-400">•</span>
                        <span className="text-gray-600">{book.reviews} reviews</span>
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
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Add Book Button */}
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

export default Library;
