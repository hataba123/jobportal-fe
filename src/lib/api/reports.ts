import axiosInstance from "@/lib/axiosInstance";

export type JobReportStatus = "Pending" | "Resolved" | "Dismissed";

export interface JobReportPayload {
  jobPostId: string;
  reason: string;
  description?: string;
}

export interface JobReportItem {
  id: string;
  jobPostId: string;
  jobTitle: string;
  companyName: string;
  reason: string;
  description?: string;
  reporterId?: string;
  reporterEmail?: string;
  status: JobReportStatus;
  createdAt: string;
  resolvedAt?: string;
  version: string;
}

export type JobReport = JobReportItem;

export async function submitJobReport(payload: JobReportPayload): Promise<{ success: boolean; message: string; data?: JobReportItem }> {
  const response = await axiosInstance.post<JobReportItem>("/reports", payload);
  return { success: true, message: "Báo cáo đã được ghi nhận.", data: response.data };
}

export async function fetchJobReports(status?: JobReportStatus, page = 1, pageSize = 20): Promise<JobReportItem[]> {
  const query = new URLSearchParams({ page: String(page), pageSize: String(pageSize) });
  if (status) query.set("status", status);
  const response = await axiosInstance.get<{ items?: JobReportItem[] }>(`/reports?${query.toString()}`);
  return response.data?.items ?? [];
}

export async function updateReportStatus(
  id: string,
  status: JobReportStatus,
  version?: string,
): Promise<{ success: boolean; message: string; data?: JobReportItem }> {
  const response = await axiosInstance.patch<JobReportItem>(`/reports/${encodeURIComponent(id)}`, { status }, {
    headers: version ? { "If-Match": version } : undefined,
  });
  return { success: true, message: "Đã cập nhật trạng thái báo cáo.", data: response.data };
}
