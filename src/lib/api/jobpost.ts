import axiosInstance from "../axiosInstance";
import { JobPost } from "@/types/JobPost";

export const fetchJobPostById = async (id: string): Promise<JobPost> => {
  const res = await axiosInstance.get(`/jobpost/${id}`);
  return res.data;
};

export const fetchAllJobPosts = async (): Promise<JobPost[]> => {
  const res = await axiosInstance.get("/jobpost");
  return res.data;
}; 