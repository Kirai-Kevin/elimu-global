import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type AssignmentDocument = HydratedDocument<Assignment>;

@Schema({ timestamps: true })
export class Assignment {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  dueDate: Date;

  @Prop({ type: Types.ObjectId, ref: 'Course', required: true })
  courseId: Types.ObjectId;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Submission' }] })
  submissions: Types.ObjectId[];
}

export const AssignmentSchema = SchemaFactory.createForClass(Assignment);
