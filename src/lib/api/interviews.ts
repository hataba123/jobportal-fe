import axios from "axios";

export interface InterviewItem {
  id: string;
  applicationId: string;
  jobPostId?: string;
  jobTitle: string;
  companyName: string;
  candidateId: string;
  candidateName: string;
  recruiterId?: string;
  scheduledAt: string;
  format: "online" | "offline";
  meetingUrl: string;
  notes?: string;
  status: "scheduled" | "completed" | "cancelled";
  createdAt: string;
  updatedAt?: string;
}

export interface CreateInterviewPayload {
  applicationId: string;
  jobPostId?: string;
  jobTitle: string;
  companyName?: string;
  candidateId: string;
  candidateName: string;
  recruiterId?: string;
  scheduledAt: string;
  format: "online" | "offline";
  meetingUrl: string;
  notes?: string;
}

export async function createInterview(payload: CreateInterviewPayload): Promise<{ success: boolean; message: string; data?: InterviewItem }> {
  const res = await axios.post("/api/interviews", payload);
  return res.data;
}

export async function fetchInterviews(params?: {
  candidateId?: string;
  recruiterId?: string;
  applicationId?: string;
  status?: string;
}): Promise<InterviewItem[]> {
  const query = new URLSearchParams();
  if (params?.candidateId) query.set("candidateId", params.candidateId);
  if (params?.recruiterId) query.set("recruiterId", params.recruiterId);
  if (params?.applicationId) query.set("applicationId", params.applicationId);
  if (params?.status) query.set("status", params.status);

  const url = query.toString() ? `/api/interviews?${query.toString()}` : "/api/interviews";
  const res = await axios.get<{ success: boolean; data: InterviewItem[] }>(url);
  return res.data?.data || [];
}

export async function updateInterviewStatus(
  id: string,
  status: "scheduled" | "completed" | "cancelled"
): Promise<{ success: boolean; message: string; data?: InterviewItem }> {
  const res = await axios.patch("/api/interviews", { id, status });
  return res.data;
}