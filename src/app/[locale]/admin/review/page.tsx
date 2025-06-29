"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import {
  Plus,
  Search,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  Star,
  User,
  MessageSquare,
  Calendar,
} from "lucide-react";
import Image from "next/image";
import { useState, useEffect } from "react";
import { fetchAllReviews, updateReview as apiUpdateReview, deleteReview as apiDeleteReview } from "@/lib/api/admin-review";
import { Review } from "@/types/Review";

export default function AdminReviewDashboard() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRating, setFilterRating] = useState("all");
  const [filterCompanyId, setFilterCompanyId] = useState("all");

  // Form state
  const [formData, setFormData] = useState<Partial<Review>>({
    userId: "",
    companyId: "",
    rating: undefined,
    comment: "",
  });

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const data = await fetchAllReviews();
      setReviews(data);
    } catch {
      // error handling if needed
    }
  };

  const getFilteredReviews = () => {
    return reviews.filter((review) => {
      const commentMatches = (review.comment || "").toLowerCase().includes(
        searchTerm.toLowerCase()
      );

      const matchesSearch = commentMatches;
      const matchesRating =
        filterRating === "all" ||
        review.rating === Number.parseInt(filterRating);
      const matchesCompany =
        filterCompanyId === "all" ||
        review.companyId === filterCompanyId;

      return matchesSearch && matchesRating && matchesCompany;
    });
  };

  const handleUpdateReview = async (id: string) => {
    try {
      await apiUpdateReview(id, formData);
    setIsEditDialogOpen(false);
      setFormData({ userId: "", companyId: "", rating: undefined, comment: "" });
      fetchReviews();
    } catch {
      // error handling if needed
    }
  };

  const handleDeleteReview = async (id: string) => {
    try {
      await apiDeleteReview(id);
    setIsDeleteDialogOpen(false);
    setSelectedReview(null);
      fetchReviews();
    } catch {
      // error handling if needed
    }
  };

  const resetForm = () => {
    setFormData({
      userId: "",
      companyId: "",
      rating: undefined,
      comment: "",
    });
  };

  const handleEdit = (review: Review) => {
    setSelectedReview(review);
    setFormData(review);
    setIsEditDialogOpen(true);
  };

  const handleView = (review: Review) => {
    setSelectedReview(review);
    setIsViewDialogOpen(true);
  };

  const handleDelete = (review: Review) => {
    setSelectedReview(review);
    setIsDeleteDialogOpen(true);
  };

  const ReviewForm = () => (
    <div className="grid gap-4 py-4">
      <div>
        <Label htmlFor="rating">Đánh giá (Rating) *</Label>
        <Select
          value={formData.rating?.toString() || ""}
          onValueChange={(value) =>
            setFormData({ ...formData, rating: Number.parseInt(value) })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Chọn số sao" />
          </SelectTrigger>
          <SelectContent>
            {[1, 2, 3, 4, 5].map((star) => (
              <SelectItem key={star} value={star.toString()}>
                {star} sao
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="comment">Bình luận</Label>
        <Textarea
          id="comment"
          value={formData.comment || ""}
          onChange={(e) =>
            setFormData({ ...formData, comment: e.target.value })
          }
          placeholder="Nhập bình luận..."
          rows={4}
        />
      </div>
    </div>
  );

  const filteredReviews = getFilteredReviews();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Quản lý đánh giá
            </h1>
            <p className="text-gray-600 mt-2">
              Quản lý tất cả đánh giá công ty trong hệ thống
            </p>
          </div>
          <Dialog
            open={isCreateDialogOpen}
            onOpenChange={setIsCreateDialogOpen}
          >
            <DialogTrigger asChild>
              <Button onClick={resetForm}>
                <Plus className="h-4 w-4 mr-2" />
                Thêm đánh giá
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Thêm đánh giá mới</DialogTitle>
                <DialogDescription>
                  Tạo một đánh giá mới cho công ty
                </DialogDescription>
              </DialogHeader>
              <ReviewForm />
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsCreateDialogOpen(false)}
                >
                  Hủy
                </Button>
                <Button onClick={() => alert("Chức năng tạo review chưa có API")}>
                  Tạo đánh giá
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Tổng đánh giá
                  </p>
                  <p className="text-3xl font-bold">{reviews.length}</p>
                </div>
                <MessageSquare className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Đánh giá trung bình
                  </p>
                  <p className="text-3xl font-bold text-yellow-600">
                    {reviews.length > 0
                      ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
                      : "0.0"}{" "}
                    <span className="text-xl">/ 5</span>
                  </p>
                </div>
                <Star className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Đánh giá gần đây
                  </p>
                  <p className="text-3xl font-bold text-purple-600">
                    {reviews.filter(
                        (r) =>
                        new Date(r.createdAt).getMonth() ===
                          new Date().getMonth()
                    ).length}
                  </p>
                </div>
                <Calendar className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Tìm kiếm theo bình luận..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select value={filterRating} onValueChange={setFilterRating}>
                <SelectTrigger>
                  <SelectValue placeholder="Đánh giá (Rating)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả đánh giá</SelectItem>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <SelectItem key={star} value={star.toString()}>
                      {star} sao
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select
                value={filterCompanyId}
                onValueChange={setFilterCompanyId}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Công ty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả công ty</SelectItem>
                  {/* Company options would be populated from API */}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Reviews Table */}
        <Card>
          <CardHeader>
            <CardTitle>Danh sách đánh giá</CardTitle>
            <CardDescription>
              Hiển thị {filteredReviews.length} / {reviews.length} đánh giá
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Người dùng</TableHead>
                  <TableHead>Công ty</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Bình luận</TableHead>
                  <TableHead>Ngày tạo</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredReviews.map((review) => (
                  <TableRow key={review.id}>
                    <TableCell>{review.id}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <User className="h-4 w-4 text-gray-500" />
                        <span>{review.userId}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Image
                          src="/placeholder.svg"
                          alt={review.companyId}
                          width={24}
                          height={24}
                          className="rounded-full"
                        />
                        <span>{review.companyId}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        {Array.from({ length: review.rating }).map((_, i) => (
                          <Star
                            key={i}
                            className="h-4 w-4 text-yellow-400 fill-current"
                          />
                        ))}
                        {Array.from({ length: 5 - review.rating }).map(
                          (_, i) => (
                            <Star key={i} className="h-4 w-4 text-gray-300" />
                          )
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="max-w-[250px] truncate">
                      {review.comment}
                    </TableCell>
                    <TableCell>{review.createdAt}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleView(review)}>
                            <Eye className="h-4 w-4 mr-2" />
                            Xem chi tiết
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleEdit(review)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Chỉnh sửa
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => handleDelete(review)}
                            className="text-red-600"
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

        {/* View Review Dialog */}
        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Chi tiết đánh giá</DialogTitle>
            </DialogHeader>
            {selectedReview && (
              <div className="space-y-4">
                <div>
                  <Label>ID</Label>
                  <p className="text-sm mt-1">{selectedReview.id}</p>
                </div>
                <div>
                  <Label>Người dùng</Label>
                  <p className="text-sm mt-1">{selectedReview.userId}</p>
                </div>
                <div>
                  <Label>Công ty</Label>
                  <p className="text-sm mt-1">{selectedReview.companyId}</p>
                </div>
                <div>
                  <Label>Rating</Label>
                  <div className="flex items-center mt-1">
                    {Array.from({ length: selectedReview.rating }).map(
                      (_, i) => (
                        <Star
                          key={i}
                          className="h-5 w-5 text-yellow-400 fill-current"
                        />
                      )
                    )}
                    {Array.from({ length: 5 - selectedReview.rating }).map(
                      (_, i) => (
                        <Star key={i} className="h-5 w-5 text-gray-300" />
                      )
                    )}
                    <span className="ml-2 text-sm">
                      ({selectedReview.rating} sao)
                    </span>
                  </div>
                </div>
                <div>
                  <Label>Bình luận</Label>
                  <p className="text-sm text-gray-700 mt-1">
                    {selectedReview.comment}
                  </p>
                </div>
                <div>
                  <Label>Ngày tạo</Label>
                  <p className="text-sm mt-1">{selectedReview.createdAt}</p>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Edit Review Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Chỉnh sửa đánh giá</DialogTitle>
              <DialogDescription>
                Cập nhật nội dung và rating của đánh giá
              </DialogDescription>
            </DialogHeader>
            <ReviewForm />
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsEditDialogOpen(false)}
              >
                Hủy
              </Button>
              <Button
                onClick={() =>
                  selectedReview && handleUpdateReview(selectedReview.id)
                }
              >
                Cập nhật
              </Button>
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
              <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
              <AlertDialogDescription>
                Bạn có chắc chắn muốn xóa đánh giá này (ID: {selectedReview?.id}
                )? Hành động này không thể hoàn tác.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Hủy</AlertDialogCancel>
              <AlertDialogAction
                onClick={() =>
                  selectedReview && handleDeleteReview(selectedReview.id)
                }
                className="bg-red-600 hover:bg-red-700"
              >
                Xóa
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
