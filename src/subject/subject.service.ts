import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Subject, SubjectDocument } from './schemas/subject.schema';
import { Teacher, TeacherDocument } from 'src/teachers/schemas/teacher.schema';

@Injectable()
export class SubjectService {
  constructor(
    @InjectModel(Subject.name) private subjectModel: Model<SubjectDocument>,
    @InjectModel(Teacher.name) private teacherModel: Model<TeacherDocument>, 
  ) {}

  // Create a subject linked to a class (teacher optional)
  async create(name: string, classId: string) {
    const subject = new this.subjectModel({
      name,
      class: new Types.ObjectId(classId),
    });
    return subject.save();
  }

  // Get all subjects
  async findAll() {
    return this.subjectModel.find().populate('teacher').populate('class');
  }

  // Get single subject
  async findOne(id: string) {
    const subject = await this.subjectModel.findById(id)
      .populate('teacher')
      .populate('class');
    if (!subject) throw new NotFoundException('Subject not found');
    return subject;
  }

  // Update subject
  async update(id: string, updateData: Partial<Subject>) {
    const updated = await this.subjectModel.findByIdAndUpdate(id, updateData, {
      new: true,
    }).populate('teacher').populate('class');
    if (!updated) throw new NotFoundException('Subject not found');
    return updated;
  }

  // Delete a subject
  async remove(id: string) {
    const deleted = await this.subjectModel.findByIdAndDelete(id);
    if (!deleted) throw new NotFoundException('Subject not found');
    return { message: 'Subject deleted successfully' };
  }

  // Assign teacher later
  async assignTeacher(subjectId: string, teacherId: string) {
  const subject = await this.subjectModel.findById(subjectId);
  if (!subject) throw new NotFoundException('Subject not found');

  subject.teacher = new Types.ObjectId(teacherId);
  await subject.save();

  const teacher = await this.teacherModel.findById(teacherId);
  if (!teacher) throw new NotFoundException('Teacher not found');

  if (!teacher.subjects.includes(subject._id)) {
    teacher.subjects.push(subject._id);
    await teacher.save();
  }

  return this.subjectModel.findById(subjectId).populate('teacher').populate('class');
}
}