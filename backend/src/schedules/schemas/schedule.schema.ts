import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type ScheduleDocument = HydratedDocument<Schedule>;

@Schema({ timestamps: true })
export class Schedule {
  @Prop({ required: true })
  startTime: Date;

  @Prop({ required: true })
  endTime: Date;

  @Prop({ type: Types.ObjectId, ref: 'Course', required: true })
  courseId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Lesson' })
  lessonId?: Types.ObjectId;

  @Prop()
  recurrence?: string;

  @Prop()
  description?: string;
}
