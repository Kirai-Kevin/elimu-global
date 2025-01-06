import { Controller, Get, Post, Body, Param, Put, Delete, Query } from '@nestjs/common';
import { AssignmentsService } from './assignments.service';

@Controller('assignments')
export class AssignmentsController {
  constructor(private readonly assignmentsService: AssignmentsService) {}

  @Post()
  create(@Body() createAssignmentDto: any) {
    return this.assignmentsService.create(createAssignmentDto);
  }

  @Get()
  findAll(@Query('courseId') courseId?: string) {
    return this.assignmentsService.findAll(courseId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.assignmentsService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateAssignmentDto: any) {
    return this.assignmentsService.update(id, updateAssignmentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.assignmentsService.remove(id);
  }

  @Post(':id/submit')
  submitAssignment(@Param('id') assignmentId: string, @Body() submissionData: any) {
    return this.assignmentsService.submitAssignment({
      ...submissionData,
      assignmentId
    });
  }
}
