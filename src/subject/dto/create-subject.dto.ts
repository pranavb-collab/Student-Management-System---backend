import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateSubjectDto {
  @IsNotEmpty()
  @IsString()
  name!: string;

   @IsNotEmpty()
  @IsString()
  classId!: string;

  @IsNotEmpty()
  @IsOptional()
  teacher!: string; // teacherId


}