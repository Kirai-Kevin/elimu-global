import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Assignment } from './schemas/assignment.schema.js';
import { Submission } from './schemas/submission.schema.js';

@Injectable()
export class AssignmentsService {
  constructor(
    @InjectModel(Assignment.name) private assignmentModel: Model<Assignment>,
    @InjectModel(Submission.name) private submissionModel: Model<Submission>,
  ) {}

  async create(data: {
    title: string;
    description: string;
    dueDate: Date;
    courseId: string;
  }) {
    const assignment = new this.assignmentModel({
      ...data,
      courseId: new Types.ObjectId(data.courseId),
    });
    return await assignment.save();
  }

  async findAll(courseId?: string) {
    const filter = courseId ? { courseId: new Types.ObjectId(courseId) } : {};
    return this.assignmentModel
      .find(filter)
      .populate('courseId')
      .populate('submissions');
  }

  async findOne(id: string) {
    const assignment = await this.assignmentModel
      .findById(id)
      .populate('courseId')
      .populate('submissions');

    if (!assignment) {
      throw new NotFoundException(`Assignment with ID ${id} not found`);
    }

    return assignment;
  }

  async update(id: string, data: {
    title?: string;
    description?: string;
    dueDate?: Date;
  }) {
    const assignment = await this.assignmentModel
      .findByIdAndUpdate(id, data, { new: true })
      .populate('courseId')
      .populate('submissions');

    if (!assignment) {
      throw new NotFoundException(`Assignment with ID ${id} not found`);
    }

    return assignment;
  }

  async remove(id: string) {
    const result = await this.assignmentModel.findByIdAndDelete(id);
    if (!result) {
      throw new NotFoundException(`Assignment with ID ${id} not found`);
    }
    return result;
  }

  async submitAssignment(data: {
    content: string;
    fileUrl?: string;
    assignmentId: string;
  }) {
    const submission = new this.submissionModel({
      ...data,
      assignmentId: new Types.ObjectId(data.assignmentId),
    });
    
    const savedSubmission = await submission.save();
    
    // Update assignment's submissions
    await this.assignmentModel.findByIdAndUpdate(
      data.assignmentId, 
      { $push: { submissions: savedSubmission._id } }
    );

    return savedSubmission;
  }

  async gradeSubmission(submissionId: string, data: {
    grade: number;
    feedback?: string;
  }) {
    return this.submissionModel
      .findByIdAndUpdate(submissionId, data, { new: true })
      .populate('assignmentId');
  }

  async getSubmissions(assignmentId: string) {
    return this.submissionModel
      .find({ assignmentId: new Types.ObjectId(assignmentId) })
      .populate('assignmentId');
  }

  async getStudentSubmissions(studentId: string) {
    // Note: This might need adjustment based on your student model
    return this.submissionModel
      .find({ studentId: new Types.ObjectId(studentId) })
      .populate('assignmentId');
  }
}
