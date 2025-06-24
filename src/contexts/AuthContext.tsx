"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "@/i18n/navigation";
import { getUser, loginUser, registerUser } from "@/lib/api/auth"; // 👈 THÊM registerUser
import {
  getAccessToken,
  setAccessToken,
  clearAccessToken,
} from "@/utils/token";
import { type Role, type User, RoleEnum } from "@/types/User";
import type { LoginCredentials } from "@/types/Auth";
import type { RegisterRequest } from "@/types/RegisterRequest"; // 👈 THÊM

type AuthContextType = {
  user: User | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  register: (data: RegisterRequest) => Promise<void>; // ✅ THÊM VÀO TYPE
  loading: boolean;
  isAuthenticated: boolean;
  role: Role | null;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = getAccessToken();
    if (!token) {
      setLoading(false);
      return;
    }

    getUser(token)
      .then((user) => setUser(user))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  const login = async (credentials: LoginCredentials) => {
    const { token, user } = await loginUser(credentials);
    setAccessToken(token);
    setUser(user);

    const roleString = mapRoleEnumToString(user.role);
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
        router.push("/");
        break;
    }
  };

  const register = async (data: RegisterRequest) => {
    await registerUser(data); // Gọi API
    // ✅ Sau khi đăng ký thành công → chuyển sang trang đăng nhập
    router.push("/auth/login");
  };

  const logout = () => {
    clearAccessToken();
    setUser(null);
    router.push("/candidate/dashboard");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register, // ✅ Đưa vào context
        logout,
        loading,
        isAuthenticated: !!user,
        role: user ? mapRoleEnumToString(user.role) : null,
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

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
