import axios from 'axios';
import { getAuthToken } from '../utils/api';

// Define the Instructor interface
export interface Instructor {
  name?: string;
  title?: string;
  expertise?: string;
  rating?: number;
}

// Define the FreeCourse interface to match backend
export interface FreeCourse {
  tags: never[];
  duration: string;
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

// Define the FreeCourse interface based on the provided specification
export interface NewFreeCourse {
  id: string;
  title: string;
  description: string;
  subject: string;
  url: string;
  provider: string;
  thumbnail?: string;
  duration?: string;
  level?: string;
  tags?: string[];
}

export interface CourseModule {
  title: string;
  description?: string;
  duration?: string;
  topics?: string[];
  content?: string;
  resources?: string[];
}

export interface PopularSubject {
  name: string;
  courseCount: number;
}

// Use port 3000 for backend
const BASE_URL = 'http://localhost:3000/free-courses';

export default {
  // Search free courses
  async searchCourses(subject: string): Promise<FreeCourse[]> {
    try {
      const token = getAuthToken();
      const headers = {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      };

      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000'}/student/free-courses/search`, {
        params: { subject },
        headers,
        withCredentials: true
      });

      // Ensure we return an array of courses
      const courses = response.data.courses || response.data;
      return Array.isArray(courses) ? this.deduplicateCourses(courses) : [];
    } catch (error) {
      console.error('Error searching free courses:', error);
      return [];
    }
  },

  // Get popular subjects
  async getPopularSubjects(): Promise<PopularSubject[]> {
    try {
      const token = getAuthToken();
      const headers = {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      };

      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000'}/student/free-courses/popular-subjects`, {
        headers,
        withCredentials: true
      });

      // Ensure we return an array of subjects
      const subjects = response.data.subjects || response.data;
      return Array.isArray(subjects) ? subjects : [];
    } catch (error) {
      console.error('Error fetching popular subjects:', error);
      return [];
    }
  },

  // Get all available courses
  async getAllCourses(): Promise<FreeCourse[]> {
    try {
      const token = getAuthToken();
      const headers = {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      };

      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000'}/student/free-courses`, 
        { 
          headers, 
          withCredentials: true 
        }
      );

      // Ensure we return an array of courses
      const courses = response.data.courses || response.data;
      return Array.isArray(courses) ? this.deduplicateCourses(courses) : [];
    } catch (error) {
      console.error('Error fetching free courses:', error);
      return [];
    }
  },

  // Deprecated: Use getAllCourses instead
  async getFeaturedCourses(): Promise<FreeCourse[]> {
    return this.getAllCourses();
  },

  // Get course by ID with dynamic endpoint selection
  async getCourseById(courseId: string): Promise<FreeCourse> {
    try {
      const token = getAuthToken();
      const headers = {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      };

      let response;
      try {
        // First, try the student/courses endpoint for all courses
        response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000'}/student/courses/${courseId}`, 
          { 
            headers, 
            withCredentials: true 
          }
        );
      } catch (studentCoursesError) {
        // If that fails, try the free courses endpoint (legacy support)
        try {
          response = await axios.get(
            `${import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000'}/student/free-courses/${courseId}`, 
            { 
              headers, 
              withCredentials: true 
            }
          );
        } catch (freeCourseError) {
          // If both fail, throw the original error
          console.error('Error fetching course details:', studentCoursesError);
          throw studentCoursesError;
        }
      }

      // Return the course details
      return response.data;
    } catch (error) {
      console.error('Error fetching course details:', error);
      throw error;
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

  // Enroll in a course
  async enrollInCourse(courseId: string): Promise<boolean> {
    try {
      const token = getAuthToken();
      const headers = {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      };

      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000'}/student/courses/${courseId}/enroll`, 
        {}, // Empty body as the courseId is in the URL
        { 
          headers, 
          withCredentials: true 
        }
      );

      return response.status === 200 || response.status === 201;
    } catch (error) {
      console.error('Error enrolling in course:', error);
      return false;
    }
  },

  // Get enrolled courses
  async getEnrolledCourses(): Promise<FreeCourse[]> {
    try {
      const token = getAuthToken();
      const headers = {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      };

      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000'}/student/courses/enrolled`, 
        { 
          headers, 
          withCredentials: true 
        }
      );

      // Transform enrolled courses to extract course details
      const transformedCourses: FreeCourse[] = response.data.map((enrollment: any) => ({
        ...enrollment.courseId,
        enrollmentDetails: {
          _id: enrollment._id,
          status: enrollment.status,
          enrolledAt: enrollment.enrolledAt,
          certificateIssued: enrollment.certificateIssued,
          courseCompletionPercentage: enrollment.courseCompletionPercentage
        }
      }));

      return Array.isArray(transformedCourses) ? this.deduplicateCourses(transformedCourses) : [];
    } catch (error) {
      console.error('Error fetching enrolled courses:', error);
      return [];
    }
  },

  // Deduplicate courses based on unique identifiers
  deduplicateCourses(courses: FreeCourse[]): FreeCourse[] {
    const uniqueCourses = new Map<string, FreeCourse>();

    courses.forEach(course => {
      // Use a combination of _id and title as a unique key
      const uniqueKey = `${course._id}-${course.title}`;
      
      // Keep the first occurrence of a course or prefer courses with more details
      if (!uniqueCourses.has(uniqueKey) || 
          (course.sourceContent?.thumbnail && course.description && course.duration)) {
        uniqueCourses.set(uniqueKey, course);
      }
    });

    // Sort courses by platform to provide consistent results
    return Array.from(uniqueCourses.values())
      .sort((a, b) => a.sourceContent?.platform.localeCompare(b.sourceContent?.platform));
  }
};
