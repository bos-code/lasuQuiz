export type UserRole = "student" | "admin";

export interface User {
  id: string;
  email: string;
  role: UserRole;
  name?: string;
  createdAt?: string;
}

export interface Student extends User {
  role: "student";
  studentId?: string;
}

export interface Admin extends User {
  role: "admin";
}

