import { useState, useEffect } from 'react';

interface Lesson {
  id: number;
  title: string;
  subject: string;
  progress: number;
}

function Lessons() {
  const [lessons, setLessons] = useState<Lesson[]>([]);

  useEffect(() => {
    // Simulating API call to fetch lessons
    const fetchLessons = async () => {
      // In a real application, this would be an API call
      const mockLessons: Lesson[] = [
        { id: 1, title: 'Introduction to Algebra', subject: 'Math', progress: 75 },
        { id: 2, title: 'Shakespeare\'s Plays', subject: 'English', progress: 50 },
        { id: 3, title: 'Cell Biology', subject: 'Biology', progress: 25 },
        { id: 4, title: 'World War II', subject: 'History', progress: 0 },
      ];
      setLessons(mockLessons);
    };

    fetchLessons();
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">Your Lessons</h2>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {lessons.map((lesson) => (
          <div key={lesson.id} className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-2">{lesson.title}</h3>
            <p className="text-sm text-gray-600 mb-4">Subject: {lesson.subject}</p>
            <div className="mb-2">
              <div className="text-sm font-medium text-gray-500 mb-1">Progress</div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-blue-600 h-2.5 rounded-full"
                  style={{ width: `${lesson.progress}%` }}
                ></div>
              </div>
            </div>
            <p className="text-sm text-right">{lesson.progress}% Complete</p>
            <button className="mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors">
              {lesson.progress === 0 ? 'Start Lesson' : 'Continue Lesson'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Lessons;

