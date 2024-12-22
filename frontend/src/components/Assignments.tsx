import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Calendar, Clock, CheckCircle, AlertCircle, FileText, Filter, Search, Tag, ChevronDown } from 'lucide-react';

interface Assignment {
  id: number;
  title: string;
  subject: string;
  dueDate: string;
  status: 'pending' | 'submitted' | 'late' | 'graded';
  grade?: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  type: 'essay' | 'quiz' | 'project' | 'homework';
  attachments: string[];
  feedback?: string;
}

function Assignments() {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'dueDate' | 'priority'>('dueDate');
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);

  useEffect(() => {
    // Simulated assignments data
    const mockAssignments: Assignment[] = [
      {
        id: 1,
        title: 'Literary Analysis Essay',
        subject: 'English Literature',
        dueDate: '2024-12-25T23:59:59',
        status: 'pending',
        description: 'Write a 2000-word analysis of Shakespeare\'s Macbeth focusing on the theme of ambition.',
        priority: 'high',
        type: 'essay',
        attachments: ['essay_guidelines.pdf', 'macbeth_text.pdf'],
      },
      {
        id: 2,
        title: 'Physics Problem Set',
        subject: 'Physics',
        dueDate: '2024-12-23T23:59:59',
        status: 'submitted',
        grade: 'A',
        description: 'Complete problems 1-10 from Chapter 5: Thermodynamics',
        priority: 'medium',
        type: 'homework',
        attachments: ['chapter5_problems.pdf'],
        feedback: 'Excellent work on the energy conservation problems!'
      },
      {
        id: 3,
        title: 'History Research Project',
        subject: 'History',
        dueDate: '2024-12-28T23:59:59',
        status: 'pending',
        description: 'Research and present on a significant event from World War II',
        priority: 'high',
        type: 'project',
        attachments: ['project_rubric.pdf', 'research_guidelines.pdf'],
      },
      {
        id: 4,
        title: 'Chemistry Lab Report',
        subject: 'Chemistry',
        dueDate: '2024-12-24T23:59:59',
        status: 'late',
        description: 'Write a detailed report on the acid-base titration experiment',
        priority: 'medium',
        type: 'homework',
        attachments: ['lab_template.doc'],
      }
    ];

    setAssignments(mockAssignments);
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

  const getStatusColor = (status: Assignment['status']) => {
    switch (status) {
      case 'submitted':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'late':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'graded':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityColor = (priority: Assignment['priority']) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredAssignments = assignments
    .filter(assignment => {
      if (filter === 'all') return true;
      return assignment.status === filter;
    })
    .filter(assignment =>
      assignment.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      assignment.subject.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === 'dueDate') {
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      } else {
        const priorityOrder = { high: 0, medium: 1, low: 2 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      }
    });

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
            <h1 className="text-3xl font-bold text-gray-800 mb-4">Your Assignments</h1>
            <p className="text-gray-600 mb-6">
              Track and manage your academic tasks. Stay on top of deadlines and maintain
              your academic excellence with our comprehensive assignment management system.
            </p>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center bg-blue-50 px-4 py-2 rounded-lg">
                <FileText className="w-5 h-5 text-blue-600 mr-2" />
                <span className="text-blue-600">Submit Work</span>
              </div>
              <div className="flex items-center bg-green-50 px-4 py-2 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                <span className="text-green-600">Track Progress</span>
              </div>
              <div className="flex items-center bg-purple-50 px-4 py-2 rounded-lg">
                <Calendar className="w-5 h-5 text-purple-600 mr-2" />
                <span className="text-purple-600">Due Dates</span>
              </div>
            </div>
          </div>
          <div className="md:w-1/2 flex justify-center">
            <img
              src="/images/assignments-illustration.svg"
              alt="Assignments Illustration"
              className="w-full max-w-md h-auto"
            />
          </div>
        </div>

        {/* Filters and Search */}
        <motion.div variants={itemVariants} className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="grid md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search assignments..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-transparent"
              />
            </div>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="submitted">Submitted</option>
              <option value="late">Late</option>
              <option value="graded">Graded</option>
            </select>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'dueDate' | 'priority')}
              className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-transparent"
            >
              <option value="dueDate">Sort by Due Date</option>
              <option value="priority">Sort by Priority</option>
            </select>
            <button className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors">
              <FileText className="w-5 h-5" />
              Submit New Assignment
            </button>
          </div>
        </motion.div>

        {/* Assignments Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredAssignments.map((assignment) => (
            <motion.div
              key={assignment.id}
              variants={itemVariants}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              onClick={() => setSelectedAssignment(assignment)}
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800">{assignment.title}</h3>
                    <p className="text-gray-600">{assignment.subject}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(assignment.status)}`}>
                    {assignment.status.charAt(0).toUpperCase() + assignment.status.slice(1)}
                  </span>
                </div>

                <p className="text-gray-600 mb-4">{assignment.description}</p>

                <div className="space-y-3 mb-4">
                  <div className="flex items-center text-gray-600">
                    <Calendar className="w-5 h-5 mr-2 text-blue-500" />
                    <span>Due: {new Date(assignment.dueDate).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Clock className="w-5 h-5 mr-2 text-green-500" />
                    <span>Time: {new Date(assignment.dueDate).toLocaleTimeString('en-US', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Tag className="w-5 h-5 mr-2 text-purple-500" />
                    <span className={`px-2 py-1 rounded-full text-sm ${getPriorityColor(assignment.priority)}`}>
                      {assignment.priority.charAt(0).toUpperCase() + assignment.priority.slice(1)} Priority
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  {assignment.attachments.map((attachment, index) => (
                    <a
                      key={index}
                      href="#"
                      className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm hover:bg-gray-200 transition-colors"
                    >
                      📎 {attachment}
                    </a>
                  ))}
                </div>

                {assignment.feedback && (
                  <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-semibold text-blue-800 mb-2">Feedback</h4>
                    <p className="text-blue-600">{assignment.feedback}</p>
                  </div>
                )}

                <div className="flex justify-end mt-4">
                  <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    {assignment.status === 'submitted' ? 'View Submission' : 'Submit Assignment'}
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

export default Assignments;
