"use client";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function CandidateProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    fullName: "Nguyễn Văn A",
    email: "nguyenvana@email.com",
    phone: "0123456789",
    address: "Hà Nội, Việt Nam",
    dateOfBirth: "1990-01-01",
    education: "Đại học Bách Khoa Hà Nội",
    experience: "5 năm kinh nghiệm trong lĩnh vực IT",
    skills: "JavaScript, React, Node.js, TypeScript",
    bio: "Tôi là một lập trình viên fullstack với 5 năm kinh nghiệm...",
  });

  const handleSave = () => {
    // TODO: Implement save logic
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  return (
    <div className="max-w-4xl mx-auto my-9">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Hồ sơ cá nhân</h1>
        {!isEditing ? (
          <Button onClick={() => setIsEditing(true)}>Chỉnh sửa hồ sơ</Button>
        ) : (
          <div className="space-x-2">
            <Button variant="outline" onClick={handleCancel}>
              Hủy
            </Button>
            <Button onClick={handleSave}>Lưu thay đổi</Button>
          </div>
        )}
      </div>

      <div className="grid gap-6">
        {/* Thông tin cơ bản */}
        <Card>
          <CardHeader>
            <CardTitle>Thông tin cơ bản</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="fullName">Họ và tên</Label>
                <Input
                  id="fullName"
                  value={profile.fullName}
                  disabled={!isEditing}
                  onChange={(e) =>
                    setProfile({ ...profile, fullName: e.target.value })
                  }
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={profile.email}
                  disabled={!isEditing}
                  onChange={(e) =>
                    setProfile({ ...profile, email: e.target.value })
                  }
                />
              </div>
              <div>
                <Label htmlFor="phone">Số điện thoại</Label>
                <Input
                  id="phone"
                  value={profile.phone}
                  disabled={!isEditing}
                  onChange={(e) =>
                    setProfile({ ...profile, phone: e.target.value })
                  }
                />
              </div>
              <div>
                <Label htmlFor="dateOfBirth">Ngày sinh</Label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  value={profile.dateOfBirth}
                  disabled={!isEditing}
                  onChange={(e) =>
                    setProfile({ ...profile, dateOfBirth: e.target.value })
                  }
                />
              </div>
            </div>
            <div>
              <Label htmlFor="address">Địa chỉ</Label>
              <Input
                id="address"
                value={profile.address}
                disabled={!isEditing}
                onChange={(e) =>
                  setProfile({ ...profile, address: e.target.value })
                }
              />
            </div>
          </CardContent>
        </Card>

        {/* Thông tin nghề nghiệp */}
        <Card>
          <CardHeader>
            <CardTitle>Thông tin nghề nghiệp</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="education">Học vấn</Label>
              <Input
                id="education"
                value={profile.education}
                disabled={!isEditing}
                onChange={(e) =>
                  setProfile({ ...profile, education: e.target.value })
                }
              />
            </div>
            <div>
              <Label htmlFor="experience">Kinh nghiệm</Label>
              <Textarea
                id="experience"
                value={profile.experience}
                disabled={!isEditing}
                onChange={(e) =>
                  setProfile({ ...profile, experience: e.target.value })
                }
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="skills">Kỹ năng</Label>
              <Textarea
                id="skills"
                value={profile.skills}
                disabled={!isEditing}
                onChange={(e) =>
                  setProfile({ ...profile, skills: e.target.value })
                }
                rows={3}
                placeholder="Ví dụ: JavaScript, React, Node.js, TypeScript"
              />
            </div>
            <div>
              <Label htmlFor="bio">Giới thiệu bản thân</Label>
              <Textarea
                id="bio"
                value={profile.bio}
                disabled={!isEditing}
                onChange={(e) =>
                  setProfile({ ...profile, bio: e.target.value })
                }
                rows={4}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
