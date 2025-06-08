// types/user.ts

export type UserRole = "Admin" | "Recruiter" | "Candidate";

export interface User {
  id: string; // Guid
  email: string;
  //   passwordHash: string; // ⚠️ thường không nên truyền về frontend, trừ khi bạn chỉ dùng nội bộ
  fullName: string;
  role: UserRole;
}
