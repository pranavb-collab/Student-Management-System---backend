import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Teacher, TeacherDocument } from './schemas/teacher.schema';
import { Model } from 'mongoose';
import { CreateTeacherDto } from './dto/create-teacher.dto';
import { UpdateTeacherDto } from './dto/update-teacher.dto';

@Injectable()
export class TeachersService {
  constructor(
    @InjectModel(Teacher.name)
    private teacherModel: Model<TeacherDocument>,
  ) {}

  async create(dto: CreateTeacherDto) {
    return this.teacherModel.create(dto);
  }

  async findAll() {
    return this.teacherModel.find().populate('user');
  }

  async findOne(id: string) {
    const teacher = await this.teacherModel.findById(id).populate('user');
    if (!teacher) throw new NotFoundException('Teacher not found');
    return teacher;
  }

  async update(id: string, dto: UpdateTeacherDto) {
    const updated = await this.teacherModel.findByIdAndUpdate(id, dto, {
      new: true,
    });
    if (!updated) throw new NotFoundException('Teacher not found');
    return updated;
  }

  async remove(id: string) {
    const deleted = await this.teacherModel.findByIdAndDelete(id);
    if (!deleted) throw new NotFoundException('Teacher not found');
    return { message: 'Teacher deleted successfully' };
  }
}