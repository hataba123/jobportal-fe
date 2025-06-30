"use client";

import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Briefcase,
  Users,
  FileText,
  TrendingUp,
  Calendar,
  Plus,
  Eye,
  UserCheck,
} from "lucide-react";
import { Link } from "@/i18n/navigation";
import {
  fetchRecruiterDashboard,
  type RecruiterDashboardDto,
} from "@/lib/api/recruiter-dashboard";
import { useAuth } from "@/contexts/AuthContext";

export default function RecruiterDashboardPage() {
  const [dashboardData, setDashboardData] =
    useState<RecruiterDashboardDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
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
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      setError("Không thể tải dữ liệu dashboard");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error && !dashboardData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={fetchDashboardData}>Thử lại</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-gray-600">Tổng quan hoạt động tuyển dụng</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Calendar className="h-4 w-4 mr-2" />
            Xuất báo cáo
          </Button>
          <Link href="/recruiter/jobs">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Đăng việc làm mới
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng việc làm</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {dashboardData?.totalJobPosts || 0}
            </div>
            <p className="text-xs text-muted-foreground">Việc làm đã đăng</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Tổng đơn ứng tuyển
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {dashboardData?.totalApplicants || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Đơn ứng tuyển nhận được
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Tỷ lệ ứng tuyển
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {dashboardData?.totalJobPosts && dashboardData?.totalApplicants
                ? Math.round(
                    (dashboardData.totalApplicants /
                      dashboardData.totalJobPosts) *
                      100
                  )
                : 0}
              %
            </div>
            <p className="text-xs text-muted-foreground">
              Trung bình ứng viên/việc làm
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Job Posts */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Việc làm gần đây</CardTitle>
                <CardDescription>
                  5 việc làm được đăng gần đây nhất
                </CardDescription>
              </div>
              <Link href="/recruiter/jobs">
                <Button variant="outline" size="sm">
                  Xem tất cả
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {dashboardData?.recentJobPosts &&
            dashboardData.recentJobPosts.length > 0 ? (
              dashboardData.recentJobPosts.map((job) => (
                <div
                  key={job.id}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
                >
                  <div className="flex-1">
                    <h4 className="font-medium">{job.title}</h4>
                    <div className="flex items-center space-x-2 text-sm text-gray-600 mt-1">
                      <Calendar className="h-3 w-3" />
                      <span>{formatDate(job.createdAt)}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="secondary">{job.applicants} ứng viên</Badge>
                    <Link href={`/recruiter/jobs/${job.id}`}>
                      <Button size="sm" variant="outline">
                        <Eye className="h-3 w-3 mr-1" />
                        Xem
                      </Button>
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Briefcase className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>Chưa có việc làm nào</p>
                <Link href="/recruiter/jobs">
                  <Button variant="outline" className="mt-2">
                    <Plus className="h-4 w-4 mr-2" />
                    Đăng việc làm đầu tiên
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Applicants */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Ứng viên gần đây</CardTitle>
                <CardDescription>10 đơn ứng tuyển mới nhất</CardDescription>
              </div>
              <Link href="/recruiter/applications">
                <Button variant="outline" size="sm">
                  Xem tất cả
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {dashboardData?.recentApplicants &&
            dashboardData.recentApplicants.length > 0 ? (
              dashboardData.recentApplicants.map((applicant) => (
                <div
                  key={applicant.candidateId}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
                >
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h4 className="font-medium">{applicant.fullName}</h4>
                      <UserCheck className="h-4 w-4 text-blue-500" />
                    </div>
                    <p className="text-sm text-gray-600">{applicant.email}</p>
                    <p className="text-sm font-medium text-blue-600">
                      {applicant.jobTitle}
                    </p>
                    <div className="flex items-center space-x-2 text-sm text-gray-500 mt-1">
                      <Calendar className="h-3 w-3" />
                      <span>{formatDate(applicant.appliedAt)}</span>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Link
                      href={`/recruiter/applications?candidate=${applicant.candidateId}`}
                    >
                      <Button size="sm" variant="outline">
                        <Eye className="h-3 w-3 mr-1" />
                        Xem
                      </Button>
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Users className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>Chưa có đơn ứng tuyển nào</p>
                <p className="text-sm">Đăng việc làm để nhận đơn ứng tuyển</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Thao tác nhanh</CardTitle>
          <CardDescription>Quản lý tuyển dụng hiệu quả</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link href="/recruiter/jobs">
              <Button className="w-full h-20 flex flex-col space-y-2">
                <Briefcase className="h-6 w-6" />
                <span>Quản lý việc làm</span>
              </Button>
            </Link>
            <Link href="/recruiter/applications">
              <Button className="w-full h-20 flex flex-col space-y-2">
                <FileText className="h-6 w-6" />
                <span>Đơn ứng tuyển</span>
              </Button>
            </Link>
            <Link href="/recruiter/candidates">
              <Button className="w-full h-20 flex flex-col space-y-2">
                <Users className="h-6 w-6" />
                <span>Quản lý ứng viên</span>
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
