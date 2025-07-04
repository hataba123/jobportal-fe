"use client";
import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  fetchMyProfile,
  updateMyProfile,
  uploadCv,
  deleteCv,
} from "@/lib/api/candidate-profile";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function CandidateProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    fullName: "",
    email: "",
    dob: "",
    education: "",
    experience: "",
    skills: "",
    gender: "",
    portfolioUrl: "",
    linkedinUrl: "",
    githubUrl: "",
    certificates: "",
    summary: "",
  });
  const [cvUrl, setCvUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchMyProfile().then(
      (data: Partial<import("@/types/CandidateProfile").CandidateProfiles>) => {
        setProfile({
          fullName: data.fullName || "",
          email: data.email || "",
          dob: data.dob ? data.dob.slice(0, 10) : "",
          education: data.education || "",
          experience: data.experience || "",
          skills: Array.isArray(data.skills)
            ? data.skills.join(", ")
            : data.skills || "",
          gender: data.gender || "",
          portfolioUrl: data.portfolioUrl || "",
          linkedinUrl: data.linkedinUrl || "",
          githubUrl: data.githubUrl || "",
          certificates: Array.isArray(data.certificates)
            ? data.certificates.join(", ")
            : data.certificates || "",
          summary: data.summary || "",
        });
        setCvUrl(data.resumeUrl || null);
      }
    );
  }, []);

  const handleSave = async () => {
    try {
      await updateMyProfile({
        fullName: profile.fullName,
        email: profile.email,
        dob: profile.dob,
        education: profile.education,
        experience: profile.experience,
        skills: profile.skills,
        gender: profile.gender,
        portfolioUrl: profile.portfolioUrl,
        linkedinUrl: profile.linkedinUrl,
        githubUrl: profile.githubUrl,
        certificates: profile.certificates,
        summary: profile.summary,
      });
      toast.success("Cập nhật hồ sơ thành công!");
      setIsEditing(false);
    } catch {
      toast.error("Cập nhật hồ sơ thất bại!");
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleUploadCv = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const url = await uploadCv(file);
      setCvUrl(url);
      toast.success("Tải lên CV thành công!");
    } catch {
      toast.error("Tải lên CV thất bại!");
    }
  };

  const handleDeleteCv = async () => {
    try {
      await deleteCv();
      setCvUrl(null);
      toast.success("Đã xóa CV!");
    } catch {
      toast.error("Xóa CV thất bại!");
    }
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

      {/* Quản lý CV */}
      <div className="mb-6">
        <h2 className="font-bold mb-2">CV của bạn</h2>
        {cvUrl ? (
          <div className="flex items-center space-x-4">
            <a
              href={`${process.env.NEXT_PUBLIC_API_URL?.replace(
                /\/api$/,
                ""
              )}${cvUrl}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline"
            >
              Xem CV
            </a>
            <button
              onClick={handleDeleteCv}
              className="text-red-600 hover:underline"
            >
              Xóa CV
            </button>
          </div>
        ) : (
          <div>
            <input
              type="file"
              accept="application/pdf"
              ref={fileInputRef}
              onChange={handleUploadCv}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              Nộp CV (PDF)
            </button>
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
                <Label htmlFor="dateOfBirth">Ngày sinh</Label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  value={profile.dob}
                  disabled={!isEditing}
                  onChange={(e) =>
                    setProfile({ ...profile, dob: e.target.value })
                  }
                />
              </div>
              <div>
                <Label htmlFor="gender">Giới tính</Label>
                <Select
                  value={profile.gender}
                  onValueChange={(value) =>
                    setProfile({ ...profile, gender: value })
                  }
                  disabled={!isEditing}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Chọn giới tính" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Nam</SelectItem>
                    <SelectItem value="female">Nữ</SelectItem>
                    <SelectItem value="other">Khác</SelectItem>
                  </SelectContent>
                </Select>
              </div>
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
              <Label htmlFor="certificates">Chứng chỉ</Label>
              <Textarea
                id="certificates"
                value={profile.certificates}
                disabled={!isEditing}
                onChange={(e) =>
                  setProfile({ ...profile, certificates: e.target.value })
                }
                rows={3}
                placeholder="Ví dụ: AWS Solutions Architect, IELTS 7.0, JLPT N2"
              />
            </div>
            <div>
              <Label htmlFor="bio">Giới thiệu bản thân</Label>
              <Textarea
                id="bio"
                value={profile.summary}
                disabled={!isEditing}
                onChange={(e) =>
                  setProfile({ ...profile, summary: e.target.value })
                }
                rows={4}
              />
            </div>
          </CardContent>
        </Card>

        {/* Liên kết */}
        <Card>
          <CardHeader>
            <CardTitle>Liên kết</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="portfolioUrl">Portfolio URL</Label>
              <Input
                id="portfolioUrl"
                type="url"
                value={profile.portfolioUrl}
                disabled={!isEditing}
                onChange={(e) =>
                  setProfile({ ...profile, portfolioUrl: e.target.value })
                }
                placeholder="https://your-portfolio.com"
              />
            </div>
            <div>
              <Label htmlFor="linkedinUrl">LinkedIn URL</Label>
              <Input
                id="linkedinUrl"
                type="url"
                value={profile.linkedinUrl}
                disabled={!isEditing}
                onChange={(e) =>
                  setProfile({ ...profile, linkedinUrl: e.target.value })
                }
                placeholder="https://linkedin.com/in/your-profile"
              />
            </div>
            <div>
              <Label htmlFor="githubUrl">GitHub URL</Label>
              <Input
                id="githubUrl"
                type="url"
                value={profile.githubUrl}
                disabled={!isEditing}
                onChange={(e) =>
                  setProfile({ ...profile, githubUrl: e.target.value })
                }
                placeholder="https://github.com/your-username"
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
