import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Teacher, TeacherDocument } from './schemas/teacher.schema';
import { CreateTeacherDto } from './dto/create-teacher.dto';
import { UpdateTeacherDto } from './dto/update-teacher.dto';
import { User, UserDocument } from 'src/users/schemas/user.schema';

@Injectable()
export class TeacherService {
  constructor(@InjectModel(Teacher.name) private teacherModel: Model<TeacherDocument>,
 @InjectModel(User.name)
  private userModel: Model<UserDocument>,) {}

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

  if (!dto) {
    throw new NotFoundException('Update body is missing');
  }

  const teacher = await this.teacherModel.findById(id);
  if (!teacher) {
    throw new NotFoundException('Teacher not found');
  }

  if (dto?.name || dto?.email) {
    await this.userModel.findByIdAndUpdate(
      teacher.user,
      {
        ...(dto.name && { name: dto.name }),
        ...(dto.email && { email: dto.email }),
      }
    );
  }

  const { name, email, ...teacherFields } = dto;

  Object.assign(teacher, teacherFields);

  await teacher.save();
  await teacher.populate('user');

  return teacher;
}

  async remove(id: string): Promise<void> {

  const teacher = await this.teacherModel.findById(id);
  if (!teacher) {
    throw new NotFoundException('Teacher not found');
  }

  await this.userModel.findByIdAndDelete(teacher.user);

  await this.teacherModel.findByIdAndDelete(id);
}
}