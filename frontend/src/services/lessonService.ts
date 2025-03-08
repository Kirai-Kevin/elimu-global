import { CourseProgress, CourseContentParser } from '../types/lesson';
import axios from 'axios';

// Local storage keys
const LESSONS_STORAGE_KEY = 'course_lessons';
const PROGRESS_STORAGE_KEY = 'course_progress';

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

/**
 * Service for managing course lessons
 */
const lessonService = {
  // Local Storage Functions
  getLessons(courseId: string): Lesson[] {
    try {
      const storedLessons = localStorage.getItem(`${LESSONS_STORAGE_KEY}_${courseId}`);
      if (storedLessons) {
        return JSON.parse(storedLessons);
      }
      return [];
    } catch (error) {
      console.error('Error getting lessons:', error);
      return [];
    }
  },

  generateLessons(course: any): Lesson[] {
    try {
      const lessons = CourseContentParser.parseContent(course);
      localStorage.setItem(`${LESSONS_STORAGE_KEY}_${course._id}`, JSON.stringify(lessons));
      this.initializeCourseProgress(course._id);
      return lessons;
    } catch (error) {
      console.error('Error generating lessons:', error);
      return [];
    }
  },

  getLesson(courseId: string, lessonId: string): Lesson | null {
    try {
      const lessons = this.getLessons(courseId);
      return lessons.find(lesson => lesson.id === lessonId) || null;
    } catch (error) {
      console.error('Error getting lesson:', error);
      return null;
    }
  },

  getNextLesson(courseId: string, currentLessonId: string): Lesson | null {
    try {
      const lessons = this.getLessons(courseId);
      const currentIndex = lessons.findIndex(lesson => lesson.id === currentLessonId);
      if (currentIndex === -1 || currentIndex === lessons.length - 1) {
        return null;
      }
      return lessons[currentIndex + 1];
    } catch (error) {
      console.error('Error getting next lesson:', error);
      return null;
    }
  },

  getPreviousLesson(courseId: string, currentLessonId: string): Lesson | null {
    try {
      const lessons = this.getLessons(courseId);
      const currentIndex = lessons.findIndex(lesson => lesson.id === currentLessonId);
      if (currentIndex <= 0) {
        return null;
      }
      return lessons[currentIndex - 1];
    } catch (error) {
      console.error('Error getting previous lesson:', error);
      return null;
    }
  },

  markLessonAsCompleted(courseId: string, lessonId: string): CourseProgress {
    try {
      const progress = this.getCourseProgress(courseId);
      if (!progress.completedLessons.includes(lessonId)) {
        progress.completedLessons.push(lessonId);
      }
      progress.lastAccessedLessonId = lessonId;
      const lessons = this.getLessons(courseId);
      progress.overallProgress = lessons.length > 0
        ? Math.round((progress.completedLessons.length / lessons.length) * 100)
        : 0;
      this.saveCourseProgress(courseId, progress);
      this.updateLessonCompletionStatus(courseId);
      return progress;
    } catch (error) {
      console.error('Error marking lesson as completed:', error);
      return this.getCourseProgress(courseId);
    }
  },

  saveQuizScore(courseId: string, lessonId: string, score: number): CourseProgress {
    try {
      const progress = this.getCourseProgress(courseId);
      progress.quizScores[lessonId] = score;
      if (score >= 70) {
        return this.markLessonAsCompleted(courseId, lessonId);
      }
      this.saveCourseProgress(courseId, progress);
      return progress;
    } catch (error) {
      console.error('Error saving quiz score:', error);
      return this.getCourseProgress(courseId);
    }
  },

  getCourseProgress(courseId: string): CourseProgress {
    try {
      const storedProgress = localStorage.getItem(`${PROGRESS_STORAGE_KEY}_${courseId}`);
      if (storedProgress) {
        return JSON.parse(storedProgress);
      }
      return this.initializeCourseProgress(courseId);
    } catch (error) {
      console.error('Error getting course progress:', error);
      return this.initializeCourseProgress(courseId);
    }
  },

  initializeCourseProgress(courseId: string): CourseProgress {
    const lessons = this.getLessons(courseId);
    const firstLessonId = lessons.length > 0 ? lessons[0].id : '';
    const progress: CourseProgress = {
      courseId,
      completedLessons: [],
      quizScores: {},
      lastAccessedLessonId: firstLessonId,
      overallProgress: 0
    };
    this.saveCourseProgress(courseId, progress);
    return progress;
  },

  saveCourseProgress(courseId: string, progress: CourseProgress): void {
    try {
      localStorage.setItem(`${PROGRESS_STORAGE_KEY}_${courseId}`, JSON.stringify(progress));
    } catch (error) {
      console.error('Error saving course progress:', error);
    }
  },

  updateLessonCompletionStatus(courseId: string): void {
    try {
      const lessons = this.getLessons(courseId);
      const progress = this.getCourseProgress(courseId);
      const updatedLessons = lessons.map(lesson => ({
        ...lesson,
        completed: progress.completedLessons.includes(lesson.id)
      }));
      localStorage.setItem(`${LESSONS_STORAGE_KEY}_${courseId}`, JSON.stringify(updatedLessons));
    } catch (error) {
      console.error('Error updating lesson completion status:', error);
    }
  },

  resetCourseProgress(courseId: string): CourseProgress {
    try {
      localStorage.removeItem(`${PROGRESS_STORAGE_KEY}_${courseId}`);
      const progress = this.initializeCourseProgress(courseId);
      this.updateLessonCompletionStatus(courseId);
      return progress;
    } catch (error) {
      console.error('Error resetting course progress:', error);
      return this.initializeCourseProgress(courseId);
    }
  },

  // API Functions
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
