"use client";

import { useState, useEffect } from "react";
import {
  Download,
  Eye,
  MessageSquare,
  MoreHorizontal,
  UserCheck,
  Send,
  UserX,
  Briefcase,
  Search,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { fetchMyJobPosts } from "@/lib/api/recruiter-jobpost";
import { fetchCandidatesForJob, updateApplicationStatus as apiUpdateStatus } from "@/lib/api/recruiter-application";
import { JobPost } from "@/types/JobPost";
import { JobApplication, UpdateApplyStatusRequest } from "@/types/JobApplication";
import { ApplicationStatus } from "@/types/ApplyStatus";

const applicationStatuses: { value: ApplicationStatus; label: string; color: string }[] = [
  { value: "pending", label: "Chờ xử lý", color: "bg-yellow-100 text-yellow-800" },
  { value: "reviewed", label: "Đã xem xét", color: "bg-blue-100 text-blue-800" },
  { value: "accepted", label: "Chấp nhận", color: "bg-green-100 text-green-800" },
  { value: "rejected", label: "Từ chối", color: "bg-red-100 text-red-800" },
];

export default function RecruiterApplicationsPage() {
  const [jobPosts, setJobPosts] = useState<JobPost[]>([]);
  const [selectedJobPost, setSelectedJobPost] = useState<string>("");
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchJobPosts();
  }, []);

  useEffect(() => {
    if (selectedJobPost) {
      fetchApplications(selectedJobPost);
    }
  }, [selectedJobPost]);

  const fetchJobPosts = async () => {
    try {
      const data = await fetchMyJobPosts();
      setJobPosts(data);
    } catch {
      // error handling if needed
    }
  };

  const fetchApplications = async (jobPostId: string) => {
    try {
      const data = await fetchCandidatesForJob(jobPostId);
      setApplications(data);
    } catch {
      // error handling if needed
    }
  };

  const handleStatusChange = async (id: string, newStatus: ApplicationStatus) => {
    try {
      const updateData: UpdateApplyStatusRequest = { status: newStatus };
      await apiUpdateStatus(id, updateData);
      if (selectedJobPost) {
        fetchApplications(selectedJobPost);
      }
    } catch {
      // error handling if needed
    }
  };

  const getStatusBadge = (status: ApplicationStatus) => {
    const statusConfig = applicationStatuses.find(s => s.value === status);
    return (
      <Badge className={statusConfig?.color || "bg-gray-100 text-gray-800"}>
        {statusConfig?.label || status}
      </Badge>
    );
  };

  const getFilteredApplications = () => {
    return applications.filter((app) => {
      const matchesSearch =
        app.candidate?.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.candidate?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.jobPost?.title?.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesSearch;
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const filteredApplications = getFilteredApplications();

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

      {/* Job Post Selection */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <Briefcase className="h-5 w-5 text-gray-500" />
            <div className="flex-1">
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Chọn việc làm
              </label>
              <Select value={selectedJobPost} onValueChange={setSelectedJobPost}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Chọn việc làm để xem đơn ứng tuyển" />
                </SelectTrigger>
                <SelectContent>
                  {jobPosts.map((job) => (
                    <SelectItem key={job.id} value={job.id}>
                      {job.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {selectedJobPost && (
        <>
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Tìm kiếm ứng viên..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <Tabs defaultValue="all" className="space-y-4">
            <TabsList>
              <TabsTrigger value="all">Tất cả ({filteredApplications.length})</TabsTrigger>
              <TabsTrigger value="pending">
                Chờ xử lý (
                {filteredApplications.filter((app) => app.status === "pending").length})
              </TabsTrigger>
              <TabsTrigger value="reviewed">
                Đã xem xét (
                {filteredApplications.filter((app) => app.status === "reviewed").length})
              </TabsTrigger>
              <TabsTrigger value="accepted">
                Chấp nhận (
                {filteredApplications.filter((app) => app.status === "accepted").length})
              </TabsTrigger>
              <TabsTrigger value="rejected">
                Từ chối (
                {filteredApplications.filter((app) => app.status === "rejected").length})
              </TabsTrigger>
            </TabsList>

            {[
              "all",
              "pending",
              "reviewed",
              "accepted",
              "rejected",
            ].map((tabValue) => (
              <TabsContent key={tabValue} value={tabValue} className="space-y-4">
                {filteredApplications
                  .filter((app) =>
                    tabValue === "all" ? true : app.status === tabValue
                  )
                  .map((app) => (
                    <Card key={app.id}>
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-4">
                            <div className="w-15 h-15 rounded-full bg-gray-200 flex items-center justify-center">
                              <UserCheck className="h-8 w-8 text-gray-400" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-2">
                                <h3 className="text-lg font-semibold">
                                  {app.candidate?.fullName || "N/A"}
                                </h3>
                                {getStatusBadge(app.status)}
                              </div>
                              <p className="text-gray-600 mb-1">
                                {app.candidate?.email || "N/A"}
                              </p>
                              <p className="text-sm text-gray-500 mb-2">
                                Ứng tuyển:{" "}
                                <span className="font-medium text-gray-700">
                                  {app.jobPost?.title || "N/A"}
                                </span>
                              </p>
                              {app.coverLetter && (
                                <p className="text-sm text-gray-700 italic line-clamp-2">
                                  &quot;{app.coverLetter}&quot;
                                </p>
                              )}
                            </div>
                          </div>
                          <div className="flex flex-col items-end space-y-2">
                            <p className="text-sm text-gray-500">
                              Ngày ứng tuyển: {formatDate(app.appliedAt)}
                            </p>
                            <div className="flex space-x-2">
                              <Button size="sm" variant="outline">
                                <Eye className="h-4 w-4 mr-1" />
                                Xem chi tiết
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
                                      handleStatusChange(app.id, "reviewed")
                                    }
                                  >
                                    <UserCheck className="h-4 w-4 mr-2" />
                                    Đã xem xét
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() =>
                                      handleStatusChange(app.id, "accepted")
                                    }
                                  >
                                    <UserCheck className="h-4 w-4 mr-2" />
                                    Chấp nhận
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
        </>
      )}

      {!selectedJobPost && (
        <Card>
          <CardContent className="p-12 text-center">
            <Briefcase className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Chọn việc làm
            </h3>
            <p className="text-gray-600">
              Vui lòng chọn một việc làm để xem danh sách đơn ứng tuyển
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
