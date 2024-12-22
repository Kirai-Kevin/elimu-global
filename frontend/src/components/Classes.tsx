import { useState, useEffect } from 'react';
import PageContainer from './PageContainer';

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
    <PageContainer>
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold text-gray-800">Upcoming Classes</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {classes.map((classItem) => (
            <div key={classItem.id} className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">{classItem.title}</h3>
              <div className="space-y-2 text-gray-600">
                <p className="flex items-center">
                  <span className="font-medium w-24">Instructor:</span>
                  <span>{classItem.instructor}</span>
                </p>
                <p className="flex items-center">
                  <span className="font-medium w-24">Date:</span>
                  <span>{classItem.date}</span>
                </p>
                <p className="flex items-center">
                  <span className="font-medium w-24">Time:</span>
                  <span>{classItem.time}</span>
                </p>
              </div>
              <a
                href={classItem.zoomLink}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Join Class
              </a>
            </div>
          ))}
        </div>
      </div>
    </PageContainer>
  );
}

export default Classes;
