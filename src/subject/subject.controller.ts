import { Body, Controller, Get, Param, Patch, Post, Delete } from '@nestjs/common';
import { SubjectService } from './subject.service';

@Controller('subjects')
export class SubjectController {
  constructor(private readonly subjectService: SubjectService) {}

  // Create a subject with classId
  @Post()
  create(@Body('name') name: string, @Body('classId') classId: string) {
    return this.subjectService.create(name, classId);
  }

  @Get()
  findAll() {
    return this.subjectService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.subjectService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateData: any) {
    return this.subjectService.update(id, updateData);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.subjectService.remove(id);
  }

  // Assign teacher later
  @Patch(':id/assign-teacher')
  assignTeacher(
    @Param('id') id: string,
    @Body('teacherId') teacherId: string,
  ) {
    return this.subjectService.assignTeacher(id, teacherId);
  }
}