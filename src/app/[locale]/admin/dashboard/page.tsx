"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Briefcase, FileText, DollarSign } from "lucide-react";
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
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
          <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
        </header>
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
          <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Tổng số người dùng
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {isLoadingStats
                    ? "Đang tải..."
                    : stats?.totalUsers.toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground">
                  Hôm nay:{" "}
                  {isLoadingStats
                    ? "..."
                    : stats?.newUsersToday.toLocaleString()}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Tổng số công ty
                </CardTitle>
                <Briefcase className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {isLoadingStats
                    ? "Đang tải..."
                    : stats?.totalCompanies.toLocaleString()}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Tổng số bài đăng tuyển dụng
                </CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {isLoadingStats
                    ? "Đang tải..."
                    : stats?.totalJobPosts.toLocaleString()}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Tổng số lượt ứng tuyển
                </CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {isLoadingStats
                    ? "Đang tải..."
                    : stats?.totalApplications.toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground">
                  Hôm nay:{" "}
                  {isLoadingStats
                    ? "..."
                    : stats?.applicationsToday.toLocaleString()}
                </p>
              </CardContent>
            </Card>
            <Card className="col-span-full">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Tổng số đánh giá
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {isLoadingStats
                    ? "Đang tải..."
                    : stats?.totalReviews.toLocaleString()}
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
