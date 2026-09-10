import axiosInstance from "../axiosInstance";
import { ApplicationStatus } from "@/types/ApplyStatus";
import { itemsOf, type PageResponse } from "./contract";

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

// API calls
export const searchCandidates = async (params: CandidateSearchRequest) => {
  const res = await axiosInstance.get<PageResponse<CandidateProfileBriefDto>>("/candidate-profile/recruiter/search", { params });
  return itemsOf(res.data);
};

export const getCandidateById = async (id: string) => {
  const res = await axiosInstance.get(`/candidate-profile/recruiter/${id}`);
  return res.data as CandidateProfileDetailDto;
};

export const getCandidateApplications = async (id: string, page = 1, pageSize = 20) => {
  const res = await axiosInstance.get<PageResponse<CandidateApplicationDto>>(`/candidate-profile/recruiter/${id}/applications`, { params: { page, pageSize } });
  return itemsOf(res.data);
};

export const getCandidatesAppliedToMyJobs = async (params?: CandidateSearchRequest) => {
  const res = await axiosInstance.get<PageResponse<CandidateProfileBriefDto>>("/candidate-profile/recruiter/applied", { params });
  return itemsOf(res.data);
}; 
