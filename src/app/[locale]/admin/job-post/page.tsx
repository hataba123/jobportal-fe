"use client";

import * as React from "react";
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
import { Badge } from "@/components/ui/badge";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
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
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { format } from "date-fns";
import { PlusIcon, SearchIcon } from "lucide-react";
interface JobPost {
  Id: string;
  Title: string;
  Description: string;
  SkillsRequired: string;
  Location: string;
  Salary: number;
  EmployerId: string;
  CompanyId: string;
  Logo: string;
  Type: "Full-time" | "Part-time" | "Contract" | "Internship";
  Tags: string[];
  Applicants: number;
  CreatedAt: string;
  CategoryId: string;
}

const mockJobPosts: JobPost[] = [
  {
    Id: "jp101",
    Title: "Frontend Developer",
    Description:
      "We are looking for a passionate Frontend Developer to join our team...",
    SkillsRequired: "React, Next.js, TypeScript, Tailwind CSS",
    Location: "Ho Chi Minh City",
    Salary: 1500,
    EmployerId: "emp001",
    CompanyId: "comp001",
    Logo: "/placeholder.svg?height=32&width=32",
    Type: "Full-time",
    Tags: ["React", "Frontend", "Web"],
    Applicants: 25,
    CreatedAt: "2024-05-20T10:00:00Z",
    CategoryId: "cat001",
  },
  {
    Id: "jp102",
    Title: "Backend Engineer",
    Description: "Join our backend team to build scalable and robust APIs...",
    SkillsRequired: "Node.js, Express, MongoDB, AWS",
    Location: "Ha Noi",
    Salary: 1800,
    EmployerId: "emp002",
    CompanyId: "comp002",
    Logo: "/placeholder.svg?height=32&width=32",
    Type: "Full-time",
    Tags: ["Node.js", "Backend", "API"],
    Applicants: 18,
    CreatedAt: "2024-05-22T11:30:00Z",
    CategoryId: "cat002",
  },
  {
    Id: "jp103",
    Title: "UI/UX Designer",
    Description: "Create intuitive and beautiful user interfaces...",
    SkillsRequired: "Figma, Sketch, Adobe XD, User Research",
    Location: "Da Nang",
    Salary: 1200,
    EmployerId: "emp003",
    CompanyId: "comp003",
    Logo: "/placeholder.svg?height=32&width=32",
    Type: "Contract",
    Tags: ["UI", "UX", "Design"],
    Applicants: 30,
    CreatedAt: "2024-05-18T09:00:00Z",
    CategoryId: "cat003",
  },
  {
    Id: "jp104",
    Title: "Data Scientist",
    Description: "Analyze large datasets to extract insights...",
    SkillsRequired: "Python, R, SQL, Machine Learning",
    Location: "Ho Chi Minh City",
    Salary: 2000,
    EmployerId: "emp004",
    CompanyId: "comp004",
    Logo: "/placeholder.svg?height=32&width=32",
    Type: "Full-time",
    Tags: ["Data Science", "ML", "Python"],
    Applicants: 12,
    CreatedAt: "2024-05-25T14:00:00Z",
    CategoryId: "cat004",
  },
];

