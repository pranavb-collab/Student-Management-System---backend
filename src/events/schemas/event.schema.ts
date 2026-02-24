import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type EventDocument = Event & Document;

@Schema({ timestamps: true })
export class Event {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  eventDate: Date;

  @Prop({ required: true })
  createdBy: string;

  @Prop({ required: true })
  createdByRole: string;
}

export const EventSchema = SchemaFactory.createForClass(Event);