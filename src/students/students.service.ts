import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Student, StudentDocument } from './schemas/student.schema';
import { Model } from 'mongoose';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';

@Injectable()
export class StudentsService {
  constructor(
    @InjectModel(Student.name)
    private readonly studentModel: Model<StudentDocument>,
  ) {}

  // CREATE
  async create(dto: CreateStudentDto) {
    const student = await this.studentModel.create(dto);
    return student;
  }

  // GET ALL
  async findAll() {
    return this.studentModel.find().populate('user');
  }

  // GET ONE
  async findOne(id: string) {
    const student = await this.studentModel
      .findById(id)
      .populate('user');

    if (!student) {
      throw new NotFoundException('Student not found');
    }

    return student;
  }

  // UPDATE
  async update(id: string, dto: UpdateStudentDto) {
    const updatedStudent = await this.studentModel.findByIdAndUpdate(
      id,
      dto,
      { new: true },
    );

    if (!updatedStudent) {
      throw new NotFoundException('Student not found');
    }

    return updatedStudent;
  }

  // DELETE
  async remove(id: string) {
    const deletedStudent = await this.studentModel.findByIdAndDelete(id);

    if (!deletedStudent) {
      throw new NotFoundException('Student not found');
    }

    return { message: 'Student deleted successfully' };
  }
}