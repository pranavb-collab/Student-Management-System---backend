import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Teacher, TeacherDocument } from './schemas/teacher.schema';
import { CreateTeacherDto } from './dto/create-teacher.dto';
import { UpdateTeacherDto } from './dto/update-teacher.dto';

@Injectable()
export class TeacherService {
  constructor(@InjectModel(Teacher.name) private teacherModel: Model<TeacherDocument>) {}

  async create(userId: string, dto: CreateTeacherDto): Promise<Teacher> {
    const teacher = new this.teacherModel({ ...dto, user: userId });
    return teacher.save();
  }

  async findAll(): Promise<Teacher[]> {
    return this.teacherModel.find().populate('user').exec();
  }

  async findOne(id: string): Promise<Teacher> {
    const teacher = await this.teacherModel.findById(id).populate('user');
    if (!teacher) throw new NotFoundException('Teacher not found');
    return teacher;
  }

  async update(id: string, dto: UpdateTeacherDto): Promise<Teacher> {
    const updated = await this.teacherModel.findByIdAndUpdate(id, dto, { new: true });
    if (!updated) throw new NotFoundException('Teacher not found');
    return updated;
  }

  async remove(id: string): Promise<void> {
    const deleted = await this.teacherModel.findByIdAndDelete(id);
    if (!deleted) throw new NotFoundException('Teacher not found');
  }
}