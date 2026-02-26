import { IsOptional, IsString, IsDateString } from 'class-validator';

export class UpdateStudentDto {

  // USER fields
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  email?: string;

  // STUDENT fields
  @IsOptional()
  @IsString()
  class?: string;

  @IsOptional()
  @IsDateString()
  dateOfBirth?: Date;

  @IsOptional()
  @IsString()
  parentName?: string;

  @IsOptional()
  @IsString()
  parentPhone?: string;

  @IsOptional()
  @IsString()
  address?: string;
}