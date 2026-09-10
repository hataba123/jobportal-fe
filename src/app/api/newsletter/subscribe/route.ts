import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const SUBSCRIBERS_FILE = path.join(process.cwd(), "data", "newsletter-subscribers.json");

function ensureDirectoryExists(filePath: string) {
  const dirname = path.dirname(filePath);
  if (!fs.existsSync(dirname)) {
    fs.mkdirSync(dirname, { recursive: true });
  }
}

function getSubscribers(): string[] {
  try {
    if (fs.existsSync(SUBSCRIBERS_FILE)) {
      const data = fs.readFileSync(SUBSCRIBERS_FILE, "utf-8");
      return JSON.parse(data);
    }
  } catch {
    // ignore
  }
  return [];
}

function saveSubscribers(subscribers: string[]) {
  try {
    ensureDirectoryExists(SUBSCRIBERS_FILE);
    fs.writeFileSync(SUBSCRIBERS_FILE, JSON.stringify(subscribers, null, 2), "utf-8");
  } catch (error) {
    console.error("Failed to save newsletter subscriber:", error);
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, message: "Địa chỉ email không hợp lệ." },
        { status: 400 }
      );
    }

    const currentList = getSubscribers();
    if (currentList.includes(email)) {
      return NextResponse.json(
        { success: true, message: "Email này đã được đăng ký nhận bản tin từ trước." },
        { status: 200 }
      );
    }

    currentList.push(email);
    saveSubscribers(currentList);

    return NextResponse.json(
      {
        success: true,
        message: "Cảm ơn bạn đã đăng ký nhận bản tin việc làm mới nhất!",
      },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      { success: false, message: "Không thể đăng ký lúc này. Vui lòng thử lại sau." },
      { status: 500 }
    );
  }
}
