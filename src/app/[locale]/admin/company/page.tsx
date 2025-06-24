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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Building2,
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  MapPin,
  Calendar,
  Star,
  Briefcase,
  Download,
  Upload,
} from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import React from "react";

// Types
interface Company {
  Id: number;
  Name: string;
  Logo: string;
  Description: string;
  Location: string;
  Employees: string;
  Industry: string;
  OpenJobs: number;
  Rating: number;
  Website: string;
  Founded: string;
  Tags: string;
}

// Mock data
const initialCompanies: Company[] = [
  {
    Id: 1,
    Name: "TechCorp Vietnam",
    Logo: "/placeholder.svg?height=60&width=60",
    Description:
      "Công ty công nghệ hàng đầu chuyên phát triển giải pháp phần mềm cho doanh nghiệp.",
    Location: "Hồ Chí Minh",
    Employees: "200-500",
    Industry: "Công nghệ thông tin",
    OpenJobs: 15,
    Rating: 4.8,
    Website: "https://techcorp.vn",
    Founded: "2015",
    Tags: "React,Node.js,AWS,Agile",
  },
  {
    Id: 2,
    Name: "StartupXYZ",
    Logo: "/placeholder.svg?height=60&width=60",
    Description:
      "Startup công nghệ tập trung vào phát triển ứng dụng mobile và web innovative.",
    Location: "Hà Nội",
    Employees: "50-100",
    Industry: "Startup",
    OpenJobs: 8,
    Rating: 4.6,
    Website: "https://startupxyz.com",
    Founded: "2020",
    Tags: "Flutter,React Native,Firebase",
  },
  {
    Id: 3,
    Name: "Design Studio Pro",
    Logo: "/placeholder.svg?height=60&width=60",
    Description:
      "Studio thiết kế chuyên nghiệp cung cấp dịch vụ UI/UX và branding.",
    Location: "Đà Nẵng",
    Employees: "20-50",
    Industry: "Thiết kế",
    OpenJobs: 5,
    Rating: 4.9,
    Website: "https://designstudio.vn",
    Founded: "2018",
    Tags: "Figma,Adobe Creative,UI/UX",
  },
];

const industries = [
  "Công nghệ thông tin",
  "Startup",
  "Thiết kế",
  "Marketing",
  "Tài chính",
  "Y tế",
  "Giáo dục",
  "Bán lẻ",
  "Sản xuất",
  "Khác",
];

const employeeSizes = [
  "1-10",
  "11-50",
  "51-200",
  "201-500",
  "501-1000",
  "1000+",
];

// const cities = [
//   "Hồ Chí Minh",
//   "Hà Nội",
//   "Đà Nẵng",
//   "Cần Thơ",
//   "Hải Phòng",
//   "Khác",
// ];

