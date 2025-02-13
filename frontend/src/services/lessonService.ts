import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json'
  }
});

export interface Lesson {
  _id: string;
  title: string;
  description: string;
  content: string;
  videoUrl?: string;
  order: number;
  duration: number;
  courseId: string;
  resources?: {
    title: string;
    url: string;
    type: string;
  }[];
}

const lessonService = {
  getLessonDetails: async (courseId: string, lessonId: string) => {
    const userString = localStorage.getItem('user');
    if (!userString) throw new Error('No authentication found');
    
    const { token } = JSON.parse(userString);
    
    const response = await api.get<Lesson>(
      `/student/courses/${courseId}/lessons/${lessonId}`,
      { headers: { Authorization: `Bearer ${token}` }}
    );
    
    return response.data;
  },

  markLessonComplete: async (courseId: string, lessonId: string) => {
    const userString = localStorage.getItem('user');
    if (!userString) throw new Error('No authentication found');
    
    const { token } = JSON.parse(userString);
    
    const response = await api.post(
      `/student/courses/${courseId}/lessons/${lessonId}/complete`,
      {},
      { headers: { Authorization: `Bearer ${token}` }}
    );
    
    return response.data;
  },

  getCourseLessons: async (courseId: string) => {
    const userString = localStorage.getItem('user');
    if (!userString) throw new Error('No authentication found');
    
    const { token } = JSON.parse(userString);
    
    const response = await api.get<Lesson[]>(
      `/student/courses/${courseId}/lessons`,
      { headers: { Authorization: `Bearer ${token}` }}
    );
    
    return response.data;
  }
};

export default lessonService;
