import { IsNotEmpty, IsString, IsDateString } from 'class-validator';

export class CreateStudentDto {
  @IsNotEmpty()
  class!: string; // classId

  @IsNotEmpty()
  @IsDateString()
  dateOfBirth!: Date;

  @IsNotEmpty()
  @IsString()
  parentName!: string;

  @IsNotEmpty()
  @IsString()
  parentPhone!: string;

  @IsString()
  address?: string;
}