import axios from 'axios';

// Define the Instructor interface
export interface Instructor {
  name?: string;
  title?: string;
  expertise?: string;
  rating?: number;
}

// Define the FreeCourse interface to match backend
export interface FreeCourse {
  _id?: string;
  title: string;
  description: string;
  courseId: string;
  category?: string;
  difficulty?: string;
  curriculum?: string[];
  learningObjectives?: string[];
  estimatedHours?: string;
  modules?: Array<{
    title?: string;
    duration?: string;
    topics?: string[];
    hasQuiz?: boolean;
    hasProject?: boolean;
  }>;
  requirements?: string[];
  instructor?: Instructor;
  enrollmentCount?: number;
  rating?: number;
  sourceContent?: {
    platform?: string;
    originalUrl?: string;
  };
}

// Use port 3000 for backend
const BASE_URL = 'http://localhost:3000/free-courses';

export const FreeCourseService = {
  // Fetch all free courses
  async getAllCourses(): Promise<FreeCourse[]> {
    try {
      const response = await axios.get(BASE_URL, {
        timeout: 5000,  // 5 seconds timeout
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching free courses:', error);
      
      // More detailed error logging
      if (axios.isAxiosError(error)) {
        if (error.response) {
          // The request was made and the server responded with a status code
          console.error('Server responded with:', error.response.data);
          console.error('Status code:', error.response.status);
        } else if (error.request) {
          // The request was made but no response was received
          console.error('No response received:', error.request);
        } else {
          // Something happened in setting up the request
          console.error('Error setting up request:', error.message);
        }
      }

      // Return an empty array or throw a custom error
      return [];
    }
  },

  // Fetch featured courses
  async getFeaturedCourses(): Promise<FreeCourse[]> {
    try {
      const response = await axios.get(`${BASE_URL}/featured`);
      return response.data;
    } catch (error) {
      console.error('Error fetching featured courses:', error);
      throw error; // Rethrow to allow component to handle error
    }
  },

  // Search courses with optional filters
  async searchCourses(params: {
    category?: string;
    platform?: string;
    level?: string;
  }): Promise<FreeCourse[]> {
    try {
      const response = await axios.get(`${BASE_URL}/search`, { params });
      return response.data;
    } catch (error) {
      console.error('Error searching courses:', error);
      throw error; // Rethrow to allow component to handle error
    }
  },

  // Get course by ID
  async getCourseById(courseId: string): Promise<FreeCourse> {
    try {
      const response = await axios.get(`${BASE_URL}/course/${courseId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching course by ID:', error);
      
      // Fallback for development: return a mock course if API call fails
      return {
        title: 'Sample Course',
        description: 'This is a sample course loaded when API fails',
        courseId: courseId,
        modules: [],
        requirements: [],
        curriculum: [],
        learningObjectives: ['Learn basic concepts'],
        instructor: {
          name: 'Elimu Global Instructor',
          title: 'Course Facilitator',
        },
        rating: 4.5,
        enrollmentCount: 100,
        difficulty: 'Beginner',
        estimatedHours: '10',
      };
    }
  },

  // Get PDF content for a course
  async getPDFContent(courseId: string): Promise<string | null> {
    try {
      const response = await axios.get(`${BASE_URL}/course/${courseId}/pdf-content`);
      return response.data || null;
    } catch (error) {
      console.error('Error fetching PDF content:', error);
      return null;
    }
  },
};
