import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AssignmentsService } from './assignments.service.js';
import { AssignmentsController } from './assignments.controller.js';
import { Assignment, AssignmentSchema } from './schemas/assignment.schema.js';
import { Submission, SubmissionSchema } from './schemas/submission.schema.js';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Assignment.name, schema: AssignmentSchema },
      { name: Submission.name, schema: SubmissionSchema }
    ])
  ],
  controllers: [AssignmentsController],
  providers: [AssignmentsService],
  exports: [AssignmentsService]
})
export class AssignmentsModule {}
