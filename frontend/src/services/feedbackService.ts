import { apiClient } from '../utils/api';

export interface FeedbackItem {
  id: string;
  createdAt: string;
  content: string;
  rating?: number;
}

export interface CreateFeedbackData {
  content: string;
  rating?: number;
}

export const submitFeedback = async (feedback: CreateFeedbackData): Promise<FeedbackItem> => {
  const response = await apiClient.post('/student/feedback', feedback);
  return response.data;
};

export const getFeedbackHistory = async (): Promise<FeedbackItem[]> => {
  const response = await apiClient.get('/student/feedback');
  return response.data;
};
