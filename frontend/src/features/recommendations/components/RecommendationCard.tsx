import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { EnhancedRecommendation, FeedbackData } from '../types';

interface RecommendationCardProps {
  recommendation: EnhancedRecommendation;
  onAction: (action: string) => void;
  onFeedback: (feedback: FeedbackData) => void;
}

const RecommendationCard: React.FC<RecommendationCardProps> = ({
  recommendation,
  onAction,
  onFeedback,
}) => {
  const [expanded, setExpanded] = useState(false);

  const getRecommendationIcon = (type: string) => {
    const icons = {
      video: '🎥',
      interactive: '🎮',
      reading: '📚',
      practice: '✏️',
    };
    return icons[type] || '📋';
  };

  return (
    <motion.div 
      className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all w-full"
      whileHover={{ scale: 1.02 }}
      layout
    >
      <div className="flex flex-col md:flex-row items-center md:items-start gap-4">
        <div className="p-4 rounded-full bg-blue-100 flex items-center justify-center">
          {getRecommendationIcon(recommendation.type)}
        </div>
        
        <div className="flex-1 w-full">
          <h3 className="text-xl font-semibold mb-2 text-center md:text-left">{recommendation.title}</h3>
          
          <div className="flex items-center justify-center md:justify-start gap-2 mb-3">
            <span className={`px-2 py-1 rounded-full text-xs ${
              recommendation.priority === 'high' ? 'bg-red-100 text-red-800' :
              recommendation.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
              'bg-green-100 text-green-800'
            }`}>
              {recommendation.priority.charAt(0).toUpperCase() + recommendation.priority.slice(1)} Priority
            </span>
            <span className="text-sm text-gray-600">
              {recommendation.duration} min
            </span>
          </div>
          
          <AnimatePresence>
            {expanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden w-full"
              >
                <p className="text-gray-600 mb-4 text-center md:text-left">{recommendation.description}</p>
                <div className="flex flex-wrap gap-2 mb-4 justify-center md:justify-start">
                  {recommendation.tags.map(tag => (
                    <span key={tag} className="px-2 py-1 bg-gray-100 rounded-full text-xs">
                      {tag}
                    </span>
                  ))}
                </div>
                
                <div className="mb-4 w-full">
                  <h4 className="font-medium mb-2 text-center md:text-left">Learning Outcomes:</h4>
                  <ul className="list-disc list-inside text-gray-600 space-y-2">
                    {recommendation.learningOutcomes.map(outcome => (
                      <li key={outcome}>{outcome}</li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          <div className="flex items-center justify-center md:justify-start gap-3 mt-4">
            <button 
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
              onClick={() => onAction('start')}
            >
              Start Now
            </button>
            <button 
              className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
              onClick={() => onAction('schedule')}
            >
              Schedule
            </button>
            <button
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              onClick={() => setExpanded(!expanded)}
            >
              <span className="transform transition-transform block">
                {expanded ? '▼' : '▲'}
              </span>
            </button>
          </div>
        </div>
      </div>
      
      <div className="mt-4 pt-4 border-t w-full">
        <div className="flex items-center justify-between">
          <div className="flex gap-2 justify-center md:justify-start">
            <button
              className="p-2 hover:bg-gray-100 rounded-full"
              onClick={() => onFeedback({ helpful: true, difficulty: 3 })}
            >
              👍
            </button>
            <button
              className="p-2 hover:bg-gray-100 rounded-full"
              onClick={() => onFeedback({ helpful: false, difficulty: 3 })}
            >
              👎
            </button>
          </div>
          <div className="text-sm text-gray-500 text-center md:text-right">
            Confidence: {Math.round(recommendation.metadata.confidenceScore * 100)}%
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default RecommendationCard;
