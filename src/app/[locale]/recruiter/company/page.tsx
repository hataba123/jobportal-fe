"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { 
  Building, 
  MapPin, 
  Users, 
  Star, 
  Calendar,
  Edit,
  ExternalLink,
  ShieldCheck,
} from "lucide-react";
import { 
  fetchMyCompany,
  updateMyCompany,
  type CompanyDto
} from "@/lib/api/recruiter-dashboard";
import { Link } from "@/i18n/navigation";
import CompanyLogo from "@/components/common/CompanyLogo";
import { toast } from "sonner";

export default function RecruiterCompanyPage() {
  const [company, setCompany] = useState<CompanyDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editForm, setEditForm] = useState<Partial<CompanyDto>>({});

  useEffect(() => {
    fetchCompanyData();
  }, []);

  const fetchCompanyData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await fetchMyCompany();
      setCompany(data);
      setEditForm(data);
    } catch (err) {
      console.error("Error fetching company data:", err);
      setError("Không thể tải thông tin công ty");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateCompany = async () => {
    try {
      await updateMyCompany(editForm, company?.version);
      setIsEditDialogOpen(false);
      toast.success("Cập nhật thông tin công ty thành công!");
      fetchCompanyData();
    } catch (err) {
      console.error("Error updating company:", err);
      toast.error("Không thể cập nhật thông tin công ty.");
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-end">
          <Skeleton className="h-10 w-36 rounded-xl" />
        </div>
        <Card className="rounded-2xl border-slate-200">
          <CardContent className="p-8 space-y-6">
            <div className="flex items-center gap-6">
              <Skeleton className="h-20 w-20 rounded-2xl" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-7 w-64 rounded-lg" />
                <Skeleton className="h-4 w-48 rounded-lg" />
              </div>
            </div>
            <Skeleton className="h-24 w-full rounded-xl" />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Skeleton className="h-16 rounded-xl" />
              <Skeleton className="h-16 rounded-xl" />
              <Skeleton className="h-16 rounded-xl" />
              <Skeleton className="h-16 rounded-xl" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error && !company) {
    return (
      <div className="flex items-center justify-center p-12 bg-white rounded-2xl border border-slate-200">
        <div className="text-center">
          <p className="text-rose-600 mb-4 text-sm font-medium">{error}</p>
          <Button onClick={fetchCompanyData} className="rounded-xl">Thử lại</Button>
        </div>
      </div>
    );
  }

  if (!company) {
    return (
      <div className="flex items-center justify-center p-12 bg-white rounded-2xl border border-slate-200">
        <div className="text-center max-w-sm">
          <Building className="h-12 w-12 mx-auto mb-3 text-slate-300" />
          <h3 className="text-base font-bold text-slate-900 mb-1">Chưa có thông tin công ty</h3>
          <p className="text-xs text-slate-500 mb-4">
            Doanh nghiệp của bạn chưa được liên kết thông tin. Vui lòng liên hệ bộ phận hỗ trợ hoặc cập nhật hồ sơ.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Action Toolbar */}
      <div className="flex items-center justify-end gap-3">
        <Link href={`/candidate/company/${company.id}`} target="_blank">
          <Button variant="outline" className="rounded-xl border-slate-200 text-xs font-semibold">
            <ExternalLink className="h-4 w-4 mr-1.5 text-slate-500" />
            Xem trang công khai
          </Button>
        </Link>

        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogTrigger asChild>
            <Button className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs">
              <Edit className="h-4 w-4 mr-1.5" />
              Chỉnh sửa hồ sơ
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl rounded-2xl p-6">
            <DialogHeader>
              <DialogTitle className="text-lg font-bold">Chỉnh sửa thông tin công ty</DialogTitle>
              <DialogDescription className="text-xs text-slate-500">
                Cập nhật thông tin thương hiệu, quy mô và địa chỉ làm việc
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4 max-h-[70vh] overflow-y-auto pr-2">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name" className="text-xs font-semibold">Tên công ty</Label>
                  <Input
                    id="name"
                    value={editForm.name || ""}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    className="mt-1 rounded-xl"
                  />
                </div>
                <div>
                  <Label htmlFor="location" className="text-xs font-semibold">Địa điểm làm việc</Label>
                  <Input
                    id="location"
                    value={editForm.location || ""}
                    onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                    className="mt-1 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="description" className="text-xs font-semibold">Mô tả doanh nghiệp</Label>
                <Textarea
                  id="description"
                  rows={4}
                  value={editForm.description || ""}
                  onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                  className="mt-1 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="employees" className="text-xs font-semibold">Quy mô nhân sự</Label>
                  <Input
                    id="employees"
                    type="number"
                    value={editForm.employees || ""}
                    onChange={(e) => setEditForm({ ...editForm, employees: parseInt(e.target.value) || 0 })}
                    className="mt-1 rounded-xl"
                  />
                </div>
                <div>
                  <Label htmlFor="industry" className="text-xs font-semibold">Lĩnh vực hoạt động</Label>
                  <Input
                    id="industry"
                    value={editForm.industry || ""}
                    onChange={(e) => setEditForm({ ...editForm, industry: e.target.value })}
                    className="mt-1 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="website" className="text-xs font-semibold">Địa chỉ Website</Label>
                  <Input
                    id="website"
                    value={editForm.website || ""}
                    onChange={(e) => setEditForm({ ...editForm, website: e.target.value })}
                    className="mt-1 rounded-xl"
                  />
                </div>
                <div>
                  <Label htmlFor="founded" className="text-xs font-semibold">Năm thành lập</Label>
                  <Input
                    id="founded"
                    type="number"
                    value={editForm.founded || ""}
                    onChange={(e) => setEditForm({ ...editForm, founded: parseInt(e.target.value) || 0 })}
                    className="mt-1 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="logo" className="text-xs font-semibold">Logo URL</Label>
                <Input
                  id="logo"
                  type="url"
                  placeholder="https://... hoặc /uploads/logo/..."
                  value={editForm.logo || ""}
                  onChange={(e) => setEditForm({ ...editForm, logo: e.target.value })}
                  className="mt-1 rounded-xl"
                />
              </div>

              <div>
                <Label htmlFor="tags" className="text-xs font-semibold">Tags (cách nhau bởi dấu phẩy)</Label>
                <Input
                  id="tags"
                  value={Array.isArray(editForm.tags) ? editForm.tags.join(", ") : ""}
                  onChange={(e) => setEditForm({
                    ...editForm,
                    tags: e.target.value.split(",").map(tag => tag.trim()).filter(Boolean)
                  })}
                  className="mt-1 rounded-xl"
                />
              </div>
            </div>
            <DialogFooter className="gap-2">
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)} className="rounded-xl">
                Hủy
              </Button>
              <Button onClick={handleUpdateCompany} className="rounded-xl bg-blue-600 hover:bg-blue-700">
                Lưu thay đổi
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Main Profile Showcase Card */}
      <Card className="rounded-2xl border-slate-200/80 shadow-xs overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-blue-600 via-indigo-600 to-slate-900"></div>
        <CardContent className="px-8 pb-8 pt-0 relative">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between -mt-12 mb-6 gap-4">
            <div className="flex items-end gap-5">
              <div className="w-24 h-24 rounded-2xl bg-white p-1 shadow-lg border border-slate-200 flex-shrink-0">
                <CompanyLogo
                  src={company.logo}
                  name={company.name}
                  size="lg"
                  className="w-full h-full rounded-xl"
                />
              </div>
              <div className="pb-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-2xl font-extrabold text-slate-900">{company.name}</h2>
                  <Badge variant="secondary" className="bg-emerald-50 text-emerald-700 border-emerald-200 text-xs font-semibold gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Doanh nghiệp đã xác thực
                  </Badge>
                </div>
                <p className="text-xs text-slate-500 mt-1 flex items-center gap-3 flex-wrap">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    {company.location || "Chưa cập nhật"}
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-slate-400" />
                    {company.employees || 0} nhân sự
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    Thành lập: {company.founded || "N/A"}
                  </span>
                </p>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="border-t border-slate-100 pt-6 space-y-6">
            <div>
              <h4 className="text-sm font-bold text-slate-900 mb-2">Giới thiệu công ty</h4>
              <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                {company.description || "Doanh nghiệp chưa bổ sung phần giới thiệu chi tiết."}
              </p>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-xs text-slate-400 font-medium">Lĩnh vực</span>
                <p className="text-sm font-bold text-slate-800 mt-0.5">{company.industry || "Công nghệ"}</p>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-xs text-slate-400 font-medium">Việc làm đang tuyển</span>
                <p className="text-sm font-bold text-blue-600 mt-0.5">{company.openJobs || 0} vị trí</p>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-xs text-slate-400 font-medium">Đánh giá trung bình</span>
                <div className="flex items-center gap-1 mt-0.5">
                  <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                  <span className="text-sm font-bold text-slate-800">{company.rating?.toFixed(1) || "5.0"}</span>
                </div>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-xs text-slate-400 font-medium">Website</span>
                <p className="text-sm font-bold text-slate-800 mt-0.5 truncate">
                  {company.website ? (
                    <a href={company.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                      {company.website.replace(/^https?:\/\//, '')}
                    </a>
                  ) : "Chưa có"}
                </p>
              </div>
            </div>

            {/* Tags */}
            {Array.isArray(company.tags) && company.tags.length > 0 && (
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Từ khóa nhận diện</h4>
                <div className="flex flex-wrap gap-2">
                  {company.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="bg-slate-100 text-slate-700 text-xs px-3 py-1 rounded-lg">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
