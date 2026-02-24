import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Teacher } from '../../teachers/schemas/teacher.schema';

@Schema({ timestamps: true })
export class Subject {
  @Prop({ required: true, unique: true })
  name!: string;

  @Prop({ type: Types.ObjectId, ref: 'Teacher', default: null })
  teacher?: Types.ObjectId;
}

export type SubjectDocument = Subject & Document;
export const SubjectSchema = SchemaFactory.createForClass(Subject);