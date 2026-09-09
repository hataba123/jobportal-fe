import axiosInstance from "../axiosInstance";
import { JobPost } from "@/types/JobPost";

export interface PagedJobPosts {
  items: JobPost[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export const fetchJobPostById = async (id: string): Promise<JobPost> => {
  const res = await axiosInstance.get(`/jobpost/${id}`);
  return res.data;
};

export const fetchPagedJobPosts = async (
  page = 1,
  pageSize = 20,
): Promise<PagedJobPosts> => {
  const res = await axiosInstance.get("/jobpost", {
    params: { page, pageSize },
  });
  if (Array.isArray(res.data)) {
    return {
      items: res.data,
      total: res.data.length,
      page,
      pageSize,
      totalPages: res.data.length ? 1 : 0,
    };
  }
  return res.data;
};

export const fetchAllJobPosts = async (): Promise<JobPost[]> => {
  const result = await fetchPagedJobPosts(1, 100);
  return result.items;
}; 
