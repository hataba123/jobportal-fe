"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "@/i18n/navigation";
import { LoginRequest } from "@/types/LoginRequest";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import BrandLogo from "@/components/common/BrandLogo";
import { signIn } from "next-auth/react";
import { toast } from "sonner";
import {
  Eye,
  EyeOff,
  Lock,
  Mail,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Users,
} from "lucide-react";

export default function LoginPage() {
  const { login, loading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [socialLoading, setSocialLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<LoginRequest>();

  const onSubmit = async (data: LoginRequest) => {
    try {
      await login(data);
      toast.success("Đăng nhập thành công!");
    } catch {
      setError("root", {
        message: "Email hoặc mật khẩu không chính xác. Vui lòng kiểm tra lại.",
      });
      toast.error("Đăng nhập thất bại. Vui lòng kiểm tra lại email hoặc mật khẩu.");
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setSocialLoading(true);
      const result = await signIn("google", {
        callbackUrl: "/candidate",
        redirect: false,
      });

      if (result?.error) {
        toast.error(`Đăng nhập Google thất bại: ${result.error}`);
      } else if (result?.url) {
        window.location.href = result.url;
      }
    } catch (error) {
      toast.error("Có lỗi xảy ra khi kết nối tới Google.");
    } finally {
      setSocialLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-50">
      {/* Left Column: Brand Showcase (Hidden on Mobile) */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950 text-white p-12 flex-col justify-between overflow-hidden">
        {/* Decorative Background Blur */}
        <div className="absolute top-10 left-10 w-80 h-80 bg-blue-500/15 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none"></div>

        <div>
          <BrandLogo href="/" size="md" variant="dark" />
        </div>

        <div className="space-y-6 max-w-lg relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Cộng đồng Lập trình viên hàng đầu</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight">
            Kết nối trực tiếp với các vị trí IT mơ ước.
          </h2>
          <p className="text-sm text-slate-300 leading-relaxed">
            Hơn 50,000+ lập trình viên đã tìm được công việc phù hợp với mức lương xứng đáng thông qua hệ thống so khớp thông minh JobPortal.
          </p>

          <div className="grid grid-cols-2 gap-4 pt-4">
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs">
              <div className="text-2xl font-bold text-blue-400">5,000+</div>
              <div className="text-xs text-slate-400 mt-1">Doanh nghiệp công nghệ</div>
            </div>
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs">
              <div className="text-2xl font-bold text-emerald-400">98%</div>
              <div className="text-xs text-slate-400 mt-1">Ứng viên được phản hồi</div>
            </div>
          </div>
        </div>

        <div className="relative z-10 flex items-center justify-between text-xs text-slate-400 pt-6 border-t border-white/10">
          <span>© {new Date().getFullYear()} JobPortal. Bản quyền được bảo lưu.</span>
          <div className="flex gap-4">
            <Link href="/candidate/blog" className="hover:text-white">Bảo mật</Link>
            <Link href="/candidate/blog" className="hover:text-white">Điều khoản</Link>
          </div>
        </div>
      </div>

      {/* Right Column: Login Form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md space-y-8 bg-white p-8 sm:p-10 rounded-3xl border border-slate-200/80 shadow-xl shadow-slate-200/50">
          {/* Header Mobile Brand */}
          <div className="lg:hidden text-center mb-4">
            <BrandLogo href="/" size="md" />
          </div>

          <div className="space-y-1 text-center lg:text-left">
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Đăng nhập tài khoản
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              Chào mừng bạn quay lại với nền tảng JobPortal
            </p>
          </div>

          {/* Social Sign In (Google) */}
          <div>
            <Button
              type="button"
              variant="outline"
              disabled={socialLoading}
              onClick={handleGoogleSignIn}
              className="w-full h-11 rounded-2xl border-slate-200 hover:bg-slate-50 flex items-center justify-center gap-3 text-sm font-semibold transition-all"
            >
              <svg width="18" height="18" viewBox="0 0 48 48">
                <path fill="#4285F4" d="M24 9.5c3.54 0 6.7 1.22 9.19 3.23l6.85-6.85C35.64 2.39 30.18 0 24 0 14.82 0 6.71 5.82 2.69 14.09l7.98 6.19C12.36 13.13 17.73 9.5 24 9.5z" />
                <path fill="#34A853" d="M46.1 24.55c0-1.64-.15-3.22-.42-4.74H24v9.01h12.42c-.54 2.9-2.18 5.36-4.65 7.01l7.19 5.6C43.98 37.13 46.1 31.3 46.1 24.55z" />
                <path fill="#FBBC05" d="M10.67 28.28a14.5 14.5 0 0 1 0-8.56l-7.98-6.19A23.94 23.94 0 0 0 0 24c0 3.77.9 7.34 2.69 10.47l7.98-6.19z" />
                <path fill="#EA4335" d="M24 48c6.18 0 11.36-2.05 15.14-5.59l-7.19-5.6c-2.01 1.35-4.59 2.15-7.95 2.15-6.27 0-11.64-3.63-13.33-8.72l-7.98 6.19C6.71 42.18 14.82 48 24 48z" />
              </svg>
              <span>{socialLoading ? "Đang kết nối..." : "Đăng nhập với Google"}</span>
            </Button>
          </div>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-3 text-slate-400 font-semibold">Hoặc với email</span>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-xs font-bold text-slate-700">
                  Mật khẩu
                </Label>
                <Link
                  href="/candidate/auth/forgot-password"
                  className="text-xs font-semibold text-blue-600 hover:underline"
                >
                  Quên mật khẩu?
                </Link>
              </div>
              <div className="relative mt-1">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  {...register("password", { required: "Vui lòng nhập mật khẩu" })}
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
              {loading ? "Đang đăng nhập..." : "Đăng nhập"}
            </Button>
          </form>

          {/* Footer link */}
          <p className="text-xs text-center text-slate-500">
            Bạn chưa có tài khoản?{" "}
            <Link
              href="/candidate/auth/register"
              className="font-bold text-blue-600 hover:underline"
            >
              Đăng ký ngay
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
