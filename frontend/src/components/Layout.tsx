import { useState, useEffect } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { HomeIcon, UserIcon, AwardIcon, VideoIcon, BookOpenIcon, CalendarIcon, FolderIcon, LibraryIcon, BarChartIcon, MoreHorizontalIcon, MenuIcon, XIcon } from 'lucide-react';

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
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* Overlay for mobile only */}
      {isMobile && sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 transition-opacity duration-300"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar with fixed width */}
      <aside
        className={`
          ${isMobile ? 'fixed' : 'relative'} 
          bg-white text-blue-600
          ${sidebarOpen ? 'w-64' : 'w-20'} 
          h-screen
          shadow-xl z-30
          transition-all duration-300 ease-in-out
          ${isMobile ? (sidebarOpen ? 'translate-x-0' : '-translate-x-full') : 'translate-x-0'}
          flex flex-col
        `}
      >
        <div className="flex items-center justify-between h-16 px-4 border-b">
          <h2 className={`font-bold text-xl whitespace-nowrap transition-opacity duration-300 ${sidebarOpen ? 'opacity-100' : 'opacity-0 w-0'}`}>
            Elimu Global
          </h2>
          {/* Only show hamburger in desktop mode when sidebar is collapsed */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className={`p-2 rounded-lg hover:bg-blue-50 transition-colors duration-200 ${isMobile ? '' : (sidebarOpen ? 'ml-auto' : 'mx-auto')}`}
          >
            {isMobile ? (
              sidebarOpen ? <XIcon className="h-6 w-6 text-blue-600" /> : <MenuIcon className="h-6 w-6 text-blue-600" />
            ) : (
              <MenuIcon className={`h-6 w-6 text-blue-600 transition-transform duration-300 ${sidebarOpen ? 'rotate-180' : ''}`} />
            )}
          </button>
        </div>

        <nav className="flex-1 mt-6 px-4 overflow-y-auto">
          {sidebarItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`
                  flex items-center py-3 px-4 rounded-lg mb-2
                  transition-all duration-200 group
                  ${!sidebarOpen ? 'justify-center' : ''}
                  ${isActive ? 'bg-blue-50 text-blue-700' : 'hover:bg-blue-50 hover:text-blue-700'}
                `}
              >
                <item.icon className={`h-5 w-5 flex-shrink-0 transition-transform duration-200 ${!sidebarOpen ? 'transform group-hover:scale-110' : ''}`} />
                {sidebarOpen && (
                  <span className="ml-3 whitespace-nowrap">
                    {item.name}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white shadow-sm flex items-center px-4 flex-shrink-0">
          {isMobile && (
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-lg hover:bg-gray-100 text-blue-600"
            >
              <MenuIcon className="h-6 w-6" />
            </button>
          )}
          <h1 className="text-2xl font-semibold text-gray-800 ml-4 truncate">Student Dashboard</h1>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto bg-gray-50">
          <div className="max-w-7xl mx-auto p-6">
            <div className="w-full">
              <Outlet />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Layout;
