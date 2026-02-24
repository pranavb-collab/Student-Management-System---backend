import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Student, StudentDocument } from './schemas/student.schema';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { Class, ClassDocument } from '../class/schemas/class.schema';

@Injectable()
export class StudentService {
  constructor(
    @InjectModel(Student.name) private studentModel: Model<StudentDocument>,
    @InjectModel(Class.name) private classModel: Model<ClassDocument>
  ) {}

  // Generate roll number per class + section
  private async generateRollNumber(classId: string): Promise<string> {
    const lastStudent = await this.studentModel
      .find({ class: classId })
      .sort({ createdAt: -1 })
      .limit(1)
      .exec();

    let serial = 1;
    if (lastStudent.length > 0) {
      const lastRoll = lastStudent[0].rollNumber;
      serial = parseInt(lastRoll.slice(-3)) + 1;
    }

    const classInfo = await this.classModel.findById(classId);
    if (!classInfo) throw new NotFoundException('Class not found');

    return `${classInfo.grade}${classInfo.section}${serial.toString().padStart(3, '0')}`;
  }

  async create(userId: string, createStudentDto: CreateStudentDto): Promise<Student> {
    const rollNumber = await this.generateRollNumber(createStudentDto.class);

    const student = new this.studentModel({
      ...createStudentDto,
      user: userId,
      rollNumber,
    });

    return student.save();
  }

  async findAll(): Promise<Student[]> {
    return this.studentModel.find().populate('user').populate('class').exec();
  }

  async findOne(id: string): Promise<Student> {
    const student = await this.studentModel.findById(id).populate('user').populate('class');
    if (!student) throw new NotFoundException('Student not found');
    return student;
  }

  async update(id: string, updateStudentDto: UpdateStudentDto): Promise<Student> {
    const updated = await this.studentModel.findByIdAndUpdate(id, updateStudentDto, { new: true });
    if (!updated) throw new NotFoundException('Student not found');
    return updated;
  }

  async remove(id: string): Promise<void> {
    const deleted = await this.studentModel.findByIdAndDelete(id);
    if (!deleted) throw new NotFoundException('Student not found');
  }
}