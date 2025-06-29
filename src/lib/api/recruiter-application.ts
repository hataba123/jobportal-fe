import axiosInstance from "../axiosInstance";
import { JobApplication, UpdateApplyStatusRequest } from "@/types/JobApplication";

export const fetchCandidatesForJob = async (jobPostId: string): Promise<JobApplication[]> => {
  const res = await axiosInstance.get(`/jobapplication/job/${jobPostId}/candidates`);
  return res.data;
};

export const updateApplicationStatus = async (id: string, data: UpdateApplyStatusRequest) => {
  return await axiosInstance.put(`/jobapplication/${id}/status`, data);
}; 