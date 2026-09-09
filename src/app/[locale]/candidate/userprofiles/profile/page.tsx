"use client";

import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import CandidateHeader from "@/components/candidate/CandidateHeader";
import {
  fetchMyProfile,
  updateMyProfile,
  uploadCv,
  deleteCv,
} from "@/lib/api/candidate-profile";
import { toast } from "sonner";
import { toBackendUrl } from "@/lib/api/url";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  User,
  FileText,
  Briefcase,
  GraduationCap,
  Sparkles,
  Link as LinkIcon,
  UploadCloud,
  ExternalLink,
  Trash2,
  CheckCircle2,
  Edit3,
} from "lucide-react";

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
  const [uploadingCv, setUploadingCv] = useState(false);
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
    setUploadingCv(true);
    try {
      const url = await uploadCv(file);
      setCvUrl(url);
      toast.success("Tải lên CV thành công!");
    } catch {
      toast.error("Tải lên CV thất bại! Chỉ chấp nhận file PDF hợp lệ.");
    } finally {
      setUploadingCv(false);
    }
  };

  const handleDeleteCv = async () => {
    if (!confirm("Bạn có chắc chắn muốn xóa CV hiện tại không?")) return;
    try {
      await deleteCv();
      setCvUrl(null);
      toast.success("Đã xóa CV thành công!");
    } catch {
      toast.error("Xóa CV thất bại!");
    }
  };

  // Profile completion score calculator
  const fields = [
    profile.fullName,
    profile.email,
    profile.dob,
    profile.education,
    profile.experience,
    profile.skills,
    profile.summary,
    cvUrl,
  ];
  const filledFields = fields.filter(Boolean).length;
  const completionPercentage = Math.round((filledFields / fields.length) * 100);

  return (
    <div className="min-h-screen bg-slate-50/60 pb-16">
      <CandidateHeader />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        {/* Header Title & Action */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Hồ sơ năng lực cá nhân
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Hoàn thiện thông tin để tăng cơ hội kết nối với các nhà tuyển dụng công nghệ
            </p>
          </div>
          {!isEditing ? (
            <Button
              onClick={() => setIsEditing(true)}
              className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs self-start sm:self-auto"
            >
              <Edit3 className="w-4 h-4 mr-1.5" />
              Chỉnh sửa hồ sơ
            </Button>
          ) : (
            <div className="flex items-center gap-2 self-start sm:self-auto">
              <Button variant="outline" onClick={handleCancel} className="rounded-xl text-xs">
                Hủy
              </Button>
              <Button onClick={handleSave} className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs">
                Lưu thay đổi
              </Button>
            </div>
          )}
        </div>

        {/* Profile Completeness Progress Banner */}
        <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-xs mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 font-extrabold text-sm flex items-center justify-center flex-shrink-0">
              {completionPercentage}%
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900">
                Mức độ hoàn thiện hồ sơ: {completionPercentage}%
              </h3>
              <p className="text-xs text-slate-500">
                {completionPercentage < 100
                  ? "Hãy cập nhật thêm kỹ năng, học vấn và tải lên CV để hồ sơ nổi bật hơn"
                  : "Hồ sơ của bạn đã sẵn sàng tiếp cận các cơ hội việc làm tốt nhất"}
              </p>
            </div>
          </div>
          <div className="w-full sm:w-48 bg-slate-100 rounded-full h-2.5 overflow-hidden">
            <div
              className="bg-gradient-to-r from-blue-600 to-indigo-600 h-2.5 rounded-full transition-all duration-500"
              style={{ width: `${completionPercentage}%` }}
            ></div>
          </div>
        </div>

        {/* CV Upload Section */}
        <Card className="rounded-3xl border-slate-200/80 shadow-xs mb-8 overflow-hidden">
          <CardHeader>
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <FileText className="w-4 h-4 text-blue-600" />
              <span>CV / Sơ yếu lý lịch ứng tuyển</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {cvUrl ? (
              <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-200/70 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center flex-shrink-0">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-blue-950">CV đã lưu trên hệ thống</p>
                    <p className="text-xs text-blue-700">Định dạng PDF sẵn sàng nộp vào các bài đăng</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 self-end sm:self-auto">
                  <a
                    href={toBackendUrl(cvUrl)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white text-blue-600 font-semibold text-xs border border-blue-200 hover:bg-blue-50 transition-colors shadow-2xs"
                  >
                    <span>Xem CV</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleDeleteCv}
                    className="text-xs text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-xl"
                  >
                    <Trash2 className="w-3.5 h-3.5 mr-1" />
                    Xóa CV
                  </Button>
                </div>
              </div>
            ) : (
              <div className="p-8 rounded-2xl border-2 border-dashed border-slate-200 hover:border-blue-500/50 bg-slate-50/50 hover:bg-blue-50/20 text-center transition-all">
                <input
                  type="file"
                  accept="application/pdf"
                  ref={fileInputRef}
                  onChange={handleUploadCv}
                  className="hidden"
                />
                <UploadCloud className="w-10 h-10 text-slate-400 mx-auto mb-2" />
                <p className="text-sm font-bold text-slate-800">
                  Tải lên bản CV cá nhân định dạng PDF
                </p>
                <p className="text-xs text-slate-500 mt-1 mb-4">
                  Dung lượng tối đa 5MB. CV sẽ được dùng để ứng tuyển nhanh
                </p>
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploadingCv}
                  className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs"
                >
                  {uploadingCv ? "Đang tải lên..." : "Chọn file PDF từ máy tính"}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Form Sections */}
        <div className="space-y-6">
          {/* Thông tin cơ bản */}
          <Card className="rounded-3xl border-slate-200/80 shadow-xs">
            <CardHeader>
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <User className="w-4 h-4 text-blue-600" />
                <span>Thông tin cá nhân</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="fullName" className="text-xs font-semibold text-slate-500">
                    Họ và tên
                  </Label>
                  <Input
                    id="fullName"
                    value={profile.fullName}
                    disabled={!isEditing}
                    onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                    className="mt-1 h-11 rounded-2xl border-slate-200"
                  />
                </div>
                <div>
                  <Label htmlFor="email" className="text-xs font-semibold text-slate-500">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={profile.email}
                    disabled={!isEditing}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                    className="mt-1 h-11 rounded-2xl border-slate-200"
                  />
                </div>
                <div>
                  <Label htmlFor="dateOfBirth" className="text-xs font-semibold text-slate-500">
                    Ngày sinh
                  </Label>
                  <Input
                    id="dateOfBirth"
                    type="date"
                    value={profile.dob}
                    disabled={!isEditing}
                    onChange={(e) => setProfile({ ...profile, dob: e.target.value })}
                    className="mt-1 h-11 rounded-2xl border-slate-200"
                  />
                </div>
                <div>
                  <Label htmlFor="gender" className="text-xs font-semibold text-slate-500">
                    Giới tính
                  </Label>
                  <Select
                    value={profile.gender}
                    onValueChange={(value) => setProfile({ ...profile, gender: value })}
                    disabled={!isEditing}
                  >
                    <SelectTrigger className="mt-1 h-11 rounded-2xl border-slate-200">
                      <SelectValue placeholder="Chọn giới tính" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl shadow-xl">
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
          <Card className="rounded-3xl border-slate-200/80 shadow-xs">
            <CardHeader>
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-indigo-600" />
                <span>Năng lực chuyên môn & Kỹ năng</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="education" className="text-xs font-semibold text-slate-500">
                  Học vấn / Bằng cấp cao nhất
                </Label>
                <Input
                  id="education"
                  value={profile.education}
                  disabled={!isEditing}
                  onChange={(e) => setProfile({ ...profile, education: e.target.value })}
                  placeholder="Ví dụ: Đại học Bách Khoa TP.HCM - Kỹ thuật Phần mềm"
                  className="mt-1 h-11 rounded-2xl border-slate-200"
                />
              </div>

              <div>
                <Label htmlFor="experience" className="text-xs font-semibold text-slate-500">
                  Kinh nghiệm làm việc
                </Label>
                <Textarea
                  id="experience"
                  value={profile.experience}
                  disabled={!isEditing}
                  onChange={(e) => setProfile({ ...profile, experience: e.target.value })}
                  rows={3}
                  placeholder="Mô tả các vị trí, công ty hoặc dự án bạn từng tham gia..."
                  className="mt-1 rounded-2xl border-slate-200 resize-none text-xs"
                />
              </div>

              <div>
                <Label htmlFor="skills" className="text-xs font-semibold text-slate-500">
                  Kỹ năng công nghệ (Phân cách bằng dấu phẩy)
                </Label>
                <Textarea
                  id="skills"
                  value={profile.skills}
                  disabled={!isEditing}
                  onChange={(e) => setProfile({ ...profile, skills: e.target.value })}
                  rows={2}
                  placeholder="Ví dụ: React, TypeScript, Next.js, Node.js, Docker, PostgreSQL"
                  className="mt-1 rounded-2xl border-slate-200 resize-none text-xs"
                />
              </div>

              <div>
                <Label htmlFor="certificates" className="text-xs font-semibold text-slate-500">
                  Chứng chỉ chuyên môn
                </Label>
                <Textarea
                  id="certificates"
                  value={profile.certificates}
                  disabled={!isEditing}
                  onChange={(e) => setProfile({ ...profile, certificates: e.target.value })}
                  rows={2}
                  placeholder="Ví dụ: AWS Certified Solutions Architect, IELTS 7.5, JLPT N2"
                  className="mt-1 rounded-2xl border-slate-200 resize-none text-xs"
                />
              </div>

              <div>
                <Label htmlFor="bio" className="text-xs font-semibold text-slate-500">
                  Giới thiệu bản thân (Summary)
                </Label>
                <Textarea
                  id="bio"
                  value={profile.summary}
                  disabled={!isEditing}
                  onChange={(e) => setProfile({ ...profile, summary: e.target.value })}
                  rows={3}
                  placeholder="Tóm tắt điểm mạnh, định hướng nghề nghiệp và đam mê công nghệ..."
                  className="mt-1 rounded-2xl border-slate-200 resize-none text-xs"
                />
              </div>
            </CardContent>
          </Card>

          {/* Liên kết mạng xã hội & Portfolio */}
          <Card className="rounded-3xl border-slate-200/80 shadow-xs">
            <CardHeader>
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <LinkIcon className="w-4 h-4 text-emerald-600" />
                <span>Liên kết Portfolio & Mạng xã hội</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="portfolioUrl" className="text-xs font-semibold text-slate-500">
                    Portfolio URL
                  </Label>
                  <Input
                    id="portfolioUrl"
                    type="url"
                    value={profile.portfolioUrl}
                    disabled={!isEditing}
                    onChange={(e) => setProfile({ ...profile, portfolioUrl: e.target.value })}
                    placeholder="https://yourportfolio.dev"
                    className="mt-1 h-11 rounded-2xl border-slate-200 text-xs"
                  />
                </div>
                <div>
                  <Label htmlFor="linkedinUrl" className="text-xs font-semibold text-slate-500">
                    LinkedIn Profile
                  </Label>
                  <Input
                    id="linkedinUrl"
                    type="url"
                    value={profile.linkedinUrl}
                    disabled={!isEditing}
                    onChange={(e) => setProfile({ ...profile, linkedinUrl: e.target.value })}
                    placeholder="https://linkedin.com/in/username"
                    className="mt-1 h-11 rounded-2xl border-slate-200 text-xs"
                  />
                </div>
                <div>
                  <Label htmlFor="githubUrl" className="text-xs font-semibold text-slate-500">
                    GitHub Profile
                  </Label>
                  <Input
                    id="githubUrl"
                    type="url"
                    value={profile.githubUrl}
                    disabled={!isEditing}
                    onChange={(e) => setProfile({ ...profile, githubUrl: e.target.value })}
                    placeholder="https://github.com/username"
                    className="mt-1 h-11 rounded-2xl border-slate-200 text-xs"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
