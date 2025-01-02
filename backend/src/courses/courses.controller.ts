import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  Query,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CoursesService } from './courses.service';
import {
  CreateCourseDto,
  UpdateCourseDto,
  UpdateContentDto,
  SearchCoursesDto,
  GenerateContentDto,
  EnrollStudentDto,
  AssignInstructorDto,
  UploadVideoDto,
} from './dto/course.dto';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { existsSync, mkdirSync, unlinkSync } from 'fs';
import { BadRequestException, InternalServerErrorException } from '@nestjs/common';

@Controller('api/courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Post()
  create(@Body() createCourseDto: CreateCourseDto) {
    return this.coursesService.create(createCourseDto);
  }

  @Get('search')
  search(
    @Query('query') query?: string,
    @Query('category') category?: string,
    @Query('level') level?: string,
    @Query('minRating') minRating?: number,
    @Query('instructorId') instructorId?: string,
    @Query('tags') tags?: string,
  ) {
    const searchDto: SearchCoursesDto = {
      query,
      category,
      level,
      minRating: minRating ? Number(minRating) : undefined,
      instructorId,
      tags: tags ? tags.split(',') : undefined,
    };
    return this.coursesService.search(searchDto);
  }

  @Get()
  findAll() {
    return this.coursesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.coursesService.findOne(id);
  }

  @Get(':id/learn')
  getCourseContent(@Param('id') id: string) {
    return this.coursesService.getCourseContent(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateCourseDto: UpdateCourseDto) {
    return this.coursesService.update(id, updateCourseDto);
  }

  @Put(':id/content')
  updateContent(@Param('id') id: string, @Body() updateContentDto: UpdateContentDto) {
    return this.coursesService.updateContent(id, updateContentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.coursesService.remove(id);
  }

  @Post('generate-content')
  generateContent(@Body() generateContentDto: GenerateContentDto) {
    return this.coursesService.generateContent(generateContentDto.message);
  }

  @Post('course-generation')
  generateCourse(@Body() createCourseDto: CreateCourseDto) {
    return this.coursesService.generateCourse(createCourseDto);
  }

  @Post('analyze')
  analyzeCourse(@Body() createCourseDto: CreateCourseDto) {
    return this.coursesService.analyzeCourse(createCourseDto);
  }

  @Post(':id/enroll')
  enrollStudent(@Param('id') id: string, @Body() enrollStudentDto: EnrollStudentDto) {
    return this.coursesService.enrollStudent(id, enrollStudentDto.studentId);
  }

  @Get('student/:studentId')
  getEnrolledCourses(@Param('studentId') studentId: string) {
    return this.coursesService.getEnrolledCourses(studentId);
  }

  @Get('instructor/:instructorId')
  getTeachingCourses(@Param('instructorId') instructorId: string) {
    return this.coursesService.getTeachingCourses(instructorId);
  }

  @Post(':id/upload')
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: (req, file, cb) => {
        const uploadPath = './uploads/courses';
        console.log('Upload path:', uploadPath);
        try {
          if (!existsSync(uploadPath)) {
            mkdirSync(uploadPath, { recursive: true });
          }
          cb(null, uploadPath);
        } catch (error) {
          console.error('Error creating directory:', error);
          cb(error, uploadPath);
        }
      },
      filename: (req, file, cb) => {
        try {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
          const filename = `${uniqueSuffix}${extname(file.originalname)}`;
          console.log('Generated filename:', filename);
          cb(null, filename);
        } catch (error) {
          console.error('Error generating filename:', error);
          cb(error, '');
        }
      },
    }),
    fileFilter: (req, file, cb) => {
      console.log('Received file:', file);
      cb(null, true);
    },
    limits: {
      fileSize: 1024 * 1024 * 100 // 100MB limit
    }
  }))
  async uploadFile(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File
  ) {
    console.log('Upload handler called with id:', id);
    console.log('Received file:', file);

    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    const baseUrl = process.env.API_URL || `http://localhost:3000`;
    const fileUrl = `${baseUrl}/uploads/courses/${file.filename}`;
    console.log('File URL:', fileUrl);

    try {
      const course = await this.coursesService.uploadVideo(id, {
        courseId: id,
        videoUrl: fileUrl,
        duration: 0
      });

      return {
        message: 'File uploaded successfully',
        course,
        file: {
          originalname: file.originalname,
          filename: file.filename,
          url: fileUrl
        }
      };
    } catch (error) {
      console.error('Error in upload handler:', error);
      try {
        if (file.path) {
          unlinkSync(file.path);
          console.log('Cleaned up file:', file.path);
        }
      } catch (e) {
        console.error('Failed to clean up file:', e);
      }
      throw new InternalServerErrorException('Failed to process upload', error.message);
    }
  }
}
