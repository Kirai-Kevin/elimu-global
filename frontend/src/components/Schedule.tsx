import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, BookOpen } from 'react-feather';

interface ScheduleEvent {
  id: string;
  title: string;
  subject: string;
  startTime: string;
  endTime: string;
  type: 'class' | 'assignment' | 'exam';
}

function Schedule() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [events] = useState<ScheduleEvent[]>([
    {
      id: '1',
      title: 'Mathematics Class',
      subject: 'Mathematics',
      startTime: '09:00',
      endTime: '10:30',
      type: 'class',
    },
    {
      id: '2',
      title: 'Physics Assignment Due',
      subject: 'Physics',
      startTime: '11:00',
      endTime: '12:00',
      type: 'assignment',
    },
    {
      id: '3',
      title: 'Chemistry Exam',
      subject: 'Chemistry',
      startTime: '14:00',
      endTime: '16:00',
      type: 'exam',
    },
  ]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 10,
      },
    },
  };

  const getEventTypeColor = (type: ScheduleEvent['type']) => {
    switch (type) {
      case 'class':
        return 'bg-blue-100 text-blue-800';
      case 'assignment':
        return 'bg-green-100 text-green-800';
      case 'exam':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
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
            <h1 className="text-3xl font-bold text-gray-800 mb-4">Class Schedule</h1>
            <p className="text-gray-600">
              View and manage your daily classes, assignments, and exams.
            </p>
          </div>
          <div className="md:w-1/2 flex justify-center">
            <img
              src="/images/schedule-illustration.svg"
              alt="Schedule Illustration"
              className="w-full max-w-md h-auto"
            />
          </div>
        </div>

        {/* Schedule Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Calendar */}
          <motion.div
            variants={itemVariants}
            className="bg-white rounded-xl shadow-md p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Calendar</h2>
              <div className="flex space-x-2">
                <button
                  onClick={() => {
                    const newDate = new Date(selectedDate);
                    newDate.setDate(newDate.getDate() - 1);
                    setSelectedDate(newDate);
                  }}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  ←
                </button>
                <button
                  onClick={() => setSelectedDate(new Date())}
                  className="px-3 py-1 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200"
                >
                  Today
                </button>
                <button
                  onClick={() => {
                    const newDate = new Date(selectedDate);
                    newDate.setDate(newDate.getDate() + 1);
                    setSelectedDate(newDate);
                  }}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  →
                </button>
              </div>
            </div>
            <div className="text-center mb-6">
              <h3 className="text-lg font-medium">
                {selectedDate.toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </h3>
            </div>
          </motion.div>

          {/* Quick Stats */}
          <motion.div
            variants={itemVariants}
            className="bg-white rounded-xl shadow-md p-6"
          >
            <h2 className="text-xl font-semibold mb-4">Today's Overview</h2>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <Calendar className="w-6 h-6 text-blue-500 mx-auto mb-2" />
                <h3 className="text-sm font-medium text-gray-500">Classes</h3>
                <p className="text-2xl font-bold text-blue-600">3</p>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <BookOpen className="w-6 h-6 text-green-500 mx-auto mb-2" />
                <h3 className="text-sm font-medium text-gray-500">Assignments</h3>
                <p className="text-2xl font-bold text-green-600">2</p>
              </div>
              <div className="text-center p-4 bg-red-50 rounded-lg">
                <Clock className="w-6 h-6 text-red-500 mx-auto mb-2" />
                <h3 className="text-sm font-medium text-gray-500">Study Hours</h3>
                <p className="text-2xl font-bold text-red-600">6</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Schedule Timeline */}
        <motion.div
          variants={itemVariants}
          className="mt-6 bg-white rounded-xl shadow-md p-6"
        >
          <h2 className="text-xl font-semibold mb-4">Schedule Timeline</h2>
          <div className="space-y-4">
            {events.map((event) => (
              <div
                key={event.id}
                className="flex items-center space-x-4 p-4 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex-shrink-0 w-16 text-sm text-gray-500">
                  {event.startTime}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-medium text-gray-900">{event.title}</h3>
                  <p className="text-sm text-gray-500">{event.subject}</p>
                </div>
                <div className={`px-3 py-1 rounded-full text-sm ${getEventTypeColor(event.type)}`}>
                  {event.type}
                </div>
                <div className="flex-shrink-0 text-sm text-gray-500">
                  {event.endTime}
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
