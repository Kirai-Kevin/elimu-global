import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Schedule } from './schemas/schedule.schema.js';

@Injectable()
export class SchedulesService {
  constructor(
    @InjectModel(Schedule.name) private scheduleModel: Model<Schedule>
  ) {}

  async create(data: {
    title: string;
    startTime: Date;
    endTime: Date;
    courseId?: string;
    lessonId?: string;
    userIds?: string[];
  }) {
    const schedule = new this.scheduleModel({
      ...data,
      courseId: data.courseId ? new Types.ObjectId(data.courseId) : undefined,
      lessonId: data.lessonId ? new Types.ObjectId(data.lessonId) : undefined,
      userIds: data.userIds ? data.userIds.map(id => new Types.ObjectId(id)) : undefined
    });
    return await schedule.save();
  }

  async findAll(userId?: string) {
    const filter = userId ? { userIds: new Types.ObjectId(userId) } : {};
    return this.scheduleModel.find(filter).populate('courseId').populate('lessonId').populate('userIds');
  }

  async findOne(id: string) {
    const schedule = await this.scheduleModel.findById(id).populate('courseId').populate('lessonId').populate('userIds');
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
    const schedule = await this.scheduleModel.findByIdAndUpdate(id, data, { new: true })
      .populate('courseId')
      .populate('lessonId')
      .populate('userIds');
    
    if (!schedule) {
      throw new NotFoundException(`Schedule with ID ${id} not found`);
    }
    return schedule;
  }

  async remove(id: string) {
    const result = await this.scheduleModel.findByIdAndDelete(id);
    if (!result) {
      throw new NotFoundException(`Schedule with ID ${id} not found`);
    }
    return result;
  }

  async getUserSchedule(userId: string, startDate: Date, endDate: Date) {
    return this.scheduleModel.find({
      userIds: new Types.ObjectId(userId),
      $and: [
        { startTime: { $gte: startDate } },
        { endTime: { $lte: endDate } }
      ]
    }).populate('courseId').populate('lessonId').populate('userIds').sort({ startTime: 1 });
  }

  async getCourseSchedule(courseId: string) {
    return this.scheduleModel.find({
      courseId: new Types.ObjectId(courseId),
    }).populate('courseId').populate('lessonId').populate('userIds').sort({ startTime: 1 });
  }

  async addUserToSchedule(scheduleId: string, userId: string) {
    return this.scheduleModel.findByIdAndUpdate(scheduleId, { $addToSet: { userIds: new Types.ObjectId(userId) } }, { new: true })
      .populate('courseId')
      .populate('lessonId')
      .populate('userIds');
  }

  async removeUserFromSchedule(scheduleId: string, userId: string) {
    return this.scheduleModel.findByIdAndUpdate(scheduleId, { $pull: { userIds: new Types.ObjectId(userId) } }, { new: true })
      .populate('courseId')
      .populate('lessonId')
      .populate('userIds');
  }
}
