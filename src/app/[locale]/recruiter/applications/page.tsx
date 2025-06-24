"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Download,
  Eye,
  MessageSquare,
  MoreHorizontal,
  UserCheck,
  Calendar,
  Send,
  UserX,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { getStatusBadge } from "@/lib/utils/status-badge"; // Assuming this utility exists

interface Application {
  id: number;
  candidateName: string;
  candidateEmail: string;
  jobTitle: string;
  appliedDate: string;
  status: "pending" | "shortlisted" | "interviewed" | "rejected" | "hired";
  experience: string;
  skills: string[];
  avatar?: string;
  resume: string;
  coverLetter: string;
}

// Mock data for applications
const applications: Application[] = [
  {
    id: 1,
    candidateName: "Nguyễn Văn A",
    candidateEmail: "nguyenvana@email.com",
    jobTitle: "Senior Frontend Developer",
    appliedDate: "2024-01-16",
    status: "pending",
    experience: "5 năm",
    skills: ["React", "TypeScript", "Next.js", "Tailwind CSS"],
    avatar: "/placeholder.svg?height=40&width=40",
    resume: "resume_nguyen_van_a.pdf",
    coverLetter:
      "Tôi rất quan tâm đến vị trí này và tin rằng kinh nghiệm của mình phù hợp với yêu cầu của công ty.",
  },
  {
    id: 2,
    candidateName: "Trần Thị B",
    candidateEmail: "tranthib@email.com",
    jobTitle: "Backend Developer",
    appliedDate: "2024-01-15",
    status: "shortlisted",
    experience: "3 năm",
    skills: ["Node.js", "MongoDB", "Express", "REST API"],
    avatar: "/placeholder.svg?height=40&width=40",
    resume: "resume_tran_thi_b.pdf",
    coverLetter:
      "Với kinh nghiệm 3 năm trong lĩnh vực phát triển backend, tôi tự tin có thể đóng góp vào sự phát triển của dự án.",
  },
  {
    id: 3,
    candidateName: "Lê Văn C",
    candidateEmail: "levanc@email.com",
    jobTitle: "UI/UX Designer",
    appliedDate: "2024-01-14",
    status: "interviewed",
    experience: "4 năm",
    skills: ["Figma", "Adobe XD", "Sketch", "User Research"],
    avatar: "/placeholder.svg?height=40&width=40",
    resume: "resume_le_van_c.pdf",
    coverLetter:
      "Tôi có passion mạnh mẽ về design và luôn tìm kiếm những giải pháp sáng tạo để cải thiện trải nghiệm người dùng.",
  },
  {
    id: 4,
    candidateName: "Phạm Thị D",
    candidateEmail: "phamthid@email.com",
    jobTitle: "Senior Frontend Developer",
    appliedDate: "2024-01-13",
    status: "rejected",
    experience: "2 năm",
    skills: ["React", "Vue.js", "CSS", "JavaScript"],
    avatar: "/placeholder.svg?height=40&width=40",
    resume: "resume_pham_thi_d.pdf",
    coverLetter:
      "Mặc dù kinh nghiệm chưa nhiều, tôi luôn sẵn sàng học hỏi và phát triển bản thân để đáp ứng yêu cầu công việc.",
  },
  {
    id: 5,
    candidateName: "Hoàng Văn E",
    candidateEmail: "hoangvane@email.com",
    jobTitle: "Data Scientist",
    appliedDate: "2024-01-12",
    status: "pending",
    experience: "6 năm",
    skills: ["Python", "Machine Learning", "SQL", "Pandas"],
    avatar: "/placeholder.svg?height=40&width=40",
    resume: "resume_hoang_van_e.pdf",
    coverLetter:
      "Tôi có kinh nghiệm sâu rộng trong phân tích dữ liệu và xây dựng mô hình dự đoán.",
  },
];

