import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { CoursesModule } from './courses/courses.module.js';
import { AssignmentsModule } from './assignments/assignments.module.js';
import { FreeCoursesModule } from './free-courses/free-courses.module.js';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGODB_URI || 'mongodb://localhost:27017/elimu-global'),
    CoursesModule,
    AssignmentsModule,
    FreeCoursesModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
