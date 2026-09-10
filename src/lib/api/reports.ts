import axios from "axios";

export interface JobReportPayload {
  jobId: string;
  jobTitle: string;
  companyName?: string;
  reason: string;
  description?: string;
  reporterEmail?: string;
}

export interface JobReportItem {
  id: string;
  jobId: string;
  jobTitle: string;
  companyName: string;
  reason: string;
  description?: string;
  reporterEmail?: string;
  status: "pending" | "resolved" | "dismissed";
  createdAt: string;
  resolvedAt?: string;
}

export type JobReport = JobReportItem;

export async function submitJobReport(payload: JobReportPayload): Promise<{ success: boolean; message: string }> {
  const response = await axios.post("/api/reports", payload);
  return response.data;
}

export async function fetchJobReports(status?: string): Promise<JobReportItem[]> {
  const url = status && status !== "all" ? `/api/reports?status=${status}` : "/api/reports";
  const response = await axios.get<{ success: boolean; data: JobReportItem[] }>(url);
  return response.data?.data || [];
}

export async function updateReportStatus(
  id: string,
  status: "pending" | "resolved" | "dismissed"
): Promise<{ success: boolean; message: string }> {
  const response = await axios.patch("/api/reports", { id, status });
  return response.data;
}
