import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Teacher } from '../../teachers/schemas/teacher.schema';
import { Class } from '../../class/schemas/class.schema';

@Schema({ timestamps: true })
export class Subject {
  @Prop({ required: true })
  name!: string;

  // Link to a class
  @Prop({ type: Types.ObjectId, ref: 'Class', required: true })
  class!: Types.ObjectId;

  // Optional teacher assignment
  @Prop({ type: Types.ObjectId, ref: 'Teacher', default: null })
  teacher?: Types.ObjectId;
}

export type SubjectDocument = Subject & Document;
export const SubjectSchema = SchemaFactory.createForClass(Subject);