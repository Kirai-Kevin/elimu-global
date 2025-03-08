import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json'
  }
});

export interface EnrolledCourse {
  _id: string;
  courseId: {
    _id: string;
    title: string;
    description: string;
  };
  status: string;
  enrolledAt: string;
  progress: number;
}

export interface Course {
  _id: string;
  title: string;
  description: string;
  category?: string;
  difficulty?: string;
  coverImage?: string;
  instructorName?: string;
}

const courseService = {
  enrollInCourse: async (courseId: string) => {
    try {
      const userString = localStorage.getItem('user');
      if (!userString) throw new Error('No authentication found');
      
      const { token } = JSON.parse(userString);

      // Using the correct endpoint format
      const response = await api.post(
        `/student/courses/${courseId}/enroll`,
        {},  // empty body
        { 
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      return response.data;
    } catch (error) {
      console.error('Enrollment error:', error);
      if (axios.isAxiosError(error)) {
        throw new Error(
          error.response?.data?.message || 
          error.response?.data?.error || 
          'Failed to enroll in course'
        );
      }
      throw error;
    }
  },

  getEnrolledCourses: async () => {
    try {
      const userString = localStorage.getItem('user');
      if (!userString) throw new Error('No authentication found');
      
      const { token } = JSON.parse(userString);
      
      const response = await api.get<EnrolledCourse[]>(
        '/student/courses/enrolled',
        { headers: { Authorization: `Bearer ${token}` }}
      );
      
      return response.data;
    } catch (error) {
      console.error('Error fetching enrolled courses:', error);
      if (axios.isAxiosError(error)) {
        throw new Error(
          error.response?.data?.message || 
          'Failed to fetch enrolled courses'
        );
      }
      throw error;
    }
  },

  checkEnrollmentStatus: async (courseId: string) => {
    try {
      const courses = await courseService.getEnrolledCourses();
      return courses.some(course => course.courseId._id === courseId);
    } catch (error) {
      console.error('Error checking enrollment status:', error);
      return false;
    }
  },

  getCourseById: async (courseId: string) => {
    try {
      const userString = localStorage.getItem('user');
      if (!userString) throw new Error('No authentication found');
      
      const { token } = JSON.parse(userString);
      
      const response = await api.get<Course>(
        `/student/courses/${courseId}`,
        { headers: { Authorization: `Bearer ${token}` }}
      );
      
      return response.data;
    } catch (error) {
      console.error('Error fetching course details:', error);
      if (axios.isAxiosError(error)) {
        throw new Error(
          error.response?.data?.message || 
          'Failed to fetch course details'
        );
      }
      throw error;
    }
  },

  getCurrentCourse: async () => {
    try {
      const userString = localStorage.getItem('user');
      if (!userString) {
        return null;
      }
      
      const { token } = JSON.parse(userString);
      
      // First try to get enrolled courses
      try {
        const enrolledCourses = await courseService.getEnrolledCourses();
        
        if (enrolledCourses && enrolledCourses.length > 0 && enrolledCourses[0].courseId) {
          // Return the first enrolled course as the current course
          return {
            _id: enrolledCourses[0].courseId._id,
            title: enrolledCourses[0].courseId.title,
            description: enrolledCourses[0].courseId.description
          };
        }
      } catch (enrolledError) {
        console.error('Error fetching enrolled courses:', enrolledError);
      }

      // If no enrolled courses, try to get available courses
      try {
        const response = await api.get<{ courses: Course[] }>(
          '/student/courses',
          { headers: { Authorization: `Bearer ${token}` }}
        );
        
        if (response.data.courses && response.data.courses.length > 0) {
          return response.data.courses[0];
        }
      } catch (availableError) {
        console.error('Error fetching available courses:', availableError);
      }

      return null;
    } catch (error) {
      console.error('Error fetching current course:', error);
      if (axios.isAxiosError(error)) {
        throw new Error(
          error.response?.data?.message || 
          'Failed to fetch current course'
        );
      }
      throw error;
    }
  }
};

export default courseService;
