import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type LessonDocument = HydratedDocument<Lesson>;

@Schema({ timestamps: true })
export class Lesson {
  @Prop({ required: true })
  title!: string;

  @Prop()
  description?: string;

  @Prop({ type: Types.ObjectId, ref: 'Course', required: true })
  courseId!: Types.ObjectId;

  @Prop()
  content?: string;

  @Prop()
  videoUrl?: string;

  @Prop({ type: Types.ObjectId, ref: 'Schedule' })
  schedule?: Types.ObjectId;
}
