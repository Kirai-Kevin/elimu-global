import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, Video, Users, BookOpen, Search, ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';

interface ScheduleEvent {
  id: number;
  title: string;
  type: 'class' | 'assignment' | 'exam';
  subject: string;
  startTime: string;
  endTime: string;
  instructor?: string;
  location?: string;
  description: string;
  color: string;
}

function Schedule() {
  const [selectedDate, setSelectedDate] = useState(new Date('2024-12-22'));
  const [view, setView] = useState<'day' | 'week'>('week');
  const [events, setEvents] = useState<ScheduleEvent[]>([]);

  useEffect(() => {
    // Simulated schedule data
    const mockEvents: ScheduleEvent[] = [
      {
        id: 1,
        title: 'Advanced Mathematics',
        type: 'class',
        subject: 'Mathematics',
        startTime: '09:00',
        endTime: '10:30',
        instructor: 'Dr. John Smith',
        location: 'Virtual Room 1',
        description: 'Calculus and Linear Algebra',
        color: 'bg-blue-100 border-blue-300 text-blue-800'
      },
      {
        id: 2,
        title: 'Physics Lab',
        type: 'class',
        subject: 'Physics',
        startTime: '11:00',
        endTime: '12:30',
        instructor: 'Prof. Sarah Johnson',
        location: 'Virtual Room 2',
        description: 'Practical experiments in mechanics',
        color: 'bg-purple-100 border-purple-300 text-purple-800'
      },
      {
        id: 3,
        title: 'Literature Essay',
        type: 'assignment',
        subject: 'English',
        startTime: '14:00',
        endTime: '15:00',
        description: 'Submit analysis of Shakespeare',
        color: 'bg-green-100 border-green-300 text-green-800'
      },
      {
        id: 4,
        title: 'Chemistry Quiz',
        type: 'exam',
        subject: 'Chemistry',
        startTime: '15:30',
        endTime: '16:30',
        instructor: 'Dr. Michael Brown',
        location: 'Virtual Room 3',
        description: 'Chapter 5: Chemical Bonds',
        color: 'bg-red-100 border-red-300 text-red-800'
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

  const timeSlots = Array.from({ length: 12 }, (_, i) => {
    const hour = i + 8; // Start from 8 AM
    return `${hour.toString().padStart(2, '0')}:00`;
  });

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const getEventPosition = (event: ScheduleEvent) => {
    const startHour = parseInt(event.startTime.split(':')[0]);
    const startMinute = parseInt(event.startTime.split(':')[1]);
    const endHour = parseInt(event.endTime.split(':')[0]);
    const endMinute = parseInt(event.endTime.split(':')[1]);

    const top = ((startHour - 8) * 60 + startMinute) * (100 / 60);
    const height = ((endHour - startHour) * 60 + (endMinute - startMinute)) * (100 / 60);

    return { top: `${top}px`, height: `${height}px` };
  };

  const getCurrentWeek = () => {
    const curr = selectedDate;
    const week = [];
    for (let i = 0; i < 7; i++) {
      const first = curr.getDate() - curr.getDay() + i;
      const day = new Date(curr.setDate(first));
      week.push(day);
    }
    return week;
  };

  const navigateWeek = (direction: 'prev' | 'next') => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + (direction === 'next' ? 7 : -7));
    setSelectedDate(newDate);
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
            <h1 className="text-3xl font-bold text-gray-800 mb-4">Your Schedule</h1>
            <p className="text-gray-600 mb-6">
              Stay organized with your personalized academic schedule. Track your classes,
              assignments, and exams all in one place.
            </p>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center bg-blue-50 px-4 py-2 rounded-lg">
                <Video className="w-5 h-5 text-blue-600 mr-2" />
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
              src="/images/schedule-illustration.svg"
              alt="Schedule Illustration"
              className="w-full max-w-md h-auto"
            />
          </div>
        </div>

        {/* Calendar Controls */}
        <motion.div variants={itemVariants} className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigateWeek('prev')}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <ChevronLeft className="w-5 h-5 text-gray-600" />
              </button>
              <h2 className="text-xl font-semibold text-gray-800">
                {getCurrentWeek()[0].toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </h2>
              <button
                onClick={() => navigateWeek('next')}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <ChevronRight className="w-5 h-5 text-gray-600" />
              </button>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setView('day')}
                className={`px-4 py-2 rounded-lg ${
                  view === 'day'
                    ? 'bg-blue-100 text-blue-600'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Day
              </button>
              <button
                onClick={() => setView('week')}
                className={`px-4 py-2 rounded-lg ${
                  view === 'week'
                    ? 'bg-blue-100 text-blue-600'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Week
              </button>
            </div>
          </div>

          {/* Week View */}
          <div className="relative overflow-x-auto">
            <div className="grid grid-cols-8 gap-px bg-gray-200">
              {/* Time Labels */}
              <div className="sticky left-0 bg-white">
                <div className="h-12"></div>
                {timeSlots.map((time) => (
                  <div
                    key={time}
                    className="h-24 border-t border-gray-200 text-right pr-2 text-sm text-gray-500"
                  >
                    {time}
                  </div>
                ))}
              </div>

              {/* Days */}
              {getCurrentWeek().map((date, index) => (
                <div key={index} className="relative">
                  <div className="h-12 border-b border-gray-200 text-center">
                    <div className="text-sm font-medium text-gray-500">
                      {daysOfWeek[date.getDay()]}
                    </div>
                    <div className="text-lg font-semibold text-gray-800">
                      {date.getDate()}
                    </div>
                  </div>
                  <div className="relative h-[720px]">
                    {/* Hour lines */}
                    {timeSlots.map((_, index) => (
                      <div
                        key={index}
                        className="absolute w-full h-24 border-t border-gray-200"
                        style={{ top: `${index * 96}px` }}
                      ></div>
                    ))}
                    
                    {/* Events */}
                    {events.map((event) => {
                      const { top, height } = getEventPosition(event);
                      return (
                        <div
                          key={event.id}
                          className={`absolute left-1 right-1 rounded-lg border p-2 ${event.color} cursor-pointer transition-transform hover:scale-[1.02]`}
                          style={{ top, height, minHeight: '24px' }}
                        >
                          <div className="text-sm font-semibold truncate">
                            {event.title}
                          </div>
                          {parseInt(height) > 50 && (
                            <>
                              <div className="text-xs truncate">
                                {event.startTime} - {event.endTime}
                              </div>
                              {event.location && (
                                <div className="text-xs truncate">{event.location}</div>
                              )}
                            </>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Upcoming Events */}
        <motion.div variants={itemVariants} className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Upcoming Events</h3>
          <div className="space-y-4">
            {events.map((event) => (
              <div
                key={event.id}
                className={`p-4 rounded-lg border ${event.color}`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-semibold">{event.title}</h4>
                    <p className="text-sm">{event.description}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">
                      {event.startTime} - {event.endTime}
                    </div>
                    {event.location && (
                      <div className="text-sm">{event.location}</div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default Schedule;
