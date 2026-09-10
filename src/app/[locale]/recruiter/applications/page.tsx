"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  getCandidatesAppliedToMyJobs,
  getCandidateApplications,
  CandidateProfileBriefDto,
  CandidateApplicationDto,
} from "@/lib/api/recruiter-candidates";
import {
  InterviewItem,
  fetchInterviews,
  createInterview,
  updateInterviewStatus,
} from "@/lib/api/interviews";
import {
  Search,
  RefreshCw,
  FileText,
  User,
  Calendar,
  Video,
  MapPin,
  Clock,
  CheckCircle,
  XCircle,
  ExternalLink,
  Copy,
} from "lucide-react";
import { toBackendUrl } from "@/lib/api/url";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const ApplicationsPage = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("applicants");
  const [candidates, setCandidates] = useState<CandidateProfileBriefDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedCandidate, setSelectedCandidate] =
    useState<CandidateProfileBriefDto | null>(null);
  const [applications, setApplications] = useState<CandidateApplicationDto[]>([]);
  const [open, setOpen] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Interviews State
  const [interviews, setInterviews] = useState<InterviewItem[]>([]);
  const [interviewsLoading, setInterviewsLoading] = useState(false);

  // Schedule Interview Modal State
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);
  const [schedulingApp, setSchedulingApp] = useState<CandidateApplicationDto | null>(null);
  const [interviewDate, setInterviewDate] = useState("");
  const [interviewFormat, setInterviewFormat] = useState<"online" | "offline">("online");
  const [meetingUrl, setMeetingUrl] = useState("https://meet.google.com/new");
  const [interviewNotes, setInterviewNotes] = useState("");
  const [submittingSchedule, setSubmittingSchedule] = useState(false);

  const fetchCandidates = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getCandidatesAppliedToMyJobs();
      setCandidates(data);
    } catch (err: unknown) {
      console.error("Error fetching candidates:", err);
      setError("Không thể tải danh sách ứng viên");
      setCandidates([]);
    } finally {
      setLoading(false);
    }
  };

  const loadInterviews = async () => {
    setInterviewsLoading(true);
    try {
      const data = await fetchInterviews(user?.id ? { recruiterId: user.id } : undefined);
      setInterviews(data);
    } catch (err: unknown) {
      console.error("Error fetching interviews:", err);
    } finally {
      setInterviewsLoading(false);
    }
  };

  useEffect(() => {
    fetchCandidates();
    loadInterviews();
  }, [user?.id]);

  const handleSearch = () => {
    return candidates.filter(
      (c) =>
        c.fullName?.toLowerCase().includes(search.toLowerCase()) ||
        c.skills?.toLowerCase().includes(search.toLowerCase()) ||
        c.education?.toLowerCase().includes(search.toLowerCase())
    );
  };

  const handleOpenDialog = async (candidate: CandidateProfileBriefDto) => {
    setDetailLoading(true);
    setOpen(true);
    setSelectedCandidate(candidate);
    setError(null);
    try {
      const apps = await getCandidateApplications(candidate.userId);
      setApplications(apps);
    } catch (err: unknown) {
      console.error("Error fetching applications:", err);
      setError("Không thể tải lịch sử ứng tuyển");
      setApplications([]);
    } finally {
      setDetailLoading(false);
    }
  };

  const handleCloseDialog = () => {
    setOpen(false);
    setSelectedCandidate(null);
    setApplications([]);
    setError(null);
  };

  const openScheduleModal = (app: CandidateApplicationDto) => {
    setSchedulingApp(app);
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(9, 0, 0, 0);
    const localIso = new Date(tomorrow.getTime() - tomorrow.getTimezoneOffset() * 60000)
      .toISOString()
      .slice(0, 16);
    setInterviewDate(localIso);
    setInterviewFormat("online");
    setMeetingUrl("https://meet.google.com/new");
    setInterviewNotes("Phỏng vấn vòng 1: Trao đổi kỹ thuật và kinh nghiệm chuyên môn.");
    setScheduleModalOpen(true);
  };

  const handleCreateInterview = async () => {
    if (!schedulingApp || !selectedCandidate) return;
    if (!interviewDate) {
      toast.error("Vui lòng chọn ngày giờ phỏng vấn.");
      return;
    }
    if (!meetingUrl.trim()) {
      toast.error("Vui lòng nhập đường dẫn cuộc họp hoặc địa chỉ văn phòng.");
      return;
    }

    setSubmittingSchedule(true);
    try {
      const res = await createInterview({
        applicationId: schedulingApp.jobId,
        jobPostId: schedulingApp.jobId,
        jobTitle: schedulingApp.jobTitle,
        companyName: (user as { companyName?: string } | null)?.companyName || user?.fullName || "Công ty tuyển dụng",
        candidateId: selectedCandidate.userId,
        candidateName: selectedCandidate.fullName,
        recruiterId: user?.id,
        scheduledAt: new Date(interviewDate).toISOString(),
        format: interviewFormat,
        meetingUrl: meetingUrl.trim(),
        notes: interviewNotes.trim(),
      });

      if (res.success) {
        toast.success("Lên lịch phỏng vấn thành công! Lời mời đã được gửi tới ứng viên.");
        setScheduleModalOpen(false);
        loadInterviews();
      } else {
        toast.error(res.message || "Không thể lên lịch phỏng vấn.");
      }
    } catch {
      toast.error("Có lỗi xảy ra khi tạo lịch phỏng vấn.");
    } finally {
      setSubmittingSchedule(false);
    }
  };

  const handleUpdateStatus = async (
    id: string,
    status: "scheduled" | "completed" | "cancelled"
  ) => {
    try {
      await updateInterviewStatus(id, status);
      toast.success(
        status === "completed"
          ? "Đã đánh dấu buổi phỏng vấn là Hoàn thành."
          : status === "cancelled"
          ? "Đã hủy lịch phỏng vấn."
          : "Đã cập nhật trạng thái."
      );
      setInterviews((prev) =>
        prev.map((i) => (i.id === id ? { ...i, status } : i))
      );
    } catch {
      toast.error("Không thể cập nhật trạng thái phỏng vấn.");
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Đã sao chép liên kết vào bộ nhớ tạm!");
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const filteredCandidates = search ? handleSearch() : candidates;

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <FileText className="h-6 w-6 text-blue-600" />
            <span>Quản lý Đơn tuyển dụng & Phỏng vấn</span>
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Theo dõi hồ sơ ứng viên nộp đơn và chủ động thiết lập lịch phỏng vấn trực tuyến hoặc trực tiếp
          </p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full max-w-md grid-cols-2 p-1 bg-slate-100 rounded-2xl">
          <TabsTrigger
            value="applicants"
            className="flex items-center gap-2 rounded-xl text-xs sm:text-sm font-semibold py-2.5"
          >
            <User className="w-4 h-4" />
            <span>Hồ sơ ứng viên ({candidates.length})</span>
          </TabsTrigger>
          <TabsTrigger
            value="interviews"
            className="flex items-center gap-2 rounded-xl text-xs sm:text-sm font-semibold py-2.5"
          >
            <Calendar className="w-4 h-4" />
            <span>Lịch phỏng vấn ({interviews.length})</span>
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: Applicants List */}
        <TabsContent value="applicants">
          <Card className="rounded-2xl border border-slate-200">
            <CardHeader className="pb-4">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Tìm theo tên ứng viên, kỹ năng, học vấn..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-10 rounded-xl"
                  />
                </div>
                <Button onClick={fetchCandidates} disabled={loading} className="rounded-xl">
                  <RefreshCw
                    className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`}
                  />
                  {loading ? "Đang tải..." : "Làm mới"}
                </Button>
              </div>
            </CardHeader>

            <CardContent>
              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl">
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              )}

              <div className="border rounded-xl overflow-hidden">
                <Table>
                  <TableHeader className="bg-slate-50">
                    <TableRow>
                      <TableHead>Họ tên ứng viên</TableHead>
                      <TableHead>Kỹ năng nổi bật</TableHead>
                      <TableHead>Kinh nghiệm</TableHead>
                      <TableHead>Học vấn</TableHead>
                      <TableHead className="text-right">Thao tác</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8">
                          <div className="flex items-center justify-center">
                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mr-2"></div>
                            Đang tải hồ sơ ứng viên...
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : filteredCandidates.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={5}
                          className="text-center py-10 text-gray-500"
                        >
                          {search
                            ? "Không tìm thấy ứng viên nào phù hợp bộ lọc"
                            : "Chưa có ứng viên nào nộp hồ sơ vào tin tuyển dụng của bạn"}
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredCandidates.map((c) => (
                        <TableRow key={c.userId} className="hover:bg-slate-50/50">
                          <TableCell className="font-semibold text-slate-900">
                            {c.fullName}
                          </TableCell>
                          <TableCell>
                            {c.skills ? (
                              <div className="flex flex-wrap gap-1">
                                {c.skills
                                  .split(",")
                                  .slice(0, 2)
                                  .map((skill, index) => (
                                    <Badge
                                      key={index}
                                      variant="secondary"
                                      className="text-xs"
                                    >
                                      {skill.trim()}
                                    </Badge>
                                  ))}
                                {c.skills.split(",").length > 2 && (
                                  <Badge variant="outline" className="text-xs">
                                    +{c.skills.split(",").length - 2}
                                  </Badge>
                                )}
                              </div>
                            ) : (
                              <span className="text-gray-400">-</span>
                            )}
                          </TableCell>
                          <TableCell>{c.experience || "-"}</TableCell>
                          <TableCell>{c.education || "-"}</TableCell>
                          <TableCell className="text-right">
                            <Button
                              onClick={() => handleOpenDialog(c)}
                              size="sm"
                              className="rounded-xl font-medium"
                            >
                              <User className="h-4 w-4 mr-1.5" />
                              Xem hồ sơ & Lên lịch
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 2: Interviews List */}
        <TabsContent value="interviews">
          <Card className="rounded-2xl border border-slate-200">
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-600" />
                <span>Danh sách lịch phỏng vấn đã thiết lập</span>
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
                <div className="text-center py-12 space-y-3">
                  <Calendar className="w-12 h-12 text-slate-300 mx-auto" />
                  <h3 className="font-bold text-slate-800 text-base">Chưa có lịch phỏng vấn nào</h3>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    Hãy vào danh sách ứng viên, chọn ứng viên phù hợp và bấm &quot;Lên lịch phỏng vấn&quot; để tạo cuộc hẹn mới.
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
                          <h4 className="font-bold text-slate-900 text-base mt-0.5">
                            Ứng viên: {item.candidateName}
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
                            ? "Sắp tới"
                            : item.status === "completed"
                            ? "Đã hoàn thành"
                            : "Đã hủy"}
                        </Badge>
                      </div>

                      <div className="space-y-1.5 text-xs text-slate-600 bg-slate-50 p-3 rounded-xl">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-slate-400 shrink-0" />
                          <span className="font-semibold text-slate-900">
                            {new Date(item.scheduledAt).toLocaleString("vi-VN", {
                              weekday: "short",
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
                            {item.format === "online" ? "Phỏng vấn Trực tuyến: " : "Địa điểm: "}
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
                          <div className="text-slate-500 italic mt-1 pt-1 border-t border-slate-200/60">
                            &ldquo;{item.notes}&rdquo;
                          </div>
                        )}
                      </div>

                      {/* Action buttons */}
                      <div className="flex items-center justify-between gap-2 pt-1">
                        {item.format === "online" && item.status === "scheduled" && (
                          <a
                            href={item.meetingUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:underline"
                          >
                            <span>Vào phòng phỏng vấn</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}

                        <div className="flex items-center gap-2 ml-auto">
                          {item.status === "scheduled" && (
                            <>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleUpdateStatus(item.id, "cancelled")}
                                className="h-8 rounded-xl text-xs text-rose-600 hover:text-rose-700 hover:bg-rose-50"
                              >
                                <XCircle className="w-3.5 h-3.5 mr-1" />
                                Hủy lịch
                              </Button>
                              <Button
                                size="sm"
                                onClick={() => handleUpdateStatus(item.id, "completed")}
                                className="h-8 rounded-xl text-xs bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
                              >
                                <CheckCircle className="w-3.5 h-3.5 mr-1" />
                                Hoàn thành
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Candidate Details & Application History Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[760px] max-h-[85vh] overflow-y-auto rounded-3xl p-6">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-slate-900">
              Chi tiết ứng viên & Lịch sử ứng tuyển
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Xem chi tiết hồ sơ ứng viên và lên lịch phỏng vấn trực tiếp
            </DialogDescription>
          </DialogHeader>

          {detailLoading ? (
            <div className="flex items-center justify-center py-10">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mr-2"></div>
              Đang tải thông tin...
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-red-600 mb-4">{error}</p>
              <Button onClick={() => handleOpenDialog(selectedCandidate!)}>
                Thử lại
              </Button>
            </div>
          ) : selectedCandidate ? (
            <div className="space-y-6">
              {/* Candidate Basic Info */}
              <div className="bg-slate-50/80 p-4 rounded-2xl border border-slate-200/80">
                <h3 className="text-sm font-bold text-slate-800 mb-3 uppercase tracking-wider">
                  Thông tin ứng viên
                </h3>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <Label className="text-slate-500 text-xs">Họ tên</Label>
                    <Input value={selectedCandidate.fullName} disabled className="mt-1 bg-white" />
                  </div>
                  <div>
                    <Label className="text-slate-500 text-xs">Kỹ năng</Label>
                    <Input value={selectedCandidate.skills || "-"} disabled className="mt-1 bg-white" />
                  </div>
                  <div>
                    <Label className="text-slate-500 text-xs">Kinh nghiệm</Label>
                    <Input value={selectedCandidate.experience || "-"} disabled className="mt-1 bg-white" />
                  </div>
                  <div>
                    <Label className="text-slate-500 text-xs">Học vấn</Label>
                    <Input value={selectedCandidate.education || "-"} disabled className="mt-1 bg-white" />
                  </div>
                </div>
              </div>

              {/* Application History */}
              <div>
                <h3 className="text-sm font-bold text-slate-800 mb-3 uppercase tracking-wider">
                  Vị trí ứng tuyển & Lên lịch phỏng vấn
                </h3>
                {applications.length === 0 ? (
                  <div className="text-gray-500 text-center py-6 border rounded-2xl bg-slate-50 text-xs">
                    Chưa có đơn ứng tuyển nào được ghi nhận.
                  </div>
                ) : (
                  <div className="border rounded-2xl overflow-hidden">
                    <Table>
                      <TableHeader className="bg-slate-50 text-xs">
                        <TableRow>
                          <TableHead>Vị trí</TableHead>
                          <TableHead>Ngày nộp</TableHead>
                          <TableHead>Trạng thái</TableHead>
                          <TableHead>CV</TableHead>
                          <TableHead className="text-right">Hành động</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody className="text-xs">
                        {applications.map((app) => (
                          <TableRow key={app.jobId} className="hover:bg-slate-50/50">
                            <TableCell className="font-bold text-slate-900">
                              {app.jobTitle}
                            </TableCell>
                            <TableCell>{formatDate(app.appliedAt)}</TableCell>
                            <TableCell>
                              <Badge
                                variant={
                                  app.status === "PENDING"
                                    ? "secondary"
                                    : app.status === "ACCEPTED"
                                    ? "default"
                                    : app.status === "REJECTED"
                                    ? "destructive"
                                    : "outline"
                                }
                                className="text-[11px]"
                              >
                                {app.status}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {app.cvUrl ? (
                                <a
                                  href={toBackendUrl(app.cvUrl)}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center text-blue-600 hover:text-blue-800 font-semibold underline"
                                >
                                  <FileText className="h-3.5 w-3.5 mr-1" />
                                  Xem CV
                                </a>
                              ) : (
                                <span className="text-gray-400">-</span>
                              )}
                            </TableCell>
                            <TableCell className="text-right">
                              <Button
                                size="sm"
                                onClick={() => openScheduleModal(app)}
                                className="rounded-xl text-xs bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-xs"
                              >
                                <Calendar className="w-3.5 h-3.5 mr-1.5" />
                                Lên lịch PV
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-red-500">
              Không thể tải thông tin ứng viên
            </div>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleCloseDialog} className="rounded-xl">
              Đóng
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Schedule Interview Modal */}
      <Dialog open={scheduleModalOpen} onOpenChange={setScheduleModalOpen}>
        <DialogContent className="sm:max-w-md rounded-3xl p-6 space-y-4">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-600" />
              Lên lịch phỏng vấn
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Thiết lập thông tin buổi phỏng vấn cho ứng viên <strong>{selectedCandidate?.fullName}</strong> vị trí <strong>{schedulingApp?.jobTitle}</strong>.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-1 text-xs">
            <div>
              <Label className="text-xs font-bold text-slate-700 block mb-1.5">
                Thời gian phỏng vấn <span className="text-rose-500">*</span>
              </Label>
              <Input
                type="datetime-local"
                value={interviewDate}
                onChange={(e) => setInterviewDate(e.target.value)}
                className="rounded-xl text-xs"
              />
            </div>

            <div>
              <Label className="text-xs font-bold text-slate-700 block mb-1.5">
                Hình thức phỏng vấn
              </Label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setInterviewFormat("online");
                    if (!meetingUrl || meetingUrl.includes("Văn phòng")) {
                      setMeetingUrl("https://meet.google.com/new");
                    }
                  }}
                  className={`p-2.5 rounded-xl border flex items-center justify-center gap-2 font-semibold transition-all ${
                    interviewFormat === "online"
                      ? "border-blue-600 bg-blue-50 text-blue-700"
                      : "border-slate-200 text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <Video className="w-4 h-4" />
                  <span>Trực tuyến</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setInterviewFormat("offline");
                    setMeetingUrl("Văn phòng công ty: Tầng 5, Tòa nhà Innovation");
                  }}
                  className={`p-2.5 rounded-xl border flex items-center justify-center gap-2 font-semibold transition-all ${
                    interviewFormat === "offline"
                      ? "border-blue-600 bg-blue-50 text-blue-700"
                      : "border-slate-200 text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <MapPin className="w-4 h-4" />
                  <span>Trực tiếp</span>
                </button>
              </div>
            </div>

            <div>
              <Label className="text-xs font-bold text-slate-700 block mb-1.5">
                {interviewFormat === "online" ? "Link cuộc họp (Google Meet / Zoom)" : "Địa chỉ phòng phỏng vấn"} <span className="text-rose-500">*</span>
              </Label>
              <Input
                value={meetingUrl}
                onChange={(e) => setMeetingUrl(e.target.value)}
                placeholder={interviewFormat === "online" ? "https://meet.google.com/..." : "Địa chỉ văn phòng công ty..."}
                className="rounded-xl text-xs"
              />
            </div>

            <div>
              <Label className="text-xs font-bold text-slate-700 block mb-1.5">
                Ghi chú / Dặn dò ứng viên
              </Label>
              <Textarea
                rows={3}
                value={interviewNotes}
                onChange={(e) => setInterviewNotes(e.target.value)}
                placeholder="Chuẩn bị portfolio, vào phòng họp trước 5 phút..."
                className="rounded-xl text-xs resize-none"
              />
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setScheduleModalOpen(false)}
              className="rounded-xl"
            >
              Hủy
            </Button>
            <Button
              onClick={handleCreateInterview}
              disabled={submittingSchedule}
              className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold"
            >
              {submittingSchedule ? "Đang gửi lời mời..." : "Xác nhận gửi lời mời"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ApplicationsPage;
