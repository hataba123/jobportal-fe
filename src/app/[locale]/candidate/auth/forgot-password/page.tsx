"use client";

import { FormEvent, useState } from "react";
import { Link, useRouter } from "@/i18n/navigation";
import { requestPasswordReset } from "@/lib/api/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import BrandLogo from "@/components/common/BrandLogo";
import { Mail, ArrowLeft, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await requestPasswordReset(email);
      setSubmitted(true);
      toast.success("Hướng dẫn đặt lại mật khẩu đã được gửi đến email của bạn.");
    } catch {
      setSubmitted(true);
      toast.success("Nếu email tồn tại, hướng dẫn đặt lại mật khẩu sẽ được gửi.");
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
            Quên mật khẩu?
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1.5">
            Nhập email của bạn để nhận liên kết đặt lại mật khẩu an toàn
          </p>
        </div>

        {submitted ? (
          <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <p className="text-sm font-semibold text-emerald-900">
              Nếu email {email} tồn tại trong hệ thống, hướng dẫn đặt lại mật khẩu đã được gửi đến hộp thư của bạn.
            </p>
            <p className="text-xs text-emerald-700">
              Vui lòng kiểm tra cả thư mục Spam/Rác nếu không thấy thư trong hộp thư chính.
            </p>
            <Button
              onClick={() => router.push("/candidate/auth/login")}
              className="w-full rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
            >
              Quay lại Đăng nhập
            </Button>
          </div>
        ) : (
          <form onSubmit={submit} className="space-y-4">
            <div>
              <Label htmlFor="email" className="text-xs font-bold text-slate-700">
                Email đã đăng ký
              </Label>
              <div className="relative mt-1">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  id="email"
                  type="email"
                  required
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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
              {loading ? "Đang gửi yêu cầu..." : "Gửi liên kết đặt lại mật khẩu"}
            </Button>

            <Button
              type="button"
              variant="ghost"
              onClick={() => router.push("/candidate/auth/login")}
              className="w-full rounded-2xl text-xs text-slate-500 hover:text-slate-900"
            >
              <ArrowLeft className="w-4 h-4 mr-1.5" />
              Quay lại trang đăng nhập
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
