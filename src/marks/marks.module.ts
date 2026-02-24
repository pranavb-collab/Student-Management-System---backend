import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Marks, MarksSchema } from './schemas/marks.schema';
import { MarksService } from './marks.service';
import { MarksController } from './marks.controller';
import { Student, StudentSchema } from '../students/schemas/student.schema';
import { Subject, SubjectSchema } from '../subject/schemas/subject.schema';
import { Teacher, TeacherSchema } from '../teachers/schemas/teacher.schema';
import { Class, ClassSchema } from 'src/class/schemas/class.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Marks.name, schema: MarksSchema },
      { name: Student.name, schema: StudentSchema },
      { name: Subject.name, schema: SubjectSchema },
      { name: Teacher.name, schema: TeacherSchema },
       { name: Class.name, schema: ClassSchema },
    ]),
  ],
  controllers: [MarksController],
  providers: [MarksService],
})
export class MarksModule {}