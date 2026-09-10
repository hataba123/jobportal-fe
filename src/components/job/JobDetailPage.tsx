"use client";

import React, { useState, useEffect } from "react";
import { useRouter, Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import CompanyLogo from "@/components/common/CompanyLogo";
import {
  MapPin,
  DollarSign,
  Briefcase,
  CalendarDays,
  Users,
  Share2,
  Bookmark,
  Building2,
  Globe,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  UploadCloud,
  FileText,
  ExternalLink,
  Sparkles,
  Flag,
} from "lucide-react";
import { fetchJobPostById, fetchAllJobPosts } from "@/lib/api/jobpost";
import { JobPost } from "@/types/JobPost";
import { fetchSavedJobs, saveJob, unsaveJob } from "@/lib/api/saved-job";
import { toast } from "sonner";
import { applyJob } from "@/lib/api/job-application";
import { fetchMyProfile, uploadCv } from "@/lib/api/candidate-profile";
import { toBackendUrl } from "@/lib/api/url";
import { submitJobReport } from "@/lib/api/reports";

interface SimilarJob {
  id: string;
  title: string;
  companyName: string;
  location: string;
  salary: number;
}

export default function JobDetailPage({ jobId }: { jobId: string }) {
  const router = useRouter();
  const [job, setJob] = useState<JobPost | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isApplying, setIsApplying] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [applyModalOpen, setApplyModalOpen] = useState(false);
  const [similarJobs, setSimilarJobs] = useState<SimilarJob[]>([]);
  const [coverLetter, setCoverLetter] = useState("");
  const [newResume, setNewResume] = useState<File | null>(null);
  const [existingCvUrl, setExistingCvUrl] = useState<string | null>(null);
  const [useExistingCv, setUseExistingCv] = useState(true);

  // Report Modal State
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [reportReason, setReportReason] = useState("Dấu hiệu lừa đảo / giả mạo công ty");
  const [reportDetail, setReportDetail] = useState("");
  const [submittingReport, setSubmittingReport] = useState(false);

  useEffect(() => {
    const fetchJob = async () => {
      setIsLoading(true);
      try {
        const jobData = await fetchJobPostById(jobId);
        setJob(jobData);

        if (jobData.categoryId) {
          const allJobs = await fetchAllJobPosts();
          const similar = allJobs
            .filter((j: JobPost) => j.id !== jobId && j.categoryId === jobData.categoryId)
            .slice(0, 3)
            .map((j: JobPost) => ({
              id: j.id,
              title: j.title,
              companyName: j.employer?.fullName || j.companyName || "N/A",
              location: j.location || "Toàn quốc",
              salary: j.salary,
            }));
          setSimilarJobs(similar);
        }
      } catch (error) {
        console.error("Error fetching job:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (jobId) {
      fetchJob();
    }

    // Check saved status
    fetchSavedJobs().then((data: unknown) => {
      const arr = Array.isArray(data) ? data : [];
      const found = arr.find((item) => {
        const sj = item as { jobPostId?: string };
        return sj.jobPostId === jobId;
      });
      setIsSaved(!!found);
    });

    // Check candidate profile CV
    fetchMyProfile().then((profile) => {
      const url = profile.cvUrl || profile.resumeUrl || null;
      setExistingCvUrl(url);
      setUseExistingCv(!!url);
    });
  }, [jobId]);

  const handleApply = async () => {
    setIsApplying(true);
    try {
      let cvUrl: string | undefined = undefined;
      if (existingCvUrl && useExistingCv) {
        cvUrl = existingCvUrl;
      } else if (newResume) {
        cvUrl = await uploadCv(newResume);
      }

      if (!cvUrl) {
        toast.error("Vui lòng tải lên CV hoặc chọn nộp bằng CV đã lưu.");
        setIsApplying(false);
        return;
      }

      await applyJob(jobId);
      toast.success("Nộp đơn ứng tuyển thành công! Nhà tuyển dụng sẽ sớm liên hệ.");
      setApplyModalOpen(false);
      setCoverLetter("");
      setNewResume(null);
    } catch (error: unknown) {
      type ErrorWithResponse = { response?: { data?: { message?: string } } };
      const errorMessage =
        error &&
        typeof error === "object" &&
        "response" in error &&
        (error as ErrorWithResponse).response?.data?.message
          ? (error as ErrorWithResponse).response!.data!.message!
          : "Có lỗi xảy ra khi gửi đơn ứng tuyển. Vui lòng thử lại.";
      toast.error(errorMessage);
    } finally {
      setIsApplying(false);
    }
  };

  const handleSaveToggle = async () => {
    try {
      if (isSaved) {
        await unsaveJob(jobId);
        setIsSaved(false);
        toast.success("Đã bỏ lưu việc làm.");
      } else {
        await saveJob(jobId);
        setIsSaved(true);
        toast.success("Đã lưu việc làm vào mục yêu thích!");
      }
    } catch {
      toast.error("Không thể thay đổi trạng thái lưu việc làm.");
    }
  };

  const handleShare = () => {
    if (typeof navigator !== "undefined" && navigator.share) {
      navigator
        .share({
          title: job?.title,
          text: `Tuyển dụng vị trí ${job?.title} tại ${job?.employer?.fullName || "JobPortal"}`,
          url: window.location.href,
        })
        .catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Đã sao chép liên kết vào bộ nhớ tạm!");
    }
  };

  const handleReport = async () => {
    if (!job) return;
    if (!reportDetail.trim()) {
      toast.error("Vui lòng nhập chi tiết phản ánh hoặc lý do vi phạm.");
      return;
    }
    setSubmittingReport(true);
    try {
      await submitJobReport({
        jobPostId: job.id,
        reason: reportReason,
        description: reportDetail.trim(),
      });
      toast.success("Báo cáo vi phạm đã được gửi thành công! Ban quản trị sẽ rà soát.");
      setReportModalOpen(false);
      setReportDetail("");
    } catch {
      toast.error("Có lỗi xảy ra khi gửi báo cáo. Vui lòng thử lại sau.");
    } finally {
      setSubmittingReport(false);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="animate-pulse space-y-6">
          <div className="h-4 bg-slate-200 rounded w-1/4"></div>
          <div className="h-40 bg-white rounded-2xl border border-slate-200"></div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 h-96 bg-white rounded-2xl border border-slate-200"></div>
            <div className="h-80 bg-white rounded-2xl border border-slate-200"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="max-w-xl mx-auto my-20 p-8 bg-white rounded-2xl border border-slate-200 text-center space-y-4">
        <Briefcase className="w-12 h-12 text-slate-300 mx-auto" />
        <h1 className="text-xl font-bold text-slate-900">Không tìm thấy việc làm</h1>
        <p className="text-sm text-slate-500">
          Công việc này có thể đã hết hạn, bị gỡ bỏ hoặc đường dẫn không chính xác.
        </p>
        <Button onClick={() => router.push("/candidate/job")} className="rounded-xl">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Quay lại danh sách việc làm
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/60 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs font-medium text-slate-500 mb-6">
          <Link href="/candidate/job" className="hover:text-blue-600 transition-colors">
            Việc làm
          </Link>
          <span>/</span>
          {job.categoryName && (
            <>
              <Link
                href={`/candidate/category/${job.categoryId || "all"}`}
                className="hover:text-blue-600 transition-colors"
              >
                {job.categoryName}
              </Link>
              <span>/</span>
            </>
          )}
          <span className="text-slate-900 font-semibold truncate max-w-xs sm:max-w-md">
            {job.title}
          </span>
        </nav>

        {/* Hero Job Banner Card */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 sm:p-8 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="flex items-start gap-5">
              <CompanyLogo
                src={job.logo}
                name={job.employer?.fullName || job.companyName || "Công ty"}
                size="lg"
                rounded="rounded-2xl"
              />
              <div className="space-y-1.5">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  {job.title}
                </h1>
                <p className="text-sm font-semibold text-blue-600 flex items-center gap-1.5">
                  <Building2 className="w-4 h-4" />
                  <Link
                    href={`/candidate/company/${job.companyId}`}
                    className="hover:underline"
                  >
                    {job.employer?.fullName || job.companyName || "Công ty đối tác"}
                  </Link>
                </p>
                <div className="flex flex-wrap items-center gap-3 pt-2 text-xs sm:text-sm text-slate-600">
                  <span className="inline-flex items-center gap-1 font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200/60">
                    <DollarSign className="w-4 h-4" />
                    {Number(job.salary) > 0 ? `${Number(job.salary).toLocaleString()}$ / tháng` : "Thương lượng"}
                  </span>
                  <span className="inline-flex items-center gap-1 bg-slate-100 px-2.5 py-1 rounded-lg">
                    <MapPin className="w-4 h-4 text-slate-400" />
                    {job.location || "Toàn quốc"}
                  </span>
                  <span className="inline-flex items-center gap-1 bg-slate-100 px-2.5 py-1 rounded-lg">
                    <Briefcase className="w-4 h-4 text-slate-400" />
                    {job.type || "Full-time"}
                  </span>
                  <span className="inline-flex items-center gap-1 bg-slate-100 px-2.5 py-1 rounded-lg">
                    <Users className="w-4 h-4 text-slate-400" />
                    {job.applicants || 0} ứng viên đã nộp
                  </span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 self-start lg:self-center">
              <Button
                variant="outline"
                size="icon"
                onClick={handleSaveToggle}
                className={`w-11 h-11 rounded-2xl border-slate-200 transition-all ${
                  isSaved ? "bg-rose-50 text-rose-600 border-rose-200" : "text-slate-600 hover:bg-slate-100"
                }`}
                title={isSaved ? "Bỏ lưu việc làm" : "Lưu việc làm"}
              >
                <Bookmark className={`w-5 h-5 ${isSaved ? "fill-current" : ""}`} />
              </Button>

              <Button
                variant="outline"
                size="icon"
                onClick={handleShare}
                className="w-11 h-11 rounded-2xl border-slate-200 text-slate-600 hover:bg-slate-100 transition-all"
                title="Chia sẻ việc làm"
              >
                <Share2 className="w-5 h-5" />
              </Button>

              <Button
                variant="outline"
                size="icon"
                onClick={() => setReportModalOpen(true)}
                className="w-11 h-11 rounded-2xl border-slate-200 text-slate-500 hover:text-rose-600 hover:bg-rose-50 hover:border-rose-200 transition-all"
                title="Báo cáo tin tuyển dụng vi phạm"
              >
                <Flag className="w-5 h-5" />
              </Button>

              <Dialog open={applyModalOpen} onOpenChange={setApplyModalOpen}>
                <DialogTrigger asChild>
                  <Button
                    size="lg"
                    className="h-11 px-8 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-md shadow-blue-500/20 active:scale-95 transition-all"
                  >
                    Ứng tuyển ngay
                  </Button>
                </DialogTrigger>

                <DialogContent className="sm:max-w-lg rounded-3xl p-6">
                  <DialogHeader>
                    <DialogTitle className="text-xl font-bold text-slate-900">
                      Ứng tuyển: {job.title}
                    </DialogTitle>
                    <DialogDescription className="text-xs text-slate-500">
                      {job.employer?.fullName || "Nhà tuyển dụng"} sẽ nhận được CV và thông tin liên hệ của bạn.
                    </DialogDescription>
                  </DialogHeader>

                  <div className="space-y-5 my-3">
                    {/* CV Selection Options */}
                    <div>
                      <Label className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 block">
                        Chọn CV ứng tuyển
                      </Label>

                      {existingCvUrl && (
                        <label
                          className={`flex items-start gap-3 p-3.5 rounded-2xl border cursor-pointer transition-all mb-3 ${
                            useExistingCv
                              ? "border-blue-600 bg-blue-50/50"
                              : "border-slate-200 hover:border-slate-300"
                          }`}
                        >
                          <input
                            type="radio"
                            name="cvOption"
                            checked={useExistingCv}
                            onChange={() => setUseExistingCv(true)}
                            className="mt-0.5 text-blue-600 focus:ring-blue-500"
                          />
                          <div className="flex-1 text-xs">
                            <p className="font-bold text-slate-900">Sử dụng CV sẵn có trong hồ sơ</p>
                            <p className="text-slate-500 truncate mt-0.5 max-w-xs">{existingCvUrl}</p>
                          </div>
                        </label>
                      )}

                      <label
                        className={`flex items-start gap-3 p-3.5 rounded-2xl border cursor-pointer transition-all ${
                          !useExistingCv || !existingCvUrl
                            ? "border-blue-600 bg-blue-50/50"
                            : "border-slate-200 hover:border-slate-300"
                        }`}
                      >
                        <input
                          type="radio"
                          name="cvOption"
                          checked={!useExistingCv || !existingCvUrl}
                          onChange={() => setUseExistingCv(false)}
                          className="mt-0.5 text-blue-600 focus:ring-blue-500"
                        />
                        <div className="flex-1 text-xs">
                          <p className="font-bold">Tải lên CV mới (PDF)</p>
                          <input
                            type="file"
                            accept="application/pdf"
                            onChange={(e) => setNewResume(e.target.files?.[0] || null)}
                            className="mt-2 text-xs file:mr-2 file:py-1 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 cursor-pointer"
                          />
                          {newResume && (
                            <p className="text-emerald-600 font-semibold mt-1">
                              Đã chọn file: {newResume.name}
                            </p>
                          )}
                        </div>
                      </label>
                    </div>

                    {/* Cover Letter */}
                    <div>
                      <Label htmlFor="coverLetter" className="text-xs font-bold text-slate-700 block mb-1.5">
                        Thư giới thiệu (Không bắt buộc)
                      </Label>
                      <Textarea
                        id="coverLetter"
                        rows={4}
                        placeholder="Nêu bật lý do bạn phù hợp với vị trí này..."
                        value={coverLetter}
                        onChange={(e) => setCoverLetter(e.target.value)}
                        className="rounded-xl text-xs bg-slate-50 border-slate-200 resize-none"
                      />
                    </div>
                  </div>

                  <DialogFooter className="gap-2 sm:gap-0">
                    <Button
                      variant="outline"
                      onClick={() => setApplyModalOpen(false)}
                      className="rounded-xl"
                    >
                      Hủy
                    </Button>
                    <Button
                      onClick={handleApply}
                      disabled={isApplying}
                      className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold"
                    >
                      {isApplying ? "Đang gửi hồ sơ..." : "Xác nhận nộp đơn"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              {/* Report Modal */}
              <Dialog open={reportModalOpen} onOpenChange={setReportModalOpen}>
                <DialogContent className="sm:max-w-md rounded-3xl p-6">
                  <DialogHeader>
                    <DialogTitle className="text-xl font-bold text-slate-900 flex items-center gap-2">
                      <Flag className="w-5 h-5 text-rose-500" />
                      Báo cáo tin tuyển dụng vi phạm
                    </DialogTitle>
                    <DialogDescription className="text-xs text-slate-500">
                      Chúng tôi cam kết bảo mật danh tính người báo cáo và xử lý nghiêm các trường hợp lừa đảo hoặc vi phạm tiêu chuẩn cộng đồng.
                    </DialogDescription>
                  </DialogHeader>

                  <div className="space-y-4 py-2">
                    <div>
                      <Label className="text-xs font-bold text-slate-700 block mb-1.5">
                        Lý do báo cáo
                      </Label>
                      <select
                        value={reportReason}
                        onChange={(e) => setReportReason(e.target.value)}
                        className="w-full text-xs rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 font-medium focus:outline-none focus:ring-2 focus:ring-rose-500"
                      >
                        <option value="Dấu hiệu lừa đảo / giả mạo công ty">Dấu hiệu lừa đảo / giả mạo công ty</option>
                        <option value="Yêu cầu nộp phí / cọc tiền ứng tuyển">Yêu cầu nộp phí / cọc tiền ứng tuyển</option>
                        <option value="Thông tin mô tả sai lệch, lôi kéo đa cấp">Thông tin mô tả sai lệch, lôi kéo đa cấp</option>
                        <option value="Nội dung phản cảm hoặc vi phạm pháp luật">Nội dung phản cảm hoặc vi phạm pháp luật</option>
                        <option value="Lý do khác">Lý do khác</option>
                      </select>
                    </div>

                    <div>
                      <Label className="text-xs font-bold text-slate-700 block mb-1.5">
                        Chi tiết phản ánh <span className="text-rose-500">*</span>
                      </Label>
                      <Textarea
                        rows={3}
                        placeholder="Mô tả cụ thể bằng chứng hoặc nội dung vi phạm..."
                        value={reportDetail}
                        onChange={(e) => setReportDetail(e.target.value)}
                        className="rounded-xl text-xs bg-slate-50 border-slate-200 resize-none"
                      />
                    </div>

                  </div>

                  <DialogFooter className="gap-2 sm:gap-0">
                    <Button
                      variant="outline"
                      onClick={() => setReportModalOpen(false)}
                      className="rounded-xl"
                    >
                      Hủy
                    </Button>
                    <Button
                      onClick={handleReport}
                      disabled={submittingReport}
                      className="rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold"
                    >
                      {submittingReport ? "Đang gửi báo cáo..." : "Gửi báo cáo"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>

        {/* Main Content Layout: 2 Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Job Description & Details */}
          <div className="lg:col-span-8 space-y-8">
            {/* Description */}
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs">
              <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600" />
                <span>Mô tả công việc</span>
              </h2>
              <div className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                {job.description || "Chưa có mô tả chi tiết."}
              </div>
            </div>

            {/* Skills Required */}
            {job.skillsRequired && (
              <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs">
                <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-indigo-600" />
                  <span>Kỹ năng yêu cầu</span>
                </h2>
                <div className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                  {job.skillsRequired}
                </div>
              </div>
            )}

            {/* Tags */}
            {Array.isArray(job.tags) && job.tags.length > 0 && (
              <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs">
                <h3 className="text-sm font-bold text-slate-900 mb-3">Từ khóa liên quan</h3>
                <div className="flex flex-wrap gap-2">
                  {job.tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="px-3 py-1 text-xs font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-lg"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Sticky Company Profile & Similar Jobs */}
          <div className="lg:col-span-4 space-y-6">
            {/* Company Info Card */}
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-4">
              <h3 className="text-base font-bold text-slate-900">Về công ty</h3>
              <div className="flex items-center gap-3">
                <CompanyLogo
                  src={job.logo}
                  name={job.employer?.fullName || job.companyName || "Công ty"}
                  size="md"
                />
                <div>
                  <h4 className="font-bold text-sm text-slate-900">
                    {job.employer?.fullName || job.companyName || "Công ty công nghệ"}
                  </h4>
                  <p className="text-xs text-slate-500">Đối tác tuyển dụng uy tín</p>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 space-y-2 text-xs text-slate-600">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Địa điểm:</span>
                  <span className="font-medium text-slate-800">{job.location || "Toàn quốc"}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Hình thức:</span>
                  <span className="font-medium text-slate-800">{job.type || "Full-time"}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Ngày đăng:</span>
                  <span className="font-medium text-slate-800">
                    {job.createdAt ? new Date(job.createdAt).toLocaleDateString("vi-VN") : "Gần đây"}
                  </span>
                </div>
              </div>

              {job.companyId && (
                <Button
                  variant="outline"
                  onClick={() => router.push(`/candidate/company/${job.companyId}`)}
                  className="w-full rounded-xl text-xs font-semibold mt-2"
                >
                  <span>Xem hồ sơ công ty</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                </Button>
              )}
            </div>

            {/* Similar Jobs */}
            {similarJobs.length > 0 && (
              <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-4">
                <h3 className="text-base font-bold text-slate-900">Việc làm tương tự</h3>
                <div className="space-y-3">
                  {similarJobs.map((simJob) => (
                    <div
                      key={simJob.id}
                      onClick={() => router.push(`/candidate/job/${simJob.id}`)}
                      className="p-3 rounded-2xl border border-slate-100 hover:border-blue-500/40 hover:bg-blue-50/30 transition-all cursor-pointer space-y-1"
                    >
                      <h4 className="font-bold text-xs text-slate-900 line-clamp-1 hover:text-blue-600">
                        {simJob.title}
                      </h4>
                      <p className="text-[11px] text-slate-500 truncate">{simJob.companyName}</p>
                      <div className="flex items-center justify-between pt-1 text-[11px]">
                        <span className="text-emerald-600 font-bold">
                          {Number(simJob.salary) > 0 ? `${Number(simJob.salary).toLocaleString()}$` : "Thương lượng"}
                        </span>
                        <span className="text-slate-400">{simJob.location}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
