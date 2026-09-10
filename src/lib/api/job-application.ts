import axiosInstance from "../axiosInstance";
import { ApplicationStatus } from "@/types/ApplyStatus";

type PageResponse<T> = { items?: T[]; data?: T[] };
export interface JobCandidateApplication {
  id: string;
  fullName?: string;
  candidateName?: string;
  email: string;
  appliedAt: string;
  cvUrl?: string;
  status: ApplicationStatus;
  version?: string;
}
const itemsOf = <T,>(value: PageResponse<T> | T[] | undefined): T[] =>
  Array.isArray(value) ? value : value?.items ?? value?.data ?? [];

export const fetchMyAppliedJobs = async (page = 1, pageSize = 20) => {
  const res = await axiosInstance.get<PageResponse<Record<string, unknown>>>(`/jobapplication/my-jobs?page=${page}&pageSize=${pageSize}`);
  return itemsOf(res.data);
};

export const deleteJobApplication = async (id: string, version?: string, reason = "Ứng viên rút hồ sơ") =>
  axiosInstance.post(`/jobapplication/${id}/withdraw`, { reason }, {
    headers: version ? { "If-Match": version } : undefined,
  });

export const fetchJobApplicationDetail = async (id: string) => {
  const res = await axiosInstance.get(`/jobapplication/${id}`);
  return res.data;
};

export const applyJob = async (jobPostId: string) =>
  axiosInstance.post("/jobapplication", { jobPostId });

export const fetchCandidatesForJob = async (jobPostId: string, page = 1, pageSize = 20) => {
  const res = await axiosInstance.get<PageResponse<JobCandidateApplication>>(`/jobapplication/job/${jobPostId}/candidates?page=${page}&pageSize=${pageSize}`);
  return itemsOf(res.data);
};

const legacyStatusMap: Record<string, ApplicationStatus> = {
  Pending: "Applied",
  Reviewed: "Screening",
  Accepted: "Offer",
  Rejected: "Rejected",
};

export const updateJobApplicationStatus = async (
  applicationId: string,
  status: ApplicationStatus | keyof typeof legacyStatusMap,
  version?: string,
  reason?: string,
) => {
  const toStatus = legacyStatusMap[status] ?? status;
  return axiosInstance.put(`/jobapplication/${applicationId}/status`, {
    toStatus,
    reason,
  }, { headers: version ? { "If-Match": version } : undefined });
};
