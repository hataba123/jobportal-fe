import axiosInstance from "../axiosInstance";
import { JobPost } from "@/types/JobPost";
import { normalizePage, type PageResponse } from "./contract";

export interface PagedJobPosts {
  items: JobPost[];
  totalItems: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export type JobPostPageQuery = {
  page?: number;
  pageSize?: number;
  search?: string;
  location?: string;
  type?: string;
  categoryId?: string;
  minSalary?: number;
};

export const fetchJobPostById = async (id: string): Promise<JobPost> => {
  const res = await axiosInstance.get(`/jobpost/${id}`);
  return res.data;
};

export const fetchPagedJobPosts = async ({
  page = 1,
  pageSize = 20,
  search,
  location,
  type,
  categoryId,
  minSalary,
}: JobPostPageQuery = {},
): Promise<PagedJobPosts> => {
  const res = await axiosInstance.get<PageResponse<JobPost>>("/jobpost", {
    params: { page, pageSize, search, location, type, categoryId, minSalary },
  });
  return normalizePage(res.data, { page, pageSize });
};

export const fetchAllJobPosts = async (): Promise<JobPost[]> => {
  const result = await fetchPagedJobPosts({ page: 1, pageSize: 100 });
  return result.items;
};
