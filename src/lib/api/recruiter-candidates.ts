import axiosInstance from "../axiosInstance";
import { ApplicationStatus } from "@/types/ApplyStatus";

// DTOs
export interface CandidateProfileBriefDto {
  id: string;
  userId: string;
  fullName: string;
  skills?: string;
  experience?: string;
  education?: string;
}

export interface CandidateProfileDetailDto {
  id: string;
  userId: string;
  fullName: string;
  resumeUrl?: string;
  experience?: string;
  skills?: string;
  education?: string;
  dob?: string;
  gender?: string;
  portfolioUrl?: string;
  linkedinUrl?: string;
  githubUrl?: string;
  certificates?: string;
  summary?: string;
  email: string;
}

export interface CandidateApplicationDto {
  id: string;
  jobId: string;
  jobPostId: string;
  jobTitle: string;
  appliedAt: string;
  cvUrl: string;
  status: ApplicationStatus;
  version?: string;
}

export interface CandidateSearchRequest {
  keyword?: string;
  skill?: string;
  education?: string;
  minYearsExperience?: number;
  experienceFrom?: number;
  experienceTo?: number;
  location?: string;
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortDir?: "asc" | "desc";
}

type PagedResponse<T> = { items?: T[]; totalCount?: number; page?: number; pageSize?: number; totalPages?: number };

// API calls
export const searchCandidates = async (params: CandidateSearchRequest) => {
  const res = await axiosInstance.get("/candidate-profile/recruiter/search", { params });
  return (res.data as PagedResponse<CandidateProfileBriefDto>).items ?? [];
};

export const getCandidateById = async (id: string) => {
  const res = await axiosInstance.get(`/candidate-profile/recruiter/${id}`);
  return res.data as CandidateProfileDetailDto;
};

export const getCandidateApplications = async (id: string, page = 1, pageSize = 20) => {
  const res = await axiosInstance.get<PagedResponse<CandidateApplicationDto>>(`/candidate-profile/recruiter/${id}/applications`, { params: { page, pageSize } });
  return res.data.items ?? [];
};

export const getCandidatesAppliedToMyJobs = async (params?: CandidateSearchRequest) => {
  const res = await axiosInstance.get<PagedResponse<CandidateProfileBriefDto>>("/candidate-profile/recruiter/applied", { params });
  return res.data.items ?? [];
}; 
