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
  Filter,
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

export default function RecruiterJobsPage() {
  const [jobs, setJobs] = useState<JobPost[]>([]);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<JobPost | null>(null);
  const [newJobPost, setNewJobPost] = useState<Partial<JobPost>>({
    type: "Full-time",
    logo: "/placeholder.svg?height=32&width=32",
    tags: [],
  });

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const data = await fetchMyJobPosts();
      setJobs(data);
    } catch {
      // error handling if needed
    }
  };

  const handleCreateJobPost = async () => {
    try {
      await apiCreateJobPost(newJobPost);
      setIsCreateDialogOpen(false);
      setNewJobPost({
        type: "Full-time",
        logo: "/placeholder.svg?height=32&width=32",
        tags: [],
      });
      fetchJobs();
    } catch {
      // error handling if needed
    }
  };

  const handleUpdateJobPost = async (id: string) => {
    try {
      await apiUpdateJobPost(id, newJobPost);
      setIsEditDialogOpen(false);
      setSelectedJob(null);
      setNewJobPost({
        type: "Full-time",
        logo: "/placeholder.svg?height=32&width=32",
        tags: [],
      });
      fetchJobs();
    } catch {
      // error handling if needed
    }
  };

  const handleDeleteJobPost = async (id: string) => {
    try {
      await apiDeleteJobPost(id);
      fetchJobs();
    } catch {
      // error handling if needed
    }
  };

  const handleEdit = (job: JobPost) => {
    setSelectedJob(job);
    setNewJobPost(job);
    setIsEditDialogOpen(true);
  };

  const resetForm = () => {
    setNewJobPost({
      type: "Full-time",
      logo: "/placeholder.svg?height=32&width=32",
      tags: [],
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Việc làm của tôi</h2>
          <p className="text-gray-600">Quản lý tất cả việc làm đã đăng</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="h-4 w-4 mr-2" />
              Đăng việc làm mới
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Đăng việc làm mới</DialogTitle>
              <DialogDescription>
                Tạo một việc làm mới để thu hút ứng viên
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">Tiêu đề công việc</Label>
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
                  <Label htmlFor="location">Địa điểm</Label>
                  <Input
                    id="location"
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
                  <Label htmlFor="salary">Mức lương</Label>
                  <Input
                    id="salary"
                    type="number"
                    placeholder="VD: 1500"
                    value={newJobPost.salary || ""}
                    onChange={(e) =>
                      setNewJobPost({
                        ...newJobPost,
                        salary: Number.parseFloat(e.target.value),
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
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn loại hình" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Full-time">Full-time</SelectItem>
                      <SelectItem value="Part-time">Part-time</SelectItem>
                      <SelectItem value="Contract">Contract</SelectItem>
                      <SelectItem value="Internship">Internship</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="description">Mô tả công việc</Label>
                <Textarea
                  id="description"
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
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="companyId">ID Công ty</Label>
                  <Input
                    id="companyId"
                    placeholder="VD: comp001"
                    value={newJobPost.companyId || ""}
                    onChange={(e) =>
                      setNewJobPost({
                        ...newJobPost,
                        companyId: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="categoryName">Tên danh mục</Label>
                  <Input
                    id="categoryName"
                    placeholder="VD: Software Development"
                    value={newJobPost.categoryName || ""}
                    onChange={(e) =>
                      setNewJobPost({
                        ...newJobPost,
                        categoryName: e.target.value,
                      })
                    }
                  />
                </div>
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
              <Button onClick={handleCreateJobPost}>Đăng ngay</Button>
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
                <Input placeholder="Tìm kiếm..." className="pl-10 w-64" />
              </div>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Lọc
              </Button>
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
                <TableHead>Ngày đăng</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {jobs.map((job) => (
                <TableRow key={job.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{job.title}</p>
                      <p className="text-sm text-gray-500">{job.type}</p>
                    </div>
                  </TableCell>
                  <TableCell>{job.companyName}</TableCell>
                  <TableCell>{job.location}</TableCell>
                  <TableCell>${job.salary}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{job.type}</Badge>
                  </TableCell>
                  <TableCell>{job.categoryName}</TableCell>
                  <TableCell>
                    {job.createdAt
                      ? new Date(job.createdAt).toLocaleDateString()
                      : "N/A"}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Eye className="h-4 w-4 mr-2" />
                          Xem chi tiết
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleEdit(job)}>
                          <Edit className="h-4 w-4 mr-2" />
                          Chỉnh sửa
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <FileText className="h-4 w-4 mr-2" />
                          Xem ứng tuyển
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-red-600"
                          onClick={() =>
                            job.id && handleDeleteJobPost(job.id.toString())
                          }
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

      {/* Edit Job Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Chỉnh sửa việc làm</DialogTitle>
            <DialogDescription>Cập nhật thông tin việc làm</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-title">Tiêu đề công việc</Label>
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
                <Label htmlFor="edit-salary">Mức lương</Label>
                <Input
                  id="edit-salary"
                  type="number"
                  placeholder="VD: 1500"
                  value={newJobPost.salary || ""}
                  onChange={(e) =>
                    setNewJobPost({
                      ...newJobPost,
                      salary: Number.parseFloat(e.target.value),
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
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn loại hình" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Full-time">Full-time</SelectItem>
                    <SelectItem value="Part-time">Part-time</SelectItem>
                    <SelectItem value="Contract">Contract</SelectItem>
                    <SelectItem value="Internship">Internship</SelectItem>
                  </SelectContent>
                </Select>
              </div>
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
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-companyId">ID Công ty</Label>
                <Input
                  id="edit-companyId"
                  placeholder="VD: comp001"
                  value={newJobPost.companyId || ""}
                  onChange={(e) =>
                    setNewJobPost({
                      ...newJobPost,
                      companyId: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <Label htmlFor="edit-categoryName">Tên danh mục</Label>
                <Input
                  id="edit-categoryName"
                  placeholder="VD: Software Development"
                  value={newJobPost.categoryName || ""}
                  onChange={(e) =>
                    setNewJobPost({
                      ...newJobPost,
                      categoryName: e.target.value,
                    })
                  }
                />
              </div>
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
            >
              Cập nhật
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
