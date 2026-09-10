"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { Textarea } from "@/components/ui/textarea";
import {
  Plus,
  Search,
  Eye,
  Edit,
  FileText,
  Trash2,
  MoreHorizontal,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  fetchMyJobPosts,
  createJobPost as apiCreateJobPost,
  updateJobPost as apiUpdateJobPost,
  deleteJobPost as apiDeleteJobPost,
} from "@/lib/api/recruiter-jobpost";
import { JobPost } from "@/types/JobPost";
import {
  fetchCandidatesForJob,
  updateJobApplicationStatus,
  type JobCandidateApplication,
} from "@/lib/api/job-application";
import { ApplicationStatus } from "@/types/ApplyStatus";
import { toast } from "sonner";
import { toBackendUrl } from "@/lib/api/url";
import CompanyLogo from "@/components/common/CompanyLogo";
import { fetchMyCompany, type CompanyDto } from "@/lib/api/recruiter-dashboard";
import { fetchCategories } from "@/lib/api/category";
import type { Category } from "@/types/Category";

export default function RecruiterJobsPage() {
  const [jobs, setJobs] = useState<JobPost[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [myCompany, setMyCompany] = useState<CompanyDto | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<JobPost | null>(null);
  const [newJobPost, setNewJobPost] = useState<Partial<JobPost>>({
    type: "Full-time",
    logo: "",
    tags: [],
  });
  const [selectedJobForCandidates, setSelectedJobForCandidates] =
    useState<JobPost | null>(null);
  const [candidates, setCandidates] = useState<JobCandidateApplication[]>([]);
  const [candidatesDialogOpen, setCandidatesDialogOpen] = useState(false);
  const [loadingCandidates, setLoadingCandidates] = useState(false);
  const [updatingStatusId, setUpdatingStatusId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchJobs();
    loadCompanyAndCategories();
  }, []);

  const loadCompanyAndCategories = async () => {
    try {
      const [comp, cats] = await Promise.all([
        fetchMyCompany().catch(() => null),
        fetchCategories().catch(() => []),
      ]);
      setMyCompany(comp);
      setCategories(cats);
    } catch {
      // ignore
    }
  };

  const fetchJobs = async () => {
    try {
      const data = await fetchMyJobPosts();
      setJobs(data);
    } catch {
      // error handling
    }
  };

  const handleCreateJobPost = async () => {
    try {
      const payload = {
        ...newJobPost,
        companyId: myCompany?.id || newJobPost.companyId,
        logo: newJobPost.logo || myCompany?.logo || "",
      };
      if (!payload.title?.trim()) {
        toast.error("Vui lòng nhập tiêu đề công việc");
        return;
      }
      if (!payload.categoryId) {
        toast.error("Vui lòng chọn ngành nghề / danh mục việc làm");
        return;
      }
      await apiCreateJobPost(payload);
      toast.success("Đăng tin tuyển dụng thành công!");
      setIsCreateDialogOpen(false);
      resetForm();
      fetchJobs();
    } catch (err: unknown) {
      const msg = err && typeof err === 'object' && 'response' in err
        ? (err as { response?: { data?: { message?: string } } }).response?.data?.message
        : "Đăng tin thất bại. Vui lòng kiểm tra lại thông tin.";
      toast.error(msg || "Đăng tin thất bại.");
    }
  };

  const handleUpdateJobPost = async (id: string) => {
    try {
      const payload = {
        ...newJobPost,
        companyId: myCompany?.id || newJobPost.companyId,
      };
      await apiUpdateJobPost(id, payload, selectedJob?.version);
      toast.success("Cập nhật tin tuyển dụng thành công!");
      setIsEditDialogOpen(false);
      setSelectedJob(null);
      resetForm();
      fetchJobs();
    } catch {
      toast.error("Cập nhật tin tuyển dụng thất bại.");
    }
  };

  const handleDeleteJobPost = async (id: string, version?: string) => {
    try {
      await apiDeleteJobPost(id, version);
      toast.success("Đã xóa tin tuyển dụng.");
      fetchJobs();
    } catch {
      toast.error("Xóa tin tuyển dụng thất bại.");
    }
  };

  const handleEdit = (job: JobPost) => {
    setSelectedJob(job);
    setNewJobPost({
      ...job,
      categoryId: job.categoryId || "",
      companyId: job.companyId || myCompany?.id,
    });
    setIsEditDialogOpen(true);
  };

  const resetForm = () => {
    setNewJobPost({
      type: "Full-time",
      companyId: myCompany?.id,
      logo: myCompany?.logo || "",
      tags: [],
    });
  };

  const handleViewCandidates = async (job: JobPost) => {
    setSelectedJobForCandidates(job);
    setCandidatesDialogOpen(true);
    setLoadingCandidates(true);
    try {
      const data = await fetchCandidatesForJob(job.id);
      setCandidates(data);
    } catch {
      setCandidates([]);
    } finally {
      setLoadingCandidates(false);
    }
  };

  const handleUpdateStatus = async (applicationId: string, status: ApplicationStatus, version?: string) => {
    setUpdatingStatusId(applicationId);
    try {
      await updateJobApplicationStatus(
        applicationId,
        status,
        version,
        status === "Rejected" ? "Không phù hợp với yêu cầu tuyển dụng" : undefined
      );
      if (selectedJobForCandidates) {
        const data = await fetchCandidatesForJob(selectedJobForCandidates.id);
        setCandidates(data);
      }
      toast.success("Cập nhật trạng thái thành công!");
    } catch {
      toast.error("Cập nhật trạng thái thất bại!");
    } finally {
      setUpdatingStatusId(null);
    }
  };

  const filteredJobs = jobs.filter((job) =>
    searchTerm.trim() === ""
      ? true
      : job.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.location?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Việc làm của tôi</h2>
          <p className="text-sm text-slate-500">Quản lý và cập nhật toàn bộ tin đăng tuyển dụng</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm} className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold">
              <Plus className="h-4 w-4 mr-2" />
              Đăng việc làm mới
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Đăng việc làm mới</DialogTitle>
              <DialogDescription>
                Tạo một tin tuyển dụng mới để tiếp cận các ứng viên tiềm năng
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">Tiêu đề công việc <span className="text-red-500">*</span></Label>
                  <Input
                    id="title"
                    placeholder="VD: Senior Frontend Developer"
                    value={newJobPost.title || ""}
                    onChange={(e) =>
                      setNewJobPost({ ...newJobPost, title: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="location">Địa điểm làm việc</Label>
                  <Input
                    id="location"
                    placeholder="VD: Hà Nội / TP. Hồ Chí Minh"
                    value={newJobPost.location || ""}
                    onChange={(e) =>
                      setNewJobPost({ ...newJobPost, location: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Doanh nghiệp tuyển dụng</Label>
                  <div className="mt-1 p-2.5 bg-slate-100 rounded-lg text-sm font-semibold text-slate-700 flex items-center gap-2">
                    <CompanyLogo src={myCompany?.logo} name={myCompany?.name || "Doanh nghiệp"} size={24} rounded="rounded" />
                    <span>{myCompany?.name || "Chưa cấu hình công ty"}</span>
                  </div>
                </div>
                <div>
                  <Label htmlFor="category">Ngành nghề / Danh mục <span className="text-red-500">*</span></Label>
                  <Select
                    value={newJobPost.categoryId || ""}
                    onValueChange={(value) => {
                      const cat = categories.find((c) => c.id === value);
                      setNewJobPost({
                        ...newJobPost,
                        categoryId: value,
                        categoryName: cat?.name || "",
                      });
                    }}
                  >
                    <SelectTrigger id="category">
                      <SelectValue placeholder="Chọn danh mục..." />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((c) => (
                        <SelectItem key={String(c.id)} value={String(c.id)}>
                          {c.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="salary">Mức lương (VNĐ hoặc USD)</Label>
                  <Input
                    id="salary"
                    type="number"
                    placeholder="VD: 25000000"
                    value={newJobPost.salary || ""}
                    onChange={(e) =>
                      setNewJobPost({
                        ...newJobPost,
                        salary: Number.parseFloat(e.target.value) || 0,
                      })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="type">Loại hình</Label>
                  <Select
                    value={newJobPost.type || "Full-time"}
                    onValueChange={(value) =>
                      setNewJobPost({
                        ...newJobPost,
                        type: value as JobPost["type"],
                      })
                    }
                  >
                    <SelectTrigger id="type">
                      <SelectValue placeholder="Chọn loại hình" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Full-time">Full-time (Toàn thời gian)</SelectItem>
                      <SelectItem value="Part-time">Part-time (Bán thời gian)</SelectItem>
                      <SelectItem value="Contract">Contract (Hợp đồng)</SelectItem>
                      <SelectItem value="Internship">Internship (Thực tập)</SelectItem>
                      <SelectItem value="Remote">Remote (Từ xa)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <Label htmlFor="minExp">Kinh nghiệm (năm)</Label>
                  <Input
                    id="minExp"
                    type="number"
                    min="0"
                    placeholder="VD: 2"
                    value={newJobPost.minExperienceYears ?? ""}
                    onChange={(e) =>
                      setNewJobPost({
                        ...newJobPost,
                        minExperienceYears: e.target.value ? Number(e.target.value) : undefined,
                      })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="education">Học vấn</Label>
                  <Select
                    value={newJobPost.educationRequirement || "Không yêu cầu"}
                    onValueChange={(val) =>
                      setNewJobPost({ ...newJobPost, educationRequirement: val })
                    }
                  >
                    <SelectTrigger id="education">
                      <SelectValue placeholder="Chọn học vấn" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Không yêu cầu">Không yêu cầu</SelectItem>
                      <SelectItem value="Trung cấp / Cao đẳng">Trung cấp / Cao đẳng</SelectItem>
                      <SelectItem value="Đại học">Đại học</SelectItem>
                      <SelectItem value="Thạc sĩ trở lên">Thạc sĩ trở lên</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="expiresAt">Hạn nộp hồ sơ</Label>
                  <Input
                    id="expiresAt"
                    type="date"
                    value={newJobPost.expiresAt ? newJobPost.expiresAt.slice(0, 10) : ""}
                    onChange={(e) =>
                      setNewJobPost({
                        ...newJobPost,
                        expiresAt: e.target.value ? new Date(e.target.value).toISOString() : undefined,
                      })
                    }
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="skillsRequired">Kỹ năng yêu cầu</Label>
                <Input
                  id="skillsRequired"
                  placeholder="VD: React, TypeScript, Next.js"
                  value={newJobPost.skillsRequired || ""}
                  onChange={(e) =>
                    setNewJobPost({ ...newJobPost, skillsRequired: e.target.value })
                  }
                />
              </div>

              <div>
                <Label htmlFor="description">Mô tả công việc</Label>
                <Textarea
                  id="description"
                  placeholder="Mô tả chi tiết về công việc và đãi ngộ..."
                  rows={4}
                  value={newJobPost.description || ""}
                  onChange={(e) =>
                    setNewJobPost({
                      ...newJobPost,
                      description: e.target.value,
                    })
                  }
                />
              </div>

              <div>
                <Label htmlFor="tags">Tags (cách nhau bởi dấu phẩy)</Label>
                <Input
                  id="tags"
                  placeholder="VD: React, Frontend, Web"
                  value={
                    Array.isArray(newJobPost.tags)
                      ? newJobPost.tags.join(", ")
                      : newJobPost.tags || ""
                  }
                  onChange={(e) =>
                    setNewJobPost({
                      ...newJobPost,
                      tags: e.target.value.split(",").map((tag) => tag.trim()),
                    })
                  }
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsCreateDialogOpen(false)}
              >
                Hủy
              </Button>
              <Button onClick={handleCreateJobPost} className="bg-blue-600 hover:bg-blue-700 text-white">
                Đăng ngay
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Danh sách việc làm</CardTitle>
              <CardDescription>
                Tổng cộng {jobs.length} việc làm
              </CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Tìm kiếm việc làm..."
                  className="pl-10 w-64"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Công việc</TableHead>
                <TableHead>Công ty</TableHead>
                <TableHead>Địa điểm</TableHead>
                <TableHead>Lương</TableHead>
                <TableHead>Loại</TableHead>
                <TableHead>Danh mục</TableHead>
                <TableHead>Hạn nộp</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredJobs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-slate-500">
                    Chưa có tin tuyển dụng nào phù hợp.
                  </TableCell>
                </TableRow>
              ) : (
                filteredJobs.map((job) => (
                  <TableRow key={job.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <CompanyLogo src={job.logo || myCompany?.logo} name={job.companyName || job.title} size={36} rounded="rounded-lg" />
                        <div>
                          <p className="font-medium text-slate-900">{job.title}</p>
                          <p className="text-xs text-gray-500">{job.type || "Full-time"}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{job.companyName || myCompany?.name || "N/A"}</TableCell>
                    <TableCell>{job.location || "Toàn quốc"}</TableCell>
                    <TableCell className="font-medium">
                      {job.salary ? `${job.salary.toLocaleString("vi-VN")} đ` : "Thỏa thuận"}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{job.type || "Full-time"}</Badge>
                    </TableCell>
                    <TableCell>{job.categoryName || "Chung"}</TableCell>
                    <TableCell className="text-xs text-slate-500">
                      {job.expiresAt
                        ? new Date(job.expiresAt).toLocaleDateString("vi-VN")
                        : "Vô thời hạn"}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEdit(job)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Chỉnh sửa
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleViewCandidates(job)}
                          >
                            <FileText className="h-4 w-4 mr-2" />
                            Xem ứng viên ({job.applicants || 0})
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-red-600"
                            onClick={() =>
                              job.id && handleDeleteJobPost(job.id.toString(), job.version)
                            }
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Xóa
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Edit Job Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Chỉnh sửa việc làm</DialogTitle>
            <DialogDescription>Cập nhật thông tin tin tuyển dụng</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-title">Tiêu đề công việc <span className="text-red-500">*</span></Label>
                <Input
                  id="edit-title"
                  placeholder="VD: Senior Frontend Developer"
                  value={newJobPost.title || ""}
                  onChange={(e) =>
                    setNewJobPost({ ...newJobPost, title: e.target.value })
                  }
                />
              </div>
              <div>
                <Label htmlFor="edit-location">Địa điểm</Label>
                <Input
                  id="edit-location"
                  placeholder="VD: Hồ Chí Minh"
                  value={newJobPost.location || ""}
                  onChange={(e) =>
                    setNewJobPost({ ...newJobPost, location: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Doanh nghiệp tuyển dụng</Label>
                <div className="mt-1 p-2.5 bg-slate-100 rounded-lg text-sm font-semibold text-slate-700 flex items-center gap-2">
                  <CompanyLogo src={myCompany?.logo} name={myCompany?.name || "Doanh nghiệp"} size={24} rounded="rounded" />
                  <span>{myCompany?.name || "Doanh nghiệp"}</span>
                </div>
              </div>
              <div>
                <Label htmlFor="edit-category">Ngành nghề / Danh mục <span className="text-red-500">*</span></Label>
                <Select
                  value={newJobPost.categoryId || ""}
                  onValueChange={(value) => {
                    const cat = categories.find((c) => c.id === value);
                    setNewJobPost({
                      ...newJobPost,
                      categoryId: value,
                      categoryName: cat?.name || "",
                    });
                  }}
                >
                  <SelectTrigger id="edit-category">
                    <SelectValue placeholder="Chọn danh mục..." />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((c) => (
                      <SelectItem key={String(c.id)} value={String(c.id)}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-salary">Mức lương</Label>
                <Input
                  id="edit-salary"
                  type="number"
                  placeholder="VD: 25000000"
                  value={newJobPost.salary || ""}
                  onChange={(e) =>
                    setNewJobPost({
                      ...newJobPost,
                      salary: Number.parseFloat(e.target.value) || 0,
                    })
                  }
                />
              </div>
              <div>
                <Label htmlFor="edit-type">Loại hình</Label>
                <Select
                  value={newJobPost.type || "Full-time"}
                  onValueChange={(value) =>
                    setNewJobPost({
                      ...newJobPost,
                      type: value as JobPost["type"],
                    })
                  }
                >
                  <SelectTrigger id="edit-type">
                    <SelectValue placeholder="Chọn loại hình" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Full-time">Full-time</SelectItem>
                    <SelectItem value="Part-time">Part-time</SelectItem>
                    <SelectItem value="Contract">Contract</SelectItem>
                    <SelectItem value="Internship">Internship</SelectItem>
                    <SelectItem value="Remote">Remote</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <Label htmlFor="edit-minExp">Kinh nghiệm (năm)</Label>
                <Input
                  id="edit-minExp"
                  type="number"
                  min="0"
                  placeholder="VD: 2"
                  value={newJobPost.minExperienceYears ?? ""}
                  onChange={(e) =>
                    setNewJobPost({
                      ...newJobPost,
                      minExperienceYears: e.target.value ? Number(e.target.value) : undefined,
                    })
                  }
                />
              </div>
              <div>
                <Label htmlFor="edit-education">Học vấn</Label>
                <Select
                  value={newJobPost.educationRequirement || "Không yêu cầu"}
                  onValueChange={(val) =>
                    setNewJobPost({ ...newJobPost, educationRequirement: val })
                  }
                >
                  <SelectTrigger id="edit-education">
                    <SelectValue placeholder="Chọn học vấn" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Không yêu cầu">Không yêu cầu</SelectItem>
                    <SelectItem value="Trung cấp / Cao đẳng">Trung cấp / Cao đẳng</SelectItem>
                    <SelectItem value="Đại học">Đại học</SelectItem>
                    <SelectItem value="Thạc sĩ trở lên">Thạc sĩ trở lên</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="edit-expiresAt">Hạn nộp hồ sơ</Label>
                <Input
                  id="edit-expiresAt"
                  type="date"
                  value={newJobPost.expiresAt ? newJobPost.expiresAt.slice(0, 10) : ""}
                  onChange={(e) =>
                    setNewJobPost({
                      ...newJobPost,
                      expiresAt: e.target.value ? new Date(e.target.value).toISOString() : undefined,
                    })
                  }
                />
              </div>
            </div>

            <div>
              <Label htmlFor="edit-skillsRequired">Kỹ năng yêu cầu</Label>
              <Input
                id="edit-skillsRequired"
                placeholder="VD: React, TypeScript, Next.js"
                value={newJobPost.skillsRequired || ""}
                onChange={(e) =>
                  setNewJobPost({ ...newJobPost, skillsRequired: e.target.value })
                }
              />
            </div>

            <div>
              <Label htmlFor="edit-description">Mô tả công việc</Label>
              <Textarea
                id="edit-description"
                placeholder="Mô tả chi tiết về công việc..."
                rows={4}
                value={newJobPost.description || ""}
                onChange={(e) =>
                  setNewJobPost({
                    ...newJobPost,
                    description: e.target.value,
                  })
                }
              />
            </div>

            <div>
              <Label htmlFor="edit-tags">Tags (cách nhau bởi dấu phẩy)</Label>
              <Input
                id="edit-tags"
                placeholder="VD: React, Frontend, Web"
                value={
                  Array.isArray(newJobPost.tags)
                    ? newJobPost.tags.join(", ")
                    : newJobPost.tags || ""
                }
                onChange={(e) =>
                  setNewJobPost({
                    ...newJobPost,
                    tags: e.target.value.split(",").map((tag) => tag.trim()),
                  })
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
            >
              Hủy
            </Button>
            <Button
              onClick={() =>
                selectedJob &&
                selectedJob.id &&
                handleUpdateJobPost(selectedJob.id.toString())
              }
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Cập nhật
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog danh sách ứng viên ứng tuyển */}
      <Dialog
        open={candidatesDialogOpen}
        onOpenChange={setCandidatesDialogOpen}
      >
        <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              Ứng viên ứng tuyển: {selectedJobForCandidates?.title}
            </DialogTitle>
          </DialogHeader>
          {loadingCandidates ? (
            <div className="py-8 text-center text-gray-500">Đang tải hồ sơ...</div>
          ) : candidates.length === 0 ? (
            <div className="py-8 text-center text-gray-500">
              Chưa có ứng viên nào ứng tuyển vị trí này.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Họ tên</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Ngày ứng tuyển</TableHead>
                  <TableHead>CV đính kèm</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead>Cập nhật trạng thái</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {candidates.map((c) => (
                  <TableRow key={c.id}>
                    <TableCell className="font-semibold text-slate-800">{c.fullName || c.candidateName || "Ứng viên"}</TableCell>
                    <TableCell>{c.email}</TableCell>
                    <TableCell className="text-xs text-slate-500">
                      {c.appliedAt
                        ? new Date(c.appliedAt).toLocaleDateString("vi-VN")
                        : ""}
                    </TableCell>
                    <TableCell>
                      {c.cvUrl ? (
                        <a
                          href={toBackendUrl(c.cvUrl)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 underline font-medium text-xs flex items-center gap-1 hover:text-blue-700"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          Xem CV
                        </a>
                      ) : (
                        "—"
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          c.status === "Applied"
                            ? "secondary"
                            : c.status === "Screening" || c.status === "Interview"
                            ? "default"
                            : c.status === "Offer" || c.status === "Hired"
                            ? "outline"
                            : c.status === "Rejected" || c.status === "Withdrawn"
                            ? "destructive"
                            : undefined
                        }
                        className={
                          c.status === "Offer" || c.status === "Hired"
                            ? "bg-emerald-500 text-white border-emerald-500"
                            : ""
                        }
                      >
                        {c.status === "Applied"
                          ? "Chờ xử lý"
                          : c.status === "Screening"
                          ? "Đang xem xét"
                          : c.status === "Interview"
                          ? "Phỏng vấn"
                          : c.status === "Offer"
                          ? "Đề nghị"
                          : c.status === "Hired"
                          ? "Đã tuyển"
                          : c.status === "Rejected"
                          ? "Từ chối"
                          : c.status === "Withdrawn"
                          ? "Đã rút"
                          : c.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Select
                        value={c.status}
                        onValueChange={(value) =>
                          handleUpdateStatus(c.id, value as ApplicationStatus, c.version)
                        }
                        disabled={updatingStatusId === c.id}
                      >
                        <SelectTrigger className="w-32 h-8 text-xs">
                          <SelectValue placeholder="Chọn trạng thái" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Applied">Đã ứng tuyển</SelectItem>
                          <SelectItem value="Screening">Đang xem xét</SelectItem>
                          <SelectItem value="Interview">Phỏng vấn</SelectItem>
                          <SelectItem value="Offer">Đề nghị</SelectItem>
                          <SelectItem value="Hired">Đã tuyển</SelectItem>
                          <SelectItem value="Rejected">Từ chối</SelectItem>
                          <SelectItem value="Withdrawn">Đã rút</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
