// Enums (matching backend)
export enum QuestionType {
  MULTIPLE_CHOICE = 'MULTIPLE_CHOICE',
  TRUE_FALSE = 'TRUE_FALSE',
  MATCHING = 'MATCHING'
}

// Interfaces for Frontend
export interface QuestionChoice {
  text: string;
  isCorrect?: boolean;
}

export interface MatchingPair {
  term: string;
  definition: string;
}

export interface Question {
  _id?: string;
  type: QuestionType;
  text: string;
  points: number;
  choices?: QuestionChoice[];
  matchingPairs?: MatchingPair[];
  studentAnswer?: string | string[] | boolean; // For tracking student's response
}

// Assignment Interfaces
export interface Assignment {
  _id: string;
  title: string;
  description: string;
  dueDate: string;
  courseId: string;
  totalPoints?: number;
}

export interface AssignmentSubmission {
  submissionUrl?: string;
  submissionText?: string;
  attachments?: string[];
  courseId: string;
  assignmentId: string;
}

export interface AssignmentSubmissionResponse {
  message: string;
  submissionId: string;
  status: 'SUBMITTED' | 'PENDING' | 'GRADED';
  submittedAt: string;
}

// Interfaces for Assessments
export interface Assessment {
  _id: string;
  courseId: string;
  title: string;
  description: string;
  type: string;
  questions: Question[];
  totalPoints: number;
  timeLimit?: number;
  dueDate?: string;
  status?: 'NOT_STARTED' | 'IN_PROGRESS' | 'SUBMITTED';
}

export interface AssessmentSubmission {
  assessmentId: string;
  courseId: string;
  studentId: string;
  questions: {
    questionId: string;
    studentAnswer: any;
  }[];
}

export interface AssessmentResult {
  score: number;
  totalPoints: number;
  passed: boolean;
  feedback?: string;
}

// Unified Service for Assessments and Assignments
import axios from 'axios';

export class UnifiedAssessmentService {
  private baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';

  private getHeaders() {
    const token = localStorage.getItem('userToken');
    return {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
  }

  // Fetch all assessments or assessments for a specific course
  async getItems(courseId?: string, type: 'assessments' | 'assignments' = 'assessments'): Promise<(Assessment | Assignment)[]> {
    try {
      let url = `${this.baseUrl}/student/assessments`;
      
      // If courseId is provided, use the course-specific endpoint
      if (courseId) {
        url = `${this.baseUrl}/student/assessments/course/${courseId}`;
      }

      const response = await axios.get(url, { 
        headers: this.getHeaders(),
        withCredentials: true
      });

      // Handle different possible response structures
      const items = response.data.assessments || response.data;
      return Array.isArray(items) ? items : [];
    } catch (error) {
      console.error(`Error fetching ${type}:`, error);
      throw error;
    }
  }

  // Get a specific assessment by ID
  async getItem(courseId: string, itemId: string, type: 'assessments' | 'assignments' = 'assessments'): Promise<Assessment | Assignment> {
    try {
      const response = await axios.get(`${this.baseUrl}/student/assessments/${itemId}`, { 
        headers: this.getHeaders(),
        withCredentials: true
      });

      return response.data;
    } catch (error) {
      console.error(`Error fetching ${type} item:`, error);
      throw error;
    }
  }

  // Submit an assessment
  async submitItem(
    courseId: string, 
    itemId: string, 
    submission: AssessmentSubmission | AssignmentSubmission, 
    type: 'assessments' | 'assignments' = 'assessments'
  ): Promise<AssessmentResult | AssignmentSubmissionResponse> {
    try {
      const response = await axios.post(
        `${this.baseUrl}/student/assessments/${itemId}/submit`, 
        submission, 
        { 
          headers: this.getHeaders(),
          withCredentials: true
        }
      );

      return response.data;
    } catch (error) {
      console.error(`Error submitting ${type}:`, error);
      throw error;
    }
  }
}

// Course Service
export interface Course {
  _id: string;
  title: string;
  description: string;
  category?: string;
  difficulty?: string;
  coverImage?: string;
  instructorName?: string;
}

export class CourseService {
  private baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';

  private getHeaders() {
    const token = localStorage.getItem('userToken');
    return {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
  }

  async getCourses(): Promise<Course[]> {
    try {
      const response = await axios.get(`${this.baseUrl}/student/courses`, {
        headers: this.getHeaders(),
        withCredentials: true
      });
      return response.data.courses;
    } catch (error) {
      console.error('Error fetching courses:', error);
      throw error;
    }
  }

  async getCurrentCourse(): Promise<Course | null> {
    try {
      const courses = await this.getCourses();
      return courses.length > 0 ? courses[0] : null;
    } catch (error) {
      console.error('Error fetching current course:', error);
      throw error;
    }
  }

  async getCourseById(courseId: string): Promise<Course> {
    try {
      const response = await axios.get(`${this.baseUrl}/student/courses/${courseId}`, {
        headers: this.getHeaders(),
        withCredentials: true
      });
      return response.data;
    } catch (error) {
      console.error(`Error fetching course with ID ${courseId}:`, error);
      throw error;
    }
  }
}

// Example React Component State
export interface AssessmentPageState {
  assessment?: Assessment;
  currentQuestionIndex: number;
  answers: {
    [questionId: string]: string | string[] | boolean;
  };
  timeRemaining?: number;
  submissionStatus: 'NOT_STARTED' | 'IN_PROGRESS' | 'SUBMITTED';
}

// Deprecated: Keeping for backwards compatibility
export interface Assessment {
  _id: string;
  title: string;
  description: string;
  courseId: string;
  dueDate?: string;
  totalPoints: number;
  status?: 'NOT_STARTED' | 'IN_PROGRESS' | 'SUBMITTED';
  questions: AssessmentQuestion[];
}

export interface AssessmentQuestion {
  _id?: string;
  text: string;
  points: number;
  choices?: { text: string }[];
}

export interface AssessmentSubmission {
  assessmentId: string;
  courseId: string;
  studentId: string;
  questions: { questionId: string; studentAnswer: any }[];
}

export interface AssessmentResult {
  score: number;
  totalPoints: number;
  passed: boolean;
  feedback?: string;
}

// Deprecated service with warning methods
export class LegacyAssessmentService {
  async getAssessment(courseId: string, assessmentId: string): Promise<Assessment> {
    console.warn('Deprecated: Use UnifiedAssessmentService instead');
    const unifiedService = new UnifiedAssessmentService();
    const assessments = await unifiedService.getItems(courseId, 'assessments');
    const assessment = assessments.find(a => a._id === assessmentId);
    
    if (!assessment) {
      throw new Error('Assessment not found');
    }

    // Convert Assessment to Assessment interface
    return {
      _id: assessment._id,
      title: assessment.title,
      description: assessment.description,
      courseId: assessment.courseId,
      dueDate: assessment.dueDate,
      totalPoints: assessment.totalPoints || 0,
      status: 'NOT_STARTED',
      questions: [] // No questions in new assessment model
    };
  }

  async submitAssessment(submission: AssessmentSubmission): Promise<AssessmentResult> {
    console.warn('Deprecated: Use UnifiedAssessmentService instead');
    throw new Error('Detailed assessment submission is no longer supported');
  }
}

// Additional deprecated interface for backwards compatibility
export interface AssessmentProgress {
  assignmentId: string;
  timeRemaining?: number;
  submissionStatus: 'NOT_STARTED' | 'IN_PROGRESS' | 'SUBMITTED';
}
