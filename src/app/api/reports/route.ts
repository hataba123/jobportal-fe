import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import crypto from "crypto";

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

const REPORTS_FILE = path.join(process.cwd(), "data", "job-reports.json");

function ensureDirectoryExists(filePath: string) {
  const dirname = path.dirname(filePath);
  if (!fs.existsSync(dirname)) {
    fs.mkdirSync(dirname, { recursive: true });
  }
}

function getReports(): JobReportItem[] {
  try {
    if (fs.existsSync(REPORTS_FILE)) {
      const data = fs.readFileSync(REPORTS_FILE, "utf-8");
      return JSON.parse(data);
    }
  } catch {
    // fallback
  }
  return [];
}

function saveReports(reports: JobReportItem[]) {
  try {
    ensureDirectoryExists(REPORTS_FILE);
    fs.writeFileSync(REPORTS_FILE, JSON.stringify(reports, null, 2), "utf-8");
  } catch (error) {
    console.error("Failed to save job reports:", error);
  }
}

// GET: Lấy danh sách báo cáo
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");

    const allReports = getReports();
    const filtered = status
      ? allReports.filter((r) => r.status.toLowerCase() === status.toLowerCase())
      : allReports;

    return NextResponse.json({ success: true, data: filtered });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Lỗi tải báo cáo vi phạm." },
      { status: 500 }
    );
  }
}

// POST: Gửi báo cáo tin vi phạm mới
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { jobId, jobTitle, companyName, reason, description, reporterEmail } = body;

    if (!jobId || !jobTitle || !reason) {
      return NextResponse.json(
        { success: false, message: "Thiếu thông tin bắt buộc để gửi báo cáo." },
        { status: 400 }
      );
    }

    const currentReports = getReports();
    const newReport: JobReportItem = {
      id: crypto.randomUUID(),
      jobId: String(jobId),
      jobTitle: String(jobTitle),
      companyName: String(companyName || "Chưa rõ công ty"),
      reason: String(reason),
      description: description ? String(description) : "",
      reporterEmail: reporterEmail ? String(reporterEmail) : "",
      status: "pending",
      createdAt: new Date().toISOString(),
    };

    currentReports.unshift(newReport);
    saveReports(currentReports);

    return NextResponse.json({
      success: true,
      message: "Báo cáo tin tuyển dụng vi phạm đã được ghi nhận. Ban quản trị sẽ xác minh.",
      data: newReport,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Không thể gửi báo cáo vi phạm lúc này." },
      { status: 500 }
    );
  }
}

// PATCH: Cập nhật trạng thái báo cáo (resolved / dismissed)
export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, status } = body;

    if (!id || !["pending", "resolved", "dismissed"].includes(status)) {
      return NextResponse.json(
        { success: false, message: "Thông tin cập nhật không hợp lệ." },
        { status: 400 }
      );
    }

    const currentReports = getReports();
    const index = currentReports.findIndex((r) => r.id === id);
    if (index === -1) {
      return NextResponse.json(
        { success: false, message: "Không tìm thấy báo cáo vi phạm." },
        { status: 400 }
      );
    }

    currentReports[index].status = status;
    if (status === "resolved") {
      currentReports[index].resolvedAt = new Date().toISOString();
    }
    saveReports(currentReports);

    return NextResponse.json({
      success: true,
      message: `Đã cập nhật trạng thái báo cáo thành "${status}".`,
      data: currentReports[index],
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Không thể cập nhật báo cáo vi phạm." },
      { status: 500 }
    );
  }
}
