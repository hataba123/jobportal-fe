"use client";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import {
  UserIcon,
  LockClosedIcon,
  BellIcon,
  ShieldCheckIcon,
  GlobeAltIcon,
} from "@heroicons/react/24/outline";

export default function SettingsPage() {
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

  const handlePasswordChange = () => {
    // TODO: Implement password change logic
    console.log("Change password:", passwordForm);
  };

  const handleSettingChange = (key: string, value: boolean) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="max-w-4xl mx-auto my-9">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Cài đặt tài khoản</h1>
        <p className="text-gray-600 mt-2">
          Quản lý thông tin tài khoản và cài đặt cá nhân
        </p>
      </div>

      <div className="space-y-6">
        {/* Thông tin tài khoản */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <UserIcon className="w-5 h-5 mr-2" />
              Thông tin tài khoản
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" value="nguyenvana@email.com" disabled />
              </div>
              <div>
                <Label htmlFor="phone">Số điện thoại</Label>
                <Input id="phone" value="0123456789" />
              </div>
            </div>
            <Button>Lưu thay đổi</Button>
          </CardContent>
        </Card>

        {/* Đổi mật khẩu */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <LockClosedIcon className="w-5 h-5 mr-2" />
              Đổi mật khẩu
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="currentPassword">Mật khẩu hiện tại</Label>
              <Input
                id="currentPassword"
                type="password"
                value={passwordForm.currentPassword}
                onChange={(e) =>
                  setPasswordForm({
                    ...passwordForm,
                    currentPassword: e.target.value,
                  })
                }
              />
            </div>
            <div>
              <Label htmlFor="newPassword">Mật khẩu mới</Label>
              <Input
                id="newPassword"
                type="password"
                value={passwordForm.newPassword}
                onChange={(e) =>
                  setPasswordForm({
                    ...passwordForm,
                    newPassword: e.target.value,
                  })
                }
              />
            </div>
            <div>
              <Label htmlFor="confirmPassword">Xác nhận mật khẩu mới</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={passwordForm.confirmPassword}
                onChange={(e) =>
                  setPasswordForm({
                    ...passwordForm,
                    confirmPassword: e.target.value,
                  })
                }
              />
            </div>
            <Button onClick={handlePasswordChange}>Đổi mật khẩu</Button>
          </CardContent>
        </Card>

        {/* Cài đặt thông báo */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BellIcon className="w-5 h-5 mr-2" />
              Cài đặt thông báo
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="emailNotifications">Thông báo qua email</Label>
                <p className="text-sm text-gray-600">
                  Nhận thông báo về đơn ứng tuyển qua email
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
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="jobAlerts">Cảnh báo việc làm mới</Label>
                <p className="text-sm text-gray-600">
                  Nhận thông báo về các việc làm phù hợp
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
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="marketingEmails">Email marketing</Label>
                <p className="text-sm text-gray-600">
                  Nhận thông tin về sản phẩm và dịch vụ
                </p>
              </div>
              <Switch
                id="marketingEmails"
                checked={settings.marketingEmails}
                onCheckedChange={(checked) =>
                  handleSettingChange("marketingEmails", checked)
                }
              />
            </div>
          </CardContent>
        </Card>

        {/* Quyền riêng tư */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <ShieldCheckIcon className="w-5 h-5 mr-2" />
              Quyền riêng tư
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="profileVisibility">Hiển thị hồ sơ</Label>
                <p className="text-sm text-gray-600">
                  Cho phép nhà tuyển dụng xem hồ sơ của bạn
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

        {/* Ngôn ngữ */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <GlobeAltIcon className="w-5 h-5 mr-2" />
              Ngôn ngữ
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4">
              <Button variant="outline">Tiếng Việt</Button>
              <Button variant="ghost">English</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
