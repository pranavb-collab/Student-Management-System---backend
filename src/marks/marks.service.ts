import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Marks, MarksDocument } from './schemas/marks.schema';
import { Student } from '../students/schemas/student.schema';
import { Subject, SubjectDocument } from '../subject/schemas/subject.schema';
import { Teacher } from '../teachers/schemas/teacher.schema';

@Injectable()
export class MarksService {
  constructor(
    @InjectModel(Marks.name) private marksModel: Model<MarksDocument>,
    @InjectModel(Student.name) private studentModel: Model<Student>,
    @InjectModel(Subject.name) private subjectModel: Model<SubjectDocument>,
    @InjectModel(Teacher.name) private teacherModel: Model<Teacher>,
  ) {}

  async getAllMarks() {
  return this.marksModel.find().populate('student').populate('subject');
}

  // ✅ Add marks (Teacher or Admin)
  async addMarks(
    studentId: string,
    subjectId: string,
    marks: number,
    role: string,
    userId: string,
  ) {
    const student = await this.studentModel.findById(studentId);
    if (!student) throw new NotFoundException('Student not found');

    const subject = await this.subjectModel.findById(subjectId);
    if (!subject) throw new NotFoundException('Subject not found');

    // 🔐 Teacher validation
    if (role === 'TEACHER') {
      const teacher = await this.teacherModel.findOne({ user: userId });
      if (!teacher)
        throw new ForbiddenException('Teacher profile not found');

      if (subject.teacher?.toString() !== teacher._id.toString()) {
        throw new ForbiddenException(
          'You are not allowed to add marks for this subject',
        );
      }
    }

    const existingMarks = await this.marksModel.findOne({
      student: studentId,
      subject: subjectId,
    });

    if (existingMarks)
      throw new BadRequestException(
        'Marks already exist. Use update instead.',
      );

    return this.marksModel.create({
      student: student._id,
      subject: subject._id,
      marks,
      isPublished: false,
    });
  }

  // ✅ Update marks (Teacher or Admin)
  async updateMark(
    markId: string,
    userId: string,
    role: string,
    newMark: number,
  ) {
    const mark = await this.marksModel
      .findById(markId)
      .populate('subject');

    if (!mark) throw new NotFoundException('Mark not found');

    if (!mark.subject || mark.subject instanceof Types.ObjectId)
      throw new BadRequestException('Subject not populated');

    const subject = mark.subject as any;

    if (role === 'TEACHER') {
      const teacher = await this.teacherModel.findOne({ user: userId });
      if (!teacher)
        throw new ForbiddenException('Teacher profile not found');

      if (subject.teacher?.toString() !== teacher._id.toString()) {
        throw new ForbiddenException(
          'You are not allowed to update marks for this subject',
        );
      }
    }

    mark.marks = newMark;
    return mark.save();
  }

  // ✅ Publish marks (Admin Only)
  async publishMarks(markId: string, role: string) {
    if (role !== 'ADMIN') {
      throw new ForbiddenException(
        'Only admin can publish marks',
      );
    }

    const mark = await this.marksModel.findById(markId);
    if (!mark)
      throw new NotFoundException('Marks record not found');

    mark.isPublished = true;
    return mark.save();
  }

  // ✅ Get marks by student
  async getMarksByStudent(
    studentId: string,
    role: string,
    userId: string,
  ) {
    const student = await this.studentModel.findById(studentId);
    if (!student) throw new NotFoundException('Student not found');

    if (role === 'STUDENT') {
      if (student.user.toString() !== userId)
        throw new ForbiddenException(
          'You can only view your own marks',
        );
    }

    // Teachers & Admin can see all
    if (role === 'STUDENT') {
      return this.marksModel
        .find({ student: studentId, isPublished: true })
        .populate('subject');
    }

    return this.marksModel
      .find({ student: studentId })
      .populate('subject');
  }
}