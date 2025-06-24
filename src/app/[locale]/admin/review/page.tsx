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
import { useState } from "react";

// Types
interface Review {
  Id: number;
  UserId: number;
  CompanyId: number;
  Rating: number;
  Comment: string;
  CreatedAt: string; // Assuming ISO string or similar for date
}

interface UserMock {
  id: number;
  name: string;
  email: string;
}

interface CompanyMock {
  id: number;
  name: string;
  logo: string;
}

// Mock Data
const mockUsers: UserMock[] = [
  { id: 1, name: "Nguyễn Văn A", email: "nguyenvana@example.com" },
  { id: 2, name: "Trần Thị B", email: "tranthib@example.com" },
  { id: 3, name: "Lê Văn C", email: "levanc@example.com" },
  { id: 4, name: "Phạm Thị D", email: "phamthid@example.com" },
];

const mockCompanies: CompanyMock[] = [
  {
    id: 101,
    name: "TechCorp Vietnam",
    logo: "/placeholder.svg?height=40&width=40",
  },
  { id: 102, name: "StartupXYZ", logo: "/placeholder.svg?height=40&width=40" },
  {
    id: 103,
    name: "Design Studio Pro",
    logo: "/placeholder.svg?height=40&width=40",
  },
];

const initialReviews: Review[] = [
  {
    Id: 1,
    UserId: 1,
    CompanyId: 101,
    Rating: 5,
    Comment:
      "Môi trường làm việc rất chuyên nghiệp và cơ hội phát triển tốt. Đồng nghiệp thân thiện và hỗ trợ.",
    CreatedAt: "2024-05-20",
  },
  {
    Id: 2,
    UserId: 2,
    CompanyId: 102,
    Rating: 4,
    Comment:
      "Startup năng động, nhiều thử thách. Lương thưởng khá nhưng áp lực công việc cao.",
    CreatedAt: "2024-05-22",
  },
  {
    Id: 3,
    UserId: 3,
    CompanyId: 101,
    Rating: 3,
    Comment:
      "Công ty lớn nhưng quy trình hơi rườm rà. Cần cải thiện về phúc lợi.",
    CreatedAt: "2024-05-25",
  },
  {
    Id: 4,
    UserId: 4,
    CompanyId: 103,
    Rating: 5,
    Comment:
      "Studio thiết kế sáng tạo, sếp rất tâm lý. Sản phẩm chất lượng cao.",
    CreatedAt: "2024-05-28",
  },
  {
    Id: 5,
    UserId: 1,
    CompanyId: 102,
    Rating: 2,
    Comment:
      "Không phù hợp với người thích sự ổn định. Thường xuyên OT và không có chế độ rõ ràng.",
    CreatedAt: "2024-06-01",
  },
];

