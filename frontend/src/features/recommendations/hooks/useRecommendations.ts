import { useState, useEffect } from 'react';
import { EnhancedRecommendation, RecommendationContext } from '../types';
import AdaptiveRecommendationEngine from '../recommendationEngine';

const getDeviceType = () => {
  const ua = navigator.userAgent;
  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
    return 'tablet';
  }
  if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) {
    return 'mobile';
  }
  return 'desktop';
};

const getCurrentLocation = async (): Promise<string> => {
  // Implement location detection logic
  return 'unknown';
};

const getLastActivity = async (studentId: string): Promise<any> => {
  // Implement last activity fetching logic
  return {
    timestamp: new Date(),
    type: 'lesson_completion',
    details: {}
  };
};

export default function useRecommendations(studentId: string) {
  const [recommendations, setRecommendations] = useState<EnhancedRecommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const engine = new AdaptiveRecommendationEngine();
    
    const fetchRecommendations = async () => {
      try {
        setLoading(true);
        const context: RecommendationContext = {
          timeOfDay: new Date(),
          deviceType: getDeviceType(),
          location: await getCurrentLocation(),
          lastActivity: await getLastActivity(studentId)
        };
        
        const newRecommendations = await engine.generateRecommendations(
          studentId,
          context
        );
        
        setRecommendations(newRecommendations);
        setError(null);
      } catch (error) {
        console.error('Failed to fetch recommendations:', error);
        setError(error as Error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchRecommendations();

    // Refresh recommendations periodically or on specific events
    const refreshInterval = setInterval(fetchRecommendations, 30 * 60 * 1000); // Every 30 minutes

    return () => {
      clearInterval(refreshInterval);
    };
  }, [studentId]);

  const refreshRecommendations = async () => {
    setLoading(true);
    const engine = new AdaptiveRecommendationEngine();
    try {
      const context: RecommendationContext = {
        timeOfDay: new Date(),
        deviceType: getDeviceType(),
        location: await getCurrentLocation(),
        lastActivity: await getLastActivity(studentId)
      };
      
      const newRecommendations = await engine.generateRecommendations(
        studentId,
        context
      );
      
      setRecommendations(newRecommendations);
      setError(null);
    } catch (error) {
      console.error('Failed to refresh recommendations:', error);
      setError(error as Error);
    } finally {
      setLoading(false);
    }
  };

  return {
    recommendations,
    loading,
    error,
    refreshRecommendations
  };
}
