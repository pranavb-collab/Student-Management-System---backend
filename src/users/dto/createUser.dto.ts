import { IsNotEmpty, IsEmail, IsOptional, IsEnum, IsArray, ArrayNotEmpty, IsString, IsNumber, IsDateString } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  name!: string;

  @IsNotEmpty()
  @IsEmail()
  email!: string;

  @IsOptional() // password is optional, system generates if not provided
  @IsString()
  password?: string;

  @IsNotEmpty()
  @IsEnum(['ADMIN', 'TEACHER', 'STUDENT'])
  role!: 'ADMIN' | 'TEACHER' | 'STUDENT';

  // Teacher fields
  @IsOptional()
  @IsString()
  employeeId?: string;

  @IsOptional()
  @IsArray()
  @ArrayNotEmpty()
  subjects?: string[]; // multiple subjects

  @IsOptional()
  @IsString()
  qualification?: string;

  @IsOptional()
  @IsNumber()
  experience?: number;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  address?: string;

  // Student fields
  @IsOptional()
  @IsString()
  classId?: string; // link to Class

  @IsOptional()
  @IsDateString()
  dateOfBirth?: Date;

  @IsOptional()
  @IsString()
  parentName?: string;

  @IsOptional()
  @IsString()
  parentPhone?: string;
}