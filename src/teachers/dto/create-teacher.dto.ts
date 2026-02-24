import { IsNotEmpty, IsString, IsNumber, IsBoolean, IsArray, ArrayNotEmpty } from 'class-validator';

export class CreateTeacherDto {
  @IsNotEmpty()
  @IsString()
  employeeId!: string;

  @IsArray()
  @ArrayNotEmpty()
  subjects!: string[]; // subject names

  @IsNotEmpty()
  @IsString()
  qualification!: string;

  @IsNotEmpty()
  @IsNumber()
  experience!: number;

  @IsNotEmpty()
  @IsString()
  phone!: string;

  @IsString()
  address?: string;

  @IsBoolean()
  isClassTeacher?: boolean;
}