"use client";

import { useState, useMemo } from "react";
import { useRouter } from "@/i18n/navigation";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Search, LayoutGrid, List, MapPin, DollarSign, Briefcase, CalendarDays } from "lucide-react";
import Image from "next/image";
import { useJobPosts } from "@/hooks/useJobPosts";

export default function AllJobsPage() {
  const router = useRouter();
  const { jobPosts, loading } = useJobPosts();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [locationFilter, setLocationFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 6;

  const filteredJobs = useMemo(() => {
    let filtered = jobPosts;

    if (searchTerm) {
      filtered = filtered.filter(
        (job) =>
          job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          job.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (Array.isArray(job.tags) && job.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))) ||
          job.employer?.fullName?.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    if (locationFilter !== "all") {
      filtered = filtered.filter((job) => job.location === locationFilter);
    }

    if (typeFilter !== "all") {
      filtered = filtered.filter((job) => job.type === typeFilter);
    }

    if (categoryFilter !== "all") {
      filtered = filtered.filter((job) => job.categoryName === categoryFilter);
    }

    return filtered;
  }, [jobPosts, searchTerm, locationFilter, typeFilter, categoryFilter]);

  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);
  const currentJobs = useMemo(() => {
    const startIndex = (currentPage - 1) * jobsPerPage;
    const endIndex = startIndex + jobsPerPage;
    return filteredJobs.slice(startIndex, endIndex);
  }, [filteredJobs, currentPage, jobsPerPage]);

  const uniqueLocations = useMemo(() => {
    const locations = new Set(
      jobPosts
        .map((job) => job.location)
        .filter((loc): loc is string => Boolean(loc))
    );
    return ["all", ...Array.from(locations)];
  }, [jobPosts]);

  const uniqueCategories = useMemo(() => {
    const categories = new Set(
      jobPosts
        .map((job) => job.categoryName)
        .filter((cat): cat is string => Boolean(cat))
    );
    return ["all", ...Array.from(categories)];
  }, [jobPosts]);

  const jobTypes = ["all", "Full-time", "Part-time", "Contract", "Internship"];

  const handleJobClick = (jobId: string) => {
    router.push(`/candidate/job/${jobId}`);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="h-12 bg-gray-200 rounded mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-64 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

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
          <Briefcase className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <h3 className="text-lg font-semibold mb-2">Không tìm thấy việc làm nào</h3>
          <p>Thử điều chỉnh bộ lọc hoặc tìm kiếm với từ khóa khác.</p>
        </div>
      ) : (
        <>
          <div className="mb-4">
            <p className="text-gray-600">
              Hiển thị {currentJobs.length} trong số {filteredJobs.length} việc làm
            </p>
          </div>

          <div
            className={
              viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "grid grid-cols-1 gap-6"
            }
          >
            {currentJobs.map((job) => (
              <Card 
                key={job.id} 
                className={`hover:shadow-lg transition-shadow cursor-pointer ${
                  viewMode === "list" ? "flex flex-col md:flex-row" : ""
                }`}
                onClick={() => handleJobClick(job.id)}
              >
                <CardHeader className={viewMode === "list" ? "flex-shrink-0 p-4" : ""}>
                  <Image
                    src={job.logo || "/placeholder.svg"}
                    alt={`${job.employer?.fullName || 'Company'} Logo`}
                    width={64}
                    height={64}
                    className="w-16 h-16 object-contain rounded-full mx-auto md:mx-0"
                  />
                </CardHeader>
                <CardContent className="flex-1 p-4">
                  <CardTitle className="text-xl font-semibold mb-2">{job.title}</CardTitle>
                  <CardDescription className="text-gray-600 mb-2">
                    {job.employer?.fullName || "N/A"}
                  </CardDescription>
                  <div className="flex items-center text-gray-500 text-sm mb-2">
                    <MapPin className="w-4 h-4 mr-1" /> {job.location || "N/A"}
                  </div>
                  <div className="flex items-center text-gray-500 text-sm mb-2">
                    <DollarSign className="w-4 h-4 mr-1" /> ${job.salary.toLocaleString()}/tháng
                  </div>
                  <div className="flex items-center text-gray-500 text-sm mb-2">
                    <Briefcase className="w-4 h-4 mr-1" /> {job.type || "N/A"}
                  </div>
                  <div className="flex items-center text-gray-500 text-sm mb-4">
                    <CalendarDays className="w-4 h-4 mr-1" /> 
                    {job.createdAt ? 
                      `Đăng ngày ${new Date(job.createdAt).toLocaleDateString("vi-VN")}` : 
                      "N/A"
                    }
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {Array.isArray(job.tags) && job.tags.map((tag) => (
                      <Badge key={tag} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="p-4 pt-0 flex justify-end">
                  <Button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleJobClick(job.id);
                    }}
                  >
                    Xem chi tiết
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          {totalPages > 1 && (
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
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                Sau
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
} 