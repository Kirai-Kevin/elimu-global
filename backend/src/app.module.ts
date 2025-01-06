import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CoursesModule } from './courses/courses.module';
import { AssignmentsModule } from './assignments/assignments.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGODB_URI || 'mongodb://localhost:27017/elimu-global'),
    CoursesModule,
    AssignmentsModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
