import axiosInstance from "../axiosInstance";

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
  status: string;
}

export interface CandidateSearchRequest {
  keyword?: string;
  skill?: string;
  education?: string;
  minYearsExperience?: number;
}

// API calls
export const searchCandidates = async (params: CandidateSearchRequest) => {
  const res = await axiosInstance.get("/candidate-profile/recruiter/search", { params });
  return res.data as CandidateProfileBriefDto[];
};

export const getCandidateById = async (id: string) => {
  const res = await axiosInstance.get(`/candidate-profile/recruiter/${id}`);
  return res.data as CandidateProfileDetailDto;
};

export const getCandidateApplications = async (id: string) => {
  const res = await axiosInstance.get(`/candidate-profile/recruiter/${id}/applications`);
  return res.data as CandidateApplicationDto[];
};

export const getCandidatesAppliedToMyJobs = async () => {
  const res = await axiosInstance.get("/candidate-profile/recruiter/applied");
  return res.data as CandidateProfileBriefDto[];
}; 