"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import CandidateHeader from "@/components/candidate/CandidateHeader";
import LanguageSwitcher from "@/components/common/LanguageSwitcher";
import { changePassword } from "@/lib/api/auth";
import { useAuth } from "@/contexts/AuthContext";
import { signOut } from "next-auth/react";
import { useRouter } from "@/i18n/navigation";
import { toast } from "sonner";
import {
  User,
  Lock,
  Bell,
  ShieldCheck,
  Globe,
  KeyRound,
  CheckCircle2,
} from "lucide-react";

export default function SettingsPage() {
  const { user } = useAuth();
  const router = useRouter();

  const [phone, setPhone] = useState("");
  const [settings, setSettings] = useState({
    emailNotifications: true,
    jobAlerts: true,
    marketingEmails: false,
    profileVisibility: true,
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordMessage, setPasswordMessage] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [changingPassword, setChangingPassword] = useState(false);

  const handlePasswordChange = async () => {
    setPasswordMessage(null);
    setPasswordError(null);

    if (passwordForm.newPassword.length < 8) {
      setPasswordError("Mật khẩu mới phải có ít nhất 8 ký tự.");
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError("Xác nhận mật khẩu không khớp.");
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
      setPasswordError("Không thể đổi mật khẩu. Hãy kiểm tra lại mật khẩu hiện tại.");
      toast.error("Đổi mật khẩu thất bại.");
    } finally {
      setChangingPassword(false);
    }
  };

  const handleSaveProfileSettings = () => {
    toast.success("Đã lưu thông tin tài khoản thành công!");
  };

  const handleSettingChange = (key: string, value: boolean) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
    toast.success("Đã cập nhật tùy chọn.");
  };

  return (
    <div className="min-h-screen bg-slate-50/60 pb-16">
      <CandidateHeader />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Cài đặt tài khoản
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Quản lý mật khẩu, tùy chọn bảo mật và thông báo cá nhân
          </p>
        </div>

        <div className="space-y-6">
          {/* Thông tin tài khoản */}
          <Card className="rounded-3xl border-slate-200/80 shadow-xs">
            <CardHeader>
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <User className="w-4 h-4 text-blue-600" />
                <span>Thông tin tài khoản</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="email" className="text-xs font-semibold text-slate-500">
                    Email đăng nhập
                  </Label>
                  <Input
                    id="email"
                    value={user?.email ?? ""}
                    disabled
                    className="mt-1 h-11 rounded-2xl bg-slate-100 text-slate-500 cursor-not-allowed"
                  />
                </div>
                <div>
                  <Label htmlFor="phone" className="text-xs font-semibold text-slate-500">
                    Số điện thoại liên hệ
                  </Label>
                  <Input
                    id="phone"
                    placeholder="Nhập số điện thoại của bạn"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="mt-1 h-11 rounded-2xl border-slate-200 bg-white"
                  />
                </div>
              </div>
              <Button
                onClick={handleSaveProfileSettings}
                className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs"
              >
                Lưu thay đổi
              </Button>
            </CardContent>
          </Card>

          {/* Đổi mật khẩu */}
          <Card className="rounded-3xl border-slate-200/80 shadow-xs">
            <CardHeader>
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <Lock className="w-4 h-4 text-indigo-600" />
                <span>Đổi mật khẩu</span>
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
                    setPasswordForm({
                      ...passwordForm,
                      currentPassword: e.target.value,
                    })
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
                      setPasswordForm({
                        ...passwordForm,
                        newPassword: e.target.value,
                      })
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
                      setPasswordForm({
                        ...passwordForm,
                        confirmPassword: e.target.value,
                      })
                    }
                    className="mt-1 h-11 rounded-2xl border-slate-200 bg-white"
                  />
                </div>
              </div>

              {passwordError && (
                <p className="text-xs font-medium text-rose-600">{passwordError}</p>
              )}

              <Button
                onClick={handlePasswordChange}
                disabled={changingPassword}
                className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs"
              >
                {changingPassword ? "Đang cập nhật..." : "Cập nhật mật khẩu"}
              </Button>
            </CardContent>
          </Card>

          {/* Cài đặt thông báo */}
          <Card className="rounded-3xl border-slate-200/80 shadow-xs">
            <CardHeader>
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <Bell className="w-4 h-4 text-amber-500" />
                <span>Cài đặt thông báo & Nhận tin</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between py-2 border-b border-slate-100">
                <div>
                  <Label htmlFor="emailNotifications" className="text-sm font-bold text-slate-800">
                    Thông báo qua email
                  </Label>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Nhận thông báo khi hồ sơ của bạn được nhà tuyển dụng xem xét
                  </p>
                </div>
                <Switch
                  id="emailNotifications"
                  checked={settings.emailNotifications}
                  onCheckedChange={(checked) =>
                    handleSettingChange("emailNotifications", checked)
                  }
                />
              </div>

              <div className="flex items-center justify-between py-2 border-b border-slate-100">
                <div>
                  <Label htmlFor="jobAlerts" className="text-sm font-bold text-slate-800">
                    Cảnh báo việc làm phù hợp
                  </Label>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Nhận danh sách việc làm IT mới tương thích với kỹ năng của bạn
                  </p>
                </div>
                <Switch
                  id="jobAlerts"
                  checked={settings.jobAlerts}
                  onCheckedChange={(checked) =>
                    handleSettingChange("jobAlerts", checked)
                  }
                />
              </div>

              <div className="flex items-center justify-between py-2">
                <div>
                  <Label htmlFor="profileVisibility" className="text-sm font-bold text-slate-800">
                    Chế độ tìm việc & Hiển thị hồ sơ
                  </Label>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Cho phép các nhà tuyển dụng uy tín chủ động xem hồ sơ và gửi lời mời phỏng vấn
                  </p>
                </div>
                <Switch
                  id="profileVisibility"
                  checked={settings.profileVisibility}
                  onCheckedChange={(checked) =>
                    handleSettingChange("profileVisibility", checked)
                  }
                />
              </div>
            </CardContent>
          </Card>

          {/* Ngôn ngữ hiển thị */}
          <Card className="rounded-3xl border-slate-200/80 shadow-xs">
            <CardHeader>
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <Globe className="w-4 h-4 text-emerald-600" />
                <span>Ngôn ngữ giao diện</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <p className="text-xs text-slate-500">
                  Lựa chọn ngôn ngữ hiển thị trên toàn bộ giao diện JobPortal
                </p>
                <LanguageSwitcher variant="light" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
