import { Controller, Post, Patch, Get, Param, Body, Query, UseGuards } from '@nestjs/common';
import { MarksService } from './marks.service';
import { Roles } from '../decorators/roles.decorator';
import { RolesGuard } from '../guards/roles.guard';

@UseGuards(RolesGuard)
@Controller('marks')
export class MarksController {
  constructor(private readonly marksService: MarksService) {}

  @Post()
  @Roles('ADMIN', 'TEACHER')
  addMarks(
    @Body('studentId') studentId: string,
    @Body('subjectId') subjectId: string,
    @Body('marks') marks: number,
    @Query('role') role: string,
    @Query('userId') userId: string,
  ) {
    return this.marksService.addMarks(studentId, subjectId, marks, role, userId);
  }

  @Patch(':id')
  @Roles('ADMIN', 'TEACHER')
  updateMarks(
    @Param('id') id: string,
    @Body('marks') marks: number,
    @Query('role') role: string,
    @Query('userId') userId: string,
  ) {
    return this.marksService.updateMark(id, userId, role, marks);
  }
@Patch(':id/publish')
@Roles('ADMIN', 'TEACHER')
publishMarks(
  @Param('id') id: string,
  @Query('role') role: string
) {
  return this.marksService.publishMarks(id, role);
}
  @Get()
  @Roles('ADMIN')
  getAllMarks() {
    return this.marksService.getAllMarks();
  }

  @Get('student/:studentId')
  @Roles('ADMIN', 'CLASS_TEACHER', 'STUDENT')
  getMarksByStudent(
    @Param('studentId') studentId: string,
    @Query('role') role: string,
    @Query('userId') userId: string,
  ) {
    return this.marksService.getMarksByStudent(studentId, role, userId);
  }
}