import { useState, useEffect } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { HomeIcon, UserIcon, AwardIcon, VideoIcon, BookOpenIcon, CalendarIcon, FolderIcon, LibraryIcon, BarChartIcon, MoreHorizontalIcon, MenuIcon, XIcon } from 'lucide-react';
import ChatBot from './ChatBot';

const sidebarItems = [
  { name: 'Dashboard', icon: HomeIcon, path: '/' },
  { name: 'Select Instructor', icon: UserIcon, path: '/select-instructor' },
  { name: 'Achievements', icon: AwardIcon, path: '/achievements' },
  { name: 'Classes', icon: VideoIcon, path: '/classes' },
  { name: 'Assignments', icon: BookOpenIcon, path: '/assignments' },
  { name: 'Lessons', icon: BookOpenIcon, path: '/lessons' },
  { name: 'Calendar', icon: CalendarIcon, path: '/calendar' },
  { name: 'Materials', icon: FolderIcon, path: '/materials' },
  { name: 'Library', icon: LibraryIcon, path: '/library' },
  { name: 'Progress', icon: BarChartIcon, path: '/progress' },
  { name: 'More', icon: MoreHorizontalIcon, path: '/more' },
];

function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const location = useLocation();

  useEffect(() => {
    const handleResize = () => {
      const newIsMobile = window.innerWidth < 768;
      setIsMobile(newIsMobile);
      if (!newIsMobile) {
        setSidebarOpen(true);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  }, [location, isMobile]);

  return (
    <div className="flex h-screen overflow-hidden bg-white">
      {/* Overlay for mobile only */}
      {isMobile && sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 transition-opacity duration-300"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } fixed md:relative md:translate-x-0 z-30 w-64 h-full transition-transform duration-300 ease-in-out bg-white border-r border-gray-200`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
            <span className="text-xl font-semibold text-blue-600">Elimu Global</span>
            {isMobile && (
              <button onClick={() => setSidebarOpen(false)} className="p-2 rounded-lg hover:bg-gray-100">
                <XIcon className="w-6 h-6 text-gray-600" />
              </button>
            )}
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
            {sidebarItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`flex items-center px-4 py-3 text-sm rounded-lg transition-colors ${
                    isActive
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-blue-600'
                  }`}
                >
                  <item.icon className={`w-5 h-5 mr-3 ${isActive ? 'text-blue-600' : 'text-gray-400'}`} />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="h-16 border-b border-gray-200 bg-white">
          <div className="flex items-center h-full px-4">
            {isMobile && (
              <button
                onClick={() => setSidebarOpen(true)}
                className="p-2 mr-2 rounded-lg hover:bg-gray-100"
              >
                <MenuIcon className="w-6 h-6 text-gray-600" />
              </button>
            )}
            <h1 className="text-xl font-semibold text-gray-800">
              {sidebarItems.find((item) => item.path === location.pathname)?.name || 'Dashboard'}
            </h1>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-auto bg-gray-50 p-6 min-h-[calc(100vh-4rem)]">
          <div className="h-full">
            <Outlet />
          </div>
        </div>
      </main>

      {/* ChatBot */}
      <ChatBot />
    </div>
  );
}

export default Layout;
