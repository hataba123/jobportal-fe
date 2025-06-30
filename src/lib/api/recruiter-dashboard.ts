import axiosInstance from "../axiosInstance";

export interface RecruiterDashboardDto {
  totalJobPosts: number;
  totalApplicants: number;
  recentJobPosts: JobPostSummaryDto[];
  recentApplicants: CandidateApplyDto[];
}

export interface JobPostSummaryDto {
  id: string;
  title: string;
  createdAt: string;
  applicants: number;
}

export interface CandidateApplyDto {
  candidateId: string;
  fullName: string;
  email: string;
  jobTitle: string;
  appliedAt: string;
}

export interface CompanyDto {
  id: string;
  name: string;
  logo: string;
  description: string;
  location: string;
  employees: number;
  industry: string;
  openJobs: number;
  rating: number;
  website: string;
  founded: number;
  tags: string[];
}

// Lấy dashboard data cho recruiter
export const fetchRecruiterDashboard = async (recruiterId: string): Promise<RecruiterDashboardDto> => {
  const res = await axiosInstance.get(`/recruiter/dashboard/${recruiterId}`);
  return res.data;
};

// Lấy thông tin công ty của recruiter
export const fetchMyCompany = async (): Promise<CompanyDto> => {
  const res = await axiosInstance.get("/recruiter/company");
  return res.data;
};

// Cập nhật thông tin công ty
export const updateMyCompany = async (data: Partial<CompanyDto>): Promise<void> => {
  await axiosInstance.put("/recruiter/company", data);
};

// Xóa công ty
export const deleteMyCompany = async (): Promise<void> => {
  await axiosInstance.delete("/recruiter/company");
}; 