export default function RecruiterApplicationsPage() {
  const [currentApplications, setCurrentApplications] =
    useState<Application[]>(applications);

  const handleStatusChange = (id: number, newStatus: Application["status"]) => {
    setCurrentApplications((prevApps) =>
      prevApps.map((app) =>
        app.id === id ? { ...app, status: newStatus } : app
      )
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Đơn ứng tuyển</h2>
          <p className="text-gray-600">Quản lý tất cả đơn ứng tuyển</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Xuất danh sách
          </Button>
        </div>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">Tất cả ({applications.length})</TabsTrigger>
          <TabsTrigger value="pending">
            Chờ xét duyệt (
            {applications.filter((app) => app.status === "pending").length})
          </TabsTrigger>
          <TabsTrigger value="shortlisted">
            Đã sàng lọc (
            {applications.filter((app) => app.status === "shortlisted").length})
          </TabsTrigger>
          <TabsTrigger value="interviewed">
            Đã phỏng vấn (
            {applications.filter((app) => app.status === "interviewed").length})
          </TabsTrigger>
          <TabsTrigger value="rejected">
            Đã từ chối (
            {applications.filter((app) => app.status === "rejected").length})
          </TabsTrigger>
          <TabsTrigger value="hired">
            Đã tuyển (
            {applications.filter((app) => app.status === "hired").length})
          </TabsTrigger>
        </TabsList>

        {[
          "all",
          "pending",
          "shortlisted",
          "interviewed",
          "rejected",
          "hired",
        ].map((tabValue) => (
          <TabsContent key={tabValue} value={tabValue} className="space-y-4">
            {currentApplications
              .filter((app) =>
                tabValue === "all" ? true : app.status === tabValue
              )
              .map((app) => (
                <Card key={app.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4">
                        <Image
                          src={app.avatar || "/placeholder.svg"}
                          alt={app.candidateName}
                          width={60}
                          height={60}
                          className="rounded-full object-cover"
                        />
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h3 className="text-lg font-semibold">
                              {app.candidateName}
                            </h3>
                            {getStatusBadge(app.status)}
                          </div>
                          <p className="text-gray-600 mb-1">
                            {app.candidateEmail}
                          </p>
                          <p className="text-sm text-gray-500 mb-2">
                            Ứng tuyển:{" "}
                            <span className="font-medium text-gray-700">
                              {app.jobTitle}
                            </span>
                          </p>
                          <p className="text-sm text-gray-500 mb-3">
                            Kinh nghiệm:{" "}
                            <span className="font-medium text-gray-700">
                              {app.experience}
                            </span>
                          </p>
                          <div className="flex flex-wrap gap-2 mb-3">
                            {app.skills.map((skill) => (
                              <Badge
                                key={skill}
                                variant="secondary"
                                className="text-xs"
                              >
                                {skill}
                              </Badge>
                            ))}
                          </div>
                          <p className="text-sm text-gray-700 italic line-clamp-2">
                            &quot;{app.coverLetter}&quot;
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-col items-end space-y-2">
                        <p className="text-sm text-gray-500">
                          Ngày ứng tuyển: {app.appliedDate}
                        </p>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline">
                            <Eye className="h-4 w-4 mr-1" />
                            Xem CV
                          </Button>
                          <Button size="sm" variant="outline">
                            <MessageSquare className="h-4 w-4 mr-1" />
                            Nhắn tin
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button size="sm" variant="outline">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() =>
                                  handleStatusChange(app.id, "shortlisted")
                                }
                              >
                                <UserCheck className="h-4 w-4 mr-2" />
                                Sàng lọc
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() =>
                                  handleStatusChange(app.id, "interviewed")
                                }
                              >
                                <Calendar className="h-4 w-4 mr-2" />
                                Lên lịch phỏng vấn
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() =>
                                  handleStatusChange(app.id, "hired")
                                }
                              >
                                <UserCheck className="h-4 w-4 mr-2" />
                                Tuyển dụng
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Send className="h-4 w-4 mr-2" />
                                Gửi email
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                className="text-red-600"
                                onClick={() =>
                                  handleStatusChange(app.id, "rejected")
                                }
                              >
                                <UserX className="h-4 w-4 mr-2" />
                                Từ chối
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
