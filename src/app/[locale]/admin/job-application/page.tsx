"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Search,
  Filter,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  Calendar,
  User,
  Briefcase,
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";
import { useState, useEffect } from "react";
import { fetchAllJobApplications, updateJobApplicationStatus as apiUpdateStatus, deleteJobApplication as apiDeleteJobApplication } from "@/lib/api/admin-jobapplication";
import { JobApplication, UpdateApplyStatusRequest } from "@/types/JobApplication";
import { ApplicationStatus } from "@/types/ApplyStatus";

const applicationStatuses: { value: ApplicationStatus; label: string; color: string }[] = [
  { value: "pending", label: "Chờ xử lý", color: "bg-yellow-100 text-yellow-800" },
  { value: "reviewed", label: "Đã xem xét", color: "bg-blue-100 text-blue-800" },
  { value: "accepted", label: "Chấp nhận", color: "bg-green-100 text-green-800" },
  { value: "rejected", label: "Từ chối", color: "bg-red-100 text-red-800" },
];

export default function Page() {
  const [jobApplications, setJobApplications] = useState<JobApplication[]>([]);
  const [selectedApplication, setSelectedApplication] = useState<JobApplication | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  // Status update form
  const [statusForm, setStatusForm] = useState<UpdateApplyStatusRequest>({
    status: "pending",
  });

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const data = await fetchAllJobApplications();
      setJobApplications(data);
    } catch {
      // error handling if needed
    }
  };

  const getFilteredApplications = () => {
    return jobApplications.filter((application) => {
      const matchesSearch =
        application.candidate?.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        application.jobPost?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        application.candidate?.email?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = filterStatus === "all" || application.status === filterStatus;

      return matchesSearch && matchesStatus;
    });
  };

  const handleUpdateStatus = async (id: string) => {
    try {
      await apiUpdateStatus(id, statusForm);
      setIsStatusDialogOpen(false);
      setStatusForm({ status: "pending" });
      fetchApplications();
    } catch {
      // error handling if needed
    }
  };

  const handleDeleteApplication = async (id: string) => {
    try {
      await apiDeleteJobApplication(id);
      setIsDeleteDialogOpen(false);
      setSelectedApplication(null);
      fetchApplications();
    } catch {
      // error handling if needed
    }
  };

  const handleView = (application: JobApplication) => {
    setSelectedApplication(application);
    setIsViewDialogOpen(true);
  };

  const handleUpdateStatusClick = (application: JobApplication) => {
    setSelectedApplication(application);
    setStatusForm({ status: application.status });
    setIsStatusDialogOpen(true);
  };

  const handleDelete = (application: JobApplication) => {
    setSelectedApplication(application);
    setIsDeleteDialogOpen(true);
  };

  const getStatusBadge = (status: ApplicationStatus) => {
    const statusConfig = applicationStatuses.find(s => s.value === status);
    return (
      <Badge className={statusConfig?.color || "bg-gray-100 text-gray-800"}>
        {statusConfig?.label || status}
      </Badge>
    );
  };

  const getStatusIcon = (status: ApplicationStatus) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case "reviewed":
        return <AlertCircle className="h-4 w-4 text-blue-500" />;
      case "accepted":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "rejected":
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const filteredApplications = getFilteredApplications();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Quản lý đơn ứng tuyển
            </h1>
            <p className="text-gray-600 mt-2">
              Quản lý tất cả đơn ứng tuyển trong hệ thống
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Tổng đơn ứng tuyển
                  </p>
                  <p className="text-3xl font-bold">{jobApplications.length}</p>
                </div>
                <FileText className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Chờ xử lý
                  </p>
                  <p className="text-3xl font-bold text-yellow-600">
                    {jobApplications.filter((a) => a.status === "pending").length}
                  </p>
                </div>
                <Clock className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Chấp nhận
                  </p>
                  <p className="text-3xl font-bold text-green-600">
                    {jobApplications.filter((a) => a.status === "accepted").length}
                  </p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Từ chối
                  </p>
                  <p className="text-3xl font-bold text-red-600">
                    {jobApplications.filter((a) => a.status === "rejected").length}
                  </p>
                </div>
                <XCircle className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Tìm kiếm ứng viên hoặc công việc..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả trạng thái</SelectItem>
                  {applicationStatuses.map((status) => (
                    <SelectItem key={status.value} value={status.value}>
                      {status.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                Bộ lọc nâng cao
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Applications Table */}
        <Card>
          <CardHeader>
            <CardTitle>Danh sách đơn ứng tuyển</CardTitle>
            <CardDescription>
              Hiển thị {filteredApplications.length} / {jobApplications.length} đơn ứng tuyển
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Ứng viên</TableHead>
                  <TableHead>Công việc</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead>Ngày ứng tuyển</TableHead>
                  <TableHead>Cập nhật lần cuối</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredApplications.map((application) => (
                  <TableRow key={application.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0">
                          <User className="h-8 w-8 text-gray-400" />
                        </div>
                        <div>
                          <p className="font-medium">{application.candidate?.fullName || "N/A"}</p>
                          <p className="text-sm text-gray-500">
                            {application.candidate?.email || "N/A"}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Briefcase className="h-4 w-4 text-gray-400" />
                        <span className="font-medium">
                          {application.jobPost?.title || "N/A"}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(application.status)}
                        {getStatusBadge(application.status)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <span className="text-sm">
                          {formatDate(application.appliedAt)}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <span className="text-sm">
                          {formatDate(application.updatedAt)}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleView(application)}>
                            <Eye className="h-4 w-4 mr-2" />
                            Xem chi tiết
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleUpdateStatusClick(application)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Cập nhật trạng thái
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => handleDelete(application)}
                            className="text-red-600"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Xóa
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* View Application Dialog */}
        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Chi tiết đơn ứng tuyển</DialogTitle>
            </DialogHeader>
            {selectedApplication && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>ID đơn ứng tuyển</Label>
                    <p className="text-sm mt-1">{selectedApplication.id}</p>
                  </div>
                  <div>
                    <Label>Trạng thái</Label>
                    <div className="mt-1">
                      {getStatusBadge(selectedApplication.status)}
                    </div>
                  </div>
                </div>

                <div>
                  <Label>Thông tin ứng viên</Label>
                  <div className="mt-2 p-3 border rounded-lg">
                    <p className="font-medium">{selectedApplication.candidate?.fullName || "N/A"}</p>
                    <p className="text-sm text-gray-600">{selectedApplication.candidate?.email || "N/A"}</p>
                  </div>
                </div>

                <div>
                  <Label>Thông tin công việc</Label>
                  <div className="mt-2 p-3 border rounded-lg">
                    <p className="font-medium">{selectedApplication.jobPost?.title || "N/A"}</p>
                    <p className="text-sm text-gray-600">{selectedApplication.jobPost?.location || "N/A"}</p>
                  </div>
                </div>

                {selectedApplication.coverLetter && (
                  <div>
                    <Label>Thư xin việc</Label>
                    <div className="mt-2 p-3 border rounded-lg bg-gray-50">
                      <p className="text-sm whitespace-pre-wrap">{selectedApplication.coverLetter}</p>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Ngày ứng tuyển</Label>
                    <p className="text-sm mt-1">{formatDate(selectedApplication.appliedAt)}</p>
                  </div>
                  <div>
                    <Label>Cập nhật lần cuối</Label>
                    <p className="text-sm mt-1">{formatDate(selectedApplication.updatedAt)}</p>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Update Status Dialog */}
        <Dialog open={isStatusDialogOpen} onOpenChange={setIsStatusDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Cập nhật trạng thái</DialogTitle>
              <DialogDescription>
                Cập nhật trạng thái đơn ứng tuyển
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div>
                <Label htmlFor="status">Trạng thái</Label>
                <Select
                  value={statusForm.status}
                  onValueChange={(value) =>
                    setStatusForm({ status: value as ApplicationStatus })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn trạng thái" />
                  </SelectTrigger>
                  <SelectContent>
                    {applicationStatuses.map((status) => (
                      <SelectItem key={status.value} value={status.value}>
                        {status.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsStatusDialogOpen(false)}
              >
                Hủy
              </Button>
              <Button
                onClick={() =>
                  selectedApplication && handleUpdateStatus(selectedApplication.id)
                }
              >
                Cập nhật
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <AlertDialog
          open={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
              <AlertDialogDescription>
                Bạn có chắc chắn muốn xóa đơn ứng tuyển này? Hành động này không thể hoàn tác.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Hủy</AlertDialogCancel>
              <AlertDialogAction
                onClick={() =>
                  selectedApplication && handleDeleteApplication(selectedApplication.id)
                }
                className="bg-red-600 hover:bg-red-700"
              >
                Xóa
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
} 