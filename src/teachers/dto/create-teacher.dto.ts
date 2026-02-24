export class CreateTeacherDto {
  user!: string;
  employeeId!: string;
  subject!: string;
  qualification!: string;
  experience!: number;
  phone!: string;
  address?: string;
}