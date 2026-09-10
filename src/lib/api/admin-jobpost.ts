// 📁 src/lib/api/admin-jobpost.ts
import axiosInstance from "../axiosInstance";
import { JobPost } from "@/types/JobPost";
import { ifMatchHeaders, normalizePage, type PageResponse } from "./contract";

export type AdminJobPostPayload = {
  title: string;
  description: string;
  skillsRequired?: string;
  location?: string;
  salary: number;
  employerId: string;
  companyId?: string;
  logo?: string;
  type?: string;
  tags: string[];
  applicants: number;
  createdAt: string;
  categoryId: string;
};
export const fetchAllJobPosts = async (page = 1, pageSize = 100): Promise<JobPost[]> => {
  const res = await axiosInstance.get<PageResponse<JobPost>>("/admin/jobposts", {
    params: { page, pageSize },
  });
  return normalizePage(res.data, { page, pageSize }).items;
};

export const fetchJobPostById = async (id: string): Promise<JobPost> => {
  const res = await axiosInstance.get(`/admin/jobposts/${id}`);
  return res.data;
};

export const createJobPost = async (data: AdminJobPostPayload) => {
  return await axiosInstance.post("/admin/jobposts", data);
};

export const updateJobPost = async (
  id: string,
  data: Partial<AdminJobPostPayload>,
  version?: string,
) => {
  return await axiosInstance.put(`/admin/jobposts/${id}`, data, {
    headers: ifMatchHeaders(version),
  });
};

export const deleteJobPost = async (id: string, version?: string) => {
  return await axiosInstance.delete(`/admin/jobposts/${id}`, {
    headers: ifMatchHeaders(version),
  });
};
