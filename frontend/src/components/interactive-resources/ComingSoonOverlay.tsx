import React from 'react';
import { useNavigate } from 'react-router-dom';

const ComingSoonOverlay: React.FC = () => {
  const navigate = useNavigate();

  return (
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
  );
};

export default ComingSoonOverlay;