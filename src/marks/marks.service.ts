

import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Marks, MarksDocument } from './schemas/marks.schema';
import { Student } from '../students/schemas/student.schema';
import { Subject, SubjectDocument } from '../subject/schemas/subject.schema';
import { Teacher } from '../teachers/schemas/teacher.schema';
import { Class } from '../class/schemas/class.schema';
  
@Injectable()
export class MarksService {
  constructor(
    @InjectModel(Marks.name) private marksModel: Model<MarksDocument>,
    @InjectModel(Student.name) private studentModel: Model<Student>,
    @InjectModel(Subject.name) private subjectModel: Model<Subject>,
    @InjectModel(Teacher.name) private teacherModel: Model<Teacher>,
    @InjectModel(Class.name) private classModel: Model<Class>,
  ) {}

  // Add marks for a student (only subject teacher or admin)
  async addMarks(studentId: string, subjectId: string, marks: number, role: string, userId: string) {
    const student = await this.studentModel.findById(studentId);
    if (!student) throw new NotFoundException('Student not found');

    const subject = await this.subjectModel.findById(subjectId);
    if (!subject) throw new NotFoundException('Subject not found');

    // Only subject teacher or admin can add
    if (role === 'TEACHER' && subject.teacher?.toString() !== userId)
      throw new ForbiddenException('You are not allowed to add marks for this subject');

    const existingMarks = await this.marksModel.findOne({ student: studentId, subject: subjectId });
    if (existingMarks) throw new ForbiddenException('Marks already exist. Use update instead.');

    const newMarks = await this.marksModel.create({
      student: student._id,
      subject: subject._id,
      marks,
      isPublished: false,
    });

    return newMarks;
  }

  // Update marks (only subject teacher or admin)
async updateMark(
  markId: string,
  userId: string,
  role: string,
  newMark: number,
) {
  const mark = await this.marksModel
    .findById(markId)
    .populate('subject');

  if (!mark) {
    throw new NotFoundException('Mark not found');
  }

  // 🔐 Check if subject is populated
  if (!mark.subject || typeof mark.subject === 'string') {
    throw new ForbiddenException('Subject not populated properly');
  }

  const subject = mark.subject as Subject;

  if (
    role === 'TEACHER' &&
    (!subject.teacher || subject.teacher.toString() !== userId)
  ) {
    throw new ForbiddenException(
      'You are not allowed to update marks for this subject',
    );
  }

  mark.marks = newMark;
  return mark.save();
}

  // Publish marks (class teacher or admin)


async publishMarks(marksId: string) {
  const mark = await this.marksModel
    .findById(marksId)
    .populate('student');

  if (!mark) {
    throw new NotFoundException('Marks record not found');
  }

  // 🔐 Ensure student is populated
  if (mark.student instanceof Types.ObjectId) {
    throw new BadRequestException('Student not populated');
  }

  const student = mark.student;

  const studentClass = await this.classModel.findById(student.class);

  if (!studentClass) {
    throw new NotFoundException('Student class not found');
  }

  mark.isPublished = true;
  return mark.save();
}

  // Get all marks (admin only)
  async getAllMarks() {
    return this.marksModel.find().populate('student').populate('subject');
  }

  // Get marks for a student (student, class teacher, admin)
  async getMarksByStudent(studentId: string, role: string, userId: string) {
    const student = await this.studentModel.findById(studentId);
    if (!student) throw new NotFoundException('Student not found');

    // Role checks
    if (role === 'STUDENT' && student.user.toString() !== userId)
      throw new ForbiddenException('You can only view your own marks');

    if (role === 'CLASS_TEACHER') {
      const cls = await this.classModel.findOne({ classTeacher: userId });
      if (!cls || cls._id.toString() !== student.class.toString())
        throw new ForbiddenException('You can only view marks for your class students');
    }

    return this.marksModel
      .find({ student: studentId, published: true })
      .populate('subject')
      .populate('student');
  }
}