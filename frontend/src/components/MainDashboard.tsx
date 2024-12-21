import { useState, useEffect } from 'react';

interface Lesson {
  id: number;
  title: string;
  progress: number;
  timeSpent: number;
  grade: number | null;
}

function MainDashboard() {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [recommendations, setRecommendations] = useState<string[]>([]);

  useEffect(() => {
    // Simulating API call to fetch lessons
    const fetchLessons = async () => {
      // In a real application, this would be an API call
      const mockLessons: Lesson[] = [
        { id: 1, title: 'Introduction to Algebra', progress: 75, timeSpent: 120, grade: 85 },
        { id: 2, title: 'World History: Ancient Civilizations', progress: 50, timeSpent: 90, grade: null },
        { id: 3, title: 'Biology: Cell Structure', progress: 25, timeSpent: 60, grade: 92 },
      ];
      setLessons(mockLessons);
    };

    // Simulating API call to fetch AI recommendations
    const fetchRecommendations = async () => {
      try {
        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': 'Bearer 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',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'mixtral-8x7b-32768',
            messages: [
              {
                role: 'system',
                content: 'You are an AI that provides personalized learning recommendations based on student data.',
              },
              {
                role: 'user',
                content: 'Provide 3 personalized learning recommendations for a student who has shown interest in algebra and biology.',
              },
            ],
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to get AI recommendations');
        }

        const data = await response.json();
        const recommendationsText = data.choices[0].message.content;
        setRecommendations(recommendationsText.split('\n').filter((rec: string) => rec.trim() !== ''));
      } catch (error) {
        console.error('Error getting AI recommendations:', error);
      }
    };

    fetchLessons();
    fetchRecommendations();
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">Your Learning Progress</h2>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {lessons.map((lesson) => (
          <div key={lesson.id} className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4">{lesson.title}</h3>
            <div className="mb-4">
              <div className="text-sm font-medium text-gray-500 mb-1">Progress</div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-blue-600 h-2.5 rounded-full"
                  style={{ width: `${lesson.progress}%` }}
                ></div>
              </div>
            </div>
            <div className="flex justify-between text-sm">
              <span>Time Spent: {lesson.timeSpent} min</span>
              <span>Grade: {lesson.grade ? `${lesson.grade}%` : 'N/A'}</span>
            </div>
          </div>
        ))}
      </div>

      <h2 className="text-2xl font-semibold my-6">AI Recommendations</h2>
      <div className="bg-white rounded-lg shadow-md p-6">
        <ul className="list-disc list-inside">
          {recommendations.map((rec, index) => (
            <li key={index} className="mb-2">{rec}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default MainDashboard;

