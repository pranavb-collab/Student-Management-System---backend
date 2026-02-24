import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Subject, SubjectDocument } from './schemas/subject.schema';

@Injectable()
export class SubjectService {
  constructor(
    @InjectModel(Subject.name) private subjectModel: Model<SubjectDocument>,
  ) {}

  // Create a subject (teacher optional)
  async create(name: string) {
    const subject = new this.subjectModel({ name });
    return subject.save();
  }

  // Get all subjects
  async findAll() {
    return this.subjectModel.find().populate('teacher');
  }

  // Get single subject
  async findOne(id: string) {
    const subject = await this.subjectModel.findById(id).populate('teacher');
    if (!subject) throw new NotFoundException('Subject not found');
    return subject;
  }

  // Update subject name or other fields
  async update(id: string, updateData: Partial<Subject>) {
    const updated = await this.subjectModel.findByIdAndUpdate(id, updateData, {
      new: true,
    }).populate('teacher');
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
    return subject.save();
  }
}