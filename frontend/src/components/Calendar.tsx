import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar as CalendarIcon, Clock, Plus, ChevronLeft, ChevronRight, Search, Filter, Users, Video, BookOpen } from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths } from 'date-fns';

interface Event {
  id: number;
  title: string;
  description: string;
  startTime: Date;
  endTime: Date;
  type: 'class' | 'assignment' | 'exam' | 'meeting';
  location?: string;
  participants?: string[];
  color: string;
}

function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [events, setEvents] = useState<Event[]>([]);
  const [view, setView] = useState<'month' | 'week' | 'day'>('month');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');

  useEffect(() => {
    // Simulated events data
    const mockEvents: Event[] = [
      {
        id: 1,
        title: 'Mathematics Class',
        description: 'Advanced Calculus - Chapter 5 Review',
        startTime: new Date(2024, 11, 22, 9, 0),
        endTime: new Date(2024, 11, 22, 10, 30),
        type: 'class',
        location: 'Room 201',
        color: '#2196F3'
      },
      {
        id: 2,
        title: 'Physics Assignment Due',
        description: 'Submit Chapter 7 Problems',
        startTime: new Date(2024, 11, 23, 23, 59),
        endTime: new Date(2024, 11, 23, 23, 59),
        type: 'assignment',
        color: '#4CAF50'
      },
      {
        id: 3,
        title: 'Chemistry Lab',
        description: 'Organic Chemistry Experiment',
        startTime: new Date(2024, 11, 24, 14, 0),
        endTime: new Date(2024, 11, 24, 16, 0),
        type: 'class',
        location: 'Lab 305',
        participants: ['Dr. Smith', '15 Students'],
        color: '#FF9800'
      },
      {
        id: 4,
        title: 'Mid-term Exam',
        description: 'Biology Mid-term Assessment',
        startTime: new Date(2024, 11, 26, 10, 0),
        endTime: new Date(2024, 11, 26, 12, 0),
        type: 'exam',
        location: 'Examination Hall',
        color: '#F44336'
      }
    ];

    setEvents(mockEvents);
  }, []);

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

  const getMonthDays = () => {
    const start = startOfMonth(currentDate);
    const end = endOfMonth(currentDate);
    return eachDayOfInterval({ start, end });
  };

  const getEventColor = (type: Event['type']) => {
    switch (type) {
      case 'class': return 'bg-blue-500';
      case 'assignment': return 'bg-green-500';
      case 'exam': return 'bg-red-500';
      case 'meeting': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  const getEventIcon = (type: Event['type']) => {
    switch (type) {
      case 'class': return <Users className="w-4 h-4" />;
      case 'assignment': return <BookOpen className="w-4 h-4" />;
      case 'exam': return <CalendarIcon className="w-4 h-4" />;
      case 'meeting': return <Video className="w-4 h-4" />;
      default: return null;
    }
  };

  const filteredEvents = events.filter(event => {
    if (selectedType !== 'all' && event.type !== selectedType) return false;
    return event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
           event.description.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const getDayEvents = (date: Date) => {
    return filteredEvents.filter(event => isSameDay(event.startTime, date));
  };

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
            <h1 className="text-3xl font-bold text-gray-800 mb-4">Academic Calendar</h1>
            <p className="text-gray-600 mb-6">
              Keep track of your classes, assignments, exams, and meetings.
              Stay organized and never miss an important academic event.
            </p>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center bg-blue-50 px-4 py-2 rounded-lg">
                <Users className="w-5 h-5 text-blue-600 mr-2" />
                <span className="text-blue-600">Classes</span>
              </div>
              <div className="flex items-center bg-green-50 px-4 py-2 rounded-lg">
                <BookOpen className="w-5 h-5 text-green-600 mr-2" />
                <span className="text-green-600">Assignments</span>
              </div>
              <div className="flex items-center bg-red-50 px-4 py-2 rounded-lg">
                <CalendarIcon className="w-5 h-5 text-red-600 mr-2" />
                <span className="text-red-600">Exams</span>
              </div>
            </div>
          </div>
          <div className="md:w-1/2 flex justify-center">
            <img
              src="/images/calendar-illustration.svg"
              alt="Calendar Illustration"
              className="w-full max-w-md h-auto"
            />
          </div>
        </div>

        {/* Controls and Filters */}
        <motion.div variants={itemVariants} className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setCurrentDate(subMonths(currentDate, 1))}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <ChevronLeft className="w-5 h-5 text-gray-600" />
              </button>
              <h2 className="text-xl font-semibold text-gray-800">
                {format(currentDate, 'MMMM yyyy')}
              </h2>
              <button
                onClick={() => setCurrentDate(addMonths(currentDate, 1))}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <ChevronRight className="w-5 h-5 text-gray-600" />
              </button>
            </div>
            <div className="flex gap-4">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search events..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 pr-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                />
              </div>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent"
              >
                <option value="all">All Events</option>
                <option value="class">Classes</option>
                <option value="assignment">Assignments</option>
                <option value="exam">Exams</option>
                <option value="meeting">Meetings</option>
              </select>
              <button
                onClick={() => setView('month')}
                className={`px-4 py-2 rounded-lg ${view === 'month' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-800'}`}
              >
                Month
              </button>
              <button
                onClick={() => setView('week')}
                className={`px-4 py-2 rounded-lg ${view === 'week' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-800'}`}
              >
                Week
              </button>
              <button
                onClick={() => setView('day')}
                className={`px-4 py-2 rounded-lg ${view === 'day' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-800'}`}
              >
                Day
              </button>
            </div>
          </div>
        </motion.div>

        {/* Calendar Grid */}
        <motion.div variants={itemVariants} className="bg-white rounded-xl shadow-md overflow-hidden">
          {/* Week Days Header */}
          <div className="grid grid-cols-7 gap-px bg-gray-200">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <div key={day} className="bg-gray-50 p-4 text-center text-gray-600 font-medium">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Days */}
          <div className="grid grid-cols-7 gap-px bg-gray-200">
            {getMonthDays().map((date, index) => {
              const dayEvents = getDayEvents(date);
              const isCurrentMonth = isSameMonth(date, currentDate);
              const isSelected = isSameDay(date, selectedDate);

              return (
                <div
                  key={index}
                  className={`min-h-[120px] bg-white p-2 ${
                    !isCurrentMonth ? 'text-gray-400' : ''
                  } ${isSelected ? 'ring-2 ring-blue-500' : ''}`}
                  onClick={() => setSelectedDate(date)}
                >
                  <div className="font-medium mb-1">{format(date, 'd')}</div>
                  <div className="space-y-1">
                    {dayEvents.map((event) => (
                      <div
                        key={event.id}
                        className={`${getEventColor(event.type)} text-white p-1 rounded text-sm truncate flex items-center gap-1`}
                      >
                        {getEventIcon(event.type)}
                        <span className="truncate">{event.title}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Selected Day Events */}
        {getDayEvents(selectedDate).length > 0 && (
          <motion.div variants={itemVariants} className="mt-8 bg-white rounded-xl shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Events for {format(selectedDate, 'MMMM d, yyyy')}
            </h3>
            <div className="space-y-4">
              {getDayEvents(selectedDate).map((event) => (
                <div
                  key={event.id}
                  className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg"
                >
                  <div className={`${getEventColor(event.type)} p-3 rounded-lg text-white`}>
                    {getEventIcon(event.type)}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-800">{event.title}</h4>
                    <p className="text-gray-600 text-sm">{event.description}</p>
                    <div className="mt-2 flex items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{format(event.startTime, 'h:mm a')} - {format(event.endTime, 'h:mm a')}</span>
                      </div>
                      {event.location && (
                        <div className="flex items-center gap-1">
                          <CalendarIcon className="w-4 h-4" />
                          <span>{event.location}</span>
                        </div>
                      )}
                    </div>
                    {event.participants && (
                      <div className="mt-2 flex items-center gap-2">
                        <Users className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-500">{event.participants.join(', ')}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Add Event Button */}
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

export default Calendar;
