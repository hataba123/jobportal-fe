"use client";
// 📁 src/contexts/AuthContext.tsx
import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "@/i18n/navigation";
import { getUser, loginUser } from "@/lib/api/auth";
import {
  getAccessToken,
  setAccessToken,
  clearAccessToken,
} from "@/utils/token";
import { type Role, type User, RoleEnum } from "@/types/User";
import type { LoginCredentials } from "@/types/Auth";

type AuthContextType = {
  user: User | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  loading: boolean;
  isAuthenticated: boolean;
  role: Role | null; // 🔄 Đã là string rồi
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = getAccessToken();
    console.log("🔑 Token từ localStorage:", token);

    if (!token) {
      setLoading(false);
      return;
    }

    getUser(token)
      .then((user) => {
        console.log("✅ User từ token:", user);
        setUser(user);
      })
      .catch((err) => {
        console.error("❌ Lỗi khi getUser:", err);
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const login = async (credentials: LoginCredentials) => {
    const { token, user } = await loginUser(credentials); // 🔁 sửa lại tên
    setAccessToken(token); // ✅ Đặt token trước
    setUser(user); // ✅ Sau đó mới set user
    // 🎯 Redirect theo vai trò
    const roleString = mapRoleEnumToString(user.role);
    console.log("🔄 Đang redirect đến:", roleString);
    switch (roleString) {
      case "ADMIN":
        router.push("/admin/dashboard");
        break;
      case "RECRUITER":
        router.push("/recruiter/dashboard");
        break;
      case "CANDIDATE":
        router.push("/candidate/dashboard");
        break;
      default:
        router.push("/"); // hoặc trang lỗi
        break;
    }
  };

  const logout = async () => {
    // await logoutUser();
    clearAccessToken();
    setUser(null);
    router.push("/candidate/dashboard");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        loading,
        isAuthenticated: !!user,
        role: user ? mapRoleEnumToString(user.role) : null, // 🔁 ánh xạ từ enum → string
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
export const mapRoleEnumToString = (roleEnum: RoleEnum): Role => {
  switch (roleEnum) {
    case RoleEnum.ADMIN:
      return "ADMIN";
    case RoleEnum.RECRUITER:
      return "RECRUITER";
    case RoleEnum.CANDIDATE:
      return "CANDIDATE";
    default:
      throw new Error(`❌ Vai trò không hợp lệ: ${roleEnum}`);
  }
};
// ✅ Đây là hook bạn dùng trong mọi component:
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
