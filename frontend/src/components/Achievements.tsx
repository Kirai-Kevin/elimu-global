import { useState, useEffect } from 'react';

interface Achievement {
  id: number;
  title: string;
  description: string;
  icon: string;
}

function Achievements() {
  const [achievements, setAchievements] = useState<Achievement[]>([]);

  useEffect(() => {
    // Simulating API call to fetch achievements
    const fetchAchievements = async () => {
      // In a real application, this would be an API call
      const mockAchievements: Achievement[] = [
        { id: 1, title: 'First Lesson Completed', description: 'You completed your first lesson!', icon: '🏆' },
        { id: 2, title: 'Perfect Score', description: 'You got 100% on an exam!', icon: '🌟' },
        { id: 3, title: 'Study Streak', description: 'You studied for 7 days in a row!', icon: '🔥' },
      ];
      setAchievements(mockAchievements);
    };

    fetchAchievements();
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">Your Achievements</h2>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {achievements.map((achievement) => (
          <div key={achievement.id} className="bg-white rounded-lg shadow-md p-6 flex items-center">
            <div className="text-4xl mr-4">{achievement.icon}</div>
            <div>
              <h3 className="text-lg font-semibold mb-2">{achievement.title}</h3>
              <p className="text-sm text-gray-600">{achievement.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Achievements;

