"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  MapPin,
  Users,
  Star,
  Building2,
  ArrowRight,
  Filter,
  Grid3X3,
  List,
  ExternalLink,
} from "lucide-react";
import Image from "next/image";
import { useState } from "react";

// Mock data for companies
const companies = [
  {
    id: 1,
    name: "TechCorp Vietnam",
    logo: "/placeholder.svg?height=80&width=80",
    description:
      "Công ty công nghệ hàng đầu chuyên phát triển giải pháp phần mềm cho doanh nghiệp.",
    location: "Hồ Chí Minh",
    employees: "200-500",
    industry: "Công nghệ thông tin",
    openJobs: 15,
    rating: 4.8,
    website: "techcorp.vn",
    founded: "2015",
    tags: ["React", "Node.js", "AWS", "Agile"],
  },
  {
    id: 2,
    name: "StartupXYZ",
    logo: "/placeholder.svg?height=80&width=80",
    description:
      "Startup công nghệ tập trung vào phát triển ứng dụng mobile và web innovative.",
    location: "Hà Nội",
    employees: "50-100",
    industry: "Startup",
    openJobs: 8,
    rating: 4.6,
    website: "startupxyz.com",
    founded: "2020",
    tags: ["Flutter", "React Native", "Firebase"],
  },
  {
    id: 3,
    name: "Design Studio Pro",
    logo: "/placeholder.svg?height=80&width=80",
    description:
      "Studio thiết kế chuyên nghiệp cung cấp dịch vụ UI/UX và branding cho các doanh nghiệp.",
    location: "Đà Nẵng",
    employees: "20-50",
    industry: "Thiết kế",
    openJobs: 5,
    rating: 4.9,
    website: "designstudio.vn",
    founded: "2018",
    tags: ["Figma", "Adobe Creative", "UI/UX"],
  },
  {
    id: 4,
    name: "CloudTech Solutions",
    logo: "/placeholder.svg?height=80&width=80",
    description:
      "Chuyên gia về cloud computing và DevOps, cung cấp giải pháp hạ tầng cho doanh nghiệp.",
    location: "Remote",
    employees: "100-200",
    industry: "Cloud Computing",
    openJobs: 12,
    rating: 4.7,
    website: "cloudtech.io",
    founded: "2017",
    tags: ["AWS", "Docker", "Kubernetes", "DevOps"],
  },
  {
    id: 5,
    name: "InnovateCorp",
    logo: "/placeholder.svg?height=80&width=80",
    description:
      "Tập đoàn công nghệ đa quốc gia với focus vào AI và machine learning solutions.",
    location: "Hồ Chí Minh",
    employees: "500+",
    industry: "AI & Machine Learning",
    openJobs: 25,
    rating: 4.5,
    website: "innovatecorp.com",
    founded: "2012",
    tags: ["Python", "TensorFlow", "AI", "Data Science"],
  },
  {
    id: 6,
    name: "AppFactory Vietnam",
    logo: "/placeholder.svg?height=80&width=80",
    description:
      "Nhà phát triển ứng dụng mobile hàng đầu với hơn 100 ứng dụng thành công.",
    location: "Hà Nội",
    employees: "100-200",
    industry: "Mobile Development",
    openJobs: 10,
    rating: 4.8,
    website: "appfactory.vn",
    founded: "2016",
    tags: ["iOS", "Android", "React Native", "Swift"],
  },
  {
    id: 7,
    name: "DataMining Co.",
    logo: "/placeholder.svg?height=80&width=80",
    description:
      "Công ty chuyên về phân tích dữ liệu và business intelligence cho các tập đoàn lớn.",
    location: "Hồ Chí Minh",
    employees: "50-100",
    industry: "Data Analytics",
    openJobs: 7,
    rating: 4.4,
    website: "datamining.vn",
    founded: "2019",
    tags: ["Python", "SQL", "Tableau", "Power BI"],
  },
  {
    id: 8,
    name: "GameStudio Elite",
    logo: "/placeholder.svg?height=80&width=80",
    description:
      "Studio phát triển game mobile và PC với nhiều tựa game nổi tiếng trên thị trường.",
    location: "Đà Nẵng",
    employees: "100-200",
    industry: "Game Development",
    openJobs: 9,
    rating: 4.6,
    website: "gamestudio.vn",
    founded: "2014",
    tags: ["Unity", "C#", "3D Modeling", "Game Design"],
  },
  {
    id: 9,
    name: "FinTech Solutions",
    logo: "/placeholder.svg?height=80&width=80",
    description:
      "Công ty fintech hàng đầu cung cấp giải pháp thanh toán và ngân hàng số.",
    location: "Hồ Chí Minh",
    employees: "200-500",
    industry: "FinTech",
    openJobs: 18,
    rating: 4.7,
    website: "fintech.vn",
    founded: "2018",
    tags: ["Blockchain", "Java", "Spring", "Security"],
  },
];

const industries = [
  "Tất cả",
  "Công nghệ thông tin",
  "Startup",
  "Thiết kế",
  "Cloud Computing",
  "AI & Machine Learning",
  "Mobile Development",
  "Data Analytics",
  "Game Development",
  "FinTech",
];

const locations = ["Tất cả", "Hồ Chí Minh", "Hà Nội", "Đà Nẵng", "Remote"];

