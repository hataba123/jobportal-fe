import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import crypto from "crypto";

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

const INTERVIEWS_FILE = path.join(process.cwd(), "data", "interviews.json");

function ensureDirectoryExists(filePath: string) {
  const dirname = path.dirname(filePath);
  if (!fs.existsSync(dirname)) {
    fs.mkdirSync(dirname, { recursive: true });
  }
}

function getInterviews(): InterviewItem[] {
  try {
    if (fs.existsSync(INTERVIEWS_FILE)) {
      const data = fs.readFileSync(INTERVIEWS_FILE, "utf-8");
      return JSON.parse(data);
    }
  } catch {
    // fallback
  }
  return [];
}

function saveInterviews(interviews: InterviewItem[]) {
  try {
    ensureDirectoryExists(INTERVIEWS_FILE);
    fs.writeFileSync(INTERVIEWS_FILE, JSON.stringify(interviews, null, 2), "utf-8");
  } catch (error) {
    console.error("Failed to save interviews:", error);
  }
}

// GET: Lấy danh sách lịch phỏng vấn (hỗ trợ lọc theo candidateId, recruiterId, applicationId)
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const candidateId = searchParams.get("candidateId");
    const recruiterId = searchParams.get("recruiterId");
    const applicationId = searchParams.get("applicationId");
    const status = searchParams.get("status");

    let list = getInterviews();

    if (candidateId) {
      list = list.filter((i) => String(i.candidateId) === String(candidateId));
    }
    if (recruiterId) {
      list = list.filter((i) => String(i.recruiterId) === String(recruiterId));
    }
    if (applicationId) {
      list = list.filter((i) => String(i.applicationId) === String(applicationId));
    }
    if (status) {
      list = list.filter((i) => i.status === status);
    }

    return NextResponse.json({ success: true, data: list });
  } catch (error: unknown) {
    return NextResponse.json(
      { success: false, message: "Lỗi khi tải lịch phỏng vấn." },
      { status: 500 }
    );
  }
}

// POST: Tạo lịch phỏng vấn mới
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      applicationId,
      jobPostId,
      jobTitle,
      companyName,
      candidateId,
      candidateName,
      recruiterId,
      scheduledAt,
      format,
      meetingUrl,
      notes,
    } = body;

    if (!jobTitle || !scheduledAt || !meetingUrl) {
      return NextResponse.json(
        { success: false, message: "Vui lòng cung cấp đầy đủ thông tin: Vị trí, thời gian và địa điểm/đường dẫn phỏng vấn." },
        { status: 400 }
      );
    }

    const currentList = getInterviews();
    const newInterview: InterviewItem = {
      id: crypto.randomUUID(),
      applicationId: String(applicationId || crypto.randomUUID()),
      jobPostId: jobPostId ? String(jobPostId) : undefined,
      jobTitle: String(jobTitle),
      companyName: String(companyName || "Nhà tuyển dụng"),
      candidateId: String(candidateId || ""),
      candidateName: String(candidateName || "Ứng viên"),
      recruiterId: recruiterId ? String(recruiterId) : undefined,
      scheduledAt: String(scheduledAt),
      format: format === "offline" ? "offline" : "online",
      meetingUrl: String(meetingUrl),
      notes: notes ? String(notes) : "",
      status: "scheduled",
      createdAt: new Date().toISOString(),
    };

    currentList.unshift(newInterview);
    saveInterviews(currentList);

    return NextResponse.json({
      success: true,
      message: "Lên lịch phỏng vấn thành công! Thông báo đã được gửi đến ứng viên.",
      data: newInterview,
    });
  } catch (error: unknown) {
    return NextResponse.json(
      { success: false, message: "Không thể tạo lịch phỏng vấn." },
      { status: 500 }
    );
  }
}

// PATCH: Cập nhật trạng thái (hoàn thành, hủy hoặc dời lịch)
export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, status, scheduledAt, meetingUrl, notes } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Mã lịch phỏng vấn không hợp lệ." },
        { status: 400 }
      );
    }

    const currentList = getInterviews();
    const index = currentList.findIndex((i) => i.id === id);
    if (index === -1) {
      return NextResponse.json(
        { success: false, message: "Không tìm thấy lịch phỏng vấn này." },
        { status: 404 }
      );
    }

    if (status && ["scheduled", "completed", "cancelled"].includes(status)) {
      currentList[index].status = status;
    }
    if (scheduledAt) {
      currentList[index].scheduledAt = scheduledAt;
    }
    if (meetingUrl) {
      currentList[index].meetingUrl = meetingUrl;
    }
    if (typeof notes === "string") {
      currentList[index].notes = notes;
    }
    currentList[index].updatedAt = new Date().toISOString();

    saveInterviews(currentList);

    return NextResponse.json({
      success: true,
      message: "Đã cập nhật lịch phỏng vấn.",
      data: currentList[index],
    });
  } catch (error: unknown) {
    return NextResponse.json(
      { success: false, message: "Không thể cập nhật lịch phỏng vấn." },
      { status: 500 }
    );
  }
}