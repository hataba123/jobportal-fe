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
import { useSession } from "next-auth/react";

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
  const { data: session } = useSession();

  useEffect(() => {
    const token = getAccessToken();
    console.log("🌟 AuthProvider useEffect token:", token);

    if (token) {
      getUser(token)
        .then((user) => {
          setUser(user);
          console.log("📥 getUser response:", user);
        })
        .catch((err) => {
          console.error("❌ Lỗi khi getUser:", err);
          setUser(null);
          clearAccessToken();
        })
        .finally(() => setLoading(false));
    } else if (session?.backendUser) {
      setUser(session.backendUser);
      setLoading(false);
    } else {
      setLoading(false);
    }
  }, [session]);

  const login = async (credentials: LoginCredentials) => {
    const { token, user } = await loginUser(credentials);

    // ✅ Đảm bảo token được lưu vào localStorage
    setAccessToken(token);
    setUser(user);

    console.log("✅ Đã login, token:", token);
    console.log("🧑‍💼 Role:", user.role);

    // ✅ Redirect về trang chủ sau khi login thành công
    setTimeout(() => {
      const roleString = mapRoleEnumToString(user.role);
      switch (roleString) {
        case "ADMIN":
          router.push("/admin/dashboard");
          break;
        case "RECRUITER":
          router.push("/recruiter/dashboard");
          break;
        case "CANDIDATE":
          router.push("/candidate");
          break;
        default:
          router.push("/candidate");
          break;
      }
    }, 100); // 100ms delay
  };

  const register = async (data: RegisterRequest) => {
    await registerUser(data); // Gọi API
    // ✅ Sau khi đăng ký thành công → chuyển sang trang đăng nhập
    router.push("/candidate/auth/login");
  };

  const logout = () => {
    clearAccessToken();
    setUser(null);
    router.push("/candidate");
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
