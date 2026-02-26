import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Student, StudentDocument } from './schemas/student.schema';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { Class, ClassDocument } from '../class/schemas/class.schema';
import { User, UserDocument } from 'src/users/schemas/user.schema';

@Injectable()
export class StudentService {
  constructor(
    @InjectModel(Student.name) private studentModel: Model<StudentDocument>,
    @InjectModel(Class.name) private classModel: Model<ClassDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

private async generateRollNumber(classId: string): Promise<string> {

  const classObjectId = new Types.ObjectId(classId);

  const classInfo = await this.classModel.findById(classObjectId);
  if (!classInfo) throw new NotFoundException('Class not found');

  const students = await this.studentModel
    .find({ class: classObjectId })
    .select('rollNumber')
    .lean();

  let maxSerial = 0;

  for (const student of students) {
    const serial = parseInt(student.rollNumber.slice(-3));
    if (serial > maxSerial) {
      maxSerial = serial;
    }
  }

  const newSerial = maxSerial + 1;

  return `${classInfo.grade}${classInfo.section}${newSerial
    .toString()
    .padStart(3, '0')}`;
}
  async create(userId: string, createStudentDto: CreateStudentDto): Promise<StudentDocument> {
    const rollNumber = await this.generateRollNumber(createStudentDto.class);

    const student = new this.studentModel({
  ...createStudentDto,
  class: new Types.ObjectId(createStudentDto.class),
  user: new Types.ObjectId(userId),
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

 async update(id: string, dto: UpdateStudentDto): Promise<Student> {

  const student = await this.studentModel.findById(id);
  if (!student) throw new NotFoundException('Student not found');

  if (dto?.name || dto?.email) {
    await this.userModel.findByIdAndUpdate(student.user, {
      ...(dto.name && { name: dto.name }),
      ...(dto.email && { email: dto.email }),
    });
  }

  if (dto.class && dto.class !== student.class.toString()) {

    await this.classModel.findByIdAndUpdate(student.class, {
      $pull: { students: student._id }
    });

    await this.classModel.findByIdAndUpdate(dto.class, {
      $push: { students: student._id }
    });

    student.class = dto.class as any;
  }

  const { name, email, class: classId, ...studentFields } = dto;

  Object.assign(student, studentFields);

  await student.save();
  await student.populate('user');
  await student.populate('class');

  return student;
}

  async remove(id: string): Promise<void> {

  const student = await this.studentModel.findById(id);
  if (!student) throw new NotFoundException('Student not found');

  await this.classModel.findByIdAndUpdate(student.class, {
    $pull: { students: student._id }
  });

  await this.userModel.findByIdAndDelete(student.user);

  await this.studentModel.findByIdAndDelete(id);
}
}