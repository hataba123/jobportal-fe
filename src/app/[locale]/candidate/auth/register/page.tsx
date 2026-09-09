"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "@/i18n/navigation";
import { RoleEnum } from "@/types/user";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import BrandLogo from "@/components/common/BrandLogo";
import { toast } from "sonner";
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Building2,
  CheckCircle2,
  Sparkles,
  ArrowRight,
} from "lucide-react";

type FormValues = {
  fullName: string;
  email: string;
  password: string;
  confirmPassword?: string;
  isRecruiter: boolean;
};

export default function RegisterPage() {
  const { register: registerUser, loading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState<"candidate" | "recruiter">("candidate");

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    watch,
  } = useForm<FormValues>({
    defaultValues: {
      isRecruiter: false,
    },
  });

  const passwordValue = watch("password");

  const onSubmit = async (data: FormValues) => {
    if (data.confirmPassword && data.password !== data.confirmPassword) {
      setError("confirmPassword", { message: "Mật khẩu xác nhận không khớp" });
      return;
    }

    const payload = {
      fullName: data.fullName,
      email: data.email,
      password: data.password,
      role: selectedRole === "recruiter" ? RoleEnum.RECRUITER : RoleEnum.CANDIDATE,
    };

    try {
      await registerUser(payload);
      toast.success("Đăng ký tài khoản thành công! Vui lòng đăng nhập.");
    } catch {
      setError("root", {
        message: "Email này đã được đăng ký hoặc máy chủ đang bận. Vui lòng thử lại.",
      });
      toast.error("Đăng ký tài khoản không thành công.");
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-50">
      {/* Left Column: Brand Showcase */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950 text-white p-12 flex-col justify-between overflow-hidden">
        <div className="absolute top-10 left-10 w-80 h-80 bg-blue-500/15 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none"></div>

        <div>
          <BrandLogo href="/" size="md" variant="dark" />
        </div>

        <div className="space-y-6 max-w-lg relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Gia nhập hệ sinh thái tuyển dụng thông minh</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight">
            Một tài khoản, mở lối tương lai sự nghiệp công nghệ.
          </h2>
          <div className="space-y-3 pt-2 text-sm text-slate-300">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
              <span>Tạo hồ sơ chuyên môn và lưu trữ CV an toàn</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
              <span>Nhận gợi ý việc làm chuẩn xác dựa trên kỹ năng</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
              <span>Theo dõi tiến trình ứng tuyển trực tiếp theo thời gian thực</span>
            </div>
          </div>
        </div>

        <div className="relative z-10 flex items-center justify-between text-xs text-slate-400 pt-6 border-t border-white/10">
          <span>© {new Date().getFullYear()} JobPortal. Tất cả quyền được bảo lưu.</span>
          <div className="flex gap-4">
            <Link href="/candidate/blog" className="hover:text-white">Bảo mật</Link>
            <Link href="/candidate/blog" className="hover:text-white">Điều khoản</Link>
          </div>
        </div>
      </div>

      {/* Right Column: Register Form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md space-y-6 bg-white p-8 sm:p-10 rounded-3xl border border-slate-200/80 shadow-xl shadow-slate-200/50">
          <div className="lg:hidden text-center mb-2">
            <BrandLogo href="/" size="md" />
          </div>

          <div className="space-y-1 text-center lg:text-left">
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Tạo tài khoản mới
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              Bắt đầu hành trình kết nối cơ hội IT ngay hôm nay
            </p>
          </div>

          {/* Role Switcher Pill */}
          <div className="p-1 rounded-2xl bg-slate-100 grid grid-cols-2 gap-1 select-none">
            <button
              type="button"
              onClick={() => setSelectedRole("candidate")}
              className={`flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-bold transition-all ${
                selectedRole === "candidate"
                  ? "bg-white text-blue-600 shadow-xs"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>Ứng viên</span>
            </button>
            <button
              type="button"
              onClick={() => setSelectedRole("recruiter")}
              className={`flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-bold transition-all ${
                selectedRole === "recruiter"
                  ? "bg-white text-blue-600 shadow-xs"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>Nhà tuyển dụng</span>
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label htmlFor="fullName" className="text-xs font-bold text-slate-700">
                {selectedRole === "recruiter" ? "Họ tên người phụ trách" : "Họ và tên"}
              </Label>
              <div className="relative mt-1">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  id="fullName"
                  type="text"
                  placeholder="Nguyễn Văn A"
                  {...register("fullName", { required: "Vui lòng nhập họ tên" })}
                  className="pl-10 h-11 rounded-2xl border-slate-200 bg-slate-50 focus:bg-white text-sm"
                />
              </div>
              {errors.fullName && (
                <p className="text-rose-500 text-xs mt-1 font-medium">{errors.fullName.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="email" className="text-xs font-bold text-slate-700">
                Email
              </Label>
              <div className="relative mt-1">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  {...register("email", { required: "Vui lòng nhập email" })}
                  className="pl-10 h-11 rounded-2xl border-slate-200 bg-slate-50 focus:bg-white text-sm"
                />
              </div>
              {errors.email && (
                <p className="text-rose-500 text-xs mt-1 font-medium">{errors.email.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="password" className="text-xs font-bold text-slate-700">
                Mật khẩu (Tối thiểu 6 ký tự)
              </Label>
              <div className="relative mt-1">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  {...register("password", {
                    required: "Vui lòng nhập mật khẩu",
                    minLength: { value: 6, message: "Mật khẩu phải có ít nhất 6 ký tự" },
                  })}
                  className="pl-10 pr-10 h-11 rounded-2xl border-slate-200 bg-slate-50 focus:bg-white text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-rose-500 text-xs mt-1 font-medium">{errors.password.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="confirmPassword" className="text-xs font-bold text-slate-700">
                Xác nhận mật khẩu
              </Label>
              <div className="relative mt-1">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  id="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  {...register("confirmPassword", {
                    required: "Vui lòng xác nhận mật khẩu",
                    validate: (value) => value === passwordValue || "Mật khẩu xác nhận không khớp",
                  })}
                  className="pl-10 pr-10 h-11 rounded-2xl border-slate-200 bg-slate-50 focus:bg-white text-sm"
                />
              </div>
              {errors.confirmPassword && (
                <p className="text-rose-500 text-xs mt-1 font-medium">{errors.confirmPassword.message}</p>
              )}
            </div>

            {errors.root && (
              <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
                {errors.root.message}
              </div>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-11 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md shadow-blue-500/25 active:scale-95 transition-all"
            >
              {loading ? "Đang xử lý..." : "Đăng ký tài khoản"}
            </Button>
          </form>

          {/* Footer link */}
          <p className="text-xs text-center text-slate-500">
            Bạn đã có tài khoản?{" "}
            <Link
              href="/candidate/auth/login"
              className="font-bold text-blue-600 hover:underline"
            >
              Đăng nhập ngay
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
