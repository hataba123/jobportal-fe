import axiosInstance from "../axiosInstance";
import { JobApplication, UpdateApplyStatusRequest } from "@/types/JobApplication";
import { itemsOf, type PageResponse } from "./contract";

export const fetchAllJobApplications = async (page = 1, pageSize = 20): Promise<JobApplication[]> => {
  const res = await axiosInstance.get<PageResponse<JobApplication>>(`/jobapplication?page=${page}&pageSize=${pageSize}`);
  return itemsOf(res.data);
};

export const fetchJobApplicationById = async (id: string): Promise<JobApplication> => {
  const res = await axiosInstance.get(`/jobapplication/${id}`);
  return res.data;
};

export const updateJobApplicationStatus = async (
  id: string,
  data: UpdateApplyStatusRequest,
) => {
  const toStatus = data.toStatus ?? data.status;
  return axiosInstance.put(`/admin/jobapplications/${id}/status`, {
    toStatus,
    reason: data.reason,
  }, { headers: data.version ? { "If-Match": data.version } : undefined });
};

export const deleteJobApplication = async (id: string) => axiosInstance.delete(`/jobapplication/${id}`);
