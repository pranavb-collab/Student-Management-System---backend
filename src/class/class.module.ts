import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Class, ClassSchema } from './schemas/class.schema';
import { ClassService } from './class.service';
import { ClassController } from './class.controller';

@Module({
  imports: [MongooseModule.forFeature([{ name: Class.name, schema: ClassSchema }]),
MongooseModule.forFeature([{ name: 'Teacher', schema: ClassSchema }])],
  controllers: [ClassController],
  providers: [ClassService],
  exports: [ClassService],
})
export class ClassModule {}