import { User } from "@/types/user";
// types/job-post.ts
export interface JobPost {
  id: string;
  title: string;
  description: string;
  skillsRequired?: string;
  location?: string;
  salary: number;
  candidateId?: string;
  employerId?: string;
  companyId?: string; // Thêm nếu API trả về companyId
  employer?: User;
  logo?: string; // Thêm nếu API trả về logo riêng
  type?: string; // Full-time, Part-time...
  tags?: string[]; // Danh sách tag
  applicants?: number; // Số ứng viên
  createdAt: string;
  categoryName?: string;
  categoryId?: string; // Thêm categoryId
  companyName?: string; // Thêm companyName
  status?: "Draft" | "PendingApproval" | "Active" | "Closed" | "Expired" | "Rejected";
  expiresAt?: string;
  minExperienceYears?: number;
  educationRequirement?: string;
}
