"use client";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type Application = {
  id: string;
  jobTitle: string;
  company: string;
  appliedDate: string;
  status: "PENDING" | "REVIEWING" | "ACCEPTED" | "REJECTED";
  salary: string;
  location: string;
};

const mockApplications: Application[] = [
  {
    id: "1",
    jobTitle: "Frontend Developer",
    company: "TechCorp",
    appliedDate: "2024-01-15",
    status: "REVIEWING",
    salary: "15-25 triệu",
    location: "Hà Nội",
  },
  {
    id: "2",
    jobTitle: "React Developer",
    company: "StartupXYZ",
    appliedDate: "2024-01-10",
    status: "PENDING",
    salary: "20-30 triệu",
    location: "TP.HCM",
  },
  {
    id: "3",
    jobTitle: "Fullstack Developer",
    company: "BigTech Inc",
    appliedDate: "2024-01-05",
    status: "ACCEPTED",
    salary: "25-35 triệu",
    location: "Hà Nội",
  },
  {
    id: "4",
    jobTitle: "UI/UX Designer",
    company: "Design Studio",
    appliedDate: "2024-01-01",
    status: "REJECTED",
    salary: "18-25 triệu",
    location: "Đà Nẵng",
  },
];

const getStatusBadge = (status: Application["status"]) => {
  const statusConfig = {
    PENDING: { label: "Chờ xử lý", className: "bg-yellow-100 text-yellow-800" },
    REVIEWING: {
      label: "Đang xem xét",
      className: "bg-blue-100 text-blue-800",
    },
    ACCEPTED: {
      label: "Được chấp nhận",
      className: "bg-green-100 text-green-800",
    },
    REJECTED: { label: "Từ chối", className: "bg-red-100 text-red-800" },
  };

  const config = statusConfig[status];
  return <Badge className={config.className}>{config.label}</Badge>;
};

export default function ApplicationsPage() {
  const [applications] = useState<Application[]>(mockApplications);

  return (
    <div className="max-w-6xl mx-auto my-9">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">
          Việc làm đã ứng tuyển
        </h1>
        <p className="text-gray-600 mt-2">
          Theo dõi trạng thái các đơn ứng tuyển của bạn
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Danh sách đơn ứng tuyển ({applications.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Vị trí công việc</TableHead>
                <TableHead>Công ty</TableHead>
                <TableHead>Địa điểm</TableHead>
                <TableHead>Mức lương</TableHead>
                <TableHead>Ngày ứng tuyển</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {applications.map((application) => (
                <TableRow key={application.id}>
                  <TableCell className="font-medium">
                    {application.jobTitle}
                  </TableCell>
                  <TableCell>{application.company}</TableCell>
                  <TableCell>{application.location}</TableCell>
                  <TableCell>{application.salary}</TableCell>
                  <TableCell>
                    {new Date(application.appliedDate).toLocaleDateString(
                      "vi-VN"
                    )}
                  </TableCell>
                  <TableCell>{getStatusBadge(application.status)}</TableCell>
                  <TableCell>
                    <div className="space-x-2">
                      <Button variant="outline" size="sm">
                        Xem chi tiết
                      </Button>
                      {application.status === "PENDING" && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-red-600"
                        >
                          Hủy đơn
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Thống kê */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">
              {applications.filter((app) => app.status === "PENDING").length}
            </div>
            <div className="text-sm text-gray-600">Chờ xử lý</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">
              {applications.filter((app) => app.status === "REVIEWING").length}
            </div>
            <div className="text-sm text-gray-600">Đang xem xét</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">
              {applications.filter((app) => app.status === "ACCEPTED").length}
            </div>
            <div className="text-sm text-gray-600">Được chấp nhận</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-red-600">
              {applications.filter((app) => app.status === "REJECTED").length}
            </div>
            <div className="text-sm text-gray-600">Từ chối</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
