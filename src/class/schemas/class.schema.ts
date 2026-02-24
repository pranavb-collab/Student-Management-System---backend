import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ClassDocument = Class & Document;

@Schema({ timestamps: true })
export class Class {
  @Prop({ required: true })
  grade!: string;

  @Prop({ required: true })
  section!: string;

  @Prop({ type: Types.ObjectId, ref: 'Teacher', unique: true, sparse: true })
  classTeacher?: Types.ObjectId; // <-- Use ObjectId here

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Student' }] })
  students!: Types.ObjectId[];
}

export const ClassSchema = SchemaFactory.createForClass(Class);