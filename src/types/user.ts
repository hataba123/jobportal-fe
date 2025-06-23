// Enum nhận từ backend (số)
export enum RoleEnum {
  ADMIN = 0,
  RECRUITER = 1,
  CANDIDATE = 2,
}

// Kiểu dùng trong frontend (string)
export type Role = "ADMIN" | "RECRUITER" | "CANDIDATE";

export interface User {
  id: string;
  email: string;
  fullName: string;
  role: RoleEnum; // từ backend là số
}
