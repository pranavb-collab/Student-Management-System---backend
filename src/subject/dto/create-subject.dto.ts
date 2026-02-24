import { IsNotEmpty, IsString } from 'class-validator';

export class CreateSubjectDto {
  @IsNotEmpty()
  @IsString()
  name!: string;

  @IsNotEmpty()
  teacher!: string; // teacherId
}