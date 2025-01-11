import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Assignment } from './assignment.schema';
import { User } from '../../schemas/user.schema';

export type SubmissionDocument = HydratedDocument<Submission>;

@Schema({ timestamps: true })
export class Submission {
  @Prop({ type: Types.ObjectId, ref: 'Assignment', required: true })
  assignment!: Types.ObjectId | Assignment;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  student!: Types.ObjectId | User;

  @Prop({ required: true })
  submissionUrl!: string;

  @Prop()
  grade?: number;

  @Prop({ type: Date, default: Date.now })
  submittedAt!: Date;

  @Prop({ type: Date })
  gradedAt?: Date;

  @Prop({ default: 'pending' })
  status!: string;

  @Prop({ type: Date, default: Date.now })
  createdAt!: Date;

  @Prop({ type: Date, default: Date.now })
  updatedAt!: Date;
}

export const SubmissionSchema = SchemaFactory.createForClass(Submission);
