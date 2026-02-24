import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Student } from 'src/students/schemas/student.schema';
import { Subject } from 'src/subject/schemas/subject.schema';

@Schema({ timestamps: true })
export class Marks {
  @Prop({ type: Types.ObjectId, ref: 'Student', required: true })
  student!: Types.ObjectId | Student;

  @Prop({ type: Types.ObjectId, ref: 'Subject', required: true })
  subject!: Types.ObjectId | Subject;

  @Prop({ type: Number, required: true })
  marks!: number;

  @Prop({ default: false })
  isPublished!: boolean; // class teacher/admin can publish marks
}

export type MarksDocument = Marks & Document;
export const MarksSchema = SchemaFactory.createForClass(Marks);