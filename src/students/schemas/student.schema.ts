import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Student {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user!: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Class', required: true })
  class!: Types.ObjectId; // reference to class

  @Prop({ required: true, unique: true })
  rollNumber!: string; // auto-generated

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

