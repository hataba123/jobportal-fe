"use client";

import { useState, useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  Search,
  LayoutGrid,
  List,
  MapPin,
  DollarSign,
  Briefcase,
  CalendarDays,
} from "lucide-react";

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
  CategoryName: string;
  CompanyName: string;
}

const mockJobPosts: JobPost[] = [
  {
    Id: "1",
    Title: "Senior Software Engineer",
    Description:
      "Developing scalable web applications using React and Node.js.",
    Location: "Ho Chi Minh City",
    Salary: 2500,
    Type: "Full-time",
    Logo: "/placeholder.svg?height=40&width=40",
    Tags: ["React", "Node.js", "AWS", "TypeScript"],
    CreatedAt: "2023-01-15T10:00:00Z",
    CategoryName: "Software Development",
    CompanyName: "Tech Solutions Inc.",
  },
  {
    Id: "2",
    Title: "Product Manager",
    Description: "Leading product development from conception to launch.",
    Location: "Ha Noi",
    Salary: 2000,
    Type: "Full-time",
    Logo: "/placeholder.svg?height=40&width=40",
    Tags: ["Product Management", "Agile", "UX/UI"],
    CreatedAt: "2023-02-01T11:30:00Z",
    CategoryName: "Product Management",
    CompanyName: "Innovate Corp.",
  },
  {
    Id: "3",
    Title: "UX/UI Designer",
    Description: "Designing intuitive and user-friendly interfaces.",
    Location: "Da Nang",
    Salary: 1800,
    Type: "Contract",
    Logo: "/placeholder.svg?height=40&width=40",
    Tags: ["Figma", "Sketch", "User Research"],
    CreatedAt: "2023-03-10T09:00:00Z",
    CategoryName: "Design",
    CompanyName: "Creative Studio",
  },
  {
    Id: "4",
    Title: "Data Scientist",
    Description: "Analyzing large datasets to extract actionable insights.",
    Location: "Ho Chi Minh City",
    Salary: 2800,
    Type: "Full-time",
    Logo: "/placeholder.svg?height=40&width=40",
    Tags: ["Python", "Machine Learning", "SQL"],
    CreatedAt: "2023-04-05T14:00:00Z",
    CategoryName: "Data Science",
    CompanyName: "Data Insights Ltd.",
  },
  {
    Id: "5",
    Title: "Marketing Specialist",
    Description: "Developing and executing digital marketing campaigns.",
    Location: "Ha Noi",
    Salary: 1500,
    Type: "Part-time",
    Logo: "/placeholder.svg?height=40&width=40",
    Tags: ["SEO", "SEM", "Content Marketing"],
    CreatedAt: "2023-05-20T16:00:00Z",
    CategoryName: "Marketing",
    CompanyName: "Brand Builders",
  },
  {
    Id: "6",
    Title: "Junior Frontend Developer",
    Description: "Assisting in the development of user-facing features.",
    Location: "Ho Chi Minh City",
    Salary: 1200,
    Type: "Internship",
    Logo: "/placeholder.svg?height=40&width=40",
    Tags: ["HTML", "CSS", "JavaScript", "Vue.js"],
    CreatedAt: "2023-06-01T08:00:00Z",
    CategoryName: "Software Development",
    CompanyName: "Startup Hub",
  },
];

