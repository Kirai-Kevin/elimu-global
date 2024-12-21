export interface EnhancedRecommendation {
  id: string;
  type: RecommendationType;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  duration: number;
  difficulty: 1 | 2 | 3 | 4 | 5;
  tags: string[];
  learningOutcomes: string[];
  prerequisites: string[];
  adaptiveContent: {
    easy: ContentVariant;
    medium: ContentVariant;
    hard: ContentVariant;
  };
  metadata: {
    confidenceScore: number;
    reasoningPath: string[];
    dataPoints: RecommendationDataPoints;
  };
}

export type RecommendationType = 'video' | 'interactive' | 'reading' | 'practice';

export interface ContentVariant {
  content: string;
  resources: string[];
  estimatedDuration: number;
}

export interface RecommendationDataPoints {
  pastPerformance: number;
  peerComparison: number;
  currentGoals: string[];
  engagementScore: number;
}

export interface StudentData {
  performance: PerformanceData;
  style: LearningStyle;
  engagement: EngagementMetrics;
  emotional: EmotionalState;
  goals: LearningGoals;
}

export interface RecommendationContext {
  timeOfDay: Date;
  deviceType: string;
  location: string;
  lastActivity: LastActivity;
}

export interface FeedbackData {
  helpful: boolean;
  difficulty: 1 | 2 | 3 | 4 | 5;
  comments?: string;
  completionStatus?: 'completed' | 'partially' | 'not_started';
}
