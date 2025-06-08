// 📁 src/hooks/useAuth.ts
"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getUser, loginUser, logoutUser } from "@/lib/api/auth";
import type { User } from "@/types/user";
import type { LoginCredentials } from "@/types/auth";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Khi component mount, kiểm tra trạng thái đăng nhập
  useEffect(() => {
    getUser()
      .then(setUser)
      .catch(() => setUser(null)) // đảm bảo nếu getUser thất bại thì cũng xử lý đúng
      .finally(() => setLoading(false));
  }, []);

  /**
   * Hàm xử lý đăng nhập
   * @param credentials - email và password của người dùng
   */
  const login = async (credentials: LoginCredentials) => {
    try {
      const loggedInUser = await loginUser(credentials);
      setUser(loggedInUser); // Cập nhật state user với thông tin người dùng đã đăng nhập
      //       Hiển thị tên người dùng

      // Bảo vệ route

      // Sử dụng token cho các request sau
      console.log("Đăng nhập thành công:", loggedInUser);
      router.push("/");
    } catch (err) {
      console.error("Đăng nhập thất bại:", err);
      throw err; // cho phép UI xử lý lỗi nếu cần
    }
  };

  /**
   * Hàm xử lý đăng xuất
   */
  const logout = async () => {
    await logoutUser();
    setUser(null);
    router.push("/login");
  };

  return {
    user,
    login,
    logout,
    loading,
    isAuthenticated: !!user,
  };
}
