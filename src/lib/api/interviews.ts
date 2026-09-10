import axiosInstance from "@/lib/axiosInstance";

export type InterviewType = "Online" | "Onsite" | "Phone";
export type InterviewStatus = "Scheduled" | "Completed" | "Cancelled";
export type InterviewResult = "Pending" | "Passed" | "Failed";

export interface InterviewItem {
  id: string;
  applicationId: string;
  jobPostId?: string;
  jobTitle: string;
  companyName?: string;
  candidateId: string;
  candidateName: string;
  interviewerId?: string;
  startAt: string;
  endAt: string;
  scheduledAt: string;
  type: InterviewType;
  format: "online" | "offline";
  meetingUrl?: string;
  location?: string;
  notes?: string;
  status: InterviewStatus;
  result: InterviewResult;
  createdAt: string;
  updatedAt?: string;
  version: string;
  applicationVersion?: string;
}

export interface CreateInterviewPayload {
  applicationId: string;
  scheduledAt: string;
  endAt?: string;
  format: "online" | "offline";
  meetingUrl?: string;
  location?: string;
  notes?: string;
  version?: string;
}

interface PagedResponse<T> {
  items?: T[];
  data?: T[];
}

type InterviewWire = Record<string, unknown>;

function mapInterview(item: InterviewWire): InterviewItem {
  const type: InterviewType = (item.type as InterviewType | undefined) ?? (item.format === "offline" ? "Onsite" : "Online");
  const status: InterviewStatus = (item.status as InterviewStatus | undefined) ?? "Scheduled";
  const startAt = String(item.startAt ?? item.scheduledAt ?? "");
  return {
    id: String(item.id ?? ""),
    applicationId: String(item.applicationId ?? ""),
    jobPostId: item.jobPostId ? String(item.jobPostId) : undefined,
    jobTitle: String(item.jobTitle ?? ""),
    companyName: item.companyName ? String(item.companyName) : undefined,
    candidateId: String(item.candidateId ?? ""),
    candidateName: String(item.candidateName ?? ""),
    interviewerId: item.interviewerId ? String(item.interviewerId) : undefined,
    startAt,
    endAt: String(item.endAt ?? startAt),
    scheduledAt: startAt,
    type,
    format: type === "Online" ? "online" : "offline",
    meetingUrl: item.meetingUrl ? String(item.meetingUrl) : undefined,
    location: item.location ? String(item.location) : undefined,
    notes: item.notes ? String(item.notes) : undefined,
    status,
    result: (item.result as InterviewResult | undefined) ?? "Pending",
    createdAt: String(item.createdAt ?? ""),
    updatedAt: item.updatedAt ? String(item.updatedAt) : undefined,
    version: String(item.version ?? ""),
    applicationVersion: item.applicationVersion ? String(item.applicationVersion) : undefined,
  };
}

export async function createInterview(
  payload: CreateInterviewPayload,
): Promise<{ success: boolean; message: string; data?: InterviewItem }> {
  const start = new Date(payload.scheduledAt);
  const end = payload.endAt ? new Date(payload.endAt) : new Date(start.getTime() + 60 * 60 * 1000);
  const res = await axiosInstance.post(
    `/jobapplication/${encodeURIComponent(payload.applicationId)}/interviews`,
    {
      type: payload.format === "online" ? "Online" : "Onsite",
      startAt: start.toISOString(),
      endAt: end.toISOString(),
      meetingUrl: payload.meetingUrl,
      location: payload.location ?? (payload.format === "offline" ? payload.meetingUrl : undefined),
      notes: payload.notes,
    },
    { headers: payload.version ? { "If-Match": payload.version } : undefined },
  );
  return { success: true, message: "Lên lịch phỏng vấn thành công.", data: mapInterview(res.data) };
}

export async function fetchInterviews(params?: {
  applicationId?: string;
  status?: InterviewStatus;
  page?: number;
  pageSize?: number;
}): Promise<InterviewItem[]> {
  const query = new URLSearchParams({
    page: String(params?.page ?? 1),
    pageSize: String(params?.pageSize ?? 100),
  });
  if (params?.applicationId) query.set("applicationId", params.applicationId);
  if (params?.status) query.set("status", params.status);
  const res = await axiosInstance.get<PagedResponse<InterviewWire>>(`/interviews?${query.toString()}`);
  const values = res.data?.items ?? res.data?.data ?? [];
  return values.map(mapInterview);
}

export async function updateInterviewStatus(
  id: string,
  status: "Scheduled" | "Completed" | "Cancelled",
  version?: string,
  result: InterviewResult = "Passed",
  applicationVersion?: string,
): Promise<{ success: boolean; message: string; data?: InterviewItem }> {
  if (status === "Scheduled") return { success: true, message: "Không có thay đổi.", data: undefined };
  const path = status === "Cancelled" ? `/interviews/${encodeURIComponent(id)}/cancel` : `/interviews/${encodeURIComponent(id)}/complete`;
  const res = await axiosInstance.post(path, status === "Cancelled" ? {} : { result, applicationVersion }, {
    headers: version ? { "If-Match": version } : undefined,
  });
  return { success: true, message: "Đã cập nhật lịch phỏng vấn.", data: mapInterview(res.data) };
}
