import { useState, useEffect } from 'react';

interface Class {
  id: number;
  title: string;
  instructor: string;
  date: string;
  time: string;
  zoomLink: string;
}

function Classes() {
  const [classes, setClasses] = useState<Class[]>([]);

  useEffect(() => {
    // Simulating API call to fetch classes
    const fetchClasses = async () => {
      // In a real application, this would be an API call
      const mockClasses: Class[] = [
        { id: 1, title: 'Advanced Algebra', instructor: 'John Doe', date: '2023-06-15', time: '10:00 AM', zoomLink: 'https://zoom.us/j/123456789' },
        { id: 2, title: 'World Literature', instructor: 'Jane Smith', date: '2023-06-16', time: '2:00 PM', zoomLink: 'https://zoom.us/j/987654321' },
        { id: 3, title: 'Biology Lab', instructor: 'Bob Johnson', date: '2023-06-17', time: '11:00 AM', zoomLink: 'https://zoom.us/j/456789123' },
      ];
      setClasses(mockClasses);
    };

    fetchClasses();
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">Upcoming Classes</h2>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {classes.map((classItem) => (
          <div key={classItem.id} className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-2">{classItem.title}</h3>
            <p className="text-sm text-gray-600 mb-2">Instructor: {classItem.instructor}</p>
            <p className="text-sm text-gray-600 mb-2">Date: {classItem.date}</p>
            <p className="text-sm text-gray-600 mb-4">Time: {classItem.time}</p>
            <a
              href={classItem.zoomLink}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors inline-block"
            >
              Join Class
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Classes;

