import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type CourseDocument = HydratedDocument<Course>;

@Schema({ timestamps: true })
export class Course {
  @Prop({ required: true, default: '' })
  title: string = '';

  @Prop({ default: '' })
  description: string = '';

  @Prop({ default: '' })
  code: string = '';

  @Prop({ default: 'beginner' })
  level: string = 'beginner';

  @Prop({ default: '' })
  category: string = '';

  @Prop({ type: [{ type: Types.ObjectId }], default: [] })
  instructorIds: Types.ObjectId[] = [];

  @Prop({ type: [{ type: Types.ObjectId }], default: [] })
  studentIds: Types.ObjectId[] = [];

  @Prop({ type: [{ type: Types.ObjectId }], default: [] })
  materials: Types.ObjectId[] = [];

  @Prop({ type: [{ type: Types.ObjectId }], default: [] })
  lessons: Types.ObjectId[] = [];

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Assignment' }], default: [] })
  assignments: Types.ObjectId[] = [];

  @Prop({ type: [{ type: Types.ObjectId }], default: [] })
  schedules: Types.ObjectId[] = [];

  @Prop({ default: 0 })
  rating: number = 0;

  @Prop({ default: false })
  published: boolean = false;

  @Prop({ type: [String], default: [] })
  tags: string[] = [];

  @Prop({ type: [{ 
    type: { 
      type: String, 
      enum: ['video', 'text', 'document'],
      default: 'text'
    },
    title: { type: String, default: '' },
    url: { type: String, default: '' },
    description: { type: String, default: '' }
  }], default: [] })
  content: Array<{
    type: string;
    title: string;
    url: string;
    description?: string;
  }> = [];
}

export const CourseSchema = SchemaFactory.createForClass(Course);
