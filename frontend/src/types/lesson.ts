export interface Lesson {
  _id: string;
  courseId: string;
  title: string;
  description: string;
  content: string;
  order: number;
  duration: number;
  resources?: Resource[];
  quiz?: Quiz;
  completed: boolean;
}

export interface Resource {
  id: string;
  title: string;
  type: 'pdf' | 'video' | 'link' | 'image';
  url: string;
}

export interface Quiz {
  id: string;
  title: string;
  questions: Question[];
}

export interface Question {
  id: string;
  text: string;
  options: string[];
  correctOptionIndex: number;
}

export interface CourseProgress {
  courseId: string;
  completedLessons: string[];
  quizScores: Record<string, number>;
  lastAccessedLessonId: string;
  overallProgress: number;
}

// Client-side course content parser
export class CourseContentParser {
  /**
   * Parses course content into lessons
   * @param course The course object
   * @param content The course content (could be HTML, markdown, or structured JSON)
   * @returns Array of lessons
   */
  static parseContent(course: any, content?: string): Lesson[] {
    // If the course already has modules/sections defined, use those
    if (course.modules && Array.isArray(course.modules) && course.modules.length > 0) {
      return this.parseCourseModules(course);
    }
    
    // If the course has a curriculum array, use that
    if (course.curriculum && Array.isArray(course.curriculum) && course.curriculum.length > 0) {
      return this.parseCurriculum(course);
    }
    
    // If we have topics, use those
    if (course.topics && Array.isArray(course.topics) && course.topics.length > 0) {
      return this.parseTopics(course);
    }
    
    // If we have learning objectives, create lessons from those
    if (course.learningObjectives && Array.isArray(course.learningObjectives) && course.learningObjectives.length > 0) {
      return this.parseLearningObjectives(course);
    }
    
    // If we have a description, create a single lesson
    if (course.description) {
      return this.createBasicLessons(course);
    }
    
    // Fallback: Create a placeholder lesson
    return [{
      id: `${course._id}-lesson-1`,
      title: 'Course Introduction',
      description: 'Introduction to the course',
      content: 'This course content is being prepared. Please check back later.',
      order: 1,
      duration: '10 mins',
      completed: false
    }];
  }
  
  private static parseCourseModules(course: any): Lesson[] {
    return course.modules.flatMap((module: any, moduleIndex: number) => {
      // If the module has topics, create a lesson for each topic
      if (module.topics && Array.isArray(module.topics) && module.topics.length > 0) {
        return module.topics.map((topic: string, topicIndex: number) => ({
          _id: `${course._id}-module-${moduleIndex + 1}-topic-${topicIndex + 1}`,
          courseId: course._id,
          title: topic,
          description: `Part of ${module.title || `Module ${moduleIndex + 1}`}`,
          content: `Content for ${topic}`,
          order: moduleIndex * 100 + topicIndex + 1,
          duration: module.duration ? `${Math.ceil(parseInt(module.duration) / module.topics.length)} mins` : '15 mins',
          completed: false
        }));
      }
      
      // If no topics, create a single lesson for the module
      return [{
        _id: `${course._id}-module-${moduleIndex + 1}`,
        courseId: course._id,
        title: module.title || `Module ${moduleIndex + 1}`,
        description: module.description || `Content for module ${moduleIndex + 1}`,
        content: module.content || `This module covers important concepts in ${course.title}`,
        order: moduleIndex + 1,
        duration: module.duration || '30 mins',
        completed: false
      }];
    });
  }
  
  private static parseCurriculum(course: any): Lesson[] {
    return course.curriculum.map((item: string, index: number) => ({
      _id: `${course._id}-curriculum-${index + 1}`,
      courseId: course._id,
      title: item,
      description: `Lesson ${index + 1}`,
      content: `Content for ${item}`,
      order: index + 1,
      duration: 20,
      completed: false
    }));
  }
  
  private static parseTopics(course: any): Lesson[] {
    return course.topics.map((topic: any, index: number) => ({
      _id: `${course._id}-topic-${index + 1}`,
      courseId: course._id,
      title: topic.title || `Topic ${index + 1}`,
      description: topic.description || `Description for topic ${index + 1}`,
      content: topic.content || `Content for ${topic.title || `Topic ${index + 1}`}`,
      order: index + 1,
      duration: 25,
      completed: false
    }));
  }
  
  private static parseLearningObjectives(course: any): Lesson[] {
    return course.learningObjectives.map((objective: string, index: number) => ({
      _id: `${course._id}-objective-${index + 1}`,
      courseId: course._id,
      title: `Lesson ${index + 1}: ${objective.split(' ').slice(0, 5).join(' ')}...`,
      description: objective,
      content: `This lesson will help you achieve the following objective: ${objective}`,
      order: index + 1,
      duration: 30,
      completed: false
    }));
  }
  
  private static createBasicLessons(course: any): Lesson[] {
    // Create 3-5 lessons based on the course description
    const lessonCount = Math.min(Math.max(3, Math.ceil(course.description.length / 200)), 5);
    
    return Array.from({ length: lessonCount }, (_, index) => ({
      _id: `${course._id}-lesson-${index + 1}`,
      courseId: course._id,
      title: index === 0 
        ? 'Course Introduction' 
        : index === lessonCount - 1 
          ? 'Course Summary' 
          : `Lesson ${index + 1}`,
      description: index === 0 
        ? 'Introduction to the course' 
        : index === lessonCount - 1 
          ? 'Summary and next steps' 
          : `Core concepts - part ${index}`,
      content: index === 0 
        ? `Welcome to ${course.title}! ${course.description.substring(0, 200)}...` 
        : index === lessonCount - 1 
          ? 'Congratulations on completing the course! Here\'s a summary of what you\'ve learned.' 
          : `This lesson covers important concepts in ${course.title}.`,
      order: index + 1,
      duration: 20,
      completed: false
    }));
  }
}