export default function Page() {
  const [companies, setCompanies] = useState<Company[]>(initialCompanies);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterIndustry, setFilterIndustry] = useState("all");

  // Form state
  const [formData, setFormData] = useState<Partial<Company>>({
    Name: "",
    Description: "",
    Location: "",
    Employees: "",
    Industry: "",
    Website: "",
    Founded: "",
    Tags: "",
  });

  // Get all companies (with filters)
  const getFilteredCompanies = () => {
    return companies.filter((company) => {
      const matchesSearch =
        company.Name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        company.Industry.toLowerCase().includes(searchTerm.toLowerCase()) ||
        company.Location.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesIndustry =
        filterIndustry === "all" || company.Industry === filterIndustry;

      return matchesSearch && matchesIndustry;
    });
  };

  // Get company by ID
  const getCompanyById = (id: number): Company | undefined => {
    return companies.find((company) => company.Id === id);
  };

  // Create new company
  const createCompany = () => {
    const newCompany: Company = {
      ...formData,
      Id: Math.max(...companies.map((c) => c.Id)) + 1,
      Logo: "/placeholder.svg?height=60&width=60",
      Rating: 0,
      OpenJobs: 0,
    } as Company;

    setCompanies([...companies, newCompany]);
    setIsCreateDialogOpen(false);
    resetForm();
  };

  // Update company by ID
  const updateCompany = (id: number) => {
    setCompanies(
      companies.map((company) =>
        company.Id === id ? { ...company, ...formData } : company
      )
    );
    setIsEditDialogOpen(false);
    resetForm();
  };

  // Delete company by ID
  const deleteCompany = (id: number) => {
    setCompanies(companies.filter((company) => company.Id !== id));
    setIsDeleteDialogOpen(false);
    setSelectedCompany(null);
  };

  const resetForm = () => {
    setFormData({
      Name: "",
      Description: "",
      Location: "",
      Employees: "",
      Industry: "",
      Website: "",
      Founded: "",
      Tags: "",
    });
  };

  const handleEdit = (company: Company) => {
    setSelectedCompany(company);
    setFormData(company);
    setIsEditDialogOpen(true);
  };

  const handleView = (company: Company) => {
    setSelectedCompany(company);
    setIsViewDialogOpen(true);
  };

  const handleDelete = (company: Company) => {
    setSelectedCompany(company);
    setIsDeleteDialogOpen(true);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800">Hoạt động</Badge>;
      case "pending":
        return (
          <Badge className="bg-yellow-100 text-yellow-800">Chờ duyệt</Badge>
        );
      case "suspended":
        return <Badge className="bg-red-100 text-red-800">Tạm ngưng</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const CompanyForm = ({ isEdit = false }: { isEdit?: boolean }) => (
    <div className="grid gap-4 py-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">Tên công ty *</Label>
          <Input
            id="name"
            value={formData.Name || ""}
            onChange={(e) => setFormData({ ...formData, Name: e.target.value })}
            placeholder="VD: TechCorp Vietnam"
          />
        </div>
        <div>
          <Label htmlFor="industry">Ngành nghề *</Label>
          <Select
            value={formData.Industry || ""}
            onValueChange={(value) =>
              setFormData({ ...formData, Industry: value })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Chọn ngành nghề" />
            </SelectTrigger>
            <SelectContent>
              {industries.map((industry) => (
                <SelectItem key={industry} value={industry}>
                  {industry}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label htmlFor="description">Mô tả công ty</Label>
        <Textarea
          id="description"
          value={formData.Description || ""}
          onChange={(e) =>
            setFormData({ ...formData, Description: e.target.value })
          }
          placeholder="Mô tả về công ty..."
          rows={3}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="website">Website</Label>
          <Input
            id="website"
            value={formData.Website || ""}
            onChange={(e) =>
              setFormData({ ...formData, Website: e.target.value })
            }
            placeholder="https://company.com"
          />
        </div>
        <div>
          <Label htmlFor="location">Địa điểm *</Label>
          <Input
            id="location"
            value={formData.Location || ""}
            onChange={(e) =>
              setFormData({ ...formData, Location: e.target.value })
            }
            placeholder="Hồ Chí Minh"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="employees">Quy mô nhân sự</Label>
          <Select
            value={formData.Employees || ""}
            onValueChange={(value) =>
              setFormData({ ...formData, Employees: value })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Chọn quy mô" />
            </SelectTrigger>
            <SelectContent>
              {employeeSizes.map((size) => (
                <SelectItem key={size} value={size}>
                  {size} nhân viên
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="founded">Năm thành lập</Label>
          <Input
            id="founded"
            value={formData.Founded || ""}
            onChange={(e) =>
              setFormData({ ...formData, Founded: e.target.value })
            }
            placeholder="2020"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="tags">Tags (phân cách bằng dấu phẩy)</Label>
        <Input
          id="tags"
          value={formData.Tags || ""}
          onChange={(e) => setFormData({ ...formData, Tags: e.target.value })}
          placeholder="React, Node.js, AWS, Agile"
        />
      </div>
    </div>
  );

  const filteredCompanies = getFilteredCompanies();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Quản lý công ty
            </h1>
            <p className="text-gray-600 mt-2">
              Quản lý tất cả công ty trong hệ thống
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Xuất Excel
            </Button>
            <Button variant="outline">
              <Upload className="h-4 w-4 mr-2" />
              Nhập Excel
            </Button>
            <Dialog
              open={isCreateDialogOpen}
              onOpenChange={setIsCreateDialogOpen}
            >
              <DialogTrigger asChild>
                <Button onClick={resetForm}>
                  <Plus className="h-4 w-4 mr-2" />
                  Thêm công ty
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Thêm công ty mới</DialogTitle>
                  <DialogDescription>
                    Tạo một công ty mới trong hệ thống
                  </DialogDescription>
                </DialogHeader>
                <CompanyForm />
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setIsCreateDialogOpen(false)}
                  >
                    Hủy
                  </Button>
                  <Button onClick={createCompany}>Tạo công ty</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Tổng công ty
                  </p>
                  <p className="text-3xl font-bold">{companies.length}</p>
                </div>
                <Building2 className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Tổng việc làm
                  </p>
                  <p className="text-3xl font-bold text-green-600">
                    {companies.reduce((sum, c) => sum + c.OpenJobs, 0)}
                  </p>
                </div>
                <Briefcase className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Rating trung bình
                  </p>
                  <p className="text-3xl font-bold text-yellow-600">
                    {(
                      companies.reduce((sum, c) => sum + c.Rating, 0) /
                      companies.length
                    ).toFixed(1)}
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
                    Công ty mới
                  </p>
                  <p className="text-3xl font-bold text-purple-600">
                    {
                      companies.filter(
                        (c) => Number.parseInt(c.Founded) >= 2020
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
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Tìm kiếm công ty..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả trạng thái</SelectItem>
                  <SelectItem value="active">Hoạt động</SelectItem>
                  <SelectItem value="pending">Chờ duyệt</SelectItem>
                  <SelectItem value="suspended">Tạm ngưng</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterIndustry} onValueChange={setFilterIndustry}>
                <SelectTrigger>
                  <SelectValue placeholder="Ngành nghề" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả ngành nghề</SelectItem>
                  {industries.map((industry) => (
                    <SelectItem key={industry} value={industry}>
                      {industry}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                Bộ lọc nâng cao
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Companies Table */}
        <Card>
          <CardHeader>
            <CardTitle>Danh sách công ty</CardTitle>
            <CardDescription>
              Hiển thị {filteredCompanies.length} / {companies.length} công ty
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Công ty</TableHead>
                  <TableHead>Ngành nghề</TableHead>
                  <TableHead>Địa điểm</TableHead>
                  <TableHead>Nhân viên</TableHead>
                  <TableHead>Việc làm</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Năm thành lập</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCompanies.map((company) => (
                  <TableRow key={company.Id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <Image
                          src={company.Logo || "/placeholder.svg"}
                          alt={company.Name}
                          width={40}
                          height={40}
                          className="rounded-lg border"
                        />
                        <div>
                          <p className="font-medium">{company.Name}</p>
                          <p className="text-sm text-gray-500">
                            {company.Website}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{company.Industry}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-1 text-gray-400" />
                        {company.Location}
                      </div>
                    </TableCell>
                    <TableCell>{company.Employees}</TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {company.OpenJobs} đang tuyển
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                        {company.Rating}
                      </div>
                    </TableCell>
                    <TableCell>{company.Founded}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleView(company)}>
                            <Eye className="h-4 w-4 mr-2" />
                            Xem chi tiết
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleEdit(company)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Chỉnh sửa
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => handleDelete(company)}
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

        {/* View Company Dialog */}
        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Chi tiết công ty</DialogTitle>
            </DialogHeader>
            {selectedCompany && (
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <Image
                    src={selectedCompany.Logo || "/placeholder.svg"}
                    alt={selectedCompany.Name}
                    width={80}
                    height={80}
                    className="rounded-lg border"
                  />
                  <div>
                    <h3 className="text-xl font-semibold">
                      {selectedCompany.Name}
                    </h3>
                    <p className="text-gray-600">{selectedCompany.Industry}</p>
                    <div className="flex items-center mt-2">
                      <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                      <span>{selectedCompany.Rating}</span>
                    </div>
                  </div>
                </div>

                <Tabs defaultValue="info" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="info">Thông tin</TabsTrigger>
                    <TabsTrigger value="contact">Chi tiết</TabsTrigger>
                    <TabsTrigger value="stats">Thống kê</TabsTrigger>
                  </TabsList>

                  <TabsContent value="info" className="space-y-4">
                    <div>
                      <Label>Mô tả</Label>
                      <p className="text-sm text-gray-600 mt-1">
                        {selectedCompany.Description}
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Ngành nghề</Label>
                        <p className="text-sm mt-1">
                          {selectedCompany.Industry}
                        </p>
                      </div>
                      <div>
                        <Label>Địa điểm</Label>
                        <p className="text-sm mt-1">
                          {selectedCompany.Location}
                        </p>
                      </div>
                      <div>
                        <Label>Quy mô</Label>
                        <p className="text-sm mt-1">
                          {selectedCompany.Employees} nhân viên
                        </p>
                      </div>
                      <div>
                        <Label>Năm thành lập</Label>
                        <p className="text-sm mt-1">
                          {selectedCompany.Founded}
                        </p>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="contact" className="space-y-4">
                    <div className="grid grid-cols-1 gap-4">
                      <div>
                        <Label>Website</Label>
                        <p className="text-sm mt-1">
                          <a
                            href={selectedCompany.Website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                          >
                            {selectedCompany.Website}
                          </a>
                        </p>
                      </div>
                      <div>
                        <Label>Tags</Label>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {selectedCompany.Tags.split(",").map((tag, index) => (
                            <Badge
                              key={index}
                              variant="secondary"
                              className="text-xs"
                            >
                              {tag.trim()}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="stats" className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-4 border rounded-lg">
                        <p className="text-2xl font-bold text-blue-600">
                          {selectedCompany.OpenJobs}
                        </p>
                        <p className="text-sm text-gray-600">
                          Việc làm đang tuyển
                        </p>
                      </div>
                      <div className="text-center p-4 border rounded-lg">
                        <p className="text-2xl font-bold text-yellow-600">
                          {selectedCompany.Rating}
                        </p>
                        <p className="text-sm text-gray-600">
                          Đánh giá trung bình
                        </p>
                      </div>
                      <div className="text-center p-4 border rounded-lg">
                        <p className="text-2xl font-bold text-purple-600">
                          {new Date().getFullYear() -
                            Number.parseInt(selectedCompany.Founded)}
                        </p>
                        <p className="text-sm text-gray-600">Năm hoạt động</p>
                      </div>
                      <div className="text-center p-4 border rounded-lg">
                        <p className="text-2xl font-bold text-green-600">
                          {selectedCompany.Employees}
                        </p>
                        <p className="text-sm text-gray-600">Quy mô nhân sự</p>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Edit Company Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Chỉnh sửa công ty</DialogTitle>
              <DialogDescription>Cập nhật thông tin công ty</DialogDescription>
            </DialogHeader>
            <CompanyForm isEdit={true} />
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsEditDialogOpen(false)}
              >
                Hủy
              </Button>
              <Button
                onClick={() =>
                  selectedCompany && updateCompany(selectedCompany.Id)
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
                Bạn có chắc chắn muốn xóa công ty &quot;{selectedCompany?.Name}
                &quot;? Hành động này không thể hoàn tác.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Hủy</AlertDialogCancel>
              <AlertDialogAction
                onClick={() =>
                  selectedCompany && deleteCompany(selectedCompany.Id)
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
