import { IsOptional, IsString, IsNumber, IsArray, IsBoolean } from 'class-validator';

export class UpdateTeacherDto {

  // USER FIELDS
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  email?: string;

  // TEACHER FIELDS
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

  @IsOptional()
  @IsArray()
  subjects?: string[];

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}