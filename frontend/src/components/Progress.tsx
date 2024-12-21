import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface ProgressData {
  subject: string;
  completionRate: number;
  averageGrade: number;
  timeSpent: number;
}

function Progress() {
  const [progressData, setProgressData] = useState<ProgressData[]>([]);
  const [performanceData, setPerformanceData] = useState<{ date: string; grade: number }[]>([]);

  useEffect(() => {
    // Simulating API call to fetch progress data
    const fetchProgressData = async () => {
      // In a real application, this would be an API call
      const mockProgressData: ProgressData[] = [
        { subject: 'Math', completionRate: 75, averageGrade: 85, timeSpent: 1200 },
        { subject: 'English', completionRate: 60, averageGrade: 78, timeSpent: 900 },
        { subject: 'Science', completionRate: 80, averageGrade: 92, timeSpent: 1500 },
        { subject: 'History', completionRate: 50, averageGrade: 70, timeSpent: 800 },
      ];
      setProgressData(mockProgressData);
    };

    // Simulating API call to fetch performance data
    const fetchPerformanceData = async () => {
      // In a real application, this would be an API call
      const mockPerformanceData = [
        { date: '2023-01', grade: 75 },
        { date: '2023-02', grade: 80 },
        { date: '2023-03', grade: 78 },
        { date: '2023-04', grade: 85 },
        { date: '2023-05', grade: 88 },
        { date: '2023-06', grade: 92 },
      ];
      setPerformanceData(mockPerformanceData);
    };

    fetchProgressData();
    fetchPerformanceData();
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">Your Progress</h2>
      
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4">Subject Progress</h3>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {progressData.map((data) => (
            <div key={data.subject} className="bg-white rounded-lg shadow-md p-6">
              <h4 className="text-lg font-semibold mb-2">{data.subject}</h4>
              <p className="text-sm text-gray-600 mb-2">Completion: {data.completionRate}%</p>
              <p className="text-sm text-gray-600 mb-2">Average Grade: {data.averageGrade}%</p>
              <p className="text-sm text-gray-600">Time Spent: {Math.floor(data.timeSpent / 60)} hours</p>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-xl font-semibold mb-4">Performance Trend</h3>
        <div className="bg-white rounded-lg shadow-md p-6" style={{ height: '400px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="grade" stroke="#3182ce" activeDot={{ r: 8 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

export default Progress;

