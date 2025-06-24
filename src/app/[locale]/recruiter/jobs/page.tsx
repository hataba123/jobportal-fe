"use client";

import { useState } from "react";
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
import { Badge } from "@/components/ui/badge"; // Import Badge explicitly

// Updated JobPost interface to match JobPostDto
interface JobPost {
  Id: string;
  Title: string;
  Description: string;
  Location: string;
  Salary: number;
  Type: "Full-time" | "Part-time" | "Contract" | "Internship";
  Logo: string;
  Tags: string[];
  CreatedAt: string;
  CategoryName: string; // New field from DTO
  CompanyName: string; // New field from DTO
  // EmployerId, SkillsRequired, Applicants are removed as per DTO
  CategoryId: string; // For Create/Update DTO
  CompanyId: string; // For Create/Update DTO
}

// Updated mock data for jobs
const myJobs: JobPost[] = [
  {
    Id: "jp101",
    Title: "Senior Frontend Developer",
    Description:
      "We are looking for a passionate Frontend Developer to join our team...",
    Location: "Hồ Chí Minh",
    Salary: 1500,
    Logo: "/placeholder.svg?height=32&width=32",
    Type: "Full-time",
    Tags: ["React", "Frontend", "Web"],
    CreatedAt: "2024-01-15T10:00:00Z",
    CategoryName: "Software Development",
    CompanyName: "Tech Solutions Inc.",
    CategoryId: "cat001",
    CompanyId: "comp001",
  },
  {
    Id: "jp102",
    Title: "Backend Developer",
    Description: "Join our backend team to build scalable and robust APIs...",
    Location: "Hà Nội",
    Salary: 1800,
    Logo: "/placeholder.svg?height=32&width=32",
    Type: "Full-time",
    Tags: ["Node.js", "Backend", "API"],
    CreatedAt: "2024-01-14T11:30:00Z",
    CategoryName: "Software Development",
    CompanyName: "Global Innovations",
    CategoryId: "cat002",
    CompanyId: "comp002",
  },
  {
    Id: "jp103",
    Title: "UI/UX Designer",
    Description: "Create intuitive and beautiful user interfaces...",
    Location: "Đà Nẵng",
    Salary: 1200,
    Logo: "/placeholder.svg?height=32&width=32",
    Type: "Contract",
    Tags: ["UI", "UX", "Design"],
    CreatedAt: "2024-01-10T09:00:00Z",
    CategoryName: "Design",
    CompanyName: "Creative Studio",
    CategoryId: "cat003",
    CompanyId: "comp003",
  },
  {
    Id: "jp104",
    Title: "DevOps Engineer",
    Description: "Analyze large datasets to extract insights...",
    Location: "Remote",
    Salary: 2000,
    Logo: "/placeholder.svg?height=32&width=32",
    Type: "Full-time",
    Tags: ["DevOps", "Cloud", "AWS"],
    CreatedAt: "2024-01-16T14:00:00Z",
    CategoryName: "IT Operations",
    CompanyName: "Cloud Solutions Ltd.",
    CategoryId: "cat004",
    CompanyId: "comp004",
  },
];

export default function RecruiterJobsPage() {
  const [jobs, setJobs] = useState(myJobs);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newJobPost, setNewJobPost] = useState<Partial<JobPost>>({
    Type: "Full-time",
    Logo: "/placeholder.svg?height=32&width=32",
    CreatedAt: new Date().toISOString(),
    Tags: [],
  });

  const handleCreateJobPost = () => {
    const id = `jp${Math.floor(Math.random() * 100000)}`;
    const newPostWithId = {
      ...newJobPost,
      Id: id,
      CreatedAt: new Date().toISOString(),
      CategoryName: "Default Category", // Placeholder, replace with actual category name lookup
      CompanyName: "Default Company", // Placeholder, replace with actual company name lookup
    } as JobPost;
    setJobs((prev) => [...prev, newPostWithId]);
    setIsCreateDialogOpen(false);
    setNewJobPost({
      Type: "Full-time",
      Logo: "/placeholder.svg?height=32&width=32",
      CreatedAt: new Date().toISOString(),
      Tags: [],
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
            <Button>
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
                    value={newJobPost.Title || ""}
                    onChange={(e) =>
                      setNewJobPost({ ...newJobPost, Title: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="location">Địa điểm</Label>
                  <Input
                    id="location"
                    placeholder="VD: Hồ Chí Minh"
                    value={newJobPost.Location || ""}
                    onChange={(e) =>
                      setNewJobPost({ ...newJobPost, Location: e.target.value })
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
                    value={newJobPost.Salary || ""}
                    onChange={(e) =>
                      setNewJobPost({
                        ...newJobPost,
                        Salary: Number.parseFloat(e.target.value),
                      })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="type">Loại hình</Label>
                  <Select
                    value={newJobPost.Type || "Full-time"}
                    onValueChange={(value) =>
                      setNewJobPost({
                        ...newJobPost,
                        Type: value as JobPost["Type"],
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
                  value={newJobPost.Description || ""}
                  onChange={(e) =>
                    setNewJobPost({
                      ...newJobPost,
                      Description: e.target.value,
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
                    value={newJobPost.CompanyId || ""}
                    onChange={(e) =>
                      setNewJobPost({
                        ...newJobPost,
                        CompanyId: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="categoryId">ID Danh mục</Label>
                  <Input
                    id="categoryId"
                    placeholder="VD: cat001"
                    value={newJobPost.CategoryId || ""}
                    onChange={(e) =>
                      setNewJobPost({
                        ...newJobPost,
                        CategoryId: e.target.value,
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
                  value={newJobPost.Tags?.join(", ") || ""}
                  onChange={(e) =>
                    setNewJobPost({
                      ...newJobPost,
                      Tags: e.target.value.split(",").map((tag) => tag.trim()),
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
                <TableHead>Công ty</TableHead> {/* New column */}
                <TableHead>Địa điểm</TableHead>
                <TableHead>Lương</TableHead>
                <TableHead>Loại</TableHead>
                <TableHead>Danh mục</TableHead> {/* New column */}
                <TableHead>Ngày đăng</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {jobs.map((job) => (
                <TableRow key={job.Id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{job.Title}</p>
                      <p className="text-sm text-gray-500">{job.Type}</p>
                    </div>
                  </TableCell>
                  <TableCell>{job.CompanyName}</TableCell>{" "}
                  {/* Display CompanyName */}
                  <TableCell>{job.Location}</TableCell>
                  <TableCell>${job.Salary}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{job.Type}</Badge>
                  </TableCell>
                  <TableCell>{job.CategoryName}</TableCell>{" "}
                  {/* Display CategoryName */}
                  <TableCell>
                    {new Date(job.CreatedAt).toLocaleDateString()}
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
                        <DropdownMenuItem>
                          <Edit className="h-4 w-4 mr-2" />
                          Chỉnh sửa
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <FileText className="h-4 w-4 mr-2" />
                          Xem ứng tuyển
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600">
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
    </div>
  );
}
