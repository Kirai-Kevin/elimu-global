import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CoursesService } from './courses.service.js';
import {
  CreateCourseDto,
  UpdateCourseDto,
  UpdateContentDto,
  SearchCoursesDto,
  EnrollStudentDto,
  UploadVideoDto,
  GenerateContentDto,
  AssignInstructorDto,
} from './dto/course.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';

@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() createCourseDto: CreateCourseDto) {
    return this.coursesService.create(createCourseDto);
  }

  @Get()
  findAll(@Query() searchDto: SearchCoursesDto) {
    if (Object.keys(searchDto).length > 0) {
      return this.coursesService.search(searchDto);
    }
    return this.coursesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.coursesService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(
    @Param('id') id: string,
    @Body() updateCourseDto: UpdateCourseDto,
  ) {
    return this.coursesService.update(id, updateCourseDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string) {
    return this.coursesService.remove(id);
  }

  @Post(':id/content')
  @UseGuards(JwtAuthGuard)
  updateContent(
    @Param('id') id: string,
    @Body() updateContentDto: UpdateContentDto,
  ) {
    return this.coursesService.updateContent(id, updateContentDto);
  }

  @Post(':id/video')
  @UseGuards(JwtAuthGuard)
  uploadVideo(
    @Param('id') id: string,
    @Body() uploadVideoDto: UploadVideoDto,
  ) {
    return this.coursesService.uploadVideo(id, uploadVideoDto);
  }

  @Post('generate-content')
  @UseGuards(JwtAuthGuard)
  generateContent(@Body() generateContentDto: GenerateContentDto) {
    return this.coursesService.generateContent(generateContentDto);
  }

  @Post('generate-course')
  @UseGuards(JwtAuthGuard)
  generateCourse(@Body() createCourseDto: CreateCourseDto) {
    return this.coursesService.generateCourse(createCourseDto);
  }

  @Post('analyze-course')
  @UseGuards(JwtAuthGuard)
  analyzeCourse(@Body() createCourseDto: CreateCourseDto) {
    return this.coursesService.analyzeCourse(createCourseDto);
  }

  @Post('enroll')
  @UseGuards(JwtAuthGuard)
  enrollStudent(@Body() enrollStudentDto: EnrollStudentDto) {
    return this.coursesService.enrollStudent(
      enrollStudentDto.courseId,
      enrollStudentDto.studentId,
    );
  }

  @Post('assign-instructor')
  @UseGuards(JwtAuthGuard)
  assignInstructor(@Body() assignInstructorDto: AssignInstructorDto) {
    return this.coursesService.assignInstructor(
      assignInstructorDto.courseId,
      assignInstructorDto.instructorId,
    );
  }

  @Get(':id/content')
  getCourseContent(@Param('id') id: string) {
    return this.coursesService.getCourseContent(id);
  }

  @Get('enrolled')
  @UseGuards(JwtAuthGuard)
  getEnrolledCourses(@Query('studentId') studentId: string) {
    return this.coursesService.getEnrolledCourses(studentId);
  }

  @Get('teaching')
  @UseGuards(JwtAuthGuard)
  getTeachingCourses(@Query('instructorId') instructorId: string) {
    return this.coursesService.getTeachingCourses(instructorId);
  }
}
