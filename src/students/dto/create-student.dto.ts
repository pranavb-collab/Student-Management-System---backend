export class CreateStudentDto {
  user!: string;
  rollNumber!: string;
  grade!: string;
  section!: string;
  dateOfBirth!: Date;
  parentName!: string;
  parentPhone!: string;
  address?: string;
}