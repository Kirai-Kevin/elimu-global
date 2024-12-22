import { useState, useEffect } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { HomeIcon, UserIcon, AwardIcon, VideoIcon, BookOpenIcon, CalendarIcon, FolderIcon, LibraryIcon, BarChartIcon, MoreHorizontalIcon, MenuIcon, XIcon, LogOut } from 'lucide-react';
import ChatBot from './ChatBot';

const sidebarItems = [
  { name: 'Dashboard', icon: HomeIcon, path: '/dashboard' },
  { name: 'Select Instructor', icon: UserIcon, path: '/dashboard/select-instructor' },
  { name: 'Achievements', icon: AwardIcon, path: '/dashboard/achievements' },
  { name: 'Classes', icon: VideoIcon, path: '/dashboard/classes' },
  { name: 'Schedule', icon: CalendarIcon, path: '/dashboard/schedule' },
  { name: 'Assignments', icon: BookOpenIcon, path: '/dashboard/assignments' },
  { name: 'Lessons', icon: BookOpenIcon, path: '/dashboard/lessons' },
  { name: 'Resources', icon: FolderIcon, path: '/dashboard/resources' },
  { name: 'Calendar', icon: CalendarIcon, path: '/dashboard/calendar' },
  { name: 'Materials', icon: FolderIcon, path: '/dashboard/materials' },
  { name: 'Library', icon: LibraryIcon, path: '/dashboard/library' },
  { name: 'Progress', icon: BarChartIcon, path: '/dashboard/progress' },
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

    // Initial check
    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const sidebarVariants = {
    open: { x: 0, display: 'block' },
    closed: { x: isMobile ? '-100%' : 0, display: isMobile ? 'none' : 'block' },
  };

  const handleLogout = () => {
    // Clear user data from localStorage
    localStorage.clear();
    // Redirect to login page
    navigate('/login');
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gradient-to-br from-blue-50 to-white">
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
        className={`${isMobile ? 'fixed' : 'sticky top-0'} z-30 w-64 h-full bg-gradient-to-b from-blue-600 to-blue-700 text-white overflow-hidden`}
        variants={sidebarVariants}
        initial={isMobile ? 'closed' : 'open'}
        animate={sidebarOpen ? 'open' : 'closed'}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between h-16 px-6 bg-blue-700/50">
            <span className="text-2xl font-bold">Elimu Global</span>
            {isMobile && (
              <button onClick={() => setSidebarOpen(false)} className="p-2 hover:bg-blue-600/50 rounded-lg transition-colors">
                <XIcon className="w-6 h-6" />
              </button>
            )}
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
            {sidebarItems.map((item) => {
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
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-4 py-3 text-red-600 hover:bg-red-50 transition-colors"
            >
              <LogOut className="w-5 h-5 mr-3" />
              <span>Logout</span>
            </button>
          </nav>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden bg-gradient-to-br from-blue-50 to-white">
        {/* Header */}
        <header className="h-16 bg-white/80 backdrop-blur-sm border-b border-blue-100">
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
        <div className="flex-1 overflow-auto">
          <Outlet />
        </div>
      </main>

      <ChatBot />
    </div>
  );
}

export default Layout;
