import React, { useState } from 'react';
import { Search, BookOpen, UserCircle2, Filter, ChevronRight } from 'lucide-react';
import { Course } from '../../types/interactive';

interface ChatSidebarProps {
  courses: Course[];  // Ensure this is always an array
  selectedCourse: Course | null;
  onSelectCourse: (course: Course) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

const ChatSidebar: React.FC<ChatSidebarProps> = ({
  courses = [],  // Provide a default empty array
  selectedCourse,
  onSelectCourse,
  searchQuery,
  onSearchChange
}) => {
  const [filterCategory, setFilterCategory] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Safely get unique categories with proper type handling
  const categories = [...new Set(
    (courses || [])
      .map(course => course.category)
      .filter((category): category is string => 
        category !== undefined && category !== null
      )
  )];

  // Safely filter courses
  const filteredCourses = (courses || []).filter(course => 
    (course.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
     course.instructor?.name?.toLowerCase().includes(searchQuery.toLowerCase())) &&
    (!filterCategory || (course.category && course.category === filterCategory))
  );

  return (
    <>
      {/* Mobile Header */}
      <div className="md:hidden bg-blue-600 text-white p-4 flex justify-between items-center">
        <h2 className="text-xl font-bold">My Courses</h2>
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="focus:outline-none"
        >
          <Filter size={24} />
        </button>
      </div>

      {/* Sidebar Container */}
      <div className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-white shadow-xl 
        transform transition-transform duration-300
        md:relative md:translate-x-0
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex flex-col h-full">
          {/* Search Input */}
          <div className="relative p-4 border-b">
            <input 
              type="text" 
              placeholder="Search courses..." 
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full px-4 py-2 pl-10 border rounded-md 
                focus:outline-none focus:ring-2 focus:ring-blue-500
                transition duration-200"
            />
            <Search 
              className="absolute left-6 top-1/2 transform -translate-y-1/2 text-gray-400" 
              size={20} 
            />
          </div>

          {/* Category Filters */}
          {categories.length > 0 && (
            <div className="p-4 border-b">
              <h3 className="text-sm font-semibold text-gray-600 mb-2">Categories</h3>
              <div className="flex flex-wrap gap-2">
                <button 
                  onClick={() => setFilterCategory(null)}
                  className={`
                    px-3 py-1 rounded-full text-xs 
                    ${!filterCategory ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}
                    hover:bg-blue-100 transition duration-200
                  `}
                >
                  All
                </button>
                {categories.map(category => (
                  <button
                    key={category}
                    onClick={() => setFilterCategory(category)}
                    className={`
                      px-3 py-1 rounded-full text-xs 
                      ${filterCategory === category ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}
                      hover:bg-blue-100 transition duration-200
                    `}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Courses List */}
          <div className="flex-grow overflow-y-auto">
            {filteredCourses.length === 0 ? (
              <div className="text-center text-gray-500 mt-8 p-4">
                <BookOpen className="mx-auto mb-4 text-gray-300" size={48} />
                <p>No courses found</p>
                <p className="text-sm">
                  {courses.length === 0 
                    ? 'No courses available' 
                    : 'Try a different search or category'}
                </p>
              </div>
            ) : (
              filteredCourses.map(course => (
                <div 
                  key={course._id}
                  onClick={() => {
                    onSelectCourse(course);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`
                    cursor-pointer p-4 flex items-center justify-between 
                    transition-colors duration-200
                    ${selectedCourse?._id === course._id 
                      ? 'bg-blue-50 border-l-4 border-blue-600' 
                      : 'hover:bg-gray-50'}
                  `}
                >
                  <div>
                    <h4 className="font-semibold text-gray-800">
                      {course.title || 'Untitled Course'}
                    </h4>
                    <div className="flex items-center text-sm text-gray-600 mt-1">
                      <UserCircle2 size={16} className="mr-2" />
                      {course.instructor?.name || 'Unknown Instructor'}
                    </div>
                  </div>
                  <ChevronRight 
                    size={20} 
                    className="text-gray-400 group-hover:text-blue-600" 
                  />
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div 
          onClick={() => setIsMobileMenuOpen(false)}
          className="fixed inset-0 bg-black opacity-50 z-30 md:hidden"
        />
      )}
    </>
  );
};

export default ChatSidebar;
