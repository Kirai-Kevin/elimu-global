import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCourseDto, UpdateCourseDto, UpdateContentDto, SearchCoursesDto, UploadVideoDto } from './dto/course.dto';
import { Groq } from 'groq-sdk';

@Injectable()
export class CoursesService {
  private groq: Groq;

  constructor(private prisma: PrismaService) {
    this.groq = new Groq({
      apiKey: process.env.GROQ_API_KEY,
    });
  }

  async create(createCourseDto: CreateCourseDto) {
    const { instructorId, ...courseData } = createCourseDto;
    
    return this.prisma.course.create({
      data: {
        ...courseData,
        instructorIds: [instructorId],
        studentIds: [],
      },
      include: {
        instructors: true,
        students: true,
        materials: true,
        lessons: true,
        assignments: true
      }
    });
  }

  async findAll() {
    return this.prisma.course.findMany({
      include: {
        instructors: true,
        students: true,
        materials: true,
        lessons: true,
        assignments: true,
        schedules: true
      }
    });
  }

  async search(searchDto: SearchCoursesDto) {
    const {
      query,
      category,
      level,
      minRating,
      instructorId,
      tags
    } = searchDto;

    const where: any = {
      published: true,
    };

    if (query) {
      where.OR = [
        { title: { contains: query, mode: 'insensitive' } },
        { description: { contains: query, mode: 'insensitive' } },
      ];
    }

    if (category) {
      where.category = category;
    }

    if (level) {
      where.level = level;
    }

    if (minRating) {
      where.rating = {
        gte: minRating,
      };
    }

    if (instructorId) {
      where.instructorIds = {
        has: instructorId,
      };
    }

    if (tags && tags.length > 0) {
      where.tags = {
        hasEvery: tags,
      };
    }

    return this.prisma.course.findMany({
      where,
      include: {
        instructors: true,
        students: true,
        materials: true,
        lessons: true,
        assignments: true
      }
    });
  }

  async findOne(id: string) {
    const course = await this.prisma.course.findUnique({
      where: { id },
      include: {
        instructors: true,
        students: true,
        materials: true,
        lessons: {
          include: {
            schedule: true
          }
        },
        assignments: {
          include: {
            submissions: true
          }
        },
        schedules: true
      }
    });

    if (!course) {
      throw new NotFoundException(`Course with ID ${id} not found`);
    }

    return course;
  }

  async update(id: string, updateCourseDto: UpdateCourseDto) {
    const { instructorIds, studentIds, ...updateData } = updateCourseDto;
    
    return this.prisma.course.update({
      where: { id },
      data: {
        ...updateData,
        ...(instructorIds && { instructorIds }),
        ...(studentIds && { studentIds })
      },
      include: {
        instructors: true,
        students: true,
        materials: true,
        lessons: true,
        assignments: true
      }
    });
  }

  async updateContent(id: string, updateContentDto: UpdateContentDto) {
    return this.prisma.course.update({
      where: { id },
      data: {
        content: updateContentDto.content,
      }
    });
  }

  async uploadVideo(id: string, uploadVideoDto: UploadVideoDto) {
    return this.prisma.course.update({
      where: { id },
      data: {
        videoUrl: uploadVideoDto.videoUrl,
        duration: uploadVideoDto.duration,
      }
    });
  }

  async remove(id: string) {
    return this.prisma.course.delete({
      where: { id },
    });
  }

  async getContent(id: string) {
    const course = await this.prisma.course.findUnique({
      where: { id },
      select: {
        content: true,
        materials: true,
        lessons: true,
        assignments: true,
        videoUrl: true,
        duration: true,
      },
    });

    if (!course) {
      throw new NotFoundException(`Course with ID ${id} not found`);
    }

    return course;
  }

  async generateContent(message: string) {
    const completion = await this.groq.chat.completions.create({
      messages: [{ role: 'user', content: message }],
      model: 'mixtral-8x7b-32768',
    });

    return { content: completion.choices[0]?.message?.content || '' };
  }

  async generateCourse(createCourseDto: CreateCourseDto) {
    const prompt = `Generate a detailed course outline for: ${createCourseDto.title}
    Include: Course description, learning objectives, and main topics.`;
    
    const completion = await this.groq.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'mixtral-8x7b-32768',
    });
    
    return this.create({
      ...createCourseDto,
      content: completion.choices[0]?.message?.content || '',
    });
  }

  async analyzeCourse(createCourseDto: CreateCourseDto) {
    const prompt = `Analyze this course content and provide insights:
    Title: ${createCourseDto.title}
    Content: ${createCourseDto.content}`;
    
    const completion = await this.groq.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'mixtral-8x7b-32768',
    });

    return { analysis: completion.choices[0]?.message?.content || '' };
  }

  async enrollStudent(courseId: string, studentId: string) {
    const course = await this.prisma.course.findUnique({
      where: { id: courseId }
    });

    if (!course) {
      throw new NotFoundException(`Course with ID ${courseId} not found`);
    }

    return this.prisma.course.update({
      where: { id: courseId },
      data: {
        studentIds: [...course.studentIds, studentId]
      }
    });
  }

  async getEnrolledCourses(studentId: string) {
    return this.prisma.course.findMany({
      where: {
        studentIds: {
          has: studentId
        }
      },
      include: {
        instructors: true,
        students: true,
        materials: true,
        lessons: true,
        assignments: true
      }
    });
  }

  async getTeachingCourses(instructorId: string) {
    return this.prisma.course.findMany({
      where: {
        instructorIds: {
          has: instructorId
        }
      },
      include: {
        instructors: true,
        students: true,
        materials: true,
        lessons: true,
        assignments: true
      }
    });
  }

  async getCourseContent(id: string) {
    return this.getContent(id);
  }
}
