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
import { TeachersService } from './teachers.service';
import { CreateTeacherDto } from './dto/create-teacher.dto';
import { UpdateTeacherDto } from './dto/update-teacher.dto';
import { JwtAuthGuard } from '../guards/jwt.guard';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from '../decorators/roles.decorator';

@Controller('teachers')
@UseGuards(JwtAuthGuard, RolesGuard)
export class TeachersController {
  constructor(private readonly service: TeachersService) {}

  @Post()
  @Roles('ADMIN')
  create(@Body() dto: CreateTeacherDto) {
    return this.service.create(dto);
  }

  @Get()
  @Roles('ADMIN')
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  @Roles('ADMIN', 'TEACHER')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Put(':id')
  @Roles('ADMIN')
  update(@Param('id') id: string, @Body() dto: UpdateTeacherDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @Roles('ADMIN')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}