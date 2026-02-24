import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Class, ClassDocument } from './schemas/class.schema';
import { Teacher, TeacherDocument } from '../teachers/schemas/teacher.schema';
import { Model } from 'mongoose';

@Injectable()
export class ClassService {
  constructor(
    @InjectModel(Class.name) private classModel: Model<ClassDocument>,
    @InjectModel(Teacher.name) private teacherModel: Model<TeacherDocument>,
  ) {}

  // Create a class without teacher
  async createClass(grade: string, section: string) {
    const existing = await this.classModel.findOne({ grade, section });
    if (existing) throw new Error('Class already exists');

    const cls = await this.classModel.create({ grade, section });
    return cls;
  }

  // Get all classes with students populated
  async getAllClasses() {
    return this.classModel.find()
      .populate('classTeacher')
      .populate({
        path: 'students',
        populate: { path: 'user', select: 'name email' },
      });
  }

  // Get single class by ID with students populated
  async getClassById(id: string) {
    const cls = await this.classModel.findById(id)
      .populate('classTeacher')
      .populate({
        path: 'students',
        populate: { path: 'user', select: 'name email' },
      });

    if (!cls) throw new NotFoundException('Class not found');
    return cls;
  }

  // Assign/Update class teacher
  async assignClassTeacher(classId: string, teacherId: string) {
    const cls = await this.classModel.findById(classId);
    if (!cls) throw new NotFoundException('Class not found');

    if (cls.classTeacher)
      throw new BadRequestException('Class already has a class teacher');

    const teacher = await this.teacherModel.findById(teacherId);
    if (!teacher) throw new NotFoundException('Teacher not found');

    cls.classTeacher = teacher._id;
    await cls.save();

    return { message: `Teacher ${teacher.user} assigned as class teacher` };
  }

  // Delete class
  async deleteClass(classId: string) {
    const cls = await this.classModel.findByIdAndDelete(classId);
    if (!cls) throw new NotFoundException('Class not found');
    return { message: 'Class deleted successfully' };
  }
}