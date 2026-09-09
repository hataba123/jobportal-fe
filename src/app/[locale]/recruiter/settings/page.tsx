"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Link } from "@/i18n/navigation";
import { useAuth } from "@/contexts/AuthContext";

export default function RecruiterSettingsPage() {
  const { user } = useAuth();
  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    applicationUpdates: true,
  });
  const [saved, setSaved] = useState(false);

  const updatePreference = (key: keyof typeof preferences, value: boolean) => {
    setSaved(false);
    setPreferences((current) => ({ ...current, [key]: value }));
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Tài khoản nhà tuyển dụng</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Email đăng nhập</Label>
            <p className="mt-1 text-sm text-muted-foreground">
              {user?.email ?? "Chưa xác định"}
            </p>
          </div>
          <Link href="/recruiter/company">
            <Button variant="outline">Cập nhật hồ sơ công ty</Button>
          </Link>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Thông báo</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="flex items-center justify-between gap-4">
            <div>
              <Label htmlFor="email-notifications">Thông báo qua email</Label>
              <p className="text-sm text-muted-foreground">
                Nhận thông tin quan trọng về hoạt động tuyển dụng.
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
          <div className="flex items-center justify-between gap-4">
            <div>
              <Label htmlFor="application-updates">Cập nhật đơn ứng tuyển</Label>
              <p className="text-sm text-muted-foreground">
                Nhận thông báo khi ứng viên gửi hoặc thay đổi trạng thái đơn.
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
          <div className="flex items-center gap-3">
            <Button onClick={() => setSaved(true)}>Lưu tùy chọn</Button>
            {saved && (
              <span className="text-sm text-green-700">Đã lưu trên trình duyệt.</span>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