export default function AllJobsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [locationFilter, setLocationFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 6;

  const filteredJobs = useMemo(() => {
    let filtered = mockJobPosts;

    if (searchTerm) {
      filtered = filtered.filter(
        (job) =>
          job.Title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          job.Description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          job.Tags.some((tag) =>
            tag.toLowerCase().includes(searchTerm.toLowerCase())
          )
      );
    }

    if (locationFilter !== "all") {
      filtered = filtered.filter((job) => job.Location === locationFilter);
    }

    if (typeFilter !== "all") {
      filtered = filtered.filter((job) => job.Type === typeFilter);
    }

    if (categoryFilter !== "all") {
      filtered = filtered.filter((job) => job.CategoryName === categoryFilter);
    }

    return filtered;
  }, [searchTerm, locationFilter, typeFilter, categoryFilter]);

  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);
  const currentJobs = useMemo(() => {
    const startIndex = (currentPage - 1) * jobsPerPage;
    const endIndex = startIndex + jobsPerPage;
    return filteredJobs.slice(startIndex, endIndex);
  }, [filteredJobs, currentPage, jobsPerPage]);

  const uniqueLocations = useMemo(() => {
    const locations = new Set(mockJobPosts.map((job) => job.Location));
    return ["all", ...Array.from(locations)];
  }, []);

  const uniqueCategories = useMemo(() => {
    const categories = new Set(mockJobPosts.map((job) => job.CategoryName));
    return ["all", ...Array.from(categories)];
  }, []);

  const jobTypes = ["all", "Full-time", "Part-time", "Contract", "Internship"];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Tất cả Việc làm</h1>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <Input
            type="text"
            placeholder="Tìm kiếm việc làm..."
            className="pl-10 pr-4 py-2 rounded-md border border-gray-300 w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex flex-col sm:flex-row gap-4">
          <Select value={locationFilter} onValueChange={setLocationFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Địa điểm" />
            </SelectTrigger>
            <SelectContent>
              {uniqueLocations.map((loc) => (
                <SelectItem key={loc} value={loc}>
                  {loc === "all" ? "Tất cả Địa điểm" : loc}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Loại hình" />
            </SelectTrigger>
            <SelectContent>
              {jobTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type === "all" ? "Tất cả Loại hình" : type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Danh mục" />
            </SelectTrigger>
            <SelectContent>
              {uniqueCategories.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat === "all" ? "Tất cả Danh mục" : cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex gap-2">
          <Button
            variant={viewMode === "grid" ? "default" : "outline"}
            onClick={() => setViewMode("grid")}
            size="icon"
            aria-label="Chế độ xem lưới"
          >
            <LayoutGrid className="h-5 w-5" />
          </Button>
          <Button
            variant={viewMode === "list" ? "default" : "outline"}
            onClick={() => setViewMode("list")}
            size="icon"
            aria-label="Chế độ xem danh sách"
          >
            <List className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <Separator className="mb-6" />

      {filteredJobs.length === 0 ? (
        <div className="text-center text-gray-500 py-10">
          Không tìm thấy việc làm nào phù hợp.
        </div>
      ) : (
        <>
          <div
            className={
              viewMode === "grid"
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                : "grid grid-cols-1 gap-6"
            }
          >
            {currentJobs.map((job) => (
              <Card
                key={job.Id}
                className={
                  viewMode === "list" ? "flex flex-col md:flex-row" : ""
                }
              >
                <CardHeader
                  className={viewMode === "list" ? "flex-shrink-0 p-4" : ""}
                >
                  <img
                    src={job.Logo || "/placeholder.svg"}
                    alt={`${job.CompanyName} Logo`}
                    className="w-16 h-16 object-contain rounded-full mx-auto md:mx-0"
                  />
                </CardHeader>
                <CardContent className="flex-1 p-4">
                  <CardTitle className="text-xl font-semibold mb-2">
                    {job.Title}
                  </CardTitle>
                  <CardDescription className="text-gray-600 mb-2">
                    {job.CompanyName}
                  </CardDescription>
                  <div className="flex items-center text-gray-500 text-sm mb-2">
                    <MapPin className="w-4 h-4 mr-1" /> {job.Location}
                  </div>
                  <div className="flex items-center text-gray-500 text-sm mb-2">
                    <DollarSign className="w-4 h-4 mr-1" />{" "}
                    {job.Salary.toLocaleString()} USD/tháng
                  </div>
                  <div className="flex items-center text-gray-500 text-sm mb-2">
                    <Briefcase className="w-4 h-4 mr-1" /> {job.Type}
                  </div>
                  <div className="flex items-center text-gray-500 text-sm mb-4">
                    <CalendarDays className="w-4 h-4 mr-1" /> Đăng ngày{" "}
                    {new Date(job.CreatedAt).toLocaleDateString()}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {job.Tags.map((tag) => (
                      <Badge key={tag} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="p-4 pt-0 flex justify-end">
                  <Button>Xem chi tiết</Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          <div className="flex justify-center mt-8 space-x-2">
            <Button
              variant="outline"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Trước
            </Button>
            {Array.from({ length: totalPages }, (_, i) => (
              <Button
                key={i + 1}
                variant={currentPage === i + 1 ? "default" : "outline"}
                onClick={() => setCurrentPage(i + 1)}
              >
                {i + 1}
              </Button>
            ))}
            <Button
              variant="outline"
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
            >
              Sau
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
