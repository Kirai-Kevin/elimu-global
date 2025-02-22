import { useState, useEffect } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { HomeIcon, UserIcon, AwardIcon, VideoIcon, BookOpenIcon, FolderIcon, LibraryIcon, BarChartIcon, MoreHorizontalIcon, MenuIcon, XIcon, LogOut, BookIcon, PlayIcon, ClipboardListIcon, MessageCircle } from 'lucide-react';
import ChatBot from './ChatBot';

const sidebarItems = [
  { name: 'Dashboard', icon: HomeIcon, path: '/dashboard' },
  { name: 'Select Instructor', icon: UserIcon, path: '/dashboard/select-instructor' },
  { name: 'Achievements', icon: AwardIcon, path: '/dashboard/achievements' },
  { name: 'Classes', icon: VideoIcon, path: '/dashboard/classes' },
  { name: 'Lessons', icon: BookOpenIcon, path: '/dashboard/lessons' },
  { name: 'Quizzes', icon: ClipboardListIcon, path: '/dashboard/quizzes' },
  { name: 'Assessments', icon: ClipboardListIcon, path: '/dashboard/assessment' },
  { name: 'Interactive Resources', icon: MessageCircle, path: '/dashboard/interactive-resources' },
  // New Free Courses Section
  { name: 'All Free Courses', icon: BookIcon, path: '/free-courses' },
  { name: 'Featured Courses', icon: PlayIcon, path: '/featured-courses' },
  { name: 'More', icon: MoreHorizontalIcon, path: '/dashboard/more' },
];

function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => {
      const newIsMobile = window.innerWidth < 768;
      setIsMobile(newIsMobile);
      if (!newIsMobile) {
        setSidebarOpen(true);
      } else {
        setSidebarOpen(false);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const sidebarVariants = {
    open: { x: 0, display: 'block' },
    closed: { x: isMobile ? '-100%' : 0, display: isMobile ? 'none' : 'block' },
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-blue-50 to-white">
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isMobile && sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-20"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        className={`${
          isMobile ? 'fixed' : 'sticky top-0'
        } z-30 w-64 h-screen bg-gradient-to-b from-blue-600 to-blue-700 text-white overflow-hidden`}
        variants={sidebarVariants}
        initial={isMobile ? 'closed' : 'open'}
        animate={sidebarOpen ? 'open' : 'closed'}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      >
        {/* Logo */}
        <div className="flex-shrink-0 flex items-center justify-between h-16 px-6 bg-blue-700/50">
          <span className="text-2xl font-bold">Elimu Global</span>
          {isMobile && (
            <button onClick={() => setSidebarOpen(false)} className="p-2 hover:bg-blue-600/50 rounded-lg transition-colors">
              <XIcon className="w-6 h-6" />
            </button>
          )}
        </div>

        {/* Navigation */}
        <nav className="h-[calc(100vh-4rem)] px-4 py-6 space-y-2 overflow-y-auto scrollbar-thin scrollbar-thumb-blue-400 scrollbar-track-transparent">
          {sidebarItems.map((item, index) => {
            if (item.name === 'More') return null;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center px-4 py-3 text-sm rounded-xl transition-all duration-200 ${
                  isActive
                    ? 'bg-white/20 text-white font-semibold'
                    : 'text-blue-100 hover:bg-white/10'
                }`}
              >
                <item.icon className="w-5 h-5 mr-3" />
                {item.name}
              </Link>
            );
          })}
          <div className="flex-1" />
          {sidebarItems.find((item) => item.name === 'More') && (
            <Link
              to={sidebarItems.find((item) => item.name === 'More')?.path || '/dashboard'}
              className={`flex items-center w-full px-4 py-3 text-sm rounded-xl transition-all duration-200 ${
                location.pathname === sidebarItems.find((item) => item.name === 'More')?.path
                  ? 'bg-white/20 text-white font-semibold'
                  : 'text-blue-100 hover:bg-white/10'
              }`}
            >
              <MoreHorizontalIcon className="w-5 h-5 mr-3" />
              More
            </Link>
          )}
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-3 text-red-100 hover:bg-red-500/20 rounded-xl transition-colors"
          >
            <LogOut className="w-5 h-5 mr-3" />
            <span>Logout</span>
          </button>
        </nav>
      </motion.aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="sticky top-0 z-10 h-16 bg-white/80 backdrop-blur-sm border-b border-blue-100">
          <div className="flex items-center h-full px-6">
            {isMobile && (
              <button
                onClick={() => setSidebarOpen(true)}
                className="p-2 mr-4 hover:bg-blue-50 rounded-lg transition-colors"
              >
                <MenuIcon className="w-6 h-6 text-blue-600" />
              </button>
            )}
            <h1 className="text-2xl font-bold text-blue-600">
              {sidebarItems.find((item) => item.path === location.pathname)?.name || 'Dashboard'}
            </h1>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div 
              key={location.pathname} 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              transition={{ duration: 0.3 }}
              className="min-h-full p-6"
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <ChatBot />
    </div>
  );
}

export default Layout;
