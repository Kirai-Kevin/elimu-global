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
  }
};

export default courseService;
