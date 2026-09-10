"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { changePassword } from "@/lib/api/auth";
import { signOut } from "next-auth/react";
import { useRouter } from "@/i18n/navigation";
import { toast } from "sonner";
import { ShieldCheck, Lock, KeyRound, UserCheck, ShieldAlert } from "lucide-react";

export default function AdminSettingsPage() {
  const { user } = useAuth();
  const router = useRouter();

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
      toast.success("Đổi mật khẩu quản trị viên thành công! Vui lòng đăng nhập lại.");
      setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
      await signOut({ redirect: false });
      router.push("/candidate/auth/login");
    } catch {
      toast.error("Đổi mật khẩu thất bại. Vui lòng kiểm tra lại mật khẩu hiện tại.");
    } finally {
      setChangingPassword(false);
    }
  };

  return (
    <div className="max-w-4xl space-y-6">
      {/* Thông tin tài khoản Admin */}
      <Card className="rounded-3xl border-slate-200/80 shadow-xs bg-white">
        <CardHeader>
          <CardTitle className="text-base font-bold flex items-center gap-2 text-slate-900">
            <UserCheck className="w-4 h-4 text-purple-600" />
            <span>Thông tin Quản trị viên</span>
          </CardTitle>
          <CardDescription>
            Tài khoản quản trị cấp cao với toàn quyền giám sát và quản lý sàn JobPortal
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label className="text-xs font-semibold text-slate-500">Email quản trị</Label>
              <Input
                value={user?.email ?? ""}
                disabled
                className="mt-1 h-11 rounded-2xl bg-slate-100 text-slate-700 cursor-not-allowed font-medium"
              />
            </div>
            <div>
              <Label className="text-xs font-semibold text-slate-500">Họ và tên</Label>
              <Input
                value={user?.fullName ?? "Quản trị viên Hệ thống"}
                disabled
                className="mt-1 h-11 rounded-2xl bg-slate-100 text-slate-700 cursor-not-allowed font-medium"
              />
            </div>
          </div>
          <div className="p-3.5 rounded-2xl bg-purple-50 border border-purple-100 flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 text-purple-600 flex-shrink-0" />
            <p className="text-xs text-purple-900 font-medium">
              Tài khoản này có quyền can thiệp vào các thực thể hệ thống: duyệt công ty, quản lý người dùng, xử lý đơn ứng tuyển và cấu hình sàn.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Đổi mật khẩu Admin */}
      <Card className="rounded-3xl border-slate-200/80 shadow-xs bg-white">
        <CardHeader>
          <CardTitle className="text-base font-bold flex items-center gap-2 text-slate-900">
            <Lock className="w-4 h-4 text-indigo-600" />
            <span>Đổi mật khẩu Quản trị</span>
          </CardTitle>
          <CardDescription>
            Định kỳ đổi mật khẩu mạnh để bảo vệ tài khoản quản trị sàn
          </CardDescription>
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
              className="rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center gap-2"
            >
              <KeyRound className="w-3.5 h-3.5" />
              <span>{changingPassword ? "Đang xử lý..." : "Cập nhật mật khẩu"}</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
