import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type CourseDocument = HydratedDocument<Course>;

@Schema({ timestamps: true })
export class Course {
  @Prop({ required: true })
  title: string;

  @Prop()
  description?: string;

  @Prop()
  code?: string;

  @Prop({ type: [{ type: Types.ObjectId }], default: [] })
  instructorIds?: Types.ObjectId[];

  @Prop({ type: [{ type: Types.ObjectId }], default: [] })
  studentIds?: Types.ObjectId[];

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Assignment' }] })
  assignments?: Types.ObjectId[];
}

export const CourseSchema = SchemaFactory.createForClass(Course);
