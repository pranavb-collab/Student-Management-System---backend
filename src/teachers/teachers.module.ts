import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TeachersService } from './teachers.service';
import { TeachersController } from './teachers.controller';
import { Teacher, TeacherSchema } from './schemas/teacher.schema';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Teacher.name, schema: TeacherSchema }
    ]),
    AuthModule
  ],
  controllers: [TeachersController],
  providers: [TeachersService],
  exports: [TeachersService]   // optional but recommended
})
export class TeachersModule {}