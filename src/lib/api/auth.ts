// 📁 src/lib/api/auth.ts
import axios from "../axios"; // ✅ đây là instance bạn tạo sẵn
import type { LoginCredentials } from "@/types/auth";
import type { User } from "@/types/user";
import type { AuthResponse } from "@/types/auth";

/**
 * Gửi request đăng nhập đến backend.
 * @param credentials - thông tin đăng nhập gồm email và password.
 * @returns Thông tin người dùng sau khi đăng nhập thành công.
 */
export async function loginUser(
  credentials: LoginCredentials
): Promise<AuthResponse> {
  const res = await axios.post("/auth/login", credentials);
  return res.data; // { user, accessToken }
}

/**
 * Gửi request đăng xuất tới backend.
 * Backend sẽ xóa JWT hoặc phiên trên server.
 */
export async function logoutUser() {
  await axios.post("/auth/logout");
}

/**
 * Lấy thông tin người dùng hiện tại nếu đang đăng nhập.
 * @param token - JWT token lưu trong localStorage
 * @returns Thông tin người dùng nếu token hợp lệ.
 */
export async function getUser(token: string): Promise<User> {
  const res = await axios.get("/auth/me", {
    headers: {
      Authorization: `Bearer ${token}`, // Gắn token vào header
    },
  });
  return res.data;
}
