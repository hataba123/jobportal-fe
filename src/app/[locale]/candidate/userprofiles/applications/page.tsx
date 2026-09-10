"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import { toBackendUrl } from "@/lib/api/url";
import { useAuth } from "@/contexts/AuthContext";
import { InterviewItem, fetchInterviews } from "@/lib/api/interviews";
import {
  FileText,
  Calendar,
  Video,
  MapPin,
  Clock,
  ExternalLink,
  Copy,
  RefreshCw,
  Building2,
} from "lucide-react";

type Application = {
  id: string;
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
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("applications");
  const [applications, setApplications] = useState<Application[]>([]);
  const [selected, setSelected] = useState<Application | null>(null);
  const [detail, setDetail] = useState<unknown>(null);
  const [open, setOpen] = useState(false);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Interviews State
  const [interviews, setInterviews] = useState<InterviewItem[]>([]);
  const [interviewsLoading, setInterviewsLoading] = useState(false);

  const loadApplications = () => {
    fetchMyAppliedJobs().then((data: unknown) => {
      const arr = Array.isArray(data) ? data : [];

      const statusMap = [
        "PENDING",
        "REVIEWING",
        "ACCEPTED",
        "REJECTED",
      ] as const;

      setApplications(
        arr.map((item) => {
          const app = item as Partial<Application> & { status?: number };
          return {
            id: app.id || "",
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
  };

  const loadInterviews = async () => {
    setInterviewsLoading(true);
    try {
      const data = await fetchInterviews(user?.id ? { candidateId: user.id } : undefined);
      setInterviews(data);
    } catch (err: unknown) {
      console.error("Error loading candidate interviews:", err);
    } finally {
      setInterviewsLoading(false);
    }
  };

  useEffect(() => {
    loadApplications();
    loadInterviews();
  }, [user?.id]);

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
    setDeletingId(app.id);
    try {
      await deleteJobApplication(app.id);
      setApplications((prev) => prev.filter((a) => a.id !== app.id));
      toast.success("Đã hủy đơn ứng tuyển.");
    } catch {
      toast.error("Hủy đơn thất bại. Vui lòng thử lại.");
    } finally {
      setDeletingId(null);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Đã sao chép liên kết vào bộ nhớ tạm!");
  };

  return (
    <div className="max-w-6xl mx-auto my-9 px-4">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">
          Hồ sơ ứng tuyển & Phỏng vấn
        </h1>
        <p className="text-gray-600 mt-2 text-sm">
          Theo dõi trạng thái các đơn ứng tuyển và nhận lịch hẹn phỏng vấn từ nhà tuyển dụng
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full max-w-md grid-cols-2 p-1 bg-slate-100 rounded-2xl">
          <TabsTrigger
            value="applications"
            className="flex items-center gap-2 rounded-xl text-xs sm:text-sm font-semibold py-2.5"
          >
            <FileText className="w-4 h-4" />
            <span>Đơn ứng tuyển ({applications.length})</span>
          </TabsTrigger>
          <TabsTrigger
            value="interviews"
            className="flex items-center gap-2 rounded-xl text-xs sm:text-sm font-semibold py-2.5"
          >
            <Calendar className="w-4 h-4" />
            <span>Lịch phỏng vấn ({interviews.length})</span>
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: Applications */}
        <TabsContent value="applications" className="space-y-6">
          <Card className="rounded-2xl border border-slate-200">
            <CardHeader>
              <CardTitle className="text-lg">Danh sách đơn ứng tuyển ({applications.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border rounded-xl overflow-hidden">
                <Table>
                  <TableHeader className="bg-slate-50">
                    <TableRow>
                      <TableHead>Vị trí công việc</TableHead>
                      <TableHead>Địa điểm</TableHead>
                      <TableHead>Mức lương</TableHead>
                      <TableHead>Ngày ứng tuyển</TableHead>
                      <TableHead>Trạng thái</TableHead>
                      <TableHead className="text-right">Thao tác</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {applications.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-10 text-slate-500">
                          Bạn chưa ứng tuyển vào vị trí nào.
                        </TableCell>
                      </TableRow>
                    ) : (
                      applications.map((application) => (
                        <TableRow key={application.id} className="hover:bg-slate-50/50">
                          <TableCell className="font-semibold text-slate-900">
                            {application.title}
                          </TableCell>
                          <TableCell>{application.location || "Toàn quốc"}</TableCell>
                          <TableCell>{application.salary || "Thương lượng"}</TableCell>
                          <TableCell>
                            {new Date(application.appliedAt).toLocaleDateString("vi-VN")}
                          </TableCell>
                          <TableCell>{getStatusBadge(application.status)}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleViewDetail(application)}
                                className="rounded-xl text-xs"
                              >
                                Xem chi tiết
                              </Button>
                              {application.status === "PENDING" && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-xl text-xs"
                                  onClick={() => handleCancel(application)}
                                  disabled={deletingId === application.id}
                                >
                                  {deletingId === application.id ? "Đang hủy..." : "Hủy đơn"}
                                </Button>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          {/* Statistics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <Card className="rounded-2xl border border-slate-200">
              <CardContent className="p-4">
                <div className="text-2xl font-black text-amber-600">
                  {applications.filter((app) => app.status === "PENDING").length}
                </div>
                <div className="text-xs text-gray-500 font-semibold uppercase mt-1">Chờ xử lý</div>
              </CardContent>
            </Card>
            <Card className="rounded-2xl border border-slate-200">
              <CardContent className="p-4">
                <div className="text-2xl font-black text-blue-600">
                  {applications.filter((app) => app.status === "REVIEWING").length}
                </div>
                <div className="text-xs text-gray-500 font-semibold uppercase mt-1">Đang xem xét</div>
              </CardContent>
            </Card>
            <Card className="rounded-2xl border border-slate-200">
              <CardContent className="p-4">
                <div className="text-2xl font-black text-emerald-600">
                  {applications.filter((app) => app.status === "ACCEPTED").length}
                </div>
                <div className="text-xs text-gray-500 font-semibold uppercase mt-1">Được chấp nhận</div>
              </CardContent>
            </Card>
            <Card className="rounded-2xl border border-slate-200">
              <CardContent className="p-4">
                <div className="text-2xl font-black text-rose-600">
                  {applications.filter((app) => app.status === "REJECTED").length}
                </div>
                <div className="text-xs text-gray-500 font-semibold uppercase mt-1">Từ chối</div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Tab 2: Interviews */}
        <TabsContent value="interviews" className="space-y-6">
          <Card className="rounded-2xl border border-slate-200">
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-600" />
                <span>Lịch hẹn phỏng vấn từ nhà tuyển dụng ({interviews.length})</span>
              </CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={loadInterviews}
                disabled={interviewsLoading}
                className="rounded-xl"
              >
                <RefreshCw
                  className={`h-4 w-4 mr-1.5 ${interviewsLoading ? "animate-spin" : ""}`}
                />
                Làm mới
              </Button>
            </CardHeader>

            <CardContent>
              {interviews.length === 0 ? (
                <div className="text-center py-14 space-y-3">
                  <Calendar className="w-14 h-14 text-slate-300 mx-auto" />
                  <h3 className="font-bold text-slate-800 text-base">Chưa có lịch hẹn phỏng vấn</h3>
                  <p className="text-xs text-slate-500 max-w-md mx-auto">
                    Khi nhà tuyển dụng chấp thuận hồ sơ và mời bạn tham gia phỏng vấn (Google Meet hoặc tại văn phòng), thông tin lịch hẹn và đường link sẽ xuất hiện tại đây.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {interviews.map((item) => (
                    <div
                      key={item.id}
                      className="p-5 rounded-2xl border border-slate-200 bg-white hover:shadow-xs transition-all space-y-3"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <span className="text-xs font-bold text-blue-600 block uppercase tracking-wider">
                            {item.jobTitle}
                          </span>
                          <h4 className="font-bold text-slate-900 text-base mt-0.5 flex items-center gap-1.5">
                            <Building2 className="w-4 h-4 text-slate-500" />
                            <span>{item.companyName}</span>
                          </h4>
                        </div>
                        <Badge
                          variant={
                            item.status === "completed"
                              ? "default"
                              : item.status === "cancelled"
                              ? "destructive"
                              : "secondary"
                          }
                          className="capitalize text-xs font-semibold rounded-lg"
                        >
                          {item.status === "scheduled"
                            ? "Sắp diễn ra"
                            : item.status === "completed"
                            ? "Đã hoàn thành"
                            : "Đã hủy"}
                        </Badge>
                      </div>

                      <div className="space-y-2 text-xs text-slate-600 bg-slate-50 p-3 rounded-xl">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-slate-400 shrink-0" />
                          <span className="font-semibold text-slate-900">
                            {new Date(item.scheduledAt).toLocaleString("vi-VN", {
                              weekday: "long",
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          {item.format === "online" ? (
                            <Video className="w-4 h-4 text-blue-600 shrink-0" />
                          ) : (
                            <MapPin className="w-4 h-4 text-amber-600 shrink-0" />
                          )}
                          <span className="font-medium truncate">
                            {item.format === "online" ? "Phỏng vấn Online: " : "Địa điểm: "}
                            {item.meetingUrl}
                          </span>
                          {item.format === "online" && (
                            <button
                              onClick={() => copyToClipboard(item.meetingUrl)}
                              className="text-slate-400 hover:text-slate-700 ml-auto p-1"
                              title="Sao chép link"
                            >
                              <Copy className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>

                        {item.notes && (
                          <div className="text-slate-600 mt-1 pt-1 border-t border-slate-200/60">
                            <strong>Dặn dò từ NTD:</strong> &ldquo;{item.notes}&rdquo;
                          </div>
                        )}
                      </div>

                      {/* Action buttons */}
                      <div className="flex items-center justify-between gap-2 pt-1">
                        {item.format === "online" && item.status === "scheduled" ? (
                          <a
                            href={item.meetingUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs transition-colors shadow-xs"
                          >
                            <span>Tham gia phỏng vấn</span>
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        ) : (
                          <span className="text-xs text-slate-400 italic">
                            Vui lòng có mặt đúng giờ theo lịch hẹn.
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Dialog xem chi tiết đơn */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="rounded-3xl p-6">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold">Chi tiết đơn ứng tuyển</DialogTitle>
          </DialogHeader>
          {loadingDetail ? (
            <div className="py-8 text-center text-gray-500">Đang tải...</div>
          ) : detail ? (
            (() => {
              const d: Partial<Application> & { [key: string]: unknown } =
                detail as Partial<Application> & { [key: string]: unknown };
              return (
                <div className="space-y-3 text-xs">
                  <div>
                    <b className="text-slate-700">Vị trí:</b> {String(d.jobTitle || selected?.title || "")}
                  </div>
                  <div>
                    <b className="text-slate-700">Địa điểm:</b>{" "}
                    {String(d.location || selected?.location || "")}
                  </div>
                  <div>
                    <b className="text-slate-700">Mức lương:</b>{" "}
                    {String(d.salary || selected?.salary || "")}
                  </div>
                  <div>
                    <b className="text-slate-700">Mô tả công việc:</b>{" "}
                    {String(d.description || selected?.description || "")}
                  </div>
                  <div>
                    <b className="text-slate-700">Yêu cầu kỹ năng:</b>{" "}
                    {String(d.skillsRequired || selected?.skillsRequired || "")}
                  </div>
                  <div>
                    <b className="text-slate-700">Trạng thái:</b>{" "}
                    {getStatusBadge(
                      (d.status as Application["status"]) ||
                        selected?.status ||
                        "PENDING"
                    )}
                  </div>
                  {typeof d.cvUrl === "string" && d.cvUrl ? (
                    <div className="pt-2">
                      <a
                        href={toBackendUrl(d.cvUrl)}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-600 underline font-semibold inline-flex items-center gap-1"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>Xem CV đã nộp</span>
                      </a>
                    </div>
                  ) : null}
                </div>
              );
            })()
          ) : (
            <div className="py-8 text-center text-red-500">
              Không thể tải chi tiết đơn ứng tuyển.
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
