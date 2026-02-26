import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { User, UserSchema } from '../users/schemas/user.schema';
import { Teacher, TeacherSchema } from '../teachers/schemas/teacher.schema';
import { Student, StudentSchema } from '../students/schemas/student.schema';
import { Class, ClassSchema } from '../class/schemas/class.schema';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { RolesGuard } from 'src/guards/roles.guard';
import { JwtAuthGuard } from 'src/guards/jwt.guard';
import { StudentModule } from 'src/students/students.module';

@Module({
  imports: [
    ConfigModule,StudentModule,

    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Teacher.name, schema: TeacherSchema },
      { name: Student.name, schema: StudentSchema },
      { name: Class.name, schema: ClassSchema },
    ]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '1d' },
      }),
    }),
  ],

  controllers: [AuthController],

  providers: [
    AuthService,
    RolesGuard,
    JwtAuthGuard,
  ],

  exports: [
    JwtModule,
    AuthService,
    RolesGuard,
    JwtAuthGuard,
  ],
})
export class AuthModule {}