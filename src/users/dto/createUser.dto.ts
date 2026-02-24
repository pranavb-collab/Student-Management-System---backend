export class CreateUserDto {
  name!: string;
  email!: string;
  password!: string;
  role!: 'ADMIN' | 'TEACHER' | 'STUDENT';

  // Teacher fields
  employeeId?: string;
  subject?: string;
  qualification?: string;
  experience?: number;
  phone?: string;
  address?: string;

  // Student fields
  rollNumber?: string;
  grade?: string;
  section?: string;
  dateOfBirth?: Date;
  parentName?: string;
  parentPhone?: string;
}