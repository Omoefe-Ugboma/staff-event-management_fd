// models/staff.model.ts
export interface Staff {
  id: string;
  user_id: string;
  username: string;
  department: string;
  position: string;
  hire_date: string | Date;
  status: 'Active' | 'Inactive' | 'On Leave';
}