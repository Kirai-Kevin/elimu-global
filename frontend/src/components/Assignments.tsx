import { useState, useEffect } from 'react';

interface Assignment {
  id: number;
  title: string;
  subject: string;
  dueDate: string;
  status: 'Not Started' | 'In Progress' | 'Submitted';
}

function Assignments() {
  const [assignments, setAssignments] = useState<Assignment[]>([]);

  useEffect(() => {
    // Simulating API call to fetch assignments
    const fetchAssignments = async () => {
      // In a real application, this would be an API call
      const mockAssignments: Assignment[] = [
        { id: 1, title: 'Algebra Problem Set', subject: 'Math', dueDate: '2023-06-20', status: 'Not Started' },
        { id: 2, title: 'Essay on Shakespeare', subject: 'English', dueDate: '2023-06-22', status: 'In Progress' },
        { id: 3, title: 'Lab Report: Photosynthesis', subject: 'Biology', dueDate: '2023-06-25', status: 'Submitted' },
      ];
      setAssignments(mockAssignments);
    };

    fetchAssignments();
  }, []);

  const getStatusColor = (status: Assignment['status']) => {
    switch (status) {
      case 'Not Started':
        return 'bg-red-100 text-red-800';
      case 'In Progress':
        return 'bg-yellow-100 text-yellow-800';
      case 'Submitted':
        return 'bg-green-100 text-green-800';
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">Your Assignments</h2>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {assignments.map((assignment) => (
          <div key={assignment.id} className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-2">{assignment.title}</h3>
            <p className="text-sm text-gray-600 mb-2">Subject: {assignment.subject}</p>
            <p className="text-sm text-gray-600 mb-2">Due Date: {assignment.dueDate}</p>
            <div className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(assignment.status)}`}>
              {assignment.status}
            </div>
            {assignment.status !== 'Submitted' && (
              <button className="mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors">
                {assignment.status === 'Not Started' ? 'Start Assignment' : 'Continue Assignment'}
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Assignments;

