import { Controller, Get, Post, Body, Param, UseInterceptors, UploadedFile, Res } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { FreeCoursesService } from './free-courses.service';
import { PDFCourseParserService } from './pdf-course-parser.service';
import { FreeCourseResponse } from './interfaces/free-course.interface';

@Controller('free-courses')
export class FreeCoursesController {
  constructor(
    private readonly freeCoursesService: FreeCoursesService,
    private readonly pdfCourseParserService: PDFCourseParserService
  ) {}

  @Get()
  async findAll(): Promise<FreeCourseResponse[]> {
    return this.freeCoursesService.findAll();
  }

  @Get('featured')
  async findFeatured(): Promise<FreeCourseResponse[]> {
    return this.freeCoursesService.findFeatured();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<FreeCourseResponse> {
    return this.freeCoursesService.findOne(id);
  }

  @Get(':id/download')
  async downloadPDF(
    @Param('id') id: string,
    @Res() res: Response
  ): Promise<void> {
    try {
      const course = await this.freeCoursesService.findOne(id);
      if (!course || !course.sourceContent?.fileId) {
        throw new Error('Course or PDF not found');
      }

      const pdfBuffer = await this.pdfCourseParserService.getCourseContent(course.courseId);

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader(
        'Content-Disposition',
        `attachment; filename="${course.sourceContent.fileName}"`
      );
      res.send(pdfBuffer);
    } catch (error) {
      console.error('Error downloading PDF:', error);
      
      // Type guard for error message
      const errorMessage = error instanceof Error 
        ? error.message 
        : typeof error === 'string' 
          ? error 
          : 'Unknown error occurred';
      
      res.status(404).send(errorMessage);
    }
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadPDF(
    @UploadedFile() file: Express.Multer.File
  ): Promise<{ message: string; course?: FreeCourseResponse }> {
    try {
      if (!file) {
        throw new Error('No file uploaded');
      }

      if (file.mimetype !== 'application/pdf') {
        throw new Error('Only PDF files are allowed');
      }

      await this.pdfCourseParserService.processCourses();
      return { message: 'PDF processed successfully' };
    } catch (error) {
      console.error('Error processing PDF:', error);
      
      // Type guard for error message
      const errorMessage = error instanceof Error 
        ? error.message 
        : typeof error === 'string' 
          ? error 
          : 'Unknown error occurred';
      
      return { message: `Error processing PDF: ${errorMessage}` };
    }
  }
}
