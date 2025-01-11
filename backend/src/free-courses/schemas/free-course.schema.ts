import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

// Interface for Lesson
export interface Lesson {
  title: string;
  description: string;
  duration: string;
  topics: string[];
  hasQuiz: boolean;
  hasProject: boolean;
  isOptional?: boolean;
}

// Schema for Lesson
export const LessonSchema = {
  title: String,
  description: String,
  duration: String,
  topics: [String],
  hasQuiz: Boolean,
  hasProject: Boolean,
  isOptional: Boolean
};

// Interface for Module
export interface CourseModule {
  title: string;
  duration: string;
  topics: string[];
  hasQuiz: boolean;
  hasProject: boolean;
  lessons?: Lesson[];
}

// Schema for Module
export const CourseModuleSchema = {
  title: String,
  duration: String,
  topics: [String],
  hasQuiz: Boolean,
  hasProject: Boolean,
  lessons: [LessonSchema]
};

// Interface for API responses
export interface FreeCourseResponse {
  _id: any;
  id: string;
  title: string;
  description: string;
  url: string;
  platform: string;
  category?: string;
  level?: string;
  isFeatured?: boolean;
  courseId: string;
  curriculum: string[];
  learningObjectives: string[];
  estimatedHours: number;
  modules: CourseModule[];
  requirements: string[];
  instructor: {
    name: string;
    title: string;
    expertise: string;
    rating: number;
  };
  enrollmentCount: number;
  rating: string;
  htmlContent: string;
  sourceContent: {
    platform: string;
    originalUrl: string;
    fileId?: string;
  };
}

export type FreeCourseDocument = FreeCourse & Document;

@Schema()
export class FreeCourse {
  @Prop({ required: true, unique: true })
  courseId: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  level: string;

  @Prop({ required: true })
  subject: string;

  @Prop({ type: [String], required: true })
  learningObjectives: string[];

  @Prop({ type: [String], required: true })
  prerequisites: string[];

  @Prop({ required: true })
  estimatedHours: number;

  @Prop({ type: [String], required: true })
  topics: string[];

  @Prop({
    type: {
      fileId: String,
      fileName: String
    },
    required: true
  })
  sourceContent: {
    fileId: string;
    fileName: string;
  };
}

export const FreeCourseSchema = SchemaFactory.createForClass(FreeCourse);
