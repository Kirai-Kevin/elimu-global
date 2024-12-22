import { useState } from 'react';
import { motion } from 'framer-motion';
import { Clock, CheckCircle, AlertCircle, Calendar } from 'react-feather';

interface Assignment {
  id: string;
  title: string;
  subject: string;
  dueDate: string;
  status: 'pending' | 'completed' | 'overdue';
  description: string;
  progress: number;
}

function Assignments() {
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [assignments] = useState<Assignment[]>([
    {
      id: '1',
      title: 'Mathematics Problem Set',
      subject: 'Mathematics',
      dueDate: '2024-01-05',
      status: 'pending',
      description: 'Complete problems 1-20 from Chapter 3',
      progress: 60,
    },
    {
      id: '2',
      title: 'Physics Lab Report',
      subject: 'Physics',
      dueDate: '2024-01-03',
      status: 'completed',
      description: 'Write a detailed report on the pendulum experiment',
      progress: 100,
    },
    {
      id: '3',
      title: 'Chemistry Quiz',
      subject: 'Chemistry',
      dueDate: '2023-12-20',
      status: 'overdue',
      description: 'Online quiz covering organic chemistry basics',
      progress: 0,
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

  const getStatusColor = (status: Assignment['status']) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 bg-green-100';
      case 'overdue':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-yellow-600 bg-yellow-100';
    }
  };

  const getStatusIcon = (status: Assignment['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5" />;
      case 'overdue':
        return <AlertCircle className="w-5 h-5" />;
      default:
        return <Clock className="w-5 h-5" />;
    }
  };

  const filteredAssignments = assignments.filter(
    (assignment) => selectedStatus === 'all' || assignment.status === selectedStatus
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <motion.div
        className="container mx-auto px-4 py-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header with Illustration */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-8 bg-white rounded-xl p-6 shadow-lg">
          <div className="md:w-1/2 mb-6 md:mb-0">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">Assignments</h1>
            <p className="text-gray-600">
              Track and manage your assignments, submissions, and deadlines.
            </p>
          </div>
          <div className="md:w-1/2 flex justify-center">
            <img
              src="/images/assignments-illustration.svg"
              alt="Assignments Illustration"
              className="w-full max-w-md h-auto"
            />
          </div>
        </div>

        {/* Status Filters */}
        <motion.div
          variants={itemVariants}
          className="bg-white rounded-xl shadow-md p-6 mb-6"
        >
          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => setSelectedStatus('all')}
              className={`px-4 py-2 rounded-lg ${
                selectedStatus === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setSelectedStatus('pending')}
              className={`px-4 py-2 rounded-lg ${
                selectedStatus === 'pending'
                  ? 'bg-yellow-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Pending
            </button>
            <button
              onClick={() => setSelectedStatus('completed')}
              className={`px-4 py-2 rounded-lg ${
                selectedStatus === 'completed'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Completed
            </button>
            <button
              onClick={() => setSelectedStatus('overdue')}
              className={`px-4 py-2 rounded-lg ${
                selectedStatus === 'overdue'
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Overdue
            </button>
          </div>
        </motion.div>

        {/* Assignments List */}
        <div className="space-y-4">
          {filteredAssignments.map((assignment) => (
            <motion.div
              key={assignment.id}
              variants={itemVariants}
              className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">{assignment.title}</h3>
                  <p className="text-sm text-gray-500">{assignment.subject}</p>
                </div>
                <div className={`px-3 py-1 rounded-full flex items-center space-x-1 ${getStatusColor(assignment.status)}`}>
                  {getStatusIcon(assignment.status)}
                  <span className="ml-1 text-sm capitalize">{assignment.status}</span>
                </div>
              </div>
              <p className="text-gray-600 mb-4">{assignment.description}</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center text-sm text-gray-500">
                  <Calendar className="w-4 h-4 mr-1" />
                  Due: {new Date(assignment.dueDate).toLocaleDateString()}
                </div>
                <div className="w-48">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-gray-500">Progress</span>
                    <span className="text-sm font-medium text-gray-700">{assignment.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${assignment.progress}%` }}
                      className={`h-2 rounded-full ${
                        assignment.status === 'completed'
                          ? 'bg-green-500'
                          : assignment.status === 'overdue'
                          ? 'bg-red-500'
                          : 'bg-blue-500'
                      }`}
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {filteredAssignments.length === 0 && (
          <motion.div
            variants={itemVariants}
            className="text-center py-12"
          >
            <CheckCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900">No assignments found</h3>
            <p className="text-gray-500">
              {selectedStatus === 'all'
                ? 'You have no assignments at the moment'
                : `You have no ${selectedStatus} assignments`}
            </p>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}

export default Assignments;
