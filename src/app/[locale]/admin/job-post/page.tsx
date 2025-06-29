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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
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
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { format } from "date-fns";
import { PlusIcon, SearchIcon, Loader2 } from "lucide-react";
import {
  fetchAllJobPosts,
  deleteJobPost,
} from "@/lib/api/admin-jobpost";
import { JobPost } from "@/types/JobPost";

export default function AdminJobPostDashboard() {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [filterType, setFilterType] = React.useState<string>("all");
  const [jobPosts, setJobPosts] = React.useState<JobPost[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
  const [jobPostToDelete, setJobPostToDelete] = React.useState<JobPost | null>(null);

  // Fetch job posts on component mount
  React.useEffect(() => {
    fetchJobPosts();
  }, []);

  const fetchJobPosts = async () => {
      try {
      setIsLoading(true);
      setError(null);
        const posts = await fetchAllJobPosts();
        setJobPosts(posts);
      } catch (err) {
        console.error("Lỗi khi fetch job posts:", err);
      setError("Không thể tải danh sách bài đăng. Vui lòng thử lại.");
      } finally {
        setIsLoading(false);
      }
    };

  // Filter job posts based on search term and type
  const filteredJobPosts = jobPosts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.skillsRequired?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.categoryName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.tags?.some((tag: string) =>
        tag.toLowerCase().includes(searchTerm.toLowerCase())
      );

    const matchesType = filterType === "all" || post.type === filterType;

    return matchesSearch && matchesType;
  });

  const handleDeleteJobPost = async (id: string) => {
    try {
      await deleteJobPost(id);
      setJobPosts((prev) => prev.filter((post) => post.id !== id));
      setIsDeleteDialogOpen(false);
      setJobPostToDelete(null);
    } catch (err) {
      console.error("Lỗi xóa bài đăng:", err);
      setError("Không thể xóa bài đăng. Vui lòng thử lại.");
    }
  };

  const openDeleteDialog = (post: JobPost) => {
    setJobPostToDelete(post);
    setIsDeleteDialogOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen w-full flex-col bg-muted/40">
        <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
          <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Quản lý Bài đăng Tuyển dụng</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin" />
                  <span className="ml-2">Đang tải...</span>
                </div>
              </CardContent>
            </Card>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Quản lý Bài đăng Tuyển dụng</CardTitle>
              {error && (
                <div className="text-sm text-red-600 bg-red-50 p-2 rounded">
                  {error}
                </div>
              )}
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
                  <Button onClick={() => alert("Hiển thị form tạo mới")}>
                    <PlusIcon className="h-4 w-4 mr-2" /> Tạo Bài đăng Mới
                  </Button>
                </div>
              </div>
              
              {filteredJobPosts.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  {searchTerm || filterType !== "all" 
                    ? "Không tìm thấy bài đăng nào phù hợp với bộ lọc."
                    : "Chưa có bài đăng nào."
                  }
                </div>
              ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tiêu đề</TableHead>
                    <TableHead>Địa điểm</TableHead>
                    <TableHead>Loại</TableHead>
                    <TableHead>Lương</TableHead>
                      <TableHead>Danh mục</TableHead>
                    <TableHead>Ứng viên</TableHead>
                    <TableHead>Ngày tạo</TableHead>
                    <TableHead>
                      <span className="sr-only">Hành động</span>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredJobPosts.map((post) => (
                    <TableRow key={post.id}>
                        <TableCell className="font-medium">{post.title}</TableCell>
                        <TableCell>{post.location || "Chưa cập nhật"}</TableCell>
                        <TableCell>
                          <Badge variant={post.type ? "default" : "secondary"}>
                            {post.type || "Chưa cập nhật"}
                          </Badge>
                        </TableCell>
                      <TableCell>
                          {post.salary ? `$${post.salary.toLocaleString()}` : "Chưa cập nhật"}
                      </TableCell>
                        <TableCell>{post.categoryName || "Chưa cập nhật"}</TableCell>
                        <TableCell>{post.applicants || 0}</TableCell>
                      <TableCell>
                          {post.createdAt 
                            ? format(new Date(post.createdAt), "dd/MM/yyyy")
                            : "Chưa cập nhật"
                          }
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <DotsHorizontalIcon className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Hành động</DropdownMenuLabel>
                            <DropdownMenuItem
                              onClick={() => alert("Xem chi tiết")}
                            >
                              Xem chi tiết
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => alert("Chỉnh sửa")}
                            >
                              Chỉnh sửa
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                onClick={() => openDeleteDialog(post)}
                                className="text-red-600"
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
              )}
            </CardContent>
          </Card>
        </main>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa bài đăng &quot;{jobPostToDelete?.title}&quot;? 
              Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => jobPostToDelete && handleDeleteJobPost(jobPostToDelete.id)}
              className="bg-red-600 hover:bg-red-700"
            >
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
