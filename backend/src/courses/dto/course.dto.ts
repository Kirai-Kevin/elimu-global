import { IsString, IsOptional, IsArray, IsNumber, IsUrl, Min, Max, IsEnum, IsBoolean } from 'class-validator';

export enum CourseLevel {
  BEGINNER = 'beginner',
  INTERMEDIATE = 'intermediate',
  ADVANCED = 'advanced'
}

export class CreateCourseDto {
  @IsString()
  title!: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  content?: string;

  @IsString()
  instructorId!: string;

  @IsUrl()
  @IsOptional()
  thumbnail?: string;

  @IsUrl()
  @IsOptional()
  videoUrl?: string;

  @IsNumber()
  @IsOptional()
  @Min(1)
  duration?: number;

  @IsString()
  @IsOptional()
  level?: string;

  @IsString()
  @IsOptional()
  category?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];

  @IsBoolean()
  @IsOptional()
  published?: boolean;
}

export class UpdateCourseDto extends CreateCourseDto {
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  instructorIds?: string[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  studentIds?: string[];
}

export class UpdateContentDto {
  @IsString()
  content!: string;
}

export class SearchCoursesDto {
  @IsString()
  @IsOptional()
  query?: string;

  @IsString()
  @IsOptional()
  category?: string;

  @IsString()
  @IsOptional()
  level?: string;

  @IsNumber()
  @IsOptional()
  @Min(0)
  minRating?: number;

  @IsString()
  @IsOptional()
  instructorId?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];
}

export class GenerateContentDto {
  @IsString()
  message!: string;
}

export class EnrollStudentDto {
  @IsString()
  courseId!: string;

  @IsString()
  studentId!: string;
}

export class AssignInstructorDto {
  @IsString()
  courseId!: string;

  @IsString()
  instructorId!: string;
}

export class UploadVideoDto {
  @IsString()
  courseId!: string;

  @IsString()
  @IsOptional()
  videoTitle?: string;

  @IsUrl()
  videoUrl!: string;

  @IsString()
  @IsOptional()
  videoDescription?: string;

  @IsNumber()
  @Min(1)
  @IsOptional()
  duration?: number;
}