const companySizes = [
  "Tất cả",
  "1-20",
  "20-50",
  "50-100",
  "100-200",
  "200-500",
  "500+",
];

export default function AllCompaniesPage() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-white border-b">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Khám phá các công ty
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Tìm hiểu về các công ty hàng đầu và cơ hội nghề nghiệp tại đây
            </p>
          </div>

          {/* Search and Filters */}
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
              <div className="md:col-span-2 relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input placeholder="Tìm kiếm công ty..." className="pl-10" />
              </div>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Ngành nghề" />
                </SelectTrigger>
                <SelectContent>
                  {industries.map((industry) => (
                    <SelectItem key={industry} value={industry.toLowerCase()}>
                      {industry}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Địa điểm" />
                </SelectTrigger>
                <SelectContent>
                  {locations.map((location) => (
                    <SelectItem key={location} value={location.toLowerCase()}>
                      {location}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Quy mô" />
                </SelectTrigger>
                <SelectContent>
                  {companySizes.map((size) => (
                    <SelectItem key={size} value={size.toLowerCase()}>
                      {size} nhân viên
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Results Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <p className="text-gray-600">
                  Hiển thị{" "}
                  <span className="font-semibold">{companies.length}</span> công
                  ty
                </p>
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Bộ lọc
                </Button>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant={viewMode === "grid" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Companies Grid/List */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          {viewMode === "grid" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {companies.map((company) => (
                <Card
                  key={company.id}
                  className="hover:shadow-lg transition-shadow cursor-pointer group"
                >
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4 mb-4">
                      <Image
                        src={company.logo || "/placeholder.svg"}
                        alt={company.name}
                        width={60}
                        height={60}
                        className="rounded-lg border"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg mb-1 group-hover:text-blue-600 transition-colors">
                          {company.name}
                        </h3>
                        <div className="flex items-center space-x-2 text-sm text-gray-600 mb-2">
                          <MapPin className="h-4 w-4" />
                          <span>{company.location}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="flex items-center">
                            <Star className="h-4 w-4 text-yellow-400 fill-current" />
                            <span className="ml-1 text-sm font-semibold">
                              {company.rating}
                            </span>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {company.industry}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {company.description}
                    </p>

                    <div className="space-y-3 mb-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Nhân viên:</span>
                        <span className="font-medium">{company.employees}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Đang tuyển:</span>
                        <span className="font-medium text-blue-600">
                          {company.openJobs} vị trí
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Thành lập:</span>
                        <span className="font-medium">{company.founded}</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1 mb-4">
                      {company.tags.slice(0, 3).map((tag) => (
                        <Badge
                          key={tag}
                          variant="secondary"
                          className="text-xs"
                        >
                          {tag}
                        </Badge>
                      ))}
                      {company.tags.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{company.tags.length - 3}
                        </Badge>
                      )}
                    </div>

                    <div className="flex space-x-2">
                      <Button size="sm" className="flex-1">
                        Xem việc làm
                      </Button>
                      <Button size="sm" variant="outline">
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {companies.map((company) => (
                <Card
                  key={company.id}
                  className="hover:shadow-lg transition-shadow cursor-pointer group"
                >
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-6">
                      <Image
                        src={company.logo || "/placeholder.svg"}
                        alt={company.name}
                        width={80}
                        height={80}
                        className="rounded-lg border"
                      />
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="font-semibold text-xl mb-2 group-hover:text-blue-600 transition-colors">
                              {company.name}
                            </h3>
                            <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                              <div className="flex items-center">
                                <MapPin className="h-4 w-4 mr-1" />
                                {company.location}
                              </div>
                              <div className="flex items-center">
                                <Users className="h-4 w-4 mr-1" />
                                {company.employees} nhân viên
                              </div>
                              <div className="flex items-center">
                                <Building2 className="h-4 w-4 mr-1" />
                                Từ {company.founded}
                              </div>
                            </div>
                            <div className="flex items-center space-x-3 mb-3">
                              <div className="flex items-center">
                                <Star className="h-4 w-4 text-yellow-400 fill-current" />
                                <span className="ml-1 text-sm font-semibold">
                                  {company.rating}
                                </span>
                              </div>
                              <Badge variant="outline">
                                {company.industry}
                              </Badge>
                              <Badge className="bg-green-100 text-green-800">
                                {company.openJobs} việc làm
                              </Badge>
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <Button size="sm">
                              Xem việc làm{" "}
                              <ArrowRight className="h-4 w-4 ml-1" />
                            </Button>
                            <Button size="sm" variant="outline">
                              <ExternalLink className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>

                        <p className="text-gray-600 mb-4">
                          {company.description}
                        </p>

                        <div className="flex flex-wrap gap-2">
                          {company.tags.map((tag) => (
                            <Badge
                              key={tag}
                              variant="secondary"
                              className="text-xs"
                            >
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Pagination */}
          <div className="flex justify-center mt-12">
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" disabled>
                Trước
              </Button>
              <Button size="sm">1</Button>
              <Button variant="outline" size="sm">
                2
              </Button>
              <Button variant="outline" size="sm">
                3
              </Button>
              <Button variant="outline" size="sm">
                Sau
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
