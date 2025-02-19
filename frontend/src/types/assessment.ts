import axios from 'axios';

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
  studentAnswer?: string | string[] | boolean;
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
  itemId?: string;
}

export interface AssignmentSubmissionResponse {
  message: string;
  submissionId: string;
  status: 'SUBMITTED' | 'PENDING' | 'GRADED';
  submittedAt: string;
}

// Assessment Interfaces
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
export class UnifiedAssessmentService {
  private baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';

  private getHeaders() {
    const userString = localStorage.getItem('user');
    if (!userString) return {};
    
    const { token } = JSON.parse(userString);
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  }

  async getItems(courseId?: string, type: 'assessments' | 'assignments' = 'assessments'): Promise<(Assessment | Assignment)[]> {
    try {
      let url = `${this.baseUrl}/student/assessments`;
      
      if (courseId) {
        url = `${this.baseUrl}/student/assessments/course/${courseId}`;
      }

      const response = await axios.get(url, { 
        headers: this.getHeaders(),
        withCredentials: true
      });

      const items = response.data.assessments || response.data;
      return Array.isArray(items) ? items : [];
    } catch (error) {
      console.error(`Error fetching ${type}:`, error);
      throw error;
    }
  }

  async getItem(courseId: string, itemId: string, type: 'assessments' | 'assignments' = 'assessments'): Promise<Assessment | Assignment> {
    try {
      const response = await axios.get(
        `${this.baseUrl}/student/assessments/${itemId}`, 
        { 
          headers: this.getHeaders(),
          withCredentials: true
        }
      );

      return response.data;
    } catch (error) {
      console.error(`Error fetching ${type} item:`, error);
      throw error;
    }
  }

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

// Component State Interface
export interface AssessmentPageState {
  assessment?: Assessment;
  currentQuestionIndex: number;
  answers: {
    [questionId: string]: string | string[] | boolean;
  };
  timeRemaining?: number;
  submissionStatus: 'NOT_STARTED' | 'IN_PROGRESS' | 'SUBMITTED';
}
