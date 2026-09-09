import type { LoginCredentials } from "@/types/auth";
import type { User } from "@/types/user";
import type { AuthResponse } from "@/types/auth";
import { RegisterRequest } from "@/types/RegisterRequest"; // Nếu đã định nghĩa kiểu dữ liệu
import axiosInstance from "@/lib/axiosInstance"; // dùng alias @ là chuẩn
/**
 * Gửi request đăng nhập đến backend.
 * @param credentials - thông tin đăng nhập gồm email và password.
 * @returns Thông tin người dùng sau khi đăng nhập thành công.
 */
export async function loginUser(
  credentials: LoginCredentials
): Promise<AuthResponse> {
  const res = await axiosInstance.post("/auth/login", credentials);
  console.log("✅ API /auth/login trả về:", res.data);

  return res.data; // { user, accessToken }
}

/**
 * Gửi request đăng xuất tới backend.
 * Backend sẽ xóa JWT hoặc phiên trên server.
 */
// export async function logoutUser() {
//   await axios.post("/auth/logout");
// }

/**
 * Lấy thông tin người dùng hiện tại nếu đang đăng nhập.
 * @param token - JWT token lưu trong localStorage
 * @returns Thông tin người dùng nếu token hợp lệ.
 */
export async function getUser(token: string): Promise<User> {
  const res = await axiosInstance.get("/auth/me", {
    headers: {
      Authorization: `Bearer ${token}`, // Gắn token vào header
    },
  });
  console.log("📥 getUser response:", res.data); // 👈 LOG NÀY RẤT QUAN TRỌNG

  return res.data;
}
export async function registerUser(
  data: RegisterRequest
): Promise<AuthResponse> {
  const res = await axiosInstance.post("/auth/register", data);
  console.log("✅ API /auth/register trả về:", res.data);
  return res.data;
}

export async function changePassword(data: {
  currentPassword: string;
  newPassword: string;
}): Promise<void> {
  await axiosInstance.post("/auth/change-password", data);
}

export async function requestPasswordReset(email: string): Promise<void> {
  await axiosInstance.post("/auth/forgot-password", { email });
}

export async function resetPassword(data: {
  email: string;
  token: string;
  newPassword: string;
}): Promise<void> {
  await axiosInstance.post("/auth/reset-password", data);
}
