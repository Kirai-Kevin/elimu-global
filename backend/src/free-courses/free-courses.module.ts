import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';

import { FreeCourse, FreeCourseSchema } from './schemas/free-course.schema.js';
import { FreeCoursesController } from './free-courses.controller.js';
import { FreeCoursesService } from './free-courses.service.js';
import { PDFCourseParserService } from './pdf-course-parser.service.js';
import { GridFsService } from './gridfs.service.js';

@Module({
  imports: [
    ConfigModule,
    HttpModule,
    MongooseModule.forFeature([
      { name: FreeCourse.name, schema: FreeCourseSchema }
    ])
  ],
  controllers: [FreeCoursesController],
  providers: [
    FreeCoursesService, 
    PDFCourseParserService,
    GridFsService  
  ],
  exports: [
    FreeCoursesService, 
    PDFCourseParserService,
    GridFsService  
  ]
})
export class FreeCoursesModule {}
