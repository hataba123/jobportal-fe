import axiosInstance from "../axiosInstance";
import { MatchResult, PagedMatches } from "@/types/Matching";

export interface MatchQuery {
  page?: number;
  pageSize?: number;
  minScore?: number;
}

export const fetchRecommendedJobs = async (
  query: MatchQuery = {}
): Promise<PagedMatches> => {
  const response = await axiosInstance.get<PagedMatches>("/matches/jobs", {
    params: query,
  });
  return response.data;
};

export const rankCandidatesForJob = async (
  jobPostId: string,
  query: MatchQuery = {}
): Promise<PagedMatches> => {
  const response = await axiosInstance.get<PagedMatches>(
    `/matches/job-posts/${jobPostId}/candidates`,
    { params: query }
  );
  return response.data;
};

export const fetchCandidateMatch = async (
  jobPostId: string,
  candidateId: string
): Promise<MatchResult> => {
  const response = await axiosInstance.get<MatchResult>(
    `/matches/job-posts/${jobPostId}/candidates/${candidateId}`
  );
  return response.data;
};
