import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Lesson } from './schemas/lesson.schema.js';

@Injectable()
export class LessonsService {
  constructor(
    @InjectModel(Lesson.name) private lessonModel: Model<Lesson>
  ) {}

  async create(data: {
    title: string;
    description?: string;
    courseId: string;
    content?: string;
    videoUrl?: string;
  }) {
    const lesson = new this.lessonModel({
      ...data,
      courseId: new Types.ObjectId(data.courseId)
    });
    return await lesson.save();
  }

  async findAll(courseId?: string) {
    const filter = courseId ? { courseId: new Types.ObjectId(courseId) } : {};
    return this.lessonModel.find(filter).populate('courseId').populate('schedule');
  }

  async findOne(id: string) {
    const lesson = await this.lessonModel.findById(id).populate('courseId').populate('schedule');
    if (!lesson) {
      throw new NotFoundException(`Lesson with ID ${id} not found`);
    }
    return lesson;
  }

  async update(id: string, data: {
    title?: string;
    description?: string;
    content?: string;
    videoUrl?: string;
  }) {
    const lesson = await this.lessonModel.findByIdAndUpdate(id, data, { new: true })
      .populate('courseId')
      .populate('schedule');
    
    if (!lesson) {
      throw new NotFoundException(`Lesson with ID ${id} not found`);
    }
    return lesson;
  }

  async remove(id: string) {
    const result = await this.lessonModel.findByIdAndDelete(id);
    if (!result) {
      throw new NotFoundException(`Lesson with ID ${id} not found`);
    }
    return result;
  }

  async scheduleLesson(lessonId: string, data: {
    title: string;
    startTime: Date;
    endTime: Date;
  }) {
    // TO DO: implement scheduleLesson using Mongoose
  }

  async enrollStudent(lessonId: string, studentId: string) {
    // TO DO: implement enrollStudent using Mongoose
  }

  async getStudentLessons(studentId: string) {
    // TO DO: implement getStudentLessons using Mongoose
  }

  async getUpcomingLessons(studentId: string) {
    // TO DO: implement getUpcomingLessons using Mongoose
  }
}
