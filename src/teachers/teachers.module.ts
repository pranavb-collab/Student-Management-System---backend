import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TeacherService } from './teachers.service';
import { TeacherController } from './teachers.controller';
import { Teacher, TeacherSchema } from './schemas/teacher.schema';
import { UserSchema } from 'src/users/schemas/user.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Teacher.name, schema: TeacherSchema },
    { name: 'User', schema: UserSchema }
  ])],
  controllers: [TeacherController],
  providers: [TeacherService],
  exports: [TeacherService],
})
export class TeacherModule {}