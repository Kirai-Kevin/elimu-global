import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { FreeCourseDocument } from './schemas/free-course.schema';
import { FreeCourseResponse } from './interfaces/free-course.interface';
import { PDFCourseParserService } from './pdf-course-parser.service';

@Injectable()
export class FreeCoursesService {
  private readonly logger = new Logger(FreeCoursesService.name);

  constructor(
    @InjectModel('FreeCourse') private readonly freeCourseModel: Model<FreeCourseDocument>,
    private readonly pdfCourseParserService: PDFCourseParserService
  ) {}

  private mapToResponse(course: FreeCourseDocument): FreeCourseResponse {
    return {
      _id: course._id,
      id: course._id.toString(),
      title: course.title,
      description: course.description,
      courseId: course.courseId,
      level: course.level,
      subject: course.subject,
      learningObjectives: course.learningObjectives,
      prerequisites: course.prerequisites,
      estimatedHours: course.estimatedHours,
      topics: course.topics,
      sourceContent: {
        fileId: course.sourceContent.fileId,
        fileName: course.sourceContent.fileName
      }
    };
  }

  async findAll(): Promise<FreeCourseResponse[]> {
    const courses = await this.freeCourseModel.find().exec();
    return courses.map(course => this.mapToResponse(course));
  }

  async findFeatured(): Promise<FreeCourseResponse[]> {
    const courses = await this.freeCourseModel
      .find()
      .limit(6)
      .exec();
    return courses.map(course => this.mapToResponse(course));
  }

  async findOne(id: string): Promise<FreeCourseResponse> {
    const course = await this.freeCourseModel.findOne({ courseId: id }).exec();
    if (!course) {
      throw new NotFoundException(`Course with ID ${id} not found`);
    }
    return this.mapToResponse(course);
  }

  async uploadPDF(file: Express.Multer.File): Promise<FreeCourseResponse> {
    try {
      await this.pdfCourseParserService.processCourses();
      const course = await this.freeCourseModel
        .findOne()
        .sort({ _id: -1 })
        .exec();
      
      if (!course) {
        throw new Error('Failed to process uploaded PDF');
      }

      return this.mapToResponse(course);
    } catch (error) {
      this.logger.error('Error uploading PDF:', error);
      throw error;
    }
  }
}
