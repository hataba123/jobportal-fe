"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "@/i18n/navigation";
import { registerUser } from "@/lib/api/auth";
import { type Role, type User, RoleEnum } from "@/types/user";
import type { LoginCredentials } from "@/types/auth";
import type { RegisterRequest } from "@/types/RegisterRequest"; // 👈 THÊM
import { getSession, signIn, signOut, useSession } from "next-auth/react";

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
    if (session?.backendUser) {
      setUser(session.backendUser);
    } else {
      setUser(null);
    }
    setLoading(false);
  }, [session]);

  const login = async (credentials: LoginCredentials) => {
    const result = await signIn("credentials", {
      ...credentials,
      redirect: false,
    });
    if (!result || result.error) {
      throw new Error("Email hoặc mật khẩu không đúng");
    }

    const currentSession = await getSession();
    const user = currentSession?.backendUser;
    if (!user) {
      throw new Error("Không thể tạo phiên đăng nhập");
    }
    setUser(user);

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
    void signOut({ redirect: false });
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
