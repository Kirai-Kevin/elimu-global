import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/animations.css';

const InteractiveResourcesComingSoon: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-100 relative">
      {/* Coming Soon Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/90 to-purple-900/90 z-50 flex flex-col items-center justify-center text-white">
        <div className="bg-white/10 backdrop-blur-md p-8 rounded-xl shadow-2xl max-w-md text-center border border-white/20 transform transition-all animate-fade-in">
          <h2 className="text-3xl font-bold mb-4">Coming Soon</h2>
          <div className="w-16 h-16 mx-auto mb-6 relative">
            <div className="absolute inset-0 rounded-full border-4 border-blue-400 border-t-transparent animate-spin"></div>
            <div className="absolute inset-2 rounded-full border-4 border-white border-b-transparent animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
          </div>
          <p className="text-lg mb-6">
            We're working hard to bring you an enhanced interactive chat experience. This feature will be available soon!
          </p>
          <div className="flex flex-col space-y-2 mb-6">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-400 rounded-full mr-3"></div>
              <span>Real-time messaging with instructors</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-400 rounded-full mr-3"></div>
              <span>Course-specific discussion forums</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-400 rounded-full mr-3"></div>
              <span>Read receipts and typing indicators</span>
            </div>
          </div>
          <button 
            onClick={() => navigate(-1)}
            className="px-6 py-3 bg-blue-500 hover:bg-blue-600 rounded-full text-white font-semibold transition-colors shadow-lg hover:shadow-xl"
          >
            Go Back
          </button>
        </div>
      </div>

      {/* Background UI (blurred) */}
      <div className="opacity-20 pointer-events-none w-full h-full">
        <div className="flex h-full">
          {/* Sidebar */}
          <div className="hidden md:block w-1/4 bg-white border-r">
            <div className="p-4 border-b">
              <div className="w-full h-10 bg-gray-200 rounded-md"></div>
            </div>
            <div className="p-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="mb-4 flex items-center">
                  <div className="w-10 h-10 rounded-full bg-gray-200 mr-3"></div>
                  <div>
                    <div className="h-4 w-32 bg-gray-200 rounded mb-2"></div>
                    <div className="h-3 w-24 bg-gray-100 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 flex flex-col">
            <div className="p-4 border-b bg-white flex items-center">
              <div className="w-10 h-10 rounded-full bg-gray-200 mr-3"></div>
              <div className="h-6 w-40 bg-gray-200 rounded"></div>
            </div>
            <div className="flex-1 bg-gray-50 p-4">
              <div className="flex flex-col h-full">
                <div className="flex-1 overflow-y-auto">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className={`mb-4 flex ${i % 2 === 0 ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-xs p-3 rounded-lg ${i % 2 === 0 ? 'bg-blue-100' : 'bg-white'}`}>
                        <div className="h-4 w-32 bg-gray-200 rounded mb-2"></div>
                        <div className="h-3 w-24 bg-gray-100 rounded"></div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 flex items-center">
                  <div className="flex-1 h-10 bg-white rounded-full border"></div>
                  <div className="ml-2 w-10 h-10 rounded-full bg-blue-200"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InteractiveResourcesComingSoon;