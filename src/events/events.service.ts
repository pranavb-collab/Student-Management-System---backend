import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as nodemailer from 'nodemailer';

import { Event, EventDocument } from './schemas/event.schema';
import { User, UserDocument } from '../users/schemas/user.schema';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';

@Injectable()
export class EventsService {
  constructor(
    @InjectModel(Event.name)
    private eventModel: Model<EventDocument>,

    @InjectModel(User.name)
    private userModel: Model<UserDocument>,
  ) {}

  // ================= CREATE EVENT =================
  async create(createEventDto: CreateEventDto, user: any) {
    const event = await this.eventModel.create({
      ...createEventDto,
      eventDate: new Date(createEventDto.eventDate),
      createdBy: user.id,
      createdByRole: user.role,
    });

    // Get all users
    const users = await this.userModel.find();

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    for (const u of users) {
      await transporter.sendMail({
        from: `"School Management System" <${process.env.MAIL_USER}>`,
        to: u.email,
        subject: `New Event: ${event.title}`,
        html: `
          <div style="font-family: Arial; max-width:600px; margin:auto;">
            <h2 style="color:#2c3e50;">📢 New Event Announcement</h2>
            <p>Hello <strong>${u.name}</strong>,</p>
            <p>A new event has been scheduled:</p>
            <p><strong>Title:</strong> ${event.title}</p>
            <p><strong>Date:</strong> ${event.eventDate.toDateString()}</p>
            <p><strong>Description:</strong> ${event.description}</p>
            <hr />
            <p style="font-size:12px;color:#888;">
              © ${new Date().getFullYear()} School Management System
            </p>
          </div>
        `,
      });
    }

    return event;
  }

  // ================= GET ALL =================
  async findAll() {
    return this.eventModel.find().sort({ eventDate: 1 });
  }

  // ================= GET ONE =================
  async findOne(id: string) {
    return this.eventModel.findById(id);
  }

  // ================= UPDATE =================
  async update(id: string, dto: UpdateEventDto) {
    if (dto.eventDate) {
      dto.eventDate = new Date(dto.eventDate) as any;
    }

    return this.eventModel.findByIdAndUpdate(id, dto, { new: true });
  }

  // ================= DELETE =================
  async remove(id: string) {
    return this.eventModel.findByIdAndDelete(id);
  }
}