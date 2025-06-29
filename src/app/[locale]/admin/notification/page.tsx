"use client";
import React, { useEffect, useState } from "react";

import { Badge } from "@/components/ui/badge";
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
  Bell,
  Mail,
  CheckCircle,
  Clock,
} from "lucide-react";
import { fetchAllNotifications, createNotification as apiCreateNotification, markNotificationAsRead, deleteNotification as apiDeleteNotification } from "@/lib/api/admin-notification";
import { Notification } from "@/types/Notification";

const notificationTypes = ["system", "job_application", "interview_invite", "offer", "other"];
const readStatuses = ["read", "unread"];

export default function AdminNotificationDashboard() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterReadStatus, setFilterReadStatus] = useState("all");
  const [formData, setFormData] = useState<Partial<Notification>>({
    userId: "",
    message: "",
    read: false,
    type: "system",
  });

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const data = await fetchAllNotifications();
      setNotifications(data);
    } catch {
      // error handling if needed
    }
  };

  const getFilteredNotifications = () => {
    return notifications.filter((notification) => {
      const matchesSearch =
        notification.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (notification.type || "").toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = filterType === "all" || notification.type === filterType;
      const matchesReadStatus =
        filterReadStatus === "all" ||
        notification.read === (filterReadStatus === "read");
      return matchesSearch && matchesType && matchesReadStatus;
    });
  };

  const handleCreateNotification = async () => {
    try {
      await apiCreateNotification(formData);
    setIsCreateDialogOpen(false);
      setFormData({ userId: "", message: "", read: false, type: "system" });
      fetchNotifications();
    } catch {
      // error handling if needed
    }
  };

  const handleDeleteNotification = async (id: string) => {
    try {
      await apiDeleteNotification(id);
    setIsDeleteDialogOpen(false);
    setSelectedNotification(null);
      fetchNotifications();
    } catch {
      // error handling if needed
    }
  };

  const handleMarkAsRead = async (id: string) => {
    try {
      await markNotificationAsRead(id);
      fetchNotifications();
    } catch {
      // error handling if needed
    }
  };

  const resetForm = () => {
    setFormData({ userId: "", message: "", read: false, type: "system" });
  };

  const handleEdit = (notification: Notification) => {
    setSelectedNotification(notification);
    setFormData(notification);
    setIsEditDialogOpen(true);
  };

  const handleView = (notification: Notification) => {
    setSelectedNotification(notification);
    setIsViewDialogOpen(true);
    handleMarkAsRead(notification.id); // Mark as read when viewed
  };

  const handleDelete = (notification: Notification) => {
    setSelectedNotification(notification);
    setIsDeleteDialogOpen(true);
  };

  const getTypeBadge = (type: Notification["type"]) => {
    switch (type) {
      case "system":
        return <Badge variant="outline">Hệ thống</Badge>;
      case "job_application":
        return <Badge className="bg-blue-100 text-blue-800">Ứng tuyển</Badge>;
      case "interview_invite":
        return <Badge className="bg-green-100 text-green-800">Phỏng vấn</Badge>;
      case "offer":
        return (
          <Badge className="bg-purple-100 text-purple-800">
            Thư mời làm việc
          </Badge>
        );
      case "other":
        return <Badge variant="secondary">Khác</Badge>;
      default:
        return <Badge variant="secondary">{type}</Badge>;
    }
  };

  const getReadStatusBadge = (read: Notification["read"]) => {
    return read ? (
      <Badge variant="secondary">Đã đọc</Badge>
    ) : (
      <Badge className="bg-yellow-100 text-yellow-800">Chưa đọc</Badge>
    );
  };

  const filteredNotifications = getFilteredNotifications();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Quản lý thông báo
            </h1>
            <p className="text-gray-600 mt-2">
              Tạo và quản lý các thông báo hệ thống
            </p>
          </div>
          <Dialog
            open={isCreateDialogOpen}
            onOpenChange={setIsCreateDialogOpen}
          >
            <DialogTrigger asChild>
              <Button onClick={resetForm}>
                <Plus className="h-4 w-4 mr-2" />
                Tạo thông báo mới
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Tạo thông báo mới</DialogTitle>
                <DialogDescription>
                  Gửi thông báo đến người dùng hoặc nhóm người dùng cụ thể
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div>
                  <Label htmlFor="userId">ID Người dùng *</Label>
                  <Input
                    id="userId"
                    type="number"
                    value={formData.userId || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        userId: e.target.value,
                      })
                    }
                    placeholder="VD: 123"
                  />
                </div>
                <div>
                  <Label htmlFor="message">Nội dung thông báo *</Label>
                  <Textarea
                    id="message"
                    value={formData.message || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, message: e.target.value })
                    }
                    placeholder="Nhập nội dung thông báo..."
                    rows={4}
                  />
                </div>
                <div>
                  <Label htmlFor="type">Loại thông báo *</Label>
                  <Select
                    value={formData.type || "system"}
                    onValueChange={(value) =>
                      setFormData({
                        ...formData,
                        type: value as Notification["type"],
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn loại thông báo" />
                    </SelectTrigger>
                    <SelectContent>
                      {notificationTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type === "system"
                            ? "Hệ thống"
                            : type === "job_application"
                            ? "Ứng tuyển"
                            : type === "interview_invite"
                            ? "Phỏng vấn"
                            : type === "offer"
                            ? "Thư mời làm việc"
                            : "Khác"}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="readStatus">Trạng thái đọc ban đầu</Label>
                  <Select
                    value={formData.read ? "read" : "unread"}
                    onValueChange={(value) =>
                      setFormData({ ...formData, read: value === "read" })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn trạng thái" />
                    </SelectTrigger>
                    <SelectContent>
                      {readStatuses.map((status) => (
                        <SelectItem key={status} value={status}>
                          {status === "read" ? "Đã đọc" : "Chưa đọc"}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsCreateDialogOpen(false)}
                >
                  Hủy
                </Button>
                <Button onClick={handleCreateNotification}>Tạo thông báo</Button>
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
                    Tổng thông báo
                  </p>
                  <p className="text-3xl font-bold">{notifications.length}</p>
                </div>
                <Bell className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Thông báo chưa đọc
                  </p>
                  <p className="text-3xl font-bold text-yellow-600">
                    {notifications.filter((n) => n.read === false).length}
                  </p>
                </div>
                <Mail className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Thông báo gần đây
                  </p>
                  <p className="text-3xl font-bold text-purple-600">
                    {
                      notifications.filter(
                        (n) =>
                          new Date(n.createdAt).getMonth() ===
                          new Date().getMonth()
                      ).length
                    }
                  </p>
                </div>
                <Clock className="h-8 w-8 text-purple-600" />
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
                  placeholder="Tìm kiếm theo nội dung hoặc loại..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger>
                  <SelectValue placeholder="Loại thông báo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả loại</SelectItem>
                  {notificationTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type === "system"
                        ? "Hệ thống"
                        : type === "job_application"
                        ? "Ứng tuyển"
                        : type === "interview_invite"
                        ? "Phỏng vấn"
                        : type === "offer"
                        ? "Thư mời làm việc"
                        : "Khác"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select
                value={filterReadStatus}
                onValueChange={setFilterReadStatus}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Trạng thái đọc" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả trạng thái</SelectItem>
                  {readStatuses.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status === "read" ? "Đã đọc" : "Chưa đọc"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Notifications Table */}
        <Card>
          <CardHeader>
            <CardTitle>Danh sách thông báo</CardTitle>
            <CardDescription>
              Hiển thị {filteredNotifications.length} / {notifications.length}{" "}
              thông báo
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>ID Người dùng</TableHead>
                  <TableHead>Nội dung (tóm tắt)</TableHead>
                  <TableHead>Loại</TableHead>
                  <TableHead>Trạng thái đọc</TableHead>
                  <TableHead>Ngày tạo</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredNotifications.map((notification) => (
                  <TableRow key={notification.id}>
                    <TableCell>{notification.id}</TableCell>
                    <TableCell>{notification.userId}</TableCell>
                    <TableCell className="font-medium">
                      {notification.message.length > 70
                        ? notification.message.substring(0, 70) + "..."
                        : notification.message}
                    </TableCell>
                    <TableCell>{getTypeBadge(notification.type)}</TableCell>
                    <TableCell>
                      {getReadStatusBadge(notification.read)}
                    </TableCell>
                    <TableCell>{notification.createdAt}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => handleView(notification)}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            Xem chi tiết
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleEdit(notification)}
                          >
                            <Edit className="h-4 w-4 mr-2" />
                            Chỉnh sửa
                          </DropdownMenuItem>
                          {notification.read === false && (
                            <DropdownMenuItem
                              onClick={() => handleMarkAsRead(notification.id)}
                            >
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Đánh dấu đã đọc
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => handleDelete(notification)}
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

        {/* View Notification Dialog */}
        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Chi tiết thông báo</DialogTitle>
            </DialogHeader>
            {selectedNotification && (
              <div className="space-y-4">
                <div>
                  <Label>ID</Label>
                  <p className="text-sm mt-1">{selectedNotification.id}</p>
                </div>
                <div>
                  <Label>ID Người dùng</Label>
                  <p className="text-sm mt-1">{selectedNotification.userId}</p>
                </div>
                <div>
                  <Label>Nội dung</Label>
                  <p className="text-sm text-gray-700 mt-1">
                    {selectedNotification.message}
                  </p>
                </div>
                <div>
                  <Label>Loại</Label>
                  <p className="text-sm mt-1">
                    {getTypeBadge(selectedNotification.type)}
                  </p>
                </div>
                <div>
                  <Label>Trạng thái đọc</Label>
                  <p className="text-sm mt-1">
                    {getReadStatusBadge(selectedNotification.read)}
                  </p>
                </div>
                <div>
                  <Label>Ngày tạo</Label>
                  <p className="text-sm mt-1">
                    {selectedNotification.createdAt}
                  </p>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Edit Notification Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Chỉnh sửa thông báo</DialogTitle>
              <DialogDescription>
                Cập nhật thông tin thông báo
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div>
                <Label htmlFor="edit-userId">ID Người dùng *</Label>
                <Input
                  id="edit-userId"
                  type="number"
                  value={formData.userId || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      userId: e.target.value,
                    })
                  }
                  placeholder="VD: 123"
                />
              </div>
              <div>
                <Label htmlFor="edit-message">Nội dung thông báo *</Label>
                <Textarea
                  id="edit-message"
                  value={formData.message || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                  placeholder="Nhập nội dung thông báo..."
                  rows={4}
                />
              </div>
              <div>
                <Label htmlFor="edit-type">Loại thông báo *</Label>
                <Select
                  value={formData.type || "system"}
                  onValueChange={(value) =>
                    setFormData({
                      ...formData,
                      type: value as Notification["type"],
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn loại thông báo" />
                  </SelectTrigger>
                  <SelectContent>
                    {notificationTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type === "system"
                          ? "Hệ thống"
                          : type === "job_application"
                          ? "Ứng tuyển"
                          : type === "interview_invite"
                          ? "Phỏng vấn"
                          : type === "offer"
                          ? "Thư mời làm việc"
                          : "Khác"}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="edit-readStatus">Trạng thái đọc</Label>
                <Select
                  value={formData.read ? "read" : "unread"}
                  onValueChange={(value) =>
                    setFormData({ ...formData, read: value === "read" })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn trạng thái" />
                  </SelectTrigger>
                  <SelectContent>
                    {readStatuses.map((status) => (
                      <SelectItem key={status} value={status}>
                        {status === "read" ? "Đã đọc" : "Chưa đọc"}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
                  selectedNotification &&
                  handleEdit(selectedNotification)
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
                Bạn có chắc chắn muốn xóa thông báo có ID:{" "}
                {selectedNotification?.id} (Loại: {selectedNotification?.type})?
                Hành động này không thể hoàn tác.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Hủy</AlertDialogCancel>
              <AlertDialogAction
                onClick={() =>
                  selectedNotification &&
                  handleDeleteNotification(selectedNotification.id)
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
