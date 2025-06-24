"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { DollarSign, Users, Briefcase, FileText } from "lucide-react";

// Mock data interfaces
interface Stats {
  totalUsers: number;
  totalCompanies: number;
  totalJobPosts: number;
  totalApplications: number;
}

interface JobPost {
  Id: string;
  Title: string;
  Location: string;
  Type: string;
  Applicants: number;
  CreatedAt: string;
}

interface Company {
  Id: string;
  Name: string;
  Industry: string;
  JobPostsCount: number;
}

interface User {
  Id: string;
  Email: string;
  FullName: string;
  Role: string;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = React.useState<Stats | null>(null);
  const [recentJobs, setRecentJobs] = React.useState<JobPost[] | null>(null);
  const [topCompanies, setTopCompanies] = React.useState<Company[] | null>(
    null
  );
  const [recentUsers, setRecentUsers] = React.useState<User[] | null>(null);

  const [isLoadingStats, setIsLoadingStats] = React.useState(true);
  const [isLoadingRecentJobs, setIsLoadingRecentJobs] = React.useState(true);
  const [isLoadingTopCompanies, setIsLoadingTopCompanies] =
    React.useState(true);
  const [isLoadingRecentUsers, setIsLoadingRecentUsers] = React.useState(true);

  // Simulate API calls
  React.useEffect(() => {
    const fetchStats = () => {
      setIsLoadingStats(true);
      setTimeout(() => {
        setStats({
          totalUsers: 1250,
          totalCompanies: 180,
          totalJobPosts: 560,
          totalApplications: 3100,
        });
        setIsLoadingStats(false);
      }, 1000);
    };

    const fetchRecentJobs = () => {
      setIsLoadingRecentJobs(true);
      setTimeout(() => {
        setRecentJobs([
          {
            Id: "jp001",
            Title: "Software Engineer",
            Location: "Hanoi",
            Type: "Full-time",
            Applicants: 120,
            CreatedAt: "2024-06-20",
          },
          {
            Id: "jp002",
            Title: "Marketing Specialist",
            Location: "Ho Chi Minh",
            Type: "Full-time",
            Applicants: 85,
            CreatedAt: "2024-06-19",
          },
          {
            Id: "jp003",
            Title: "UI/UX Designer",
            Location: "Da Nang",
            Type: "Contract",
            Applicants: 60,
            CreatedAt: "2024-06-18",
          },
          {
            Id: "jp004",
            Title: "Data Analyst",
            Location: "Hanoi",
            Type: "Full-time",
            Applicants: 95,
            CreatedAt: "2024-06-17",
          },
          {
            Id: "jp005",
            Title: "HR Manager",
            Location: "Ho Chi Minh",
            Type: "Part-time",
            Applicants: 40,
            CreatedAt: "2024-06-16",
          },
        ]);
        setIsLoadingRecentJobs(false);
      }, 1200);
    };

    const fetchTopCompanies = () => {
      setIsLoadingTopCompanies(true);
      setTimeout(() => {
        setTopCompanies([
          {
            Id: "c001",
            Name: "Tech Solutions Inc.",
            Industry: "IT",
            JobPostsCount: 50,
          },
          {
            Id: "c002",
            Name: "Global Marketing Co.",
            Industry: "Marketing",
            JobPostsCount: 35,
          },
          {
            Id: "c003",
            Name: "Creative Design Studio",
            Industry: "Design",
            JobPostsCount: 20,
          },
          {
            Id: "c004",
            Name: "Finance Hub Ltd.",
            Industry: "Finance",
            JobPostsCount: 45,
          },
        ]);
        setIsLoadingTopCompanies(false);
      }, 1100);
    };

    const fetchRecentUsers = () => {
      setIsLoadingRecentUsers(true);
      setTimeout(() => {
        setRecentUsers([
          {
            Id: "u001",
            Email: "john.doe@example.com",
            FullName: "John Doe",
            Role: "Candidate",
          },
          {
            Id: "u002",
            Email: "jane.smith@example.com",
            FullName: "Jane Smith",
            Role: "Employer",
          },
          {
            Id: "u003",
            Email: "peter.jones@example.com",
            FullName: "Peter Jones",
            Role: "Candidate",
          },
          {
            Id: "u004",
            Email: "admin@example.com",
            FullName: "Admin User",
            Role: "Admin",
          },
        ]);
        setIsLoadingRecentUsers(false);
      }, 1300);
    };

    fetchStats();
    fetchRecentJobs();
    fetchTopCompanies();
    fetchRecentUsers();
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
                  +20.1% từ tháng trước
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
                <p className="text-xs text-muted-foreground">
                  +15.5% từ tháng trước
                </p>
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
                <p className="text-xs text-muted-foreground">
                  +10.2% từ tháng trước
                </p>
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
                  +30.5% từ tháng trước
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
            <Card className="xl:col-span-2">
              <CardHeader className="flex flex-row items-center">
                <div className="grid gap-2">
                  <CardTitle>Bài đăng tuyển dụng gần đây</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Các bài đăng mới nhất trên hệ thống.
                  </p>
                </div>
              </CardHeader>
              <CardContent>
                {isLoadingRecentJobs ? (
                  <div className="text-center py-4">Đang tải...</div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Tiêu đề</TableHead>
                        <TableHead>Địa điểm</TableHead>
                        <TableHead>Loại</TableHead>
                        <TableHead className="text-right">Ứng viên</TableHead>
                        <TableHead className="text-right">Ngày tạo</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {recentJobs?.map((job) => (
                        <TableRow key={job.Id}>
                          <TableCell>
                            <div className="font-medium">{job.Title}</div>
                          </TableCell>
                          <TableCell>{job.Location}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{job.Type}</Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            {job.Applicants}
                          </TableCell>
                          <TableCell className="text-right">
                            {job.CreatedAt}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Người dùng mới đăng ký</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Các tài khoản người dùng mới nhất.
                </p>
              </CardHeader>
              <CardContent>
                {isLoadingRecentUsers ? (
                  <div className="text-center py-4">Đang tải...</div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Email</TableHead>
                        <TableHead>Vai trò</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {recentUsers?.map((user) => (
                        <TableRow key={user.Id}>
                          <TableCell>
                            <div className="font-medium">{user.FullName}</div>
                            <div className="hidden text-sm text-muted-foreground md:inline">
                              {user.Email}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="secondary">{user.Role}</Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
            <Card className="xl:col-span-3">
              <CardHeader>
                <CardTitle>Các công ty hàng đầu</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Các công ty có nhiều bài đăng tuyển dụng nhất.
                </p>
              </CardHeader>
              <CardContent>
                {isLoadingTopCompanies ? (
                  <div className="text-center py-4">Đang tải...</div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Tên công ty</TableHead>
                        <TableHead>Ngành</TableHead>
                        <TableHead className="text-right">
                          Số bài đăng
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {topCompanies?.map((company) => (
                        <TableRow key={company.Id}>
                          <TableCell>
                            <div className="font-medium">{company.Name}</div>
                          </TableCell>
                          <TableCell>{company.Industry}</TableCell>
                          <TableCell className="text-right">
                            {company.JobPostsCount}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
