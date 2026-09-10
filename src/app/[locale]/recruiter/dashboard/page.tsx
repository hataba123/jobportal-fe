"use client";

import React, { useEffect, useState, useCallback } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Briefcase,
  Users,
  FileText,
  TrendingUp,
  Calendar,
  Plus,
  Eye,
  UserCheck,
  Download,
} from "lucide-react";
import { Link } from "@/i18n/navigation";
import {
  fetchRecruiterDashboard,
  type RecruiterDashboardDto,
} from "@/lib/api/recruiter-dashboard";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export default function RecruiterDashboardPage() {
  const [dashboardData, setDashboardData] =
    useState<RecruiterDashboardDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchDashboardData = useCallback(async () => {
    if (!user?.id) {
      setError("Không tìm thấy thông tin người dùng");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const data = await fetchRecruiterDashboard(user.id);
      setDashboardData(data);
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
      setError("Không thể tải dữ liệu dashboard");
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    if (user?.id) {
      fetchDashboardData();
    }
  }, [user?.id, fetchDashboardData]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleExportSummary = () => {
    if (!dashboardData) return;
    try {
      const rows = [
        ["Chi so", "Gia tri"],
        ["Tong so tin tuyen dung", String(dashboardData.totalJobPosts)],
        ["Tong so luot ung tuyen", String(dashboardData.totalApplicants)],
        [
          "Ung vien trung binh / tin",
          dashboardData.totalJobPosts > 0
            ? (dashboardData.totalApplicants / dashboardData.totalJobPosts).toFixed(1)
            : "0.0",
        ],
        [],
        ["Tin tuyen dung gan day", "Ngay dang", "So ung vien"],
        ...(dashboardData.recentJobPosts || []).map((j) => [
          j.title,
          j.createdAt ? new Date(j.createdAt).toLocaleDateString("vi-VN") : "",
          String(j.applicants || 0),
        ]),
        [],
        ["Ung vien gan day", "Email", "Vi tri", "Ngay nop"],
        ...(dashboardData.recentApplicants || []).map((a) => [
          a.fullName,
          a.email,
          a.jobTitle,
          a.appliedAt ? new Date(a.appliedAt).toLocaleDateString("vi-VN") : "",
        ]),
      ];

      const csvContent =
        "data:text/csv;charset=utf-8,\uFEFF" +
        rows.map((e) => e.map((val) => `"${val.replace(/"/g, '""')}"`).join(",")).join("\n");

      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `bao-cao-tuyen-dung-${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success("Xuất báo cáo tổng quan thành công!");
    } catch {
      toast.error("Không thể xuất file báo cáo.");
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-end gap-3">
          <Skeleton className="h-10 w-32 rounded-xl" />
          <Skeleton className="h-10 w-44 rounded-xl" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Skeleton className="h-32 rounded-2xl" />
          <Skeleton className="h-32 rounded-2xl" />
          <Skeleton className="h-32 rounded-2xl" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Skeleton className="h-80 rounded-2xl" />
          <Skeleton className="h-80 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (error && !dashboardData) {
    return (
      <div className="flex items-center justify-center p-12 bg-white rounded-3xl border border-slate-200">
        <div className="text-center">
          <p className="text-rose-600 mb-4 text-sm font-medium">{error}</p>
          <Button onClick={fetchDashboardData} className="rounded-xl">Thử lại</Button>
        </div>
      </div>
    );
  }

  const avgApplicants =
    dashboardData?.totalJobPosts && dashboardData.totalJobPosts > 0
      ? (dashboardData.totalApplicants / dashboardData.totalJobPosts).toFixed(1)
      : "0.0";

  return (
    <div className="space-y-6">
      {/* Top Action Bar (No duplicate H1, layout already renders currentMeta.title) */}
      <div className="flex items-center justify-end gap-3">
        <Button
          variant="outline"
          onClick={handleExportSummary}
          className="rounded-xl border-slate-200 hover:bg-slate-50 text-xs font-semibold"
        >
          <Download className="h-4 w-4 mr-1.5 text-slate-500" />
          Xuất báo cáo (CSV)
        </Button>
        <Link href="/recruiter/jobs">
          <Button className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs">
            <Plus className="h-4 w-4 mr-1.5" />
            Đăng việc làm mới
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="rounded-2xl border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Tổng số việc làm
            </CardTitle>
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Briefcase className="h-5 w-5" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold text-slate-900">
              {dashboardData?.totalJobPosts || 0}
            </div>
            <p className="text-xs text-slate-500 mt-1">Tin tuyển dụng đã đăng</p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Tổng số hồ sơ ứng tuyển
            </CardTitle>
            <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Users className="h-5 w-5" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold text-slate-900">
              {dashboardData?.totalApplicants || 0}
            </div>
            <p className="text-xs text-slate-500 mt-1">Ứng viên đã nộp vào các tin</p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Mức độ tương tác
            </CardTitle>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <TrendingUp className="h-5 w-5" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold text-slate-900">
              {avgApplicants}
            </div>
            <p className="text-xs text-emerald-600 font-semibold mt-1">
              Ứng viên trung bình / bài đăng
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Job Posts */}
        <Card className="rounded-2xl border-slate-200/80 shadow-xs">
          <CardHeader className="border-b border-slate-100 pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base font-bold text-slate-900">Việc làm gần đây</CardTitle>
                <CardDescription className="text-xs text-slate-500 mt-0.5">
                  Các bài đăng tuyển dụng mới nhất của công ty
                </CardDescription>
              </div>
              <Link href="/recruiter/jobs">
                <Button variant="ghost" size="sm" className="rounded-xl text-xs font-semibold text-blue-600 hover:text-blue-700">
                  Xem tất cả
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent className="p-4 space-y-3">
            {dashboardData?.recentJobPosts && dashboardData.recentJobPosts.length > 0 ? (
              dashboardData.recentJobPosts.map((job) => (
                <div
                  key={job.id}
                  className="flex items-center justify-between p-3.5 border border-slate-100 rounded-xl hover:bg-slate-50 transition-colors"
                >
                  <div className="flex-1 min-w-0 pr-3">
                    <h4 className="font-bold text-sm text-slate-900 truncate">{job.title}</h4>
                    <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
                      <Calendar className="h-3 w-3" />
                      <span>{formatDate(job.createdAt)}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="bg-blue-50 text-blue-700 border-blue-100 text-xs">
                      {job.applicants} ứng viên
                    </Badge>
                    <Link href={`/recruiter/jobs`}>
                      <Button size="sm" variant="outline" className="h-8 rounded-lg text-xs">
                        <Eye className="h-3 w-3 mr-1 text-slate-400" />
                        Quản lý
                      </Button>
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-10 text-slate-400">
                <Briefcase className="h-10 w-10 mx-auto mb-2 text-slate-300" />
                <p className="text-sm font-semibold text-slate-700">Chưa có việc làm nào</p>
                <Link href="/recruiter/jobs">
                  <Button size="sm" variant="outline" className="mt-3 rounded-xl text-xs">
                    <Plus className="h-3.5 w-3.5 mr-1" />
                    Đăng việc làm đầu tiên
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Applicants */}
        <Card className="rounded-2xl border-slate-200/80 shadow-xs">
          <CardHeader className="border-b border-slate-100 pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base font-bold text-slate-900">Ứng viên vừa ứng tuyển</CardTitle>
                <CardDescription className="text-xs text-slate-500 mt-0.5">Hồ sơ ứng viên nộp gần đây nhất</CardDescription>
              </div>
              <Link href="/recruiter/applications">
                <Button variant="ghost" size="sm" className="rounded-xl text-xs font-semibold text-blue-600 hover:text-blue-700">
                  Xem tất cả
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent className="p-4 space-y-3">
            {dashboardData?.recentApplicants && dashboardData.recentApplicants.length > 0 ? (
              dashboardData.recentApplicants.map((applicant) => (
                <div
                  key={`${applicant.candidateId}-${applicant.jobTitle}`}
                  className="flex items-center justify-between p-3.5 border border-slate-100 rounded-xl hover:bg-slate-50 transition-colors"
                >
                  <div className="flex-1 min-w-0 pr-3">
                    <div className="flex items-center gap-1.5">
                      <h4 className="font-bold text-sm text-slate-900 truncate">{applicant.fullName}</h4>
                      <UserCheck className="h-3.5 w-3.5 text-blue-500 flex-shrink-0" />
                    </div>
                    <p className="text-xs text-slate-400 truncate mt-0.5">{applicant.email}</p>
                    <p className="text-xs font-semibold text-blue-600 truncate mt-0.5">
                      Vị trí: {applicant.jobTitle}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Link href={`/recruiter/applications`}>
                      <Button size="sm" variant="outline" className="h-8 rounded-lg text-xs">
                        <Eye className="h-3 w-3 mr-1 text-slate-400" />
                        Xem đơn
                      </Button>
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-10 text-slate-400">
                <Users className="h-10 w-10 mx-auto mb-2 text-slate-300" />
                <p className="text-sm font-semibold text-slate-700">Chưa có đơn ứng tuyển nào</p>
                <p className="text-xs text-slate-400 mt-1">Đăng thêm việc làm để tiếp cận ứng viên tiềm năng</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Action Navigation Tiles */}
      <Card className="rounded-2xl border-slate-200/80 shadow-xs">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-bold text-slate-900">Phím tắt quản lý nhanh</CardTitle>
          <CardDescription className="text-xs text-slate-500">Tiếp cận nhanh các công cụ cốt lõi trong Recruiter Portal</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Link href="/recruiter/jobs" className="group">
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-blue-300 hover:shadow-md transition-all flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0">
                  <Briefcase className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">Quản lý việc làm</h4>
                  <p className="text-xs text-slate-500 mt-0.5">Đăng tin & theo dõi trạng thái</p>
                </div>
              </div>
            </Link>

            <Link href="/recruiter/applications" className="group">
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-indigo-300 hover:shadow-md transition-all flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center flex-shrink-0">
                  <FileText className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">Đơn ứng tuyển</h4>
                  <p className="text-xs text-slate-500 mt-0.5">Duyệt CV & hẹn phỏng vấn</p>
                </div>
              </div>
            </Link>

            <Link href="/recruiter/candidates" className="group">
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-emerald-300 hover:shadow-md transition-all flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center flex-shrink-0">
                  <Users className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">Tìm kiếm nhân tài</h4>
                  <p className="text-xs text-slate-500 mt-0.5">Tra cứu Talent Pool toàn sàn</p>
                </div>
              </div>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
