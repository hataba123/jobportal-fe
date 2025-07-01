"use client";
import { useState, useEffect } from "react";
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
import {
  fetchMyAppliedJobs,
  deleteJobApplication,
  fetchJobApplicationDetail,
} from "@/lib/api/job-application";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import axiosInstance from "@/lib/axiosInstance";

type Application = {
  id: string; // ← cần thêm
  jobPostId: string;
  title: string;
  description: string;
  skillsRequired: string;
  location: string;
  salary: string;
  appliedAt: string;
  status: "PENDING" | "REVIEWING" | "ACCEPTED" | "REJECTED";
};

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

  if (!config) {
    return <Badge className="bg-gray-100 text-gray-800">Không rõ</Badge>;
  }

  return <Badge className={config.className}>{config.label}</Badge>;
};

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [selected, setSelected] = useState<Application | null>(null);
  const [detail, setDetail] = useState<unknown>(null);
  const [open, setOpen] = useState(false);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [newCvFile, setNewCvFile] = useState<File | null>(null);
  const [updatingCv, setUpdatingCv] = useState(false);

  useEffect(() => {
    fetchMyAppliedJobs().then((data: unknown) => {
      const arr = Array.isArray(data) ? data : [];
  
      const statusMap = ["PENDING", "REVIEWING", "ACCEPTED", "REJECTED"] as const;
  
      setApplications(
        arr.map((item) => {
          const app = item as Partial<Application> & { status?: number };
          return {
            id: app.id || "", // ✅ thêm dòng này
            jobPostId: app.jobPostId || "",
            title: app.title || "(Không có tiêu đề)",
            description: app.description || "",
            skillsRequired: app.skillsRequired || "",
            location: app.location || "",
            salary: app.salary ? app.salary.toLocaleString() : "",
            appliedAt: app.appliedAt || "",
            status: statusMap[app.status ?? 0] ?? "PENDING",
          };
        })
      );
    });
  }, []);

  const handleViewDetail = async (app: Application) => {
    setSelected(app);
    setOpen(true);
    setLoadingDetail(true);
    try {
      const data = await fetchJobApplicationDetail(app.id);
      setDetail(data);
    } catch {
      setDetail(null);
    } finally {
      setLoadingDetail(false);
    }
  };

  const handleCancel = async (app: Application) => {
    setDeletingId(app.jobPostId);
    try {
      await deleteJobApplication(app.jobPostId);
      setApplications((prev) =>
        prev.filter((a) => a.jobPostId !== app.jobPostId)
      );
      toast.success("Đã hủy đơn ứng tuyển.");
    } catch {
      toast.error("Hủy đơn thất bại. Vui lòng thử lại.");
    } finally {
      setDeletingId(null);
    }
  };

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
                    {application.title}
                  </TableCell>
                  <TableCell>{application.location}</TableCell>
                  <TableCell>{application.salary}</TableCell>
                  <TableCell>
                    {new Date(application.appliedAt).toLocaleDateString(
                      "vi-VN"
                    )}
                  </TableCell>
                  <TableCell>{getStatusBadge(application.status)}</TableCell>
                  <TableCell>
                    <div className="space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewDetail(application)}
                      >
                        Xem chi tiết
                      </Button>
                      {application.status === "PENDING" && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-red-600"
                          onClick={() => handleCancel(application)}
                          disabled={deletingId === application.id}
                        >
                          {deletingId === application.id
                            ? "Đang hủy..."
                            : "Hủy đơn"}
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

      {/* Dialog xem chi tiết */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Chi tiết đơn ứng tuyển</DialogTitle>
          </DialogHeader>
          {loadingDetail ? (
            <div className="py-8 text-center text-gray-500">Đang tải...</div>
          ) : detail ? (
            (() => {
              const d: Partial<Application> & { [key: string]: unknown } =
                detail as Partial<Application> & { [key: string]: unknown };
              return (
                <div className="space-y-2">
                  <div>
                    <b>Vị trí:</b> {String(d.jobTitle || selected?.title || "")}
                  </div>
                  <div>
                    <b>Địa điểm:</b>{" "}
                    {String(d.location || selected?.location || "")}
                  </div>
                  <div>
                    <b>Lương:</b> {String(d.salary || selected?.salary || "")}
                  </div>
                  <div>
                    <b>Ngày ứng tuyển:</b>{" "}
                    {d.appliedAt
                      ? new Date(String(d.appliedAt)).toLocaleDateString(
                          "vi-VN"
                        )
                      : selected?.appliedAt || ""}
                  </div>
                  <div>
                    <b>Trạng thái:</b>{" "}
                    {getStatusBadge(
                      (typeof d.status === "string"
                        ? d.status.toUpperCase()
                        : selected?.status || "PENDING") as Application["status"]
                    )}
                  </div>
                  <div>
                    <b>Mô tả:</b>{" "}
                    {String(d.description || selected?.description || "")}
                  </div>
                  <div>
                    <b>Kỹ năng yêu cầu:</b>{" "}
                    {String(d.skillsRequired || selected?.skillsRequired || "")}
                  </div>
                  {typeof d.cvUrl === "string" && d.cvUrl.length > 0 && (
                    <div>
                      <b>CV đã nộp:</b>{" "}
                      <a
                        href={d.cvUrl.startsWith("https") ? d.cvUrl : `https://localhost:7146${d.cvUrl}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 underline"
                      >
                        Xem CV
                      </a>
                      <div className="mt-2">
                        <input
                          type="file"
                          accept=".pdf,.doc,.docx"
                          onChange={e => setNewCvFile(e.target.files?.[0] || null)}
                          disabled={updatingCv}
                        />
                        <Button
                          size="sm"
                          className="ml-2"
                          disabled={!newCvFile || updatingCv}
                          onClick={async () => {
                            if (!newCvFile) return;
                            setUpdatingCv(true);
                            try {
                              const formData = new FormData();
                              formData.append("file", newCvFile);
                              // Gọi API cập nhật lại CV cho đơn ứng tuyển
                              const res = await axiosInstance.put(`/jobapplication/${d.id}/cv`, formData, {
                                headers: { "Content-Type": "multipart/form-data" },
                              });
                              toast.success("Cập nhật CV thành công!");
                              setDetail({ ...d, cvUrl: res.data.cvUrl });
                              setNewCvFile(null);
                            } catch {
                              toast.error("Cập nhật CV thất bại!");
                            } finally {
                              setUpdatingCv(false);
                            }
                          }}
                        >
                          {updatingCv ? "Đang cập nhật..." : "Thay đổi CV"}
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })()
          ) : (
            <div className="py-8 text-center text-gray-500">
              Không tìm thấy chi tiết đơn ứng tuyển.
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
