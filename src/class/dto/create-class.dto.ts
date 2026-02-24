import { IsNotEmpty, IsString } from 'class-validator';

export class CreateClassDto {
  @IsNotEmpty()
  @IsString()
  grade!: string;

  @IsNotEmpty()
  @IsString()
  section!: string;

  @IsNotEmpty()
  classTeacher!: string; // teacherId
}