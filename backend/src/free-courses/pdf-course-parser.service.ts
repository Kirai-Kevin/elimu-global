import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { promises as fs } from 'fs';
import * as path from 'path';

import { FreeCourseDocument } from './schemas/free-course.schema.js';
import { GridFsService } from './gridfs.service.js';

interface CourseMetadata {
  id: string;
  title: string;
  description: string;
  level: string;
  subject: string;
  learningObjectives: string[];
  pdfFileName: string;
  prerequisites: string[];
  estimatedHours: number;
  topics: string[];
}

@Injectable()
export class PDFCourseParserService {
  private readonly logger = new Logger(PDFCourseParserService.name);
  private readonly coursesDir = path.join(process.cwd(), 'courses');
  private readonly metadataDir = path.join(this.coursesDir, 'metadata');
  private readonly pdfsDir = path.join(this.coursesDir, 'pdfs');

  constructor(
    @InjectModel('FreeCourse') private readonly freeCourseModel: Model<FreeCourseDocument>,
    private readonly gridFsService: GridFsService,
  ) {}

  async processCourses(): Promise<void> {
    try {
      // Ensure metadata directory exists
      await fs.mkdir(this.metadataDir, { recursive: true });

      // Get all metadata files
      const metadataFiles = await fs.readdir(this.metadataDir);
      
      for (const metadataFile of metadataFiles) {
        if (!metadataFile.endsWith('.json')) continue;

        try {
          // Read and parse metadata
          const metadataPath = path.join(this.metadataDir, metadataFile);
          const metadata = JSON.parse(await fs.readFile(metadataPath, 'utf-8')) as CourseMetadata;

          // Read PDF file
          const pdfPath = path.join(this.pdfsDir, metadata.pdfFileName);
          const pdfBuffer = await fs.readFile(pdfPath);

          // Upload PDF to GridFS
          const fileId = await this.gridFsService.uploadFile(
            metadata.pdfFileName,
            pdfBuffer,
            'application/pdf'
          );

          // Create or update course in database
          await this.freeCourseModel.findOneAndUpdate(
            { courseId: metadata.id },
            {
              courseId: metadata.id,
              title: metadata.title,
              description: metadata.description,
              level: metadata.level,
              subject: metadata.subject,
              learningObjectives: metadata.learningObjectives,
              prerequisites: metadata.prerequisites,
              estimatedHours: metadata.estimatedHours,
              topics: metadata.topics,
              sourceContent: {
                fileId: fileId,
                fileName: metadata.pdfFileName
              }
            },
            { upsert: true, new: true }
          );

          this.logger.log(`Successfully processed course: ${metadata.title}`);
        } catch (error) {
          this.logger.error(`Error processing course from metadata ${metadataFile}:`, error);
        }
      }
    } catch (error) {
      this.logger.error('Error processing courses:', error);
      throw error;
    }
  }

  async getCourseContent(courseId: string): Promise<Buffer> {
    try {
      const course = await this.freeCourseModel.findOne({ courseId }).exec();
      if (!course || !course.sourceContent?.fileId) {
        throw new Error(`Course not found or no PDF available: ${courseId}`);
      }

      return this.gridFsService.getFile(course.sourceContent.fileId);
    } catch (error) {
      this.logger.error(`Error getting course content for ${courseId}:`, error);
      throw error;
    }
  }
}
