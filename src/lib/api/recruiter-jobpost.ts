import axiosInstance from "../axiosInstance";
import { JobPost } from "@/types/JobPost";
import { ifMatchHeaders } from "./contract";

export const fetchMyJobPosts = async (): Promise<JobPost[]> => {
  const res = await axiosInstance.get("/jobpost/my-posts");
  return res.data;
};

export const createJobPost = async (data: Partial<JobPost>) => {
  return await axiosInstance.post("/jobpost", data);
};

export const updateJobPost = async (id: string, data: Partial<JobPost>, version?: string) => {
  return await axiosInstance.put(`/jobpost/${id}`, data, {
    headers: ifMatchHeaders(version),
  });
};

export const deleteJobPost = async (id: string, version?: string) => {
  return await axiosInstance.delete(`/jobpost/${id}`, {
    headers: ifMatchHeaders(version),
  });
};
