// models/staff.model.ts
export interface Staff {
  id: string;
  name: string;
  email: string; // Make sure email is required
  department: string;
  role: 'Admin' | 'Manager' | 'Employee';
  hireDate: Date;
  attendance?: number; // Optional property
}