// 📁 src/lib/api/auth.ts
import axios from "../axios"; // Sử dụng instance Axios đã cấu hình sẵn với baseURL và withCredentials
import type { LoginCredentials } from "@/types/auth";
import type { User } from "@/types/user";

/**
 * Gửi request đăng nhập đến backend.
 * @param credentials - thông tin đăng nhập gồm email và password. // parameters tag tham số credentials // comment
 * @returns Thông tin người dùng sau khi đăng nhập thành công.
 */
export async function loginUser(credentials: LoginCredentials): Promise<User> {
  const res = await axios.post("api/auth/login", credentials);
  return res.data;
}

/**
 * Gửi request đăng xuất tới backend.
 * Backend sẽ xóa JWT trong HttpOnly cookie.
 */
export async function logoutUser() {
  await axios.post("api/auth/logout"); // Gửi POST request tới /auth/logout
  // Không cần trả dữ liệu vì backend chỉ cần xoá session/cookie
}

/**
 * Lấy thông tin người dùng hiện tại nếu đang đăng nhập (dựa vào cookie).
 * Backend sẽ xác thực JWT từ HttpOnly cookie.
 * @returns Thông tin người dùng (hoặc lỗi nếu chưa đăng nhập).
 */
export async function getUser() {
  const res = await axios.get("api/auth/me"); // Gửi GET request tới /auth/me
  return res.data; // Trả về object user nếu đang đăng nhập
}
