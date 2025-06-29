// 📁 src/lib/api/admin-jobpost.ts
import axiosInstance from "../axiosInstance";
import { JobPost } from "@/types/JobPost";
export const fetchAllJobPosts = async (): Promise<JobPost[]> => {
  const res = await axiosInstance.get("/admin/jobposts");
  return res.data;
};

export const fetchJobPostById = async (id: string): Promise<JobPost> => {
  const res = await axiosInstance.get(`/admin/jobposts/${id}`);
  return res.data;
};

export const createJobPost = async (data: Partial<JobPost>) => {
  return await axiosInstance.post("/admin/jobposts", data);
};

export const updateJobPost = async (id: string, data: Partial<JobPost>) => {
  return await axiosInstance.put(`/admin/jobposts/${id}`, data);
};

export const deleteJobPost = async (id: string) => {
  return await axiosInstance.delete(`/admin/jobposts/${id}`);
};
