import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { StudentsController } from './students.controller';
import { StudentsService } from './students.service';
import { Student, StudentSchema } from './schemas/student.schema';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Student.name, schema: StudentSchema }
    ]),
    AuthModule
  ],
  controllers: [StudentsController],
  providers: [StudentsService],
  exports: [StudentsService] // optional but good practice
})
export class StudentsModule {}