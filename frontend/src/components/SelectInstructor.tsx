import { useState, useEffect } from 'react';

interface Instructor {
  id: number;
  name: string;
  subjects: string[];
  rating: number;
}

function SelectInstructor() {
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<string>('');

  useEffect(() => {
    // Simulating API call to fetch instructors
    const fetchInstructors = async () => {
      // In a real application, this would be an API call
      const mockInstructors: Instructor[] = [
        { id: 1, name: 'John Doe', subjects: ['Math', 'Physics'], rating: 4.8 },
        { id: 2, name: 'Jane Smith', subjects: ['English', 'Literature'], rating: 4.6 },
        { id: 3, name: 'Bob Johnson', subjects: ['History', 'Geography'], rating: 4.7 },
      ];
      setInstructors(mockInstructors);
    };

    fetchInstructors();
  }, []);

  const filteredInstructors = selectedSubject
    ? instructors.filter(instructor => instructor.subjects.includes(selectedSubject))
    : instructors;

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">Select an Instructor</h2>
      <div className="mb-4">
        <label htmlFor="subject" className="block text-sm font-medium text-gray-700">Filter by Subject</label>
        <select
          id="subject"
          value={selectedSubject}
          onChange={(e) => setSelectedSubject(e.target.value)}
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
        >
          <option value="">All Subjects</option>
          <option value="Math">Math</option>
          <option value="Physics">Physics</option>
          <option value="English">English</option>
          <option value="Literature">Literature</option>
          <option value="History">History</option>
          <option value="Geography">Geography</option>
        </select>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredInstructors.map((instructor) => (
          <div key={instructor.id} className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-2">{instructor.name}</h3>
            <p className="text-sm text-gray-600 mb-2">Subjects: {instructor.subjects.join(', ')}</p>
            <div className="flex items-center mb-4">
              <span className="text-yellow-400 mr-1">★</span>
              <span>{instructor.rating.toFixed(1)}</span>
            </div>
            <button className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors">
              Select Instructor
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SelectInstructor;

