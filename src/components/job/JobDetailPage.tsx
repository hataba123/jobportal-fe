"use client";

import { useState, useEffect } from "react";
import { useRouter } from "@/i18n/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  MapPin,
  DollarSign,
  Briefcase,
  CalendarDays,
  Users,
  Heart,
  Share2,
  Bookmark,
  Building2,
  Globe,
  ArrowLeft,
} from "lucide-react";
import Image from "next/image";
import { fetchJobPostById, fetchAllJobPosts } from "@/lib/api/jobpost";
import { JobPost } from "@/types/JobPost";
import { fetchSavedJobs, saveJob, unsaveJob } from "@/lib/api/saved-job";
import { toast } from "sonner";
import { applyJob } from "@/lib/api/job-application";
import { fetchMyProfile, uploadCv } from "@/lib/api/candidate-profile";

interface ApplicationForm {
  fullName: string;
  email: string;
  phone: string;
  coverLetter: string;
  resume: File | null;
}

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
  const [isLiked, setIsLiked] = useState(false);
  const [similarJobs, setSimilarJobs] = useState<SimilarJob[]>([]);
  const [applicationForm, setApplicationForm] = useState<ApplicationForm>({
    fullName: "",
    email: "",
    phone: "",
    coverLetter: "",
    resume: null,
  });
  const [existingCvUrl, setExistingCvUrl] = useState<string | null>(null);
  const [useExistingCv, setUseExistingCv] = useState(true);

  useEffect(() => {
    const fetchJob = async () => {
      setIsLoading(true);
      try {
        const jobData = await fetchJobPostById(jobId);
        setJob(jobData);
        
        // Fetch similar jobs based on category
        if (jobData.categoryId) {
          const allJobs = await fetchAllJobPosts();
          const similar = allJobs
            .filter((j: JobPost) => j.id !== jobId && j.categoryId === jobData.categoryId)
            .slice(0, 3)
            .map((j: JobPost) => ({
              id: j.id,
              title: j.title,
              companyName: j.employer?.fullName || j.companyName || "N/A",
              location: j.location || "N/A",
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

    // Kiểm tra đã lưu chưa
    fetchSavedJobs().then((data: unknown) => {
      const arr = Array.isArray(data) ? data : [];
      const found = arr.find((item) => {
        const sj = item as { jobPostId?: string };
        return sj.jobPostId === jobId;
      });
      setIsSaved(!!found);
    });

    // Lấy CV cũ nếu có
    fetchMyProfile().then(profile => {
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
      } else if (applicationForm.resume) {
        cvUrl = await uploadCv(applicationForm.resume);
      }
      if (!cvUrl) {
        toast.error("Bạn cần tải lên CV trước khi ứng tuyển.");
        setIsApplying(false);
        return;
      }
      await applyJob(jobId, cvUrl);
      toast.success("Đơn ứng tuyển đã được gửi thành công!");
      setApplicationForm({
        fullName: "",
        email: "",
        phone: "",
        coverLetter: "",
        resume: null,
      });
    } catch (error: unknown) {
      type ErrorWithResponse = { response?: { data?: { message?: string } } };
      const errorMessage = (error && typeof error === 'object' && 'response' in error && (error as ErrorWithResponse).response?.data?.message)
        ? (error as ErrorWithResponse).response!.data!.message!
        : "Có lỗi xảy ra khi gửi đơn ứng tuyển. Vui lòng thử lại.";
      toast.error(errorMessage);
    } finally {
      setIsApplying(false);
    }
  };

  const handleSave = async () => {
    try {
      if (isSaved) {
        // Bỏ lưu
        await unsaveJob(jobId);
        setIsSaved(false);
        toast.success("Đã bỏ lưu công việc.");
      } else {
        // Lưu job
        await saveJob(jobId);
        setIsSaved(true);
        toast.success("Đã lưu công việc.");
      }
    } catch {
      toast.error("Có lỗi khi lưu/bỏ lưu công việc.");
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: job?.title,
        text: job?.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Đã sao chép link vào clipboard!");
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-12 bg-gray-200 rounded w-3/4 mb-6"></div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="h-64 bg-gray-200 rounded mb-6"></div>
            </div>
            <div className="h-96 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Không tìm thấy việc làm</h1>
        <p className="text-gray-600 mb-6">Việc làm bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.</p>
        <Button onClick={() => router.push("/candidate/job")}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Quay lại danh sách việc làm
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center text-sm text-gray-600 mb-6">
        <button onClick={() => router.push("/candidate/job")} className="hover:text-blue-600">
          Việc làm
        </button>
        <span className="mx-2">/</span>
        <button onClick={() => router.push(`/candidate/category/${job.categoryId || 'all'}`)} className="hover:text-blue-600">
          {job.categoryName}
        </button>
        <span className="mx-2">/</span>
        <span className="text-gray-900">{job.title}</span>
      </div>

      {/* Job Header */}
      <Card className="mb-8">
        <CardHeader>
          <div className="flex flex-col md:flex-row gap-6">
            <Image
              src={job.logo || "/placeholder.svg"}
              alt={`${job.employer?.fullName || 'Company'} Logo`}
              width={80}
              height={80}
              className="w-20 h-20 object-contain rounded-lg border"
            />
            <div className="flex-1">
              <CardTitle className="text-3xl font-bold mb-2">{job.title}</CardTitle>
              <CardDescription className="text-xl text-blue-600 mb-4">
                <button onClick={() => router.push(`/candidate/company/${job.companyId}`)} className="hover:underline">
                  {job.employer?.fullName || job.companyName || "N/A"}
                </button>
              </CardDescription>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 mr-2" />
                  {job.location}
                </div>
                <div className="flex items-center">
                  <DollarSign className="w-4 h-4 mr-2" />${job.salary.toLocaleString()}/tháng
                </div>
                <div className="flex items-center">
                  <Briefcase className="w-4 h-4 mr-2" />
                  {job.type}
                </div>
                <div className="flex items-center">
                  <Users className="w-4 h-4 mr-2" />
                  {job.applicants || 0} ứng viên
                </div>
              </div>
              <div className="flex items-center mt-4 text-sm text-gray-500">
                <CalendarDays className="w-4 h-4 mr-2" />
                Đăng ngày {new Date(job.createdAt).toLocaleDateString("vi-VN")}
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3 mb-6">
            {Array.isArray(job.tags) && job.tags.map((tag) => (
              <Badge key={tag} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>
          <div className="flex flex-wrap gap-3">
            <Dialog>
              <DialogTrigger asChild>
                <Button size="lg" className="px-8">
                  Ứng tuyển ngay
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Ứng tuyển: {job.title}</DialogTitle>
                  <DialogDescription>Điền thông tin của bạn để ứng tuyển vào vị trí này.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="fullName">Họ và tên *</Label>
                    <Input
                      id="fullName"
                      value={applicationForm.fullName}
                      onChange={(e) => setApplicationForm((prev) => ({ ...prev, fullName: e.target.value }))}
                      placeholder="Nhập họ và tên"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={applicationForm.email}
                      onChange={(e) => setApplicationForm((prev) => ({ ...prev, email: e.target.value }))}
                      placeholder="Nhập email"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="phone">Số điện thoại *</Label>
                    <Input
                      id="phone"
                      value={applicationForm.phone}
                      onChange={(e) => setApplicationForm((prev) => ({ ...prev, phone: e.target.value }))}
                      placeholder="Nhập số điện thoại"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="coverLetter">Thư xin việc</Label>
                    <Textarea
                      id="coverLetter"
                      value={applicationForm.coverLetter}
                      onChange={(e) => setApplicationForm((prev) => ({ ...prev, coverLetter: e.target.value }))}
                      placeholder="Viết thư xin việc của bạn..."
                      rows={4}
                    />
                  </div>
                  {existingCvUrl && (
                    <div className="mb-2">
                      <label>
                        <input
                          type="radio"
                          checked={useExistingCv}
                          onChange={() => setUseExistingCv(true)}
                        />
                        Sử dụng CV đã có (
                        <a href={`https://localhost:7146${useExistingCv}`} target="_blank" rel="noopener noreferrer" className="underline text-blue-600">
                          Xem CV
                        </a>
                        )
                      </label>
                      <label className="ml-4">
                        <input
                          type="radio"
                          checked={!useExistingCv}
                          onChange={() => setUseExistingCv(false)}
                        />
                        Upload file mới
                      </label>
                    </div>
                  )}
                  {(!existingCvUrl || !useExistingCv) && (
                    <div className="grid gap-2">
                      <Label htmlFor="resume">CV/Resume</Label>
                      <Input
                        id="resume"
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={(e) => setApplicationForm((prev) => ({ ...prev, resume: e.target.files?.[0] || null }))}
                      />
                    </div>
                  )}
                </div>
                <DialogFooter>
                  <Button
                    onClick={handleApply}
                    disabled={
                      isApplying || !applicationForm.fullName || !applicationForm.email || !applicationForm.phone
                    }
                    className="w-full"
                  >
                    {isApplying ? "Đang gửi..." : "Gửi đơn ứng tuyển"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            <Button
              variant="outline"
              size="lg"
              onClick={handleSave}
              className={isSaved ? "text-blue-600 border-blue-600" : ""}
            >
              <Bookmark className={`w-4 h-4 mr-2 ${isSaved ? "fill-current" : ""}`} />
              {isSaved ? "Đã lưu" : "Lưu việc làm"}
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => setIsLiked(!isLiked)}
              className={isLiked ? "text-red-600 border-red-600" : ""}
            >
              <Heart className={`w-4 h-4 mr-2 ${isLiked ? "fill-current" : ""}`} />
              {isLiked ? "Đã thích" : "Yêu thích"}
            </Button>
            <Button variant="outline" size="lg" onClick={handleShare}>
              <Share2 className="w-4 h-4 mr-2" />
              Chia sẻ
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Mô tả công việc</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose max-w-none">
                {job.description ? (
                  job.description.split("\n").map((paragraph, index) => (
                    <p key={index} className="mb-4 text-gray-700 leading-relaxed">
                      {paragraph}
                    </p>
                  ))
                ) : (
                  <p className="text-gray-500 italic">Chưa có mô tả chi tiết cho vị trí này.</p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Kỹ năng yêu cầu</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-3">
                {Array.isArray(job.tags) && job.tags.length > 0 ? (
                  job.tags.map((skill) => (
                    <Badge key={skill} variant="outline" className="text-sm py-2 px-3">
                      {skill}
                    </Badge>
                  ))
                ) : (
                  <p className="text-gray-500 italic">Chưa có thông tin kỹ năng yêu cầu.</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Company Info */}
          <Card>
            <CardHeader>
              <CardTitle>Thông tin công ty</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center mb-4">
                <Image
                  src={job.logo || "/placeholder.svg"}
                  alt={job.employer?.fullName || job.companyName || "Company"}
                  width={48}
                  height={48}
                  className="w-12 h-12 object-contain rounded mr-3"
                />
                <div>
                  <h3 className="font-semibold">{job.employer?.fullName || job.companyName || "N/A"}</h3>
                  <p className="text-sm text-gray-600">N/A nhân viên</p>
                </div>
              </div>
              <p className="text-sm text-gray-700 mb-4">Chưa có mô tả công ty.</p>
              <div className="space-y-2">
                <div className="flex items-center text-sm">
                  <Building2 className="w-4 h-4 mr-2 text-gray-500" />
                  <span>N/A nhân viên</span>
                </div>
                <div className="flex items-center text-sm">
                  <Globe className="w-4 h-4 mr-2 text-gray-500" />
                  <span className="text-gray-500">Chưa có website</span>
                </div>
              </div>
              <Button
                variant="outline"
                className="w-full mt-4 bg-transparent"
                onClick={() => router.push(`/candidate/company/${job.companyId}`)}
              >
                Xem trang công ty
              </Button>
            </CardContent>
          </Card>

          {/* Job Details */}
          <Card>
            <CardHeader>
              <CardTitle>Chi tiết việc làm</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Mức lương:</span>
                  <span className="font-semibold">${job.salary.toLocaleString()}/tháng</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Loại hình:</span>
                  <span>{job.type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Địa điểm:</span>
                  <span>{job.location}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Danh mục:</span>
                  <button
                    onClick={() => router.push(`/candidate/category/${job.categoryId || 'all'}`)}
                    className="text-blue-600 hover:underline"
                  >
                    {job.categoryName}
                  </button>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Số ứng viên:</span>
                  <span>{job.applicants || 0} người</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Ngày đăng:</span>
                  <span>{new Date(job.createdAt).toLocaleDateString("vi-VN")}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Similar Jobs */}
          <Card>
            <CardHeader>
              <CardTitle>Việc làm tương tự</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {similarJobs.length > 0 ? (
                  similarJobs.map((similarJob) => (
                    <div key={similarJob.id} className="border-b border-gray-100 pb-4 last:border-b-0">
                      <h4 className="font-semibold text-sm mb-1">
                        <button onClick={() => router.push(`/candidate/job/${similarJob.id}`)} className="hover:text-blue-600">
                          {similarJob.title}
                        </button>
                      </h4>
                      <p className="text-sm text-gray-600 mb-1">{similarJob.companyName}</p>
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>{similarJob.location}</span>
                        <span>${similarJob.salary.toLocaleString()}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">Chưa có việc làm tương tự.</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 