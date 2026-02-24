import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { StudentsService } from './students.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { JwtAuthGuard } from '../guards/jwt.guard';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from '../decorators/roles.decorator';

@Controller('students')
@UseGuards(JwtAuthGuard, RolesGuard)
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  // ADMIN creates student
  @Post()
  @Roles('ADMIN')
  create(@Body() dto: CreateStudentDto) {
    return this.studentsService.create(dto);
  }

  // ADMIN view all students
  @Get()
  @Roles('ADMIN')
  findAll() {
    return this.studentsService.findAll();
  }

  // ADMIN or STUDENT view one
  @Get(':id')
  @Roles('ADMIN', 'STUDENT')
  findOne(@Param('id') id: string) {
    return this.studentsService.findOne(id);
  }

  // ADMIN update student
  @Put(':id')
  @Roles('ADMIN')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateStudentDto,
  ) {
    return this.studentsService.update(id, dto);
  }

  // ADMIN delete student
  @Delete(':id')
  @Roles('ADMIN')
  remove(@Param('id') id: string) {
    return this.studentsService.remove(id);
  }
}