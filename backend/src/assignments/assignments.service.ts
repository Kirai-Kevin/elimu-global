import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AssignmentsService {
  constructor(private prisma: PrismaService) {}

  async create(data: {
    title: string;
    description: string;
    dueDate: Date;
    courseId: string;
  }) {
    return this.prisma.assignment.create({
      data,
      include: {
        course: true,
        submissions: true,
      },
    });
  }

  async findAll(courseId?: string) {
    const where = courseId ? { courseId } : {};
    return this.prisma.assignment.findMany({
      where,
      include: {
        course: true,
        submissions: true,
      },
    });
  }

  async findOne(id: string) {
    const assignment = await this.prisma.assignment.findUnique({
      where: { id },
      include: {
        course: true,
        submissions: true,
      },
    });

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
    return this.prisma.assignment.update({
      where: { id },
      data,
      include: {
        course: true,
        submissions: true,
      },
    });
  }

  async remove(id: string) {
    return this.prisma.assignment.delete({
      where: { id },
    });
  }

  async submitAssignment(data: {
    content: string;
    fileUrl?: string;
    assignmentId: string;
  }) {
    return this.prisma.submission.create({
      data,
      include: {
        assignment: true,
      },
    });
  }

  async gradeSubmission(submissionId: string, data: {
    grade: number;
    feedback?: string;
  }) {
    return this.prisma.submission.update({
      where: { id: submissionId },
      data,
      include: {
        assignment: true,
      },
    });
  }

  async getSubmissions(assignmentId: string) {
    return this.prisma.submission.findMany({
      where: { assignmentId },
      include: {
        assignment: true,
      },
    });
  }

  async getStudentSubmissions(studentId: string) {
    return this.prisma.submission.findMany({
      where: {
        assignment: {
          students: {
            some: { id: studentId }
          }
        }
      },
      include: {
        assignment: true,
      },
    });
  }
}
