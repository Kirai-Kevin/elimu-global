import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import Groq from 'groq-sdk';
import {
  CreateCourseDto,
  UpdateCourseDto,
  UpdateContentDto,
  SearchCoursesDto,
  UploadVideoDto,
  GenerateContentDto,
} from './dto/course.dto';
import { Course } from './schemas/course.schema.js';

@Injectable()
export class CoursesService {
  private groq: Groq;

  constructor(@InjectModel(Course.name) private courseModel: Model<Course>) {
    this.groq = new Groq({
      apiKey: process.env.GROQ_API_KEY,
    });
  }

  async create(createCourseDto: CreateCourseDto) {
    const { instructorId, ...courseData } = createCourseDto;
    const course = new this.courseModel({
      ...courseData,
      instructorIds: [instructorId],
      studentIds: [],
      materials: [],
      lessons: [],
      assignments: [],
      schedules: [],
      rating: 0,
      published: false,
      tags: [],
    });
    return await course.save();
  }

  async findAll() {
    return this.courseModel.find()
      .populate('students')
      .populate('materials')
      .populate('lessons')
      .populate('schedules')
      .populate('assignments')
      .exec();
  }

  async search(searchDto: SearchCoursesDto & { title?: string }) {
    const query = this.courseModel.find();

    if (searchDto.title) {
      query.where('title', new RegExp(searchDto.title, 'i'));
    }

    if (searchDto.category) {
      query.where('category', searchDto.category);
    }

    if (searchDto.level) {
      query.where('level', searchDto.level);
    }

    return query.exec();
  }

  async findOne(id: string) {
    const course = await this.courseModel.findById(id)
      .populate('students')
      .populate('materials')
      .populate('lessons')
      .populate('schedules')
      .populate('assignments')
      .exec();

    if (!course) {
      throw new NotFoundException(`Course with ID ${id} not found`);
    }

    return course;
  }

  async update(id: string, updateCourseDto: UpdateCourseDto) {
    const course = await this.courseModel.findByIdAndUpdate(
      id, 
      updateCourseDto, 
      { new: true }
    );

    if (!course) {
      throw new NotFoundException(`Course with ID ${id} not found`);
    }

    return course;
  }

  async remove(id: string) {
    const course = await this.courseModel.findByIdAndDelete(id);

    if (!course) {
      throw new NotFoundException(`Course with ID ${id} not found`);
    }

    return course;
  }

  async updateContent(id: string, updateContentDto: UpdateContentDto) {
    const course = await this.courseModel.findById(id);
    if (!course) {
      throw new NotFoundException(`Course with ID ${id} not found`);
    }

    // Validate and parse content
    const validatedContent = updateContentDto.content.split('\n')
      .filter(item => item.trim() !== '')
      .map(item => ({
        type: 'text',
        title: '',
        url: '',
        description: item.trim()
      }));

    course.content = validatedContent;
    return course.save();
  }

  async uploadVideo(id: string, uploadVideoDto: UploadVideoDto) {
    const course = await this.courseModel.findById(id);
    if (!course) {
      throw new NotFoundException(`Course with ID ${id} not found`);
    }

    if (!course.content) {
      course.content = [];
    }

    course.content.push({
      type: 'video',
      title: uploadVideoDto.videoTitle || 'Untitled Video', 
      url: uploadVideoDto.videoUrl,
      description: uploadVideoDto.videoDescription || ''
    });

    return course.save();
  }

  async generateContent(generateContentDto: GenerateContentDto) {
    try {
      const response = await this.groq.chat.completions.create({
        model: 'llama2-70b-4096',
        messages: [
          {
            role: 'system', 
            content: 'You are an educational content generator. Create concise, informative course content.'
          },
          {
            role: 'user', 
            content: `Generate educational content for the following topic: ${generateContentDto.message}`
          }
        ],
        max_tokens: 500,
        temperature: 0.7,
      });

      const generatedContent = response.choices[0].message.content || '';
      
      return {
        message: generatedContent.split('\n').map(line => ({
          type: 'text',
          title: '',
          url: '',
          description: line.trim()
        }))
      };
    } catch (error) {
      console.error('Content generation error:', error);
      throw new BadRequestException('Failed to generate course content');
    }
  }

  async generateCourse(createCourseDto: CreateCourseDto) {
    try {
      // Use Groq to enhance course details
      const courseDetailsResponse = await this.groq.chat.completions.create({
        model: 'llama2-70b-4096',
        messages: [
          {
            role: 'system', 
            content: 'You are an expert course designer. Enhance and expand course details.'
          },
          {
            role: 'user', 
            content: `Help me design a course with the following initial details: 
              Title: ${createCourseDto.title}
              Description: ${createCourseDto.description}
              Level: ${createCourseDto.level}`
          }
        ],
        max_tokens: 300,
        temperature: 0.7,
      });

      const enhancedDetails = courseDetailsResponse.choices[0].message.content || '';

      // Merge AI-generated details with original DTO
      const enrichedCourseDto = {
        ...createCourseDto,
        description: enhancedDetails,
        tags: ['AI-Enhanced'],
      };

      return this.create(enrichedCourseDto);
    } catch (error) {
      console.error('Course generation error:', error);
      throw new BadRequestException('Failed to generate course');
    }
  }

  async analyzeCourse(createCourseDto: CreateCourseDto) {
    try {
      const analysisResponse = await this.groq.chat.completions.create({
        model: 'llama2-70b-4096',
        messages: [
          {
            role: 'system', 
            content: 'You are an expert course analyst. Provide insights and recommendations.'
          },
          {
            role: 'user', 
            content: `Analyze the potential and structure of a course with these details:
              Title: ${createCourseDto.title}
              Description: ${createCourseDto.description}
              Level: ${createCourseDto.level}`
          }
        ],
        max_tokens: 300,
        temperature: 0.7,
      });

      const courseAnalysis = analysisResponse.choices[0].message.content || '';

      return { 
        course: createCourseDto, 
        analysis: courseAnalysis 
      };
    } catch (error) {
      console.error('Course analysis error:', error);
      throw new BadRequestException('Failed to analyze course');
    }
  }

  async enrollStudent(courseId: string, studentId: string) {
    const course = await this.courseModel.findById(courseId);
    if (!course) {
      throw new NotFoundException(`Course with ID ${courseId} not found`);
    }

    // Ensure studentIds is initialized
    course.studentIds = course.studentIds || [];

    if (!course.studentIds.some(id => id.equals(new Types.ObjectId(studentId)))) {
      course.studentIds.push(new Types.ObjectId(studentId));
      await course.save();
    }

    return course;
  }

  async assignInstructor(courseId: string, instructorId: string) {
    const course = await this.courseModel.findById(courseId);
    if (!course) {
      throw new NotFoundException(`Course with ID ${courseId} not found`);
    }

    // Ensure instructorIds is initialized
    course.instructorIds = course.instructorIds || [];

    if (!course.instructorIds.some(id => id.equals(new Types.ObjectId(instructorId)))) {
      course.instructorIds.push(new Types.ObjectId(instructorId));
      await course.save();
    }

    return course;
  }

  async getCourseContent(courseId: string) {
    const course = await this.courseModel.findById(courseId);
    if (!course) {
      throw new NotFoundException(`Course with ID ${courseId} not found`);
    }
    return course.content || [];
  }

  async getEnrolledCourses(studentId: string) {
    return this.courseModel.find({ 
      studentIds: new Types.ObjectId(studentId) 
    });
  }

  async getTeachingCourses(instructorId: string) {
    return this.courseModel.find({ 
      instructorIds: new Types.ObjectId(instructorId) 
    });
  }
}
