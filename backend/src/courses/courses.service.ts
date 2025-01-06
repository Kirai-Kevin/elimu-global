import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  CreateCourseDto,
  UpdateCourseDto,
  UpdateContentDto,
  SearchCoursesDto,
  UploadVideoDto,
} from './dto/course.dto';
import { Course } from './schemas/course.schema';

@Injectable()
export class CoursesService {
  constructor(@InjectModel(Course.name) private courseModel: Model<Course>) {}

  async create(createCourseDto: CreateCourseDto) {
    const { instructorId, ...courseData } = createCourseDto;
    const course = new this.courseModel({
      ...courseData,
      instructorIds: [instructorId],
      studentIds: [],
    });
    return await course.save();
  }

  async findAll() {
    return this.courseModel
      .find()
      .populate('instructors')
      .populate('students')
      .populate('materials')
      .populate('lessons')
      .populate('assignments')
      .populate('schedules');
  }

  async search(searchDto: SearchCoursesDto) {
    const { query, category, level, minRating, instructorId, tags } = searchDto;

    const queryObj: any = {
      published: true,
    };

    if (query) {
      queryObj.$or = [
        { title: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } },
      ];
    }

    if (category) {
      queryObj.category = category;
    }

    if (level) {
      queryObj.level = level;
    }

    if (minRating) {
      queryObj.rating = {
        $gte: minRating,
      };
    }

    if (instructorId) {
      queryObj.instructorIds = {
        $in: [instructorId],
      };
    }

    if (tags && tags.length > 0) {
      queryObj.tags = {
        $all: tags,
      };
    }

    return this.courseModel
      .find(queryObj)
      .populate('instructors')
      .populate('students')
      .populate('materials')
      .populate('lessons')
      .populate('assignments');
  }

  async findOne(id: string) {
    const course = await this.courseModel
      .findById(id)
      .populate('instructors')
      .populate('students')
      .populate('materials')
      .populate('lessons')
      .populate('schedule')
      .populate('assignments')
      .populate('submissions')
      .populate('schedules');
    if (!course) {
      throw new NotFoundException(`Course with ID ${id} not found`);
    }
    return course;
  }

  async update(id: string, updateCourseDto: UpdateCourseDto) {
    const { instructorIds, studentIds, ...updateData } = updateCourseDto;
    const course = await this.courseModel
      .findByIdAndUpdate(
        id,
        {
          ...updateData,
          ...(instructorIds && { instructorIds }),
          ...(studentIds && { studentIds }),
        },
        { new: true },
      )
      .populate('instructors')
      .populate('students')
      .populate('materials')
      .populate('lessons')
      .populate('assignments');
    if (!course) {
      throw new NotFoundException(`Course with ID ${id} not found`);
    }
    return course;
  }

  async updateContent(id: string, updateContentDto: UpdateContentDto) {
    const course = await this.courseModel.findByIdAndUpdate(
      id,
      {
        content: updateContentDto.content,
      },
      { new: true },
    );
    if (!course) {
      throw new NotFoundException(`Course with ID ${id} not found`);
    }
    return course;
  }

  async uploadVideo(id: string, uploadVideoDto: UploadVideoDto) {
    const course = await this.courseModel.findByIdAndUpdate(
      id,
      {
        videoUrl: uploadVideoDto.videoUrl,
        duration: uploadVideoDto.duration,
      },
      { new: true },
    );
    if (!course) {
      throw new NotFoundException(`Course with ID ${id} not found`);
    }
    return course;
  }

  async remove(id: string) {
    const result = await this.courseModel.findByIdAndDelete(id);
    if (!result) {
      throw new NotFoundException(`Course with ID ${id} not found`);
    }
    return result;
  }

  async getContent(id: string) {
    const course = await this.courseModel.findById(
      id,
      'content materials lessons assignments videoUrl duration',
    );
    if (!course) {
      throw new NotFoundException(`Course with ID ${id} not found`);
    }
    return course;
  }

  async generateContent(_message: string) {
    // This method is not implemented as it requires a different service
    throw new Error('Method not implemented');
  }

  async generateCourse(_createCourseDto: CreateCourseDto) {
    // This method is not implemented as it requires a different service
    throw new Error('Method not implemented');
  }

  async analyzeCourse(_createCourseDto: CreateCourseDto) {
    // This method is not implemented as it requires a different service
    throw new Error('Method not implemented');
  }

  async enrollStudent(courseId: string, studentId: string) {
    const course = await this.courseModel.findById(courseId);

    if (!course) {
      throw new NotFoundException(`Course with ID ${courseId} not found`);
    }
    
    // Convert studentId to ObjectId and check if it's not already in the array
    const studentObjectId = new Types.ObjectId(studentId);
    if (!course.studentIds.some(id => id.equals(studentObjectId))) {
      course.studentIds.push(studentObjectId);
    }
    
    return await course.save();
  }

  async getEnrolledCourses(studentId: string) {
    return this.courseModel
      .find({ studentIds: { $in: [studentId] } })
      .populate('instructors')
      .populate('students')
      .populate('materials')
      .populate('lessons')
      .populate('assignments');
  }

  async getTeachingCourses(instructorId: string) {
    return this.courseModel
      .find({ instructorIds: { $in: [instructorId] } })
      .populate('instructors')
      .populate('students')
      .populate('materials')
      .populate('lessons')
      .populate('assignments');
  }

  async getCourseContent(id: string) {
    return this.getContent(id);
  }
}
