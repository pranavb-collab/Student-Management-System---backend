import { Body, Controller, Get, Param, Patch, Post, Delete } from '@nestjs/common';
import { ClassService } from './class.service';

@Controller('classes')
export class ClassController {
  constructor(private readonly classService: ClassService) {}

  // Create class
  @Post()
  async createClass(@Body() body: { grade: string; section: string }) {
    return this.classService.createClass(body.grade, body.section);
  }

  // Get all classes
  @Get()
  async getAllClasses() {
    return this.classService.getAllClasses();
  }

  // Get single class
  @Get(':id')
  async getClassById(@Param('id') id: string) {
    return this.classService.getClassById(id);
  }

  // Assign teacher to class
  @Patch(':id/assign-teacher')
  async assignTeacher(
    @Param('id') classId: string,
    @Body() body: { teacherId: string },
  ) {
    return this.classService.assignClassTeacher(classId, body.teacherId);
  }

  // Delete class
  @Delete(':id')
  async deleteClass(@Param('id') id: string) {
    return this.classService.deleteClass(id);
  }
}