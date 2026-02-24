import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../users/schemas/user.schema';
import { Teacher, TeacherDocument } from '../teachers/schemas/teacher.schema';
import { Student, StudentDocument } from '../students/schemas/student.schema';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from '../users/dto/createUser.dto';
import { LoginDto } from './dto/login.dto';
import { generateRandomPassword } from 'src/helpers/generate-password';
import * as nodemailer from 'nodemailer';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<UserDocument>,

    @InjectModel(Teacher.name)
    private teacherModel: Model<TeacherDocument>,

    @InjectModel(Student.name)
    private studentModel: Model<StudentDocument>,

    private jwtService: JwtService,
  ) {}

  // ================= REGISTER =================

async register(data: CreateUserDto) {
  const {
    name,
    email,
    role,
    employeeId,
    subject,
    qualification,
    experience,
    phone,
    address,
    rollNumber,
    grade,
    section,
    dateOfBirth,
    parentName,
    parentPhone,
  } = data;

  const existingUser = await this.userModel.findOne({ email });
  if (existingUser) {
    throw new BadRequestException('User already exists');
  }
  const randomPassword = generateRandomPassword(8);

  const user = await this.userModel.create({
    name,
    email,
    password: randomPassword, 
    role,
  });

  if (role === 'TEACHER') {
    await this.teacherModel.create({
      user: user._id,
      employeeId,
      subject,
      qualification,
      experience,
      phone,
      address,
    });
  }

  if (role === 'STUDENT') {
    await this.studentModel.create({
      user: user._id,
      rollNumber,
      grade,
      section,
      dateOfBirth,
      parentName,
      parentPhone,
      address,
    });
  }
  const resetToken = this.jwtService.sign(
    { id: user._id },
    { expiresIn: '1d' },
  );

  await this.sendResetEmail(name,email, resetToken);

  return {
    message: 'User created successfully. Reset link sent to email.',
  };
}

  // ================= LOGIN =================
  async login(
    data: LoginDto,
  ): Promise<{ token: string; role: string ;email: string}> {
    const { email, password } = data;

    const user = await this.userModel.findOne({ email });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

   if (user.password !== password) {
    throw new UnauthorizedException('Invalid credentials');
  }

    const token = this.jwtService.sign({
      id: user._id,
      role: user.role,
    });

    return {
      token,
      role: user.role,
      email: user.email
    };
  }

   async sendResetEmail(name:string,email: string, token: string) {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    const resetLink = `http://localhost:3000/auth/reset-password?token=${token}`;

  await transporter.sendMail({
  from: `"School Management System" <${process.env.MAIL_USER}>`,
  to: email,
  subject: 'Set Your Account Password',
  html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 8px;">
      
      <h2 style="color: #2c3e50;">Welcome to School Management System 🎓</h2>
      
      <p>Hi <strong>${name}</strong>,</p>
      
      <p>
        Your account has been created successfully by the administrator.
      </p>

      <p>
        To activate your account and set your password, please click the button below:
      </p>

      <div style="text-align: center; margin: 30px 0;">
        <a 
          href="${resetLink}" 
          style="
            background-color: #3498db;
            color: #ffffff;
            padding: 12px 25px;
            text-decoration: none;
            border-radius: 5px;
            font-weight: bold;
          "
        >
          Set Your Password
        </a>
      </div>

      <p>
        This link will expire in <strong>24 hours</strong>.
      </p>

      <p>If you did not expect this email, please ignore it.</p>

      <hr style="margin: 30px 0;" />

      <p style="font-size: 12px; color: #888;">
        © ${new Date().getFullYear()} School Management System. All rights reserved.
      </p>
    </div>
  `,
});
  }

  async resetPassword(token: string, newPassword: string) {
  try {
    const decoded = this.jwtService.verify(token);

    await this.userModel.findByIdAndUpdate(decoded.id, {
      password: newPassword,
    });

    return { message: 'Password updated successfully' };
  } catch (err) {
    throw new BadRequestException('Invalid or expired token');
  }
}
}