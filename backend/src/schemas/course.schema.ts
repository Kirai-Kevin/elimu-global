import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type CourseDocument = HydratedDocument<Course>;

@Schema()
export class Course {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop()
  content?: string;

  @Prop({ default: 'beginner' })
  level: string;

  @Prop({ default: 'uncategorized' })
  category: string;

  @Prop()
  videoUrl?: string;

  @Prop()
  duration?: number;

  @Prop({ type: [Types.ObjectId], ref: 'User' })
  instructorIds: Types.ObjectId[];

  @Prop({ type: [Types.ObjectId], ref: 'User' })
  studentIds: Types.ObjectId[];

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Material' }] })
  materials: Types.ObjectId[];

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Lesson' }] })
  lessons: Types.ObjectId[];

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Assignment' }] })
  assignments: Types.ObjectId[];

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Schedule' }] })
  schedules: Types.ObjectId[];

  @Prop({ default: 0 })
  rating: number;

  @Prop({ default: false })
  published: boolean;

  @Prop({ type: [String], default: [] })
  tags: string[];
}

export const CourseSchema = SchemaFactory.createForClass(Course);
