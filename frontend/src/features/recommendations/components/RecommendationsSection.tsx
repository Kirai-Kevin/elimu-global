import React, { useState } from 'react';
import { EnhancedRecommendation, FeedbackData } from '../types';
import RecommendationCard from './RecommendationCard';
import useRecommendations from '../hooks/useRecommendations';

type RecommendationFilter = 'all' | 'high' | 'medium' | 'low';

const RecommendationsSection: React.FC = () => {
  const { recommendations, loading } = useRecommendations('currentStudentId'); // Replace with actual student ID
  const [filter, setFilter] = useState<RecommendationFilter>('all');

  const filterRecommendation = (rec: EnhancedRecommendation, filter: RecommendationFilter) => {
    if (filter === 'all') return true;
    return rec.priority === filter;
  };

  const handleAction = async (recommendationId: string, action: string) => {
    console.log(`Action ${action} for recommendation ${recommendationId}`);
    // Implement action handling
  };

  const handleFeedback = async (recommendationId: string, feedback: FeedbackData) => {
    console.log(`Feedback for recommendation ${recommendationId}:`, feedback);
    // Implement feedback handling
  };

  if (loading) {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 w-full">
        {[1, 2, 3].map(i => (
          <div key={i} className="bg-white rounded-xl shadow-lg p-6 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <section className="w-full min-h-screen px-4 py-8 max-w-7xl mx-auto">
      <div className="flex flex-col items-center justify-between mb-8">
        <h2 className="text-3xl font-bold text-center mb-6">Personalized Recommendations</h2>
        <div className="flex gap-2 justify-center w-full">
          {(['all', 'high', 'medium', 'low'] as RecommendationFilter[]).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filter === f
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 w-full">
        {recommendations
          .filter(rec => filterRecommendation(rec, filter))
          .map(recommendation => (
            <RecommendationCard
              key={recommendation.id}
              recommendation={recommendation}
              onAction={action => handleAction(recommendation.id, action)}
              onFeedback={feedback => handleFeedback(recommendation.id, feedback)}
            />
          ))}
      </div>
      
      {recommendations.length === 0 && (
        <div className="flex flex-col items-center justify-center min-h-[400px] w-full">
          <h3 className="text-2xl font-semibold text-gray-600 text-center">No recommendations available</h3>
          <p className="text-gray-500 mt-2 text-center">Check back later for personalized recommendations</p>
        </div>
      )}
    </section>
  );
};

export default RecommendationsSection;
