import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type SubmissionDocument = HydratedDocument<Submission>;

@Schema({ timestamps: true })
export class Submission {
  @Prop({ required: true })
  content: string;

  @Prop()
  fileUrl?: string;

  @Prop({ type: Types.ObjectId, ref: 'Assignment', required: true })
  assignmentId: Types.ObjectId;

  @Prop()
  grade?: number;

  @Prop()
  feedback?: string;
}

export const SubmissionSchema = SchemaFactory.createForClass(Submission);
