"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Link } from "@/i18n/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Bell, Building2, Mail, Shield } from "lucide-react";

export default function RecruiterSettingsPage() {
  const { user } = useAuth();
  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    applicationUpdates: true,
  });

  const updatePreference = (key: keyof typeof preferences, value: boolean) => {
    setPreferences((current) => ({ ...current, [key]: value }));
  };

  const handleSave = () => {
    toast.success("Đã lưu các cài đặt nhà tuyển dụng thành công!");
  };

  return (
    <div className="max-w-3xl space-y-6">
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

      <Card className="rounded-3xl border-slate-200/80 shadow-xs">
        <CardHeader>
          <CardTitle className="text-base font-bold flex items-center gap-2">
            <Bell className="w-4 h-4 text-indigo-600" />
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
            <Button onClick={handleSave} className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs">
              Lưu tùy chọn
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
