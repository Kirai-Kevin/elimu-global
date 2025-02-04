import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { 
  Video, Users, Clock, Calendar, BookOpen, Star, Search, 
  Filter, ChevronRight, GraduationCap, Book, VideoIcon, Link 
} from 'lucide-react';
import { formatDistanceToNow, parseISO } from 'date-fns';
import { getAuthToken } from '../utils/api';

interface ZoomMeeting {
  _id: string;
  title: string;
  courseId: {
    title: string;
  };
  instructorId: {
    name: string;
    email: string;
  };
  startTime: string;
  endTime: string;
  meetingLink: string;
  description?: string;
}

function Classes() {
  const [zoomMeetings, setZoomMeetings] = useState<ZoomMeeting[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchZoomMeetings = async () => {
      try {
        setLoading(true);
        
        const token = getAuthToken();
        console.log('Backend URL:', import.meta.env.VITE_BACKEND_URL);
        console.log('Full URL:', `${import.meta.env.VITE_BACKEND_URL}/student/zoom-meetings`);
        console.log('Token:', token);
        
        const response = await axios.get<ZoomMeeting[]>(`${import.meta.env.VITE_BACKEND_URL}/student/zoom-meetings`, {
          headers: { 
            'Authorization': `Bearer ${token}` 
          }
        });
        
        setZoomMeetings(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Full error:', err);
        console.error('Error response:', err.response?.data);
        setError('Failed to load Zoom meetings');
        setLoading(false);
      }
    };

    fetchZoomMeetings();
  }, []);

  // Filter meetings based on search query
  const filteredMeetings = zoomMeetings.filter(meeting => 
    meeting.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    meeting.courseId.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    meeting.instructorId.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <motion.div
          animate={{ 
            rotate: [0, 360],
            scale: [1, 1.2, 1]
          }}
          transition={{ 
            duration: 2, 
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <VideoIcon className="w-16 h-16 text-blue-500" />
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 p-8">
        {error}
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Search Section */}
      <div className="mb-8 flex justify-between items-center">
        <div className="relative flex-grow mr-4">
          <input 
            type="text" 
            placeholder="Search Zoom meetings..." 
            className="w-full p-3 pl-10 border rounded-lg"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
      </div>

      {/* Zoom Meetings Section */}
      <motion.div 
        className="bg-white rounded-2xl shadow-lg p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center">
            <VideoIcon className="mr-3 text-blue-500" size={28} />
            Upcoming Zoom Meetings
          </h2>
        </div>

        {filteredMeetings.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            No upcoming Zoom meetings
          </div>
        ) : (
          <div className="space-y-4">
            {filteredMeetings.map((meeting) => (
              <motion.div
                key={meeting._id}
                className="bg-gray-50 rounded-lg p-4 flex items-center justify-between hover:bg-gray-100 transition"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex-grow">
                  <div className="flex items-center mb-2">
                    <h3 className="text-lg font-semibold text-gray-800 mr-3">
                      {meeting.title}
                    </h3>
                    <span className="text-sm text-gray-500">
                      {meeting.courseId.title}
                    </span>
                  </div>
                  <div className="flex items-center text-gray-600 space-x-4">
                    <div className="flex items-center">
                      <Clock className="mr-2 text-blue-500" size={16} />
                      <span>
                        {formatDistanceToNow(parseISO(meeting.startTime), { addSuffix: true })}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <Users className="mr-2 text-green-500" size={16} />
                      <span>{meeting.instructorId.name}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <a 
                    href={meeting.meetingLink} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition flex items-center"
                  >
                    <Link className="mr-2" size={16} />
                    Join Meeting
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}

export default Classes;
