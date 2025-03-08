import { useState, useEffect } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  HomeIcon, UserIcon, AwardIcon, VideoIcon, BookOpenIcon, 
  FolderIcon, LibraryIcon, MoreHorizontalIcon, MenuIcon, 
  XIcon, LogOut, BookIcon, PlayIcon, ClipboardListIcon, 
  MessageCircle, Rocket, Gift, Star, Gamepad2, Sparkles
} from 'lucide-react';
import ChatBot from './ChatBot';

const sidebarItems = [
  { name: 'My Space', icon: HomeIcon, path: '/dashboard' },
  { name: 'Find a Teacher', icon: UserIcon, path: '/dashboard/select-instructor' },
  { name: 'My Trophies', icon: AwardIcon, path: '/dashboard/achievements' },
  { name: 'Fun Classes', icon: VideoIcon, path: '/dashboard/classes' },
  { name: 'Cool Lessons', icon: BookOpenIcon, path: '/dashboard/lessons' },
  { name: 'Brain Games', icon: Gamepad2, path: '/dashboard/quizzes' },
  { name: 'Test Your Skills', icon: Rocket, path: '/dashboard/assessment' },
  { name: 'Talk & Learn', icon: MessageCircle, path: '/dashboard/interactive-resources' },
  { name: 'Free Stuff', icon: Gift, path: '/free-courses' },
  { name: 'Awesome Picks', icon: Star, path: '/featured-courses' },
  { name: 'More Fun', icon: MoreHorizontalIcon, path: '/dashboard/more' },
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
    <div className="flex h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50">
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isMobile && sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-indigo-500/20 backdrop-blur-sm z-20"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        className={`${
          isMobile ? 'fixed' : 'sticky top-0'
        } z-30 w-64 h-screen bg-gradient-to-b from-indigo-500 via-purple-500 to-pink-500 text-white overflow-hidden rounded-r-2xl`}
        variants={sidebarVariants}
        initial={isMobile ? 'closed' : 'open'}
        animate={sidebarOpen ? 'open' : 'closed'}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      >
        {/* Logo */}
        <div className="flex-shrink-0 flex items-center justify-between h-16 px-6 bg-indigo-600/50">
          <div className="flex items-center">
            <Sparkles className="w-6 h-6 mr-2 text-yellow-300" />
            <span className="text-2xl font-bold bg-gradient-to-r from-yellow-200 to-yellow-400 text-transparent bg-clip-text">
              Elimu Global
            </span>
          </div>
          {isMobile && (
            <button onClick={() => setSidebarOpen(false)} className="p-2 hover:bg-indigo-600/50 rounded-full transition-colors">
              <XIcon className="w-6 h-6" />
            </button>
          )}
        </div>

        {/* Navigation */}
        <nav className="h-[calc(100vh-4rem)] px-4 py-6 space-y-2 overflow-y-auto scrollbar-thin scrollbar-thumb-purple-400 scrollbar-track-transparent">
          {sidebarItems.map((item) => {
            if (item.name === 'More Fun') return null;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center px-4 py-3 text-sm rounded-xl transition-all duration-200 ${
                  isActive
                    ? 'bg-white/20 text-white font-bold scale-105 shadow-lg shadow-purple-600/20'
                    : 'text-white hover:bg-white/10 hover:scale-105'
                }`}
              >
                <motion.div
                  whileHover={{ rotate: isActive ? 0 : 10 }}
                  className="mr-3"
                >
                  <item.icon className={`w-5 h-5 ${isActive ? 'text-yellow-300' : 'text-purple-200'}`} />
                </motion.div>
                {item.name}
                {isActive && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="ml-auto"
                  >
                    <Star className="w-4 h-4 text-yellow-300 fill-yellow-300" />
                  </motion.div>
                )}
              </Link>
            );
          })}
          <div className="flex-1" />
          <Link
            to="/dashboard/more"
            className={`flex items-center w-full px-4 py-3 text-sm rounded-xl transition-all duration-200 ${
              location.pathname === '/dashboard/more'
                ? 'bg-white/20 text-white font-bold'
                : 'text-white hover:bg-white/10'
            }`}
          >
            <MoreHorizontalIcon className="w-5 h-5 mr-3 text-purple-200" />
            More Fun
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-3 text-pink-100 hover:bg-pink-500/20 rounded-xl transition-colors"
          >
            <LogOut className="w-5 h-5 mr-3" />
            <span>Exit Adventure</span>
          </button>
        </nav>
      </motion.aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="sticky top-0 z-10 h-16 bg-white/80 backdrop-blur-sm border-b border-purple-100 rounded-bl-2xl">
          <div className="flex items-center h-full px-6">
            {isMobile && (
              <motion.button
                whileHover={{ rotate: 180 }}
                transition={{ duration: 0.3 }}
                onClick={() => setSidebarOpen(true)}
                className="p-2 mr-4 hover:bg-purple-100 rounded-full transition-colors"
              >
                <MenuIcon className="w-6 h-6 text-purple-600" />
              </motion.button>
            )}
            <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-transparent bg-clip-text">
              {sidebarItems.find((item) => item.path === location.pathname)?.name || 'My Space'}
            </h1>
            <motion.div
              whileHover={{ rotate: 10 }}
              className="ml-3"
            >
              {location.pathname === '/dashboard' && <Sparkles className="w-6 h-6 text-yellow-500" />}
              {location.pathname === '/dashboard/achievements' && <AwardIcon className="w-6 h-6 text-yellow-500" />}
              {location.pathname === '/dashboard/quizzes' && <Gamepad2 className="w-6 h-6 text-indigo-500" />}
            </motion.div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div 
              key={location.pathname} 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              exit={{ opacity: 0, y: -20 }} 
              transition={{ duration: 0.3 }}
              className="min-h-full p-6"
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <ChatBot />
      </motion.div>
    </div>
  );
}

export default Layout;