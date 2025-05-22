// user.model.ts
// export interface User {
//   id: string;
//   username: string;
//   email: string;
//   password?: string;
//   role: 'admin' | 'manager' | 'employee' | 'user'; // Add 'user' to the union type
//   createdAt?: Date;
// }

// user.model.ts
export enum UserRole {
  ADMIN = 'admin',
  MANAGER = 'manager',
  EMPLOYEE = 'employee',
  USER = 'user'
}

export interface User {
  id: string;
  username: string;
  email: string;
  password?: string;
  role: UserRole; // Use the enum here
  createdAt?: Date;
}

 