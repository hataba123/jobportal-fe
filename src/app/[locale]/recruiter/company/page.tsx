"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { 
  Building, 
  MapPin, 
  Users, 
  Star, 
  Globe, 
  Calendar,
  Edit,
  Trash2,
  Save,
} from "lucide-react";
import { 
  fetchMyCompany,
  updateMyCompany,
  deleteMyCompany,
  type CompanyDto
} from "@/lib/api/recruiter-dashboard";

export default function RecruiterCompanyPage() {
  const [company, setCompany] = useState<CompanyDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
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
    } catch (error) {
      console.error("Error fetching company data:", error);
      setError("Không thể tải thông tin công ty");
      // Fallback to mock data for development
      setMockData();
    } finally {
      setLoading(false);
    }
  };

  const setMockData = () => {
    const mockCompany: CompanyDto = {
      id: "1",
      name: "TechCorp Vietnam",
      logo: "/placeholder.svg",
      description: "Công ty công nghệ hàng đầu tại Việt Nam, chuyên về phát triển phần mềm và giải pháp số.",
      location: "Ho Chi Minh City",
      employees: 150,
      industry: "Technology",
      openJobs: 8,
      rating: 4.5,
      website: "https://techcorp.vn",
      founded: 2018,
      tags: ["Technology", "Software", "Innovation", "Startup"]
    };
    setCompany(mockCompany);
    setEditForm(mockCompany);
  };

  const handleUpdateCompany = async () => {
    try {
      await updateMyCompany(editForm);
      setIsEditDialogOpen(false);
      fetchCompanyData(); // Refresh data
    } catch (error) {
      console.error("Error updating company:", error);
      setError("Không thể cập nhật thông tin công ty");
    }
  };

  const handleDeleteCompany = async () => {
    try {
      await deleteMyCompany();
      setIsDeleteDialogOpen(false);
      setCompany(null);
    } catch (error) {
      console.error("Error deleting company:", error);
      setError("Không thể xóa công ty");
    }
  };

  const formatDate = (year: number) => {
    return new Date(year, 0, 1).getFullYear().toString();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error && !company) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={fetchCompanyData}>Thử lại</Button>
        </div>
      </div>
    );
  }

  if (!company) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Building className="h-12 w-12 mx-auto mb-4 text-gray-300" />
          <h2 className="text-xl font-semibold mb-2">Chưa có thông tin công ty</h2>
          <p className="text-gray-600 mb-4">Vui lòng liên hệ admin để thiết lập thông tin công ty</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Thông tin công ty</h1>
          <p className="text-gray-600">Quản lý thông tin công ty của bạn</p>
        </div>
        <div className="flex space-x-2">
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Edit className="h-4 w-4 mr-2" />
                Chỉnh sửa
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Chỉnh sửa thông tin công ty</DialogTitle>
                <DialogDescription>
                  Cập nhật thông tin công ty của bạn
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Tên công ty</Label>
                    <Input
                      id="name"
                      value={editForm.name || ""}
                      onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="location">Địa điểm</Label>
                    <Input
                      id="location"
                      value={editForm.location || ""}
                      onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="description">Mô tả</Label>
                  <Textarea
                    id="description"
                    rows={4}
                    value={editForm.description || ""}
                    onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="employees">Số nhân viên</Label>
                    <Input
                      id="employees"
                      type="number"
                      value={editForm.employees || ""}
                      onChange={(e) => setEditForm({ ...editForm, employees: parseInt(e.target.value) })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="industry">Ngành nghề</Label>
                    <Input
                      id="industry"
                      value={editForm.industry || ""}
                      onChange={(e) => setEditForm({ ...editForm, industry: e.target.value })}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="website">Website</Label>
                    <Input
                      id="website"
                      value={editForm.website || ""}
                      onChange={(e) => setEditForm({ ...editForm, website: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="founded">Năm thành lập</Label>
                    <Input
                      id="founded"
                      type="number"
                      value={editForm.founded || ""}
                      onChange={(e) => setEditForm({ ...editForm, founded: parseInt(e.target.value) })}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="tags">Tags (cách nhau bởi dấu phẩy)</Label>
                  <Input
                    id="tags"
                    value={Array.isArray(editForm.tags) ? editForm.tags.join(", ") : ""}
                    onChange={(e) => setEditForm({
                      ...editForm,
                      tags: e.target.value.split(",").map(tag => tag.trim())
                    })}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  Hủy
                </Button>
                <Button onClick={handleUpdateCompany}>
                  <Save className="h-4 w-4 mr-2" />
                  Lưu thay đổi
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">
                <Trash2 className="h-4 w-4 mr-2" />
                Xóa công ty
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Bạn có chắc chắn muốn xóa?</AlertDialogTitle>
                <AlertDialogDescription>
                  Hành động này không thể hoàn tác. Công ty sẽ bị xóa vĩnh viễn.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Hủy</AlertDialogCancel>
                <AlertDialogAction onClick={handleDeleteCompany} className="bg-red-600">
                  Xóa
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      {/* Company Information */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Info */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 rounded-lg bg-gray-200 flex items-center justify-center">
                  <Building className="h-8 w-8 text-gray-600" />
                </div>
                <div>
                  <CardTitle className="text-2xl">{company.name}</CardTitle>
                  <div className="flex items-center space-x-2 text-gray-600">
                    <MapPin className="h-4 w-4" />
                    <span>{company.location}</span>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Mô tả</h3>
                <p className="text-gray-700">{company.description}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600">{company.employees} nhân viên</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Building className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600">{company.industry}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600">Thành lập {formatDate(company.founded)}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Globe className="h-4 w-4 text-gray-500" />
                  <a 
                    href={company.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:underline"
                  >
                    Website
                  </a>
                </div>
              </div>

              {company.tags && company.tags.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-2">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {company.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Stats */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Thống kê</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Việc làm đang mở</span>
                <Badge variant="outline">{company.openJobs}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Đánh giá</span>
                <div className="flex items-center space-x-1">
                  <Star className="h-4 w-4 text-yellow-500 fill-current" />
                  <span className="text-sm font-medium">{company.rating}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Hành động nhanh</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button className="w-full" variant="outline">
                <Edit className="h-4 w-4 mr-2" />
                Chỉnh sửa thông tin
              </Button>
              <Button className="w-full" variant="outline">
                <Building className="h-4 w-4 mr-2" />
                Quản lý việc làm
              </Button>
              <Button className="w-full" variant="outline">
                <Users className="h-4 w-4 mr-2" />
                Xem ứng viên
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 