export default function AdminReviewDashboard() {
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
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
    UserId: undefined,
    CompanyId: undefined,
    Rating: undefined,
    Comment: "",
  });

  const getUserNameById = (userId: number) => {
    return (
      mockUsers.find((user) => user.id === userId)?.name || `User #${userId}`
    );
  };

  const getCompanyNameById = (companyId: number) => {
    return (
      mockCompanies.find((company) => company.id === companyId)?.name ||
      `Company #${companyId}`
    );
  };

  const getFilteredReviews = () => {
    return reviews.filter((review) => {
      const userMatches = getUserNameById(review.UserId)
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const companyMatches = getCompanyNameById(review.CompanyId)
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const commentMatches = review.Comment.toLowerCase().includes(
        searchTerm.toLowerCase()
      );

      const matchesSearch = userMatches || companyMatches || commentMatches;
      const matchesRating =
        filterRating === "all" ||
        review.Rating === Number.parseInt(filterRating);
      const matchesCompany =
        filterCompanyId === "all" ||
        review.CompanyId === Number.parseInt(filterCompanyId);

      return matchesSearch && matchesRating && matchesCompany;
    });
  };

  const createReview = () => {
    const newReview: Review = {
      ...formData,
      Id: Math.max(...reviews.map((r) => r.Id)) + 1,
      CreatedAt: new Date().toISOString().split("T")[0],
    } as Review;

    setReviews([...reviews, newReview]);
    setIsCreateDialogOpen(false);
    resetForm();
  };

  const updateReview = (id: number) => {
    setReviews(
      reviews.map((review) =>
        review.Id === id
          ? { ...review, ...formData, CreatedAt: review.CreatedAt }
          : review
      )
    );
    setIsEditDialogOpen(false);
    resetForm();
  };

  const deleteReview = (id: number) => {
    setReviews(reviews.filter((review) => review.Id !== id));
    setIsDeleteDialogOpen(false);
    setSelectedReview(null);
  };

  const resetForm = () => {
    setFormData({
      UserId: undefined,
      CompanyId: undefined,
      Rating: undefined,
      Comment: "",
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

  const ReviewForm = ({ isEdit = false }: { isEdit?: boolean }) => (
    <div className="grid gap-4 py-4">
      {!isEdit && (
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="userId">Người dùng *</Label>
            <Select
              value={formData.UserId?.toString() || ""}
              onValueChange={(value) =>
                setFormData({ ...formData, UserId: Number.parseInt(value) })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn người dùng" />
              </SelectTrigger>
              <SelectContent>
                {mockUsers.map((user) => (
                  <SelectItem key={user.id} value={user.id.toString()}>
                    {user.name} ({user.email})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="companyId">Công ty *</Label>
            <Select
              value={formData.CompanyId?.toString() || ""}
              onValueChange={(value) =>
                setFormData({ ...formData, CompanyId: Number.parseInt(value) })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn công ty" />
              </SelectTrigger>
              <SelectContent>
                {mockCompanies.map((company) => (
                  <SelectItem key={company.id} value={company.id.toString()}>
                    {company.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      )}

      <div>
        <Label htmlFor="rating">Đánh giá (Rating) *</Label>
        <Select
          value={formData.Rating?.toString() || ""}
          onValueChange={(value) =>
            setFormData({ ...formData, Rating: Number.parseInt(value) })
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
          value={formData.Comment || ""}
          onChange={(e) =>
            setFormData({ ...formData, Comment: e.target.value })
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
                <Button onClick={createReview}>Tạo đánh giá</Button>
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
                    {(
                      reviews.reduce((sum, r) => sum + r.Rating, 0) /
                      reviews.length
                    ).toFixed(1)}{" "}
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
                    {
                      reviews.filter(
                        (r) =>
                          new Date(r.CreatedAt).getMonth() ===
                          new Date().getMonth()
                      ).length
                    }
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
                  placeholder="Tìm kiếm theo người dùng, công ty, bình luận..."
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
                  {mockCompanies.map((company) => (
                    <SelectItem key={company.id} value={company.id.toString()}>
                      {company.name}
                    </SelectItem>
                  ))}
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
                  <TableRow key={review.Id}>
                    <TableCell>{review.Id}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <User className="h-4 w-4 text-gray-500" />
                        <span>{getUserNameById(review.UserId)}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Image
                          src={
                            mockCompanies.find((c) => c.id === review.CompanyId)
                              ?.logo || "/placeholder.svg"
                          }
                          alt={getCompanyNameById(review.CompanyId)}
                          width={24}
                          height={24}
                          className="rounded-full"
                        />
                        <span>{getCompanyNameById(review.CompanyId)}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        {Array.from({ length: review.Rating }).map((_, i) => (
                          <Star
                            key={i}
                            className="h-4 w-4 text-yellow-400 fill-current"
                          />
                        ))}
                        {Array.from({ length: 5 - review.Rating }).map(
                          (_, i) => (
                            <Star key={i} className="h-4 w-4 text-gray-300" />
                          )
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="max-w-[250px] truncate">
                      {review.Comment}
                    </TableCell>
                    <TableCell>{review.CreatedAt}</TableCell>
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
                  <p className="text-sm mt-1">{selectedReview.Id}</p>
                </div>
                <div>
                  <Label>Người dùng</Label>
                  <p className="text-sm mt-1">
                    {getUserNameById(selectedReview.UserId)}
                  </p>
                </div>
                <div>
                  <Label>Công ty</Label>
                  <p className="text-sm mt-1">
                    {getCompanyNameById(selectedReview.CompanyId)}
                  </p>
                </div>
                <div>
                  <Label>Rating</Label>
                  <div className="flex items-center mt-1">
                    {Array.from({ length: selectedReview.Rating }).map(
                      (_, i) => (
                        <Star
                          key={i}
                          className="h-5 w-5 text-yellow-400 fill-current"
                        />
                      )
                    )}
                    {Array.from({ length: 5 - selectedReview.Rating }).map(
                      (_, i) => (
                        <Star key={i} className="h-5 w-5 text-gray-300" />
                      )
                    )}
                    <span className="ml-2 text-sm">
                      ({selectedReview.Rating} sao)
                    </span>
                  </div>
                </div>
                <div>
                  <Label>Bình luận</Label>
                  <p className="text-sm text-gray-700 mt-1">
                    {selectedReview.Comment}
                  </p>
                </div>
                <div>
                  <Label>Ngày tạo</Label>
                  <p className="text-sm mt-1">{selectedReview.CreatedAt}</p>
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
            <ReviewForm isEdit={true} />
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsEditDialogOpen(false)}
              >
                Hủy
              </Button>
              <Button
                onClick={() =>
                  selectedReview && updateReview(selectedReview.Id)
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
                Bạn có chắc chắn muốn xóa đánh giá này (ID: {selectedReview?.Id}
                )? Hành động này không thể hoàn tác.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Hủy</AlertDialogCancel>
              <AlertDialogAction
                onClick={() =>
                  selectedReview && deleteReview(selectedReview.Id)
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
