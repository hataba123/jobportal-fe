"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Users,
  Briefcase,
  FileText,
  TrendingUp,
  Star,
  ArrowRight,
  Building2,
  Receipt,
  Flag,
  Calendar,
} from "lucide-react";
import { Link } from "@/i18n/navigation";
import Dashboard from "@/types/admin/DashboardDto";
import axiosInstance from "@/lib/axiosInstance";

export default function AdminDashboardPage() {
  const [stats, setStats] = React.useState<Dashboard | null>(null);
  const [isLoadingStats, setIsLoadingStats] = React.useState(true);

  React.useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await axiosInstance.get("/admin/dashboard");
        setStats(res.data);
      } catch (err) {
        console.error("Lỗi khi gọi API dashboard:", err);
      } finally {
        setIsLoadingStats(false);
      }
    };
    fetchDashboard();
  }, []);

  return (
    <div className="space-y-8">
      {/* KPI Cards Grid */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Users */}
        <Card className="rounded-2xl border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Tổng số người dùng
            </CardTitle>
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </CardHeader>
          <CardContent>
            {isLoadingStats ? (
              <div className="space-y-2">
                <Skeleton className="h-8 w-24" />
                <Skeleton className="h-4 w-32" />
              </div>
            ) : (
              <>
                <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                  {stats?.totalUsers.toLocaleString() ?? 0}
                </div>
                <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-semibold mt-1.5">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>+{stats?.newUsersToday.toLocaleString() ?? 0} mới hôm nay</span>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Total Companies */}
        <Card className="rounded-2xl border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Doanh nghiệp
            </CardTitle>
            <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Building2 className="w-5 h-5" />
            </div>
          </CardHeader>
          <CardContent>
            {isLoadingStats ? (
              <div className="space-y-2">
                <Skeleton className="h-8 w-24" />
                <Skeleton className="h-4 w-28" />
              </div>
            ) : (
              <>
                <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                  {stats?.totalCompanies.toLocaleString() ?? 0}
                </div>
                <p className="text-xs text-slate-500 mt-1.5">Công ty đang hoạt động</p>
              </>
            )}
          </CardContent>
        </Card>

        {/* Total Job Posts */}
        <Card className="rounded-2xl border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Tin tuyển dụng
            </CardTitle>
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Briefcase className="w-5 h-5" />
            </div>
          </CardHeader>
          <CardContent>
            {isLoadingStats ? (
              <div className="space-y-2">
                <Skeleton className="h-8 w-24" />
                <Skeleton className="h-4 w-28" />
              </div>
            ) : (
              <>
                <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                  {stats?.totalJobPosts.toLocaleString() ?? 0}
                </div>
                <p className="text-xs text-slate-500 mt-1.5">Vị trí mở trên toàn sàn</p>
              </>
            )}
          </CardContent>
        </Card>

        {/* Total Applications */}
        <Card className="rounded-2xl border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Lượt ứng tuyển
            </CardTitle>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
          </CardHeader>
          <CardContent>
            {isLoadingStats ? (
              <div className="space-y-2">
                <Skeleton className="h-8 w-24" />
                <Skeleton className="h-4 w-32" />
              </div>
            ) : (
              <>
                <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                  {stats?.totalApplications.toLocaleString() ?? 0}
                </div>
                <div className="flex items-center gap-1.5 text-xs text-blue-600 font-semibold mt-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>+{stats?.applicationsToday.toLocaleString() ?? 0} lượt nộp hôm nay</span>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Review Metric Banner */}
      <Card className="rounded-2xl border-slate-200/80 shadow-xs bg-gradient-to-r from-amber-50/60 via-orange-50/30 to-white">
        <CardContent className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center flex-shrink-0">
              <Star className="w-6 h-6 fill-amber-500" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Đánh giá và phản hồi cộng đồng
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Tổng cộng {isLoadingStats ? "..." : stats?.totalReviews.toLocaleString() ?? 0} đánh giá doanh nghiệp từ ứng viên và nhân viên.
              </p>
            </div>
          </div>
          <Link href="/admin/review">
            <Button variant="outline" size="sm" className="rounded-xl border-slate-300 hover:bg-white text-xs font-semibold">
              <span>Kiểm duyệt đánh giá</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
            </Button>
          </Link>
        </CardContent>
      </Card>

      {/* Quick Access Management Hub */}
      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Truy cập nhanh danh mục quản trị</h2>
          <p className="text-xs text-slate-500">Các phân hệ thường dùng để kiểm duyệt và giám sát hoạt động sàn</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link href="/admin/job-post" className="group">
            <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs group-hover:shadow-md group-hover:border-purple-300 transition-all">
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-3">
                <Briefcase className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-slate-900 group-hover:text-purple-600 transition-colors">
                Quản lý Tin tuyển dụng
              </h4>
              <p className="text-xs text-slate-500 mt-1">
                Kiểm duyệt, chỉnh sửa và đóng các bài đăng tuyển dụng.
              </p>
            </div>
          </Link>

          <Link href="/admin/company" className="group">
            <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs group-hover:shadow-md group-hover:border-indigo-300 transition-all">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-3">
                <Building2 className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                Xác minh Doanh nghiệp
              </h4>
              <p className="text-xs text-slate-500 mt-1">
                Duyệt hồ sơ công ty và cấp tích xanh pháp lý.
              </p>
            </div>
          </Link>

          <Link href="/admin/transactions" className="group">
            <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs group-hover:shadow-md group-hover:border-emerald-300 transition-all">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
                <Receipt className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">
                Giao dịch & Doanh thu
              </h4>
              <p className="text-xs text-slate-500 mt-1">
                Theo dõi dòng tiền nạp VNPAY và thanh toán tín dụng.
              </p>
            </div>
          </Link>

          <Link href="/admin/reports" className="group">
            <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs group-hover:shadow-md group-hover:border-rose-300 transition-all">
              <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center mb-3">
                <Flag className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-slate-900 group-hover:text-rose-600 transition-colors">
                Báo cáo vi phạm
              </h4>
              <p className="text-xs text-slate-500 mt-1">
                Xử lý khiếu nại, tin lừa đảo từ ứng viên.
              </p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
