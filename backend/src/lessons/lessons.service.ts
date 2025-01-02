import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class LessonsService {
  constructor(private prisma: PrismaService) {}

  async create(data: {
    title: string;
    content: string;
    courseId: string;
  }) {
    return this.prisma.lesson.create({
      data,
      include: {
        course: true,
        schedule: true,
        students: true,
      },
    });
  }

  async findAll(courseId?: string) {
    const where = courseId ? { courseId } : {};
    return this.prisma.lesson.findMany({
      where,
      include: {
        course: true,
        schedule: true,
        students: true,
      },
    });
  }

  async findOne(id: string) {
    const lesson = await this.prisma.lesson.findUnique({
      where: { id },
      include: {
        course: true,
        schedule: true,
        students: true,
      },
    });

    if (!lesson) {
      throw new NotFoundException(`Lesson with ID ${id} not found`);
    }

    return lesson;
  }

  async update(id: string, data: {
    title?: string;
    content?: string;
  }) {
    return this.prisma.lesson.update({
      where: { id },
      data,
      include: {
        course: true,
        schedule: true,
        students: true,
      },
    });
  }

  async remove(id: string) {
    return this.prisma.lesson.delete({
      where: { id },
    });
  }

  async scheduleLesson(lessonId: string, data: {
    title: string;
    startTime: Date;
    endTime: Date;
  }) {
    return this.prisma.schedule.create({
      data: {
        ...data,
        lesson: {
          connect: { id: lessonId }
        }
      },
      include: {
        lesson: true,
        users: true,
      },
    });
  }

  async enrollStudent(lessonId: string, studentId: string) {
    return this.prisma.lesson.update({
      where: { id: lessonId },
      data: {
        students: {
          connect: { id: studentId }
        }
      },
      include: {
        students: true,
        schedule: true,
      },
    });
  }

  async getStudentLessons(studentId: string) {
    return this.prisma.lesson.findMany({
      where: {
        students: {
          some: { id: studentId }
        }
      },
      include: {
        course: true,
        schedule: true,
      },
    });
  }

  async getUpcomingLessons(studentId: string) {
    const now = new Date();
    return this.prisma.lesson.findMany({
      where: {
        students: {
          some: { id: studentId }
        },
        schedule: {
          startTime: {
            gte: now
          }
        }
      },
      include: {
        course: true,
        schedule: true,
      },
      orderBy: {
        schedule: {
          startTime: 'asc'
        }
      },
    });
  }
}
