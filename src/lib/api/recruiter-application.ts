import axiosInstance from "../axiosInstance";
import { ApplicationStatus } from "@/types/ApplyStatus";
import { UpdateApplyStatusRequest } from "@/types/JobApplication";
import { itemsOf, type PageResponse } from "./contract";

export const fetchCandidatesForJob = async (jobPostId: string, page = 1, pageSize = 20) => {
  const res = await axiosInstance.get<PageResponse<Record<string, unknown>>>(`/jobapplication/job/${jobPostId}/candidates?page=${page}&pageSize=${pageSize}`);
  return itemsOf(res.data);
};

export const updateApplicationStatus = async (
  id: string,
  data: UpdateApplyStatusRequest & { toStatus?: ApplicationStatus },
) => {
  const toStatus = data.toStatus ?? data.status;
  return axiosInstance.put(`/jobapplication/${id}/status`, {
    toStatus,
    reason: data.reason,
  }, { headers: data.version ? { "If-Match": data.version } : undefined });
};
