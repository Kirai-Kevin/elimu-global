import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Course } from '../../courses/schemas/course.schema.js';
import { Submission } from './submission.schema.js';
import { IsString, IsOptional } from 'class-validator';

export type AssignmentDocument = HydratedDocument<Assignment>;

@Schema({ timestamps: true })
export class Assignment {
  @Prop({ required: true })
  title!: string;

  @Prop({ required: true })
  description!: string;

  @Prop({ type: Types.ObjectId, ref: 'Course', required: true })
  courseId!: Types.ObjectId | Course;

  @Prop({ type: Date, required: true })
  dueDate!: Date;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Submission' }], default: [] })
  submissions!: Types.ObjectId[] | Submission[];

  @Prop({ type: Date, default: Date.now })
  createdAt!: Date;

  @Prop({ type: Date, default: Date.now })
  updatedAt!: Date;

  @Prop({ default: true })
  isActive!: boolean;
}

export const AssignmentSchema = SchemaFactory.createForClass(Assignment);