export default function AdminJobPostDashboard() {
  const [jobPosts, setJobPosts] = React.useState<JobPost[]>(mockJobPosts);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [filterType, setFilterType] = React.useState<string>("all");

  const [isViewDetailsOpen, setIsViewDetailsOpen] = React.useState(false);
  const [selectedJobPost, setSelectedJobPost] = React.useState<JobPost | null>(
    null
  );

  const [isCreateDialogOpen, setIsCreateDialogOpen] = React.useState(false);
  const [newJobPost, setNewJobPost] = React.useState<Partial<JobPost>>({
    Type: "Full-time",
    Applicants: 0,
    Logo: "/placeholder.svg?height=32&width=32",
    CreatedAt: new Date().toISOString(),
  });

  const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false);
  const [editingJobPost, setEditingJobPost] = React.useState<JobPost | null>(
    null
  );

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
  const [jobPostToDelete, setJobPostToDelete] = React.useState<string | null>(
    null
  );

  const filteredJobPosts = jobPosts.filter((post) => {
    const matchesSearch =
      post.Title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.Description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.Location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.SkillsRequired.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.Tags.some((tag) =>
        tag.toLowerCase().includes(searchTerm.toLowerCase())
      );

    const matchesType = filterType === "all" || post.Type === filterType;

    return matchesSearch && matchesType;
  });

  const handleViewDetails = (post: JobPost) => {
    setSelectedJobPost(post);
    setIsViewDetailsOpen(true);
  };

  const handleCreateJobPost = () => {
    const id = `jp${Math.floor(Math.random() * 100000)}`;
    const newPostWithId = {
      ...newJobPost,
      Id: id,
      CreatedAt: new Date().toISOString(),
    } as JobPost;
    setJobPosts((prev) => [...prev, newPostWithId]);
    setIsCreateDialogOpen(false);
    setNewJobPost({
      Type: "Full-time",
      Applicants: 0,
      Logo: "/placeholder.svg?height=32&width=32",
      CreatedAt: new Date().toISOString(),
    });
  };

  const handleEditJobPost = () => {
    if (editingJobPost) {
      setJobPosts((prev) =>
        prev.map((post) =>
          post.Id === editingJobPost.Id ? editingJobPost : post
        )
      );
      setIsEditDialogOpen(false);
      setEditingJobPost(null);
    }
  };

  const handleDeleteJobPost = () => {
    if (jobPostToDelete) {
      setJobPosts((prev) => prev.filter((post) => post.Id !== jobPostToDelete));
      setIsDeleteDialogOpen(false);
      setJobPostToDelete(null);
    }
  };

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Quản lý Bài đăng Tuyển dụng</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-4">
                <div className="relative w-full md:w-1/3">
                  <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Tìm kiếm theo tiêu đề, mô tả, kỹ năng..."
                    className="w-full rounded-lg bg-background pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="flex flex-col md:flex-row gap-4 w-full md:w-2/3 justify-end">
                  <Select value={filterType} onValueChange={setFilterType}>
                    <SelectTrigger className="w-full md:w-[180px]">
                      <SelectValue placeholder="Lọc theo loại" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tất cả loại</SelectItem>
                      <SelectItem value="Full-time">Full-time</SelectItem>
                      <SelectItem value="Part-time">Part-time</SelectItem>
                      <SelectItem value="Contract">Contract</SelectItem>
                      <SelectItem value="Internship">Internship</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button onClick={() => setIsCreateDialogOpen(true)}>
                    <PlusIcon className="h-4 w-4 mr-2" /> Tạo Bài đăng Mới
                  </Button>
                </div>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Tiêu đề</TableHead>
                    <TableHead>Địa điểm</TableHead>
                    <TableHead>Loại</TableHead>
                    <TableHead>Lương</TableHead>
                    <TableHead>Ứng viên</TableHead>
                    <TableHead>Ngày tạo</TableHead>
                    <TableHead>
                      <span className="sr-only">Actions</span>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredJobPosts.map((post) => (
                    <TableRow key={post.Id}>
                      <TableCell className="font-medium">{post.Id}</TableCell>
                      <TableCell>{post.Title}</TableCell>
                      <TableCell>{post.Location}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{post.Type}</Badge>
                      </TableCell>
                      <TableCell>${post.Salary}</TableCell>
                      <TableCell>{post.Applicants}</TableCell>
                      <TableCell>
                        {format(new Date(post.CreatedAt), "dd/MM/yyyy HH:mm")}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              aria-haspopup="true"
                              size="icon"
                              variant="ghost"
                            >
                              <DotsHorizontalIcon className="h-4 w-4" />
                              <span className="sr-only">Toggle menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Hành động</DropdownMenuLabel>
                            <DropdownMenuItem
                              onClick={() => handleViewDetails(post)}
                            >
                              Xem chi tiết
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => {
                                setEditingJobPost(post);
                                setIsEditDialogOpen(true);
                              }}
                            >
                              Chỉnh sửa
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => {
                                setJobPostToDelete(post.Id);
                                setIsDeleteDialogOpen(true);
                              }}
                            >
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
        </main>
      </div>

      {/* View Details Dialog */}
      <Dialog open={isViewDetailsOpen} onOpenChange={setIsViewDetailsOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Chi tiết Bài đăng Tuyển dụng</DialogTitle>
            <DialogDescription>
              Xem thông tin chi tiết của bài đăng.
            </DialogDescription>
          </DialogHeader>
          {selectedJobPost && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">ID:</Label>
                <span className="col-span-3 font-medium">
                  {selectedJobPost.Id}
                </span>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Tiêu đề:</Label>
                <span className="col-span-3">{selectedJobPost.Title}</span>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Mô tả:</Label>
                <span className="col-span-3 text-justify">
                  {selectedJobPost.Description}
                </span>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Kỹ năng yêu cầu:</Label>
                <span className="col-span-3">
                  {selectedJobPost.SkillsRequired}
                </span>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Địa điểm:</Label>
                <span className="col-span-3">{selectedJobPost.Location}</span>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Lương:</Label>
                <span className="col-span-3">${selectedJobPost.Salary}</span>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">ID Nhà tuyển dụng:</Label>
                <span className="col-span-3">{selectedJobPost.EmployerId}</span>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">ID Công ty:</Label>
                <span className="col-span-3">{selectedJobPost.CompanyId}</span>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Loại:</Label>
                <span className="col-span-3">
                  <Badge variant="outline">{selectedJobPost.Type}</Badge>
                </span>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Tags:</Label>
                <span className="col-span-3 flex flex-wrap gap-1">
                  {selectedJobPost.Tags.map((tag, index) => (
                    <Badge key={index} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </span>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Số ứng viên:</Label>
                <span className="col-span-3">{selectedJobPost.Applicants}</span>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Ngày tạo:</Label>
                <span className="col-span-3">
                  {format(
                    new Date(selectedJobPost.CreatedAt),
                    "dd/MM/yyyy HH:mm"
                  )}
                </span>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">ID Danh mục:</Label>
                <span className="col-span-3">{selectedJobPost.CategoryId}</span>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setIsViewDetailsOpen(false)}>Đóng</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Tạo Bài đăng Tuyển dụng Mới</DialogTitle>
            <DialogDescription>
              Điền thông tin để tạo bài đăng mới.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">
                Tiêu đề
              </Label>
              <Input
                id="title"
                value={newJobPost.Title || ""}
                onChange={(e) =>
                  setNewJobPost({ ...newJobPost, Title: e.target.value })
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Mô tả
              </Label>
              <Textarea
                id="description"
                value={newJobPost.Description || ""}
                onChange={(e) =>
                  setNewJobPost({ ...newJobPost, Description: e.target.value })
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="skillsRequired" className="text-right">
                Kỹ năng yêu cầu
              </Label>
              <Input
                id="skillsRequired"
                value={newJobPost.SkillsRequired || ""}
                onChange={(e) =>
                  setNewJobPost({
                    ...newJobPost,
                    SkillsRequired: e.target.value,
                  })
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="location" className="text-right">
                Địa điểm
              </Label>
              <Input
                id="location"
                value={newJobPost.Location || ""}
                onChange={(e) =>
                  setNewJobPost({ ...newJobPost, Location: e.target.value })
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="salary" className="text-right">
                Lương ($)
              </Label>
              <Input
                id="salary"
                type="number"
                value={newJobPost.Salary || ""}
                onChange={(e) =>
                  setNewJobPost({
                    ...newJobPost,
                    Salary: Number.parseFloat(e.target.value),
                  })
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="employerId" className="text-right">
                ID Nhà tuyển dụng
              </Label>
              <Input
                id="employerId"
                value={newJobPost.EmployerId || ""}
                onChange={(e) =>
                  setNewJobPost({ ...newJobPost, EmployerId: e.target.value })
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="companyId" className="text-right">
                ID Công ty
              </Label>
              <Input
                id="companyId"
                value={newJobPost.CompanyId || ""}
                onChange={(e) =>
                  setNewJobPost({ ...newJobPost, CompanyId: e.target.value })
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="type" className="text-right">
                Loại
              </Label>
              <Select
                value={newJobPost.Type || "Full-time"}
                onValueChange={(value) =>
                  setNewJobPost({
                    ...newJobPost,
                    Type: value as JobPost["Type"],
                  })
                }
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Chọn loại" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Full-time">Full-time</SelectItem>
                  <SelectItem value="Part-time">Part-time</SelectItem>
                  <SelectItem value="Contract">Contract</SelectItem>
                  <SelectItem value="Internship">Internship</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="tags" className="text-right">
                Tags (cách nhau bởi dấu phẩy)
              </Label>
              <Input
                id="tags"
                value={newJobPost.Tags?.join(", ") || ""}
                onChange={(e) =>
                  setNewJobPost({
                    ...newJobPost,
                    Tags: e.target.value.split(",").map((tag) => tag.trim()),
                  })
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="categoryId" className="text-right">
                ID Danh mục
              </Label>
              <Input
                id="categoryId"
                value={newJobPost.CategoryId || ""}
                onChange={(e) =>
                  setNewJobPost({ ...newJobPost, CategoryId: e.target.value })
                }
                className="col-span-3"
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
            <Button onClick={handleCreateJobPost}>Tạo</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Chỉnh sửa Bài đăng Tuyển dụng</DialogTitle>
            <DialogDescription>Cập nhật thông tin bài đăng.</DialogDescription>
          </DialogHeader>
          {editingJobPost && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-title" className="text-right">
                  Tiêu đề
                </Label>
                <Input
                  id="edit-title"
                  value={editingJobPost.Title}
                  onChange={(e) =>
                    setEditingJobPost({
                      ...editingJobPost,
                      Title: e.target.value,
                    })
                  }
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-description" className="text-right">
                  Mô tả
                </Label>
                <Textarea
                  id="edit-description"
                  value={editingJobPost.Description}
                  onChange={(e) =>
                    setEditingJobPost({
                      ...editingJobPost,
                      Description: e.target.value,
                    })
                  }
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-skillsRequired" className="text-right">
                  Kỹ năng yêu cầu
                </Label>
                <Input
                  id="edit-skillsRequired"
                  value={editingJobPost.SkillsRequired}
                  onChange={(e) =>
                    setEditingJobPost({
                      ...editingJobPost,
                      SkillsRequired: e.target.value,
                    })
                  }
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-location" className="text-right">
                  Địa điểm
                </Label>
                <Input
                  id="edit-location"
                  value={editingJobPost.Location}
                  onChange={(e) =>
                    setEditingJobPost({
                      ...editingJobPost,
                      Location: e.target.value,
                    })
                  }
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-salary" className="text-right">
                  Lương ($)
                </Label>
                <Input
                  id="edit-salary"
                  type="number"
                  value={editingJobPost.Salary}
                  onChange={(e) =>
                    setEditingJobPost({
                      ...editingJobPost,
                      Salary: Number.parseFloat(e.target.value),
                    })
                  }
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-employerId" className="text-right">
                  ID Nhà tuyển dụng
                </Label>
                <Input
                  id="edit-employerId"
                  value={editingJobPost.EmployerId}
                  onChange={(e) =>
                    setEditingJobPost({
                      ...editingJobPost,
                      EmployerId: e.target.value,
                    })
                  }
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-companyId" className="text-right">
                  ID Công ty
                </Label>
                <Input
                  id="edit-companyId"
                  value={editingJobPost.CompanyId}
                  onChange={(e) =>
                    setEditingJobPost({
                      ...editingJobPost,
                      CompanyId: e.target.value,
                    })
                  }
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-type" className="text-right">
                  Loại
                </Label>
                <Select
                  value={editingJobPost.Type}
                  onValueChange={(value) =>
                    setEditingJobPost({
                      ...editingJobPost,
                      Type: value as JobPost["Type"],
                    })
                  }
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Chọn loại" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Full-time">Full-time</SelectItem>
                    <SelectItem value="Part-time">Part-time</SelectItem>
                    <SelectItem value="Contract">Contract</SelectItem>
                    <SelectItem value="Internship">Internship</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-tags" className="text-right">
                  Tags (cách nhau bởi dấu phẩy)
                </Label>
                <Input
                  id="edit-tags"
                  value={editingJobPost.Tags.join(", ")}
                  onChange={(e) =>
                    setEditingJobPost({
                      ...editingJobPost,
                      Tags: e.target.value.split(",").map((tag) => tag.trim()),
                    })
                  }
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-categoryId" className="text-right">
                  ID Danh mục
                </Label>
                <Input
                  id="edit-categoryId"
                  value={editingJobPost.CategoryId}
                  onChange={(e) =>
                    setEditingJobPost({
                      ...editingJobPost,
                      CategoryId: e.target.value,
                    })
                  }
                  className="col-span-3"
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
            >
              Hủy
            </Button>
            <Button onClick={handleEditJobPost}>Lưu thay đổi</Button>
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
            <AlertDialogTitle>Bạn có chắc chắn muốn xóa?</AlertDialogTitle>
            <AlertDialogDescription>
              Hành động này không thể hoàn tác. Thao tác này sẽ xóa vĩnh viễn
              bài đăng tuyển dụng này.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteJobPost}>
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
