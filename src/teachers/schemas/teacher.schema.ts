import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Teacher {

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user!: Types.ObjectId;

  @Prop({ required: true, unique: true })
  employeeId!: string;

  @Prop({ required: true })
  subject!: string;

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
}

export type TeacherDocument = Teacher & Document;
export const TeacherSchema = SchemaFactory.createForClass(Teacher);