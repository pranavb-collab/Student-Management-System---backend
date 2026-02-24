import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Student {

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user!: Types.ObjectId;

  @Prop({ required: true, unique: true })
  rollNumber!: string;

  @Prop({ required: true })
  grade!: string;

  @Prop({ required: true })
  section!: string;

  @Prop({ required: true })
  dateOfBirth!: Date;

  @Prop({ required: true })
  parentName!: string;

  @Prop({ required: true })
  parentPhone!: string;

  @Prop()
  address?: string;

  @Prop({ default: true })
  isActive!: boolean;
}

export type StudentDocument = Student & Document;
export const StudentSchema = SchemaFactory.createForClass(Student);