import { User } from "./user";

// types/job-post.ts
export interface JobPost {
  id: string; // Guid
  title: string;
  description: string;
  skillsRequired?: string; // optional vì không có [Required] trong C#
  location?: string; // optional
  salary: number;
  employerId: string;
  employer?: User; // nếu API có trả về thông tin employer
  createdAt: string; // ISO string khi nhận từ API (có thể dùng Date nếu muốn convert)
}
