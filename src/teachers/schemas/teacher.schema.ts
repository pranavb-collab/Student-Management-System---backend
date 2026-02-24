import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Subject } from '../../subject/schemas/subject.schema';

@Schema({ timestamps: true })
export class Teacher {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user!: Types.ObjectId;

  @Prop({ required: true, unique: true })
  employeeId!: string;

  // Array of subjects (references)
  @Prop({ type: [{ type: Types.ObjectId, ref: 'Subject' }], default: [] })
  subjects!: Types.ObjectId[];

  @Prop({ required: true })
  qualification!: string;

  @Prop({ required: true })
  experience!: number;

  @Prop({ required: true })
  phone!: string;

  @Prop()
  address?: string;

  @Prop({ default: true })
  isActive!: boolean;

  @Prop({ default: false })
  isClassTeacher!: boolean;
}

export type TeacherDocument = Teacher & Document;
export const TeacherSchema = SchemaFactory.createForClass(Teacher);