"use client";

import { FormEvent, useEffect, useState } from "react";
import { Link, useRouter } from "@/i18n/navigation";
import { resetPassword } from "@/lib/api/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import BrandLogo from "@/components/common/BrandLogo";
import { Lock, Mail, KeyRound, ArrowLeft, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setEmail(params.get("email") ?? "");
    setToken(params.get("token") ?? "");
  }, []);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setMessage(null);

    if (newPassword.length < 8) {
      setError("Mật khẩu mới phải có ít nhất 8 ký tự.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Mật khẩu xác nhận không khớp.");
      return;
    }

    setLoading(true);
    try {
      await resetPassword({ email, token, newPassword });
      setMessage("Đặt lại mật khẩu thành công! Bạn có thể đăng nhập bằng mật khẩu mới.");
      toast.success("Đặt lại mật khẩu thành công!");
      setTimeout(() => router.push("/candidate/auth/login"), 1200);
    } catch {
      setError("Mã đặt lại không hợp lệ hoặc đã hết hạn. Vui lòng yêu cầu lại mã mới.");
      toast.error("Không thể đặt lại mật khẩu.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-3xl border border-slate-200/80 shadow-xl p-8 sm:p-10 space-y-6">
        <div className="text-center">
          <BrandLogo href="/" size="md" />
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight mt-6">
            Đặt lại mật khẩu
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1.5">
            Thiết lập mật khẩu mới an toàn cho tài khoản của bạn
          </p>
        </div>

        {message ? (
          <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <p className="text-sm font-semibold text-emerald-900">{message}</p>
            <p className="text-xs text-emerald-700">Đang chuyển hướng đến trang đăng nhập...</p>
          </div>
        ) : (
          <form onSubmit={submit} className="space-y-4">
            <div>
              <Label htmlFor="email" className="text-xs font-bold text-slate-700">
                Email
              </Label>
              <div className="relative mt-1">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 h-11 rounded-2xl border-slate-200 bg-slate-50 text-sm"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="token" className="text-xs font-bold text-slate-700">
                Mã xác thực (Token)
              </Label>
              <div className="relative mt-1">
                <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  id="token"
                  required
                  placeholder="Nhập mã từ email"
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  className="pl-10 h-11 rounded-2xl border-slate-200 bg-slate-50 text-sm"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="newPassword" className="text-xs font-bold text-slate-700">
                Mật khẩu mới (Tối thiểu 8 ký tự)
              </Label>
              <div className="relative mt-1">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  id="newPassword"
                  type="password"
                  required
                  placeholder="••••••••"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="pl-10 h-11 rounded-2xl border-slate-200 bg-slate-50 text-sm"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="confirmPassword" className="text-xs font-bold text-slate-700">
                Xác nhận mật khẩu mới
              </Label>
              <div className="relative mt-1">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  id="confirmPassword"
                  type="password"
                  required
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="pl-10 h-11 rounded-2xl border-slate-200 bg-slate-50 text-sm"
                />
              </div>
            </div>

            {error && (
              <p className="text-xs text-rose-600 font-medium">{error}</p>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-11 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md shadow-blue-500/20 active:scale-95 transition-all"
            >
              {loading ? "Đang cập nhật..." : "Lưu mật khẩu mới"}
            </Button>

            <Button
              type="button"
              variant="ghost"
              onClick={() => router.push("/candidate/auth/login")}
              className="w-full rounded-2xl text-xs text-slate-500 hover:text-slate-900"
            >
              <ArrowLeft className="w-4 h-4 mr-1.5" />
              Quay lại đăng nhập
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
