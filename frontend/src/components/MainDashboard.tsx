import { useState, useEffect } from 'react';
import { config } from '../config/env';
import PageContainer from './PageContainer';

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
        const response = await fetch(config.apiUrl, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${config.groqApiKey}`,
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
    <PageContainer>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 h-full">
        {/* Recent Lessons */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Lessons</h2>
          <div className="space-y-4">
            {lessons.map((lesson) => (
              <div key={lesson.id} className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-medium text-gray-800">{lesson.title}</h3>
                <div className="mt-2 flex items-center">
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${lesson.progress}%` }}
                    />
                  </div>
                  <span className="ml-2 text-sm text-gray-600">{lesson.progress}%</span>
                </div>
                <div className="mt-2 text-sm text-gray-600">
                  Time spent: {lesson.timeSpent} minutes
                </div>
                {lesson.grade && (
                  <div className="mt-1 text-sm text-green-600">
                    Grade: {lesson.grade}%
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Progress Overview */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Progress Overview</h2>
          {/* Add your progress charts/stats here */}
        </div>

        {/* Upcoming Classes */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Upcoming Classes</h2>
          {/* Add your upcoming classes list here */}
        </div>

        {/* AI Recommendations */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">AI Recommendations</h2>
          <ul className="list-disc list-inside">
            {recommendations.map((rec, index) => (
              <li key={index} className="mb-2">{rec}</li>
            ))}
          </ul>
        </div>
      </div>
    </PageContainer>
  );
}

export default MainDashboard;
