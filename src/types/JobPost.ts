import { User } from "@/types/User";
// types/job-post.ts
export interface JobPost {
  id: string;
  title: string;
  description: string;
  skillsRequired?: string;
  location?: string;
  salary: number;
  candidateId: string;
  companyId?: string; // Thêm nếu API trả về companyId
  employer?: User;
  logo?: string; // Thêm nếu API trả về logo riêng
  type?: string; // Full-time, Part-time...
  tags?: string[]; // Danh sách tag
  applicants?: number; // Số ứng viên
  createdAt: string;
  categoryName: string;
  categoryId?: string; // Thêm categoryId
  companyName?: string; // Thêm companyName
}
