import { User } from "@/types/User";

export interface CandidateProfiles extends User {
  resumeUrl?: string; // Đường dẫn CV
  experience?: string; // Kinh nghiệm làm việc (mô tả ngắn)
  skills?: string[]; // Danh sách kỹ năng
  education?: string; // Trình độ học vấn
  dob?: string; // Ngày sinh (ISO string)
  gender?: string; // Giới tính
  portfolioUrl?: string; // Link portfolio cá nhân
  linkedinUrl?: string; // Link LinkedIn
  githubUrl?: string; // Link GitHub
  appliedJobs?: string[]; // Danh sách job đã ứng tuyển (id)
  certificates?: string[]; // Danh sách chứng chỉ
  summary?: string; // Tóm tắt bản thân
}
