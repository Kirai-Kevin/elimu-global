export interface FreeCourseResponse {
  _id: any;
  id: string;
  title: string;
  description: string;
  courseId: string;
  level: string;
  subject: string;
  learningObjectives: string[];
  prerequisites: string[];
  estimatedHours: number;
  topics: string[];
  sourceContent: {
    fileId: string;
    fileName: string;
  };
}
