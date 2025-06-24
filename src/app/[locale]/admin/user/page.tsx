"use client";

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
  User,
  Mail,
  Briefcase,
  Users,
} from "lucide-react";
import { useState } from "react";
import React from "react";
// Types
interface UserData {
  Id: number;
  Email: string;
  FullName: string;
  Role: "admin" | "employer" | "candidate";
}

// Mock Data
const initialUsers: UserData[] = [
  { Id: 1, Email: "admin@jobportal.vn", FullName: "Admin User", Role: "admin" },
  {
    Id: 2,
    Email: "hr@techcorp.vn",
    FullName: "Nguyễn Thị Tuyển Dụng",
    Role: "employer",
  },
  {
    Id: 3,
    Email: "candidate.a@email.com",
    FullName: "Trần Văn A",
    Role: "candidate",
  },
  {
    Id: 4,
    Email: "candidate.b@email.com",
    FullName: "Lê Thị B",
    Role: "candidate",
  },
  {
    Id: 5,
    Email: "contact@startupxyz.com",
    FullName: "Phạm Minh C",
    Role: "employer",
  },
];

const userRoles = ["admin", "employer", "candidate"];

export default function Page() {
  const [users, setUsers] = useState<UserData[]>(initialUsers);
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("all");

  // Form state
  const [formData, setFormData] = useState<Partial<UserData>>({
    Email: "",
    FullName: "",
    Role: "candidate", // Default role
  });

  const getFilteredUsers = () => {
    return users.filter((user) => {
      const matchesSearch =
        user.Email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.FullName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRole = filterRole === "all" || user.Role === filterRole;

      return matchesSearch && matchesRole;
    });
  };

  const createUser = () => {
    const newUser: UserData = {
      ...formData,
      Id: Math.max(...users.map((u) => u.Id)) + 1,
    } as UserData;

    setUsers([...users, newUser]);
    setIsCreateDialogOpen(false);
    resetForm();
  };

  const updateUser = (id: number) => {
    setUsers(
      users.map((user) => (user.Id === id ? { ...user, ...formData } : user))
    );
    setIsEditDialogOpen(false);
    resetForm();
  };

  const deleteUser = (id: number) => {
    setUsers(users.filter((user) => user.Id !== id));
    setIsDeleteDialogOpen(false);
    setSelectedUser(null);
  };

  const resetForm = () => {
    setFormData({
      Email: "",
      FullName: "",
      Role: "candidate",
    });
  };

  const handleEdit = (user: UserData) => {
    setSelectedUser(user);
    setFormData(user);
    setIsEditDialogOpen(true);
  };

  const handleView = (user: UserData) => {
    setSelectedUser(user);
    setIsViewDialogOpen(true);
  };

  const handleDelete = (user: UserData) => {
    setSelectedUser(user);
    setIsDeleteDialogOpen(true);
  };

  const getUserRoleBadge = (role: UserData["Role"]) => {
    switch (role) {
      case "admin":
        return <Badge className="bg-red-100 text-red-800">Admin</Badge>;
      case "employer":
        return (
          <Badge className="bg-blue-100 text-blue-800">Nhà tuyển dụng</Badge>
        );
      case "candidate":
        return <Badge className="bg-green-100 text-green-800">Ứng viên</Badge>;
      default:
        return <Badge variant="secondary">{role}</Badge>;
    }
  };

  const UserForm = ({ isEdit = false }: { isEdit?: boolean }) => (
    <div className="grid gap-4 py-4">
      <div>
        <Label htmlFor="email">Email *</Label>
        <Input
          id="email"
          type="email"
          value={formData.Email || ""}
          onChange={(e) => setFormData({ ...formData, Email: e.target.value })}
          placeholder="user@example.com"
        />
      </div>
      <div>
        <Label htmlFor="fullName">Họ và tên</Label>
        <Input
          id="fullName"
          value={formData.FullName || ""}
          onChange={(e) =>
            setFormData({ ...formData, FullName: e.target.value })
          }
          placeholder="Nguyễn Văn A"
        />
      </div>
      <div>
        <Label htmlFor="role">Vai trò *</Label>
        <Select
          value={formData.Role || "candidate"}
          onValueChange={(value) =>
            setFormData({ ...formData, Role: value as UserData["Role"] })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Chọn vai trò" />
          </SelectTrigger>
          <SelectContent>
            {userRoles.map((role) => (
              <SelectItem key={role} value={role}>
                {role === "admin"
                  ? "Admin"
                  : role === "employer"
                  ? "Nhà tuyển dụng"
                  : "Ứng viên"}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );

  const filteredUsers = getFilteredUsers();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Quản lý người dùng
            </h1>
            <p className="text-gray-600 mt-2">
              Quản lý tất cả người dùng trong hệ thống
            </p>
          </div>
          <Dialog
            open={isCreateDialogOpen}
            onOpenChange={setIsCreateDialogOpen}
          >
            <DialogTrigger asChild>
              <Button onClick={resetForm}>
                <Plus className="h-4 w-4 mr-2" />
                Thêm người dùng
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Thêm người dùng mới</DialogTitle>
                <DialogDescription>
                  Tạo một tài khoản người dùng mới
                </DialogDescription>
              </DialogHeader>
              <UserForm />
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsCreateDialogOpen(false)}
                >
                  Hủy
                </Button>
                <Button onClick={createUser}>Tạo người dùng</Button>
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
                    Tổng người dùng
                  </p>
                  <p className="text-3xl font-bold">{users.length}</p>
                </div>
                <Users className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Nhà tuyển dụng
                  </p>
                  <p className="text-3xl font-bold text-purple-600">
                    {users.filter((u) => u.Role === "employer").length}
                  </p>
                </div>
                <Briefcase className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Ứng viên</p>
                  <p className="text-3xl font-bold text-green-600">
                    {users.filter((u) => u.Role === "candidate").length}
                  </p>
                </div>
                <User className="h-8 w-8 text-green-600" />
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
                  placeholder="Tìm kiếm theo email hoặc tên..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select value={filterRole} onValueChange={setFilterRole}>
                <SelectTrigger>
                  <SelectValue placeholder="Vai trò" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả vai trò</SelectItem>
                  {userRoles.map((role) => (
                    <SelectItem key={role} value={role}>
                      {role === "admin"
                        ? "Admin"
                        : role === "employer"
                        ? "Nhà tuyển dụng"
                        : "Ứng viên"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button variant="outline">
                <Users className="h-4 w-4 mr-2" />
                Bộ lọc nâng cao
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Users Table */}
        <Card>
          <CardHeader>
            <CardTitle>Danh sách người dùng</CardTitle>
            <CardDescription>
              Hiển thị {filteredUsers.length} / {users.length} người dùng
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Họ và tên</TableHead>
                  <TableHead>Vai trò</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.Id}>
                    <TableCell>{user.Id}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Mail className="h-4 w-4 text-gray-500" />
                        <span>{user.Email}</span>
                      </div>
                    </TableCell>
                    <TableCell>{user.FullName}</TableCell>
                    <TableCell>{getUserRoleBadge(user.Role)}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleView(user)}>
                            <Eye className="h-4 w-4 mr-2" />
                            Xem chi tiết
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleEdit(user)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Chỉnh sửa
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => handleDelete(user)}
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

        {/* View User Dialog */}
        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Chi tiết người dùng</DialogTitle>
            </DialogHeader>
            {selectedUser && (
              <div className="space-y-4">
                <div>
                  <Label>ID</Label>
                  <p className="text-sm mt-1">{selectedUser.Id}</p>
                </div>
                <div>
                  <Label>Email</Label>
                  <p className="text-sm mt-1">{selectedUser.Email}</p>
                </div>
                <div>
                  <Label>Họ và tên</Label>
                  <p className="text-sm mt-1">{selectedUser.FullName}</p>
                </div>
                <div>
                  <Label>Vai trò</Label>
                  <p className="text-sm mt-1">
                    {getUserRoleBadge(selectedUser.Role)}
                  </p>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Edit User Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Chỉnh sửa người dùng</DialogTitle>
              <DialogDescription>
                Cập nhật thông tin người dùng
              </DialogDescription>
            </DialogHeader>
            <UserForm isEdit={true} />
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsEditDialogOpen(false)}
              >
                Hủy
              </Button>
              <Button
                onClick={() => selectedUser && updateUser(selectedUser.Id)}
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
                Bạn có chắc chắn muốn xóa người dùng &quot;
                {selectedUser?.FullName}&quot; (Email: {selectedUser?.Email})?
                Hành động này không thể hoàn tác.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Hủy</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => selectedUser && deleteUser(selectedUser.Id)}
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
