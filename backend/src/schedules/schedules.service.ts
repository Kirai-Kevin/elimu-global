import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SchedulesService {
  constructor(private prisma: PrismaService) {}

  async create(data: {
    title: string;
    startTime: Date;
    endTime: Date;
    courseId?: string;
    lessonId?: string;
    userIds?: string[];
  }) {
    const { userIds, ...scheduleData } = data;
    return this.prisma.schedule.create({
      data: {
        ...scheduleData,
        users: userIds ? {
          connect: userIds.map(id => ({ id }))
        } : undefined
      },
      include: {
        course: true,
        lesson: true,
        users: true,
      },
    });
  }

  async findAll(userId?: string) {
    const where = userId ? {
      users: {
        some: { id: userId }
      }
    } : {};
    
    return this.prisma.schedule.findMany({
      where,
      include: {
        course: true,
        lesson: true,
        users: true,
      },
    });
  }

  async findOne(id: string) {
    const schedule = await this.prisma.schedule.findUnique({
      where: { id },
      include: {
        course: true,
        lesson: true,
        users: true,
      },
    });

    if (!schedule) {
      throw new NotFoundException(`Schedule with ID ${id} not found`);
    }

    return schedule;
  }

  async update(id: string, data: {
    title?: string;
    startTime?: Date;
    endTime?: Date;
    userIds?: string[];
  }) {
    const { userIds, ...scheduleData } = data;
    return this.prisma.schedule.update({
      where: { id },
      data: {
        ...scheduleData,
        users: userIds ? {
          set: userIds.map(id => ({ id }))
        } : undefined
      },
      include: {
        course: true,
        lesson: true,
        users: true,
      },
    });
  }

  async remove(id: string) {
    return this.prisma.schedule.delete({
      where: { id },
    });
  }

  async getUserSchedule(userId: string, startDate: Date, endDate: Date) {
    return this.prisma.schedule.findMany({
      where: {
        users: {
          some: { id: userId }
        },
        AND: [
          { startTime: { gte: startDate } },
          { endTime: { lte: endDate } }
        ]
      },
      include: {
        course: true,
        lesson: true,
        users: true,
      },
      orderBy: {
        startTime: 'asc'
      },
    });
  }

  async getCourseSchedule(courseId: string) {
    return this.prisma.schedule.findMany({
      where: {
        courseId,
      },
      include: {
        course: true,
        lesson: true,
        users: true,
      },
      orderBy: {
        startTime: 'asc'
      },
    });
  }

  async addUserToSchedule(scheduleId: string, userId: string) {
    return this.prisma.schedule.update({
      where: { id: scheduleId },
      data: {
        users: {
          connect: { id: userId }
        }
      },
      include: {
        course: true,
        lesson: true,
        users: true,
      },
    });
  }

  async removeUserFromSchedule(scheduleId: string, userId: string) {
    return this.prisma.schedule.update({
      where: { id: scheduleId },
      data: {
        users: {
          disconnect: { id: userId }
        }
      },
      include: {
        course: true,
        lesson: true,
        users: true,
      },
    });
  }
}
