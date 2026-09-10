"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Link, useRouter } from "@/i18n/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { changePassword } from "@/lib/api/auth";
import { signOut } from "next-auth/react";
import { toast } from "sonner";
import { Bell, Building2, Lock, ShieldCheck, KeyRound } from "lucide-react";

export default function RecruiterSettingsPage() {
  const { user } = useAuth();
  const router = useRouter();

  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    applicationUpdates: true,
  });

  // Load preferences from localStorage if exists
  useEffect(() => {
    if (typeof window !== "undefined" && user?.id) {
      const saved = localStorage.getItem(`recruiter_prefs_${user.id}`);
      if (saved) {
        try {
          setPreferences(JSON.parse(saved));
        } catch {
          // ignore
        }
      }
    }
  }, [user?.id]);

  const updatePreference = (key: keyof typeof preferences, value: boolean) => {
    setPreferences((current) => ({ ...current, [key]: value }));
  };

  const handleSavePreferences = () => {
    if (user?.id && typeof window !== "undefined") {
      localStorage.setItem(`recruiter_prefs_${user.id}`, JSON.stringify(preferences));
    }
    toast.success("Đã lưu các tùy chọn thông báo nhà tuyển dụng!");
  };

  // Password change state
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [changingPassword, setChangingPassword] = useState(false);

  const handlePasswordChange = async () => {
    if (!passwordForm.currentPassword) {
      toast.error("Vui lòng nhập mật khẩu hiện tại.");
      return;
    }
    if (passwordForm.newPassword.length < 8) {
      toast.error("Mật khẩu mới phải có ít nhất 8 ký tự.");
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error("Xác nhận mật khẩu mới không khớp.");
      return;
    }

    setChangingPassword(true);
    try {
      await changePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });
      toast.success("Đổi mật khẩu thành công! Vui lòng đăng nhập lại.");
      setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
      await signOut({ redirect: false });
      router.push("/candidate/auth/login");
    } catch {
      toast.error("Không thể đổi mật khẩu. Vui lòng kiểm tra lại mật khẩu hiện tại.");
    } finally {
      setChangingPassword(false);
    }
  };

  return (
    <div className="max-w-3xl space-y-6 pb-12">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Cài đặt tài khoản nhà tuyển dụng</h2>
        <p className="text-sm text-slate-500 mt-1">Quản lý bảo mật, thông báo và thông tin doanh nghiệp</p>
      </div>

      <Card className="rounded-3xl border-slate-200/80 shadow-xs">
        <CardHeader>
          <CardTitle className="text-base font-bold flex items-center gap-2">
            <Building2 className="w-4 h-4 text-blue-600" />
            <span>Tài khoản nhà tuyển dụng</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="text-xs font-semibold text-slate-500">Email đăng nhập</Label>
            <p className="mt-1 text-sm font-semibold text-slate-900">
              {user?.email ?? "Chưa xác định"}
            </p>
          </div>
          <Link href="/recruiter/company">
            <Button variant="outline" className="rounded-xl text-xs font-semibold">
              Cập nhật hồ sơ công ty
            </Button>
          </Link>
        </CardContent>
      </Card>

      {/* Đổi mật khẩu */}
      <Card className="rounded-3xl border-slate-200/80 shadow-xs">
        <CardHeader>
          <CardTitle className="text-base font-bold flex items-center gap-2">
            <Lock className="w-4 h-4 text-indigo-600" />
            <span>Bảo mật & Đổi mật khẩu</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="currentPassword" className="text-xs font-semibold text-slate-500">
              Mật khẩu hiện tại
            </Label>
            <Input
              id="currentPassword"
              type="password"
              placeholder="••••••••"
              value={passwordForm.currentPassword}
              onChange={(e) =>
                setPasswordForm({ ...passwordForm, currentPassword: e.target.value })
              }
              className="mt-1 h-11 rounded-2xl border-slate-200 bg-white"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="newPassword" className="text-xs font-semibold text-slate-500">
                Mật khẩu mới (Tối thiểu 8 ký tự)
              </Label>
              <Input
                id="newPassword"
                type="password"
                placeholder="••••••••"
                value={passwordForm.newPassword}
                onChange={(e) =>
                  setPasswordForm({ ...passwordForm, newPassword: e.target.value })
                }
                className="mt-1 h-11 rounded-2xl border-slate-200 bg-white"
              />
            </div>
            <div>
              <Label htmlFor="confirmPassword" className="text-xs font-semibold text-slate-500">
                Xác nhận mật khẩu mới
              </Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={passwordForm.confirmPassword}
                onChange={(e) =>
                  setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })
                }
                className="mt-1 h-11 rounded-2xl border-slate-200 bg-white"
              />
            </div>
          </div>

          <div className="pt-2">
            <Button
              onClick={handlePasswordChange}
              disabled={changingPassword}
              className="rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-2"
            >
              <KeyRound className="w-3.5 h-3.5" />
              <span>{changingPassword ? "Đang cập nhật..." : "Cập nhật mật khẩu"}</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-3xl border-slate-200/80 shadow-xs">
        <CardHeader>
          <CardTitle className="text-base font-bold flex items-center gap-2">
            <Bell className="w-4 h-4 text-emerald-600" />
            <span>Tùy chọn thông báo</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="flex items-center justify-between gap-4 py-2 border-b border-slate-100">
            <div>
              <Label htmlFor="email-notifications" className="text-sm font-bold text-slate-800">
                Thông báo qua email
              </Label>
              <p className="text-xs text-slate-500 mt-0.5">
                Nhận thông tin quan trọng về hoạt động tuyển dụng và giao dịch.
              </p>
            </div>
            <Switch
              id="email-notifications"
              checked={preferences.emailNotifications}
              onCheckedChange={(value) =>
                updatePreference("emailNotifications", value)
              }
            />
          </div>
          <div className="flex items-center justify-between gap-4 py-2">
            <div>
              <Label htmlFor="application-updates" className="text-sm font-bold text-slate-800">
                Cập nhật đơn ứng tuyển
              </Label>
              <p className="text-xs text-slate-500 mt-0.5">
                Nhận thông báo tức thì khi ứng viên gửi hồ sơ mới vào bài đăng.
              </p>
            </div>
            <Switch
              id="application-updates"
              checked={preferences.applicationUpdates}
              onCheckedChange={(value) =>
                updatePreference("applicationUpdates", value)
              }
            />
          </div>
          <div className="pt-2">
            <Button onClick={handleSavePreferences} className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs">
              Lưu tùy chọn
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
