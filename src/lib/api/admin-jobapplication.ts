import axiosInstance from "../axiosInstance";
import { JobApplication, UpdateApplyStatusRequest } from "@/types/JobApplication";

export const fetchAllJobApplications = async (): Promise<JobApplication[]> => {
  const res = await axiosInstance.get("/jobapplication");
  return res.data;
};

export const fetchJobApplicationById = async (id: string): Promise<JobApplication> => {
  const res = await axiosInstance.get(`/jobapplication/${id}`);
  return res.data;
};

export const updateJobApplicationStatus = async (id: string, data: UpdateApplyStatusRequest) => {
  return await axiosInstance.put(`/jobapplication/${id}/status`, data);
};

export const deleteJobApplication = async (id: string) => {
  return await axiosInstance.delete(`/jobapplication/${id}`);
}; 