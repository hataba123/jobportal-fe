// 📁 src/hooks/useAuth.ts
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getUser, loginUser, logoutUser } from "@/lib/api/auth";
import type { User } from "@/types/user";
import type { LoginCredentials } from "@/types/auth";
import {
  getAccessToken,
  setAccessToken,
  clearAccessToken,
} from "@/utils/token";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Khi component mount, kiểm tra token và gọi API getUser
  useEffect(() => {
    const token = getAccessToken();
    if (!token) {
      setLoading(false);
      return;
    }

    getUser(token) // truyền token nếu cần
      .then(setUser)
      .catch(() => setUser(null))
      .finally(() => setLoading(false));

    // ❌ Nếu dùng cookie httpOnly:
    // getUser() // credentials: 'include' bên trong
    //   .then(setUser)
    //   .catch(() => setUser(null))
    //   .finally(() => setLoading(false));
  }, []);

  /**
   * Hàm xử lý đăng nhập
   */
  const login = async (credentials: LoginCredentials) => {
    try {
      const { user: loggedInUser, accessToken } = await loginUser(credentials);
      setUser(loggedInUser);
      setAccessToken(accessToken); // lưu token vào localStorage

      // ❌ Nếu dùng cookie httpOnly:
      // Không cần lưu token, chỉ cần setUser()

      router.push("/");
    } catch (err) {
      console.error("Đăng nhập thất bại:", err);
      throw err;
    }
  };

  /**
   * Hàm xử lý đăng xuất
   */
  const logout = async () => {
    await logoutUser(); // Nếu API hỗ trợ xoá session/token server-side
    clearAccessToken(); // Xoá token trong localStorage
    setUser(null);
    router.push("/");
  };

  return {
    user,
    login,
    logout,
    loading,
    isAuthenticated: !!user,
  };
}
