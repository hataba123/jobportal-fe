"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "@/i18n/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import CompanyLogo from "@/components/common/CompanyLogo";
import {
  Search,
  LayoutGrid,
  List,
  MapPin,
  DollarSign,
  Briefcase,
  CalendarDays,
  X,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Building2,
} from "lucide-react";
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
  const jobsPerPage = 9;

  const hasActiveFilters =
    Boolean(searchTerm.trim()) ||
    locationFilter !== "all" ||
    typeFilter !== "all" ||
    categoryFilter !== "all";

  const handleResetFilters = () => {
    setSearchTerm("");
    setLocationFilter("all");
    setTypeFilter("all");
    setCategoryFilter("all");
    setCurrentPage(1);
  };

  const filteredJobs = useMemo(() => {
    let filtered = jobPosts;

    if (searchTerm.trim()) {
      const lower = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (job) =>
          job.title?.toLowerCase().includes(lower) ||
          job.description?.toLowerCase().includes(lower) ||
          (Array.isArray(job.tags) && job.tags.some((t) => t.toLowerCase().includes(lower))) ||
          job.employer?.fullName?.toLowerCase().includes(lower)
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
    return filteredJobs.slice(startIndex, startIndex + jobsPerPage);
  }, [filteredJobs, currentPage, jobsPerPage]);

  const uniqueLocations = useMemo(() => {
    const locs = new Set(jobPosts.map((j) => j.location).filter((loc): loc is string => Boolean(loc)));
    return ["all", ...Array.from(locs)];
  }, [jobPosts]);

  const uniqueCategories = useMemo(() => {
    const cats = new Set(jobPosts.map((j) => j.categoryName).filter((c): c is string => Boolean(c)));
    return ["all", ...Array.from(cats)];
  }, [jobPosts]);

  const jobTypes = ["all", "Full-time", "Part-time", "Contract", "Internship"];

  return (
    <div className="min-h-screen bg-slate-50/50 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Title */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 uppercase tracking-wider mb-2">
            <Briefcase className="w-3.5 h-3.5" />
            <span>Thị trường việc làm IT</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Tất cả Việc làm tuyển dụng
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Tìm kiếm công việc lý tưởng theo vị trí, kỹ năng công nghệ, loại hình và mức lương
          </p>
        </div>

        {/* Filter Toolbar */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-4 sm:p-5 mb-8 space-y-4">
          <div className="flex flex-col lg:flex-row gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Tìm việc làm theo chức danh, kỹ năng..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Select Filters */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Select
                value={locationFilter}
                onValueChange={(val) => {
                  setLocationFilter(val);
                  setCurrentPage(1);
                }}
              >
                <SelectTrigger className="rounded-xl h-[42px] border-slate-200 bg-slate-50 text-xs sm:text-sm">
                  <SelectValue placeholder="Địa điểm" />
                </SelectTrigger>
                <SelectContent className="rounded-xl shadow-xl">
                  {uniqueLocations.map((loc) => (
                    <SelectItem key={loc} value={loc} className="rounded-lg text-xs sm:text-sm">
                      {loc === "all" ? "Tất cả địa điểm" : loc}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={typeFilter}
                onValueChange={(val) => {
                  setTypeFilter(val);
                  setCurrentPage(1);
                }}
              >
                <SelectTrigger className="rounded-xl h-[42px] border-slate-200 bg-slate-50 text-xs sm:text-sm">
                  <SelectValue placeholder="Loại hình" />
                </SelectTrigger>
                <SelectContent className="rounded-xl shadow-xl">
                  {jobTypes.map((t) => (
                    <SelectItem key={t} value={t} className="rounded-lg text-xs sm:text-sm">
                      {t === "all" ? "Tất cả loại hình" : t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={categoryFilter}
                onValueChange={(val) => {
                  setCategoryFilter(val);
                  setCurrentPage(1);
                }}
              >
                <SelectTrigger className="rounded-xl h-[42px] border-slate-200 bg-slate-50 text-xs sm:text-sm">
                  <SelectValue placeholder="Danh mục" />
                </SelectTrigger>
                <SelectContent className="rounded-xl shadow-xl">
                  {uniqueCategories.map((c) => (
                    <SelectItem key={c} value={c} className="rounded-lg text-xs sm:text-sm">
                      {c === "all" ? "Tất cả danh mục" : c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* View Mode & Reset */}
            <div className="flex items-center gap-2 self-end lg:self-auto">
              <div className="flex items-center p-1 rounded-xl bg-slate-100 border border-slate-200">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-1.5 rounded-lg transition-colors ${
                    viewMode === "grid" ? "bg-white text-blue-600 shadow-xs font-bold" : "text-slate-500 hover:text-slate-800"
                  }`}
                  aria-label="Xem dạng lưới"
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-1.5 rounded-lg transition-colors ${
                    viewMode === "list" ? "bg-white text-blue-600 shadow-xs font-bold" : "text-slate-500 hover:text-slate-800"
                  }`}
                  aria-label="Xem dạng danh sách"
                >
                  <List className="w-4 h-4" />
                </button>
              </div>

              {hasActiveFilters && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleResetFilters}
                  className="rounded-xl text-xs text-rose-600 hover:bg-rose-50 hover:text-rose-700 h-[40px] px-3 font-semibold"
                >
                  <X className="w-3.5 h-3.5 mr-1" />
                  Xóa lọc
                </Button>
              )}
            </div>
          </div>

          {/* Results Summary */}
          <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
            <span>
              Tìm thấy <strong className="text-slate-900">{filteredJobs.length}</strong> việc làm
              {hasActiveFilters && " (đang lọc)"}
            </span>
            {hasActiveFilters && (
              <span className="text-blue-600 font-medium">Bộ lọc đang hoạt động</span>
            )}
          </div>
        </div>

        {/* Loading Skeleton */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs animate-pulse space-y-4">
                <div className="flex gap-4 items-center">
                  <div className="w-12 h-12 bg-slate-200 rounded-xl"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                    <div className="h-3 bg-slate-200 rounded w-1/2"></div>
                  </div>
                </div>
                <div className="h-3 bg-slate-200 rounded w-full"></div>
                <div className="h-3 bg-slate-200 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        ) : filteredJobs.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-slate-200/80 p-8">
            <Briefcase className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-slate-800">Không tìm thấy việc làm nào</h3>
            <p className="text-sm text-slate-500 mt-1 max-w-md mx-auto">
              Thử điều chỉnh từ khóa tìm kiếm hoặc xóa các điều kiện lọc để hiển thị nhiều kết quả hơn.
            </p>
            {hasActiveFilters && (
              <Button onClick={handleResetFilters} variant="outline" className="mt-5 rounded-xl">
                Xóa tất cả bộ lọc
              </Button>
            )}
          </div>
        ) : (
          <>
            {/* Jobs Display: Grid or List */}
            <div
              className={
                viewMode === "grid"
                  ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                  : "grid grid-cols-1 gap-4"
              }
            >
              {currentJobs.map((job) => (
                <div
                  key={job.id}
                  onClick={() => router.push(`/candidate/job/${job.id}`)}
                  className={`group relative p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:shadow-xl hover:border-blue-500/50 transition-all duration-200 cursor-pointer overflow-hidden flex flex-col justify-between ${
                    viewMode === "list" ? "md:flex-row md:items-center md:gap-6" : ""
                  }`}
                >
                  <div className={viewMode === "list" ? "flex-1" : ""}>
                    {/* Top Row: Logo & Title */}
                    <div className="flex items-start gap-4 mb-4">
                      <CompanyLogo
                        src={job.logo}
                        name={job.employer?.fullName || job.companyName || "Công ty"}
                        size="md"
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-base text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1">
                          {job.title}
                        </h3>
                        <p className="text-xs text-slate-500 line-clamp-1 mt-0.5 flex items-center gap-1">
                          <Building2 className="w-3 h-3 text-slate-400 flex-shrink-0" />
                          <span>{job.employer?.fullName || job.companyName || "Công ty công nghệ"}</span>
                        </p>
                      </div>
                    </div>

                    {/* Highlights Row */}
                    <div className="flex flex-wrap items-center gap-2 mb-4 text-xs">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 font-bold border border-emerald-200/60">
                        <DollarSign className="w-3.5 h-3.5" />
                        {Number(job.salary) > 0 ? `${Number(job.salary).toLocaleString()}$ / tháng` : "Thương lượng"}
                      </span>
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-slate-100 text-slate-600">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        {job.location || "Toàn quốc"}
                      </span>
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-slate-100 text-slate-600">
                        <Briefcase className="w-3 h-3 text-slate-400" />
                        {job.type || "Full-time"}
                      </span>
                    </div>

                    {/* Tags */}
                    {Array.isArray(job.tags) && job.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-3">
                        {job.tags.slice(0, 4).map((tag) => (
                          <Badge
                            key={tag}
                            variant="secondary"
                            className="text-[11px] font-medium bg-slate-100/80 text-slate-600"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Footer / Meta info */}
                  <div
                    className={`flex items-center justify-between text-xs text-slate-400 pt-3 border-t border-slate-100 ${
                      viewMode === "list" ? "md:border-t-0 md:pt-0 md:flex-col md:items-end md:gap-3" : ""
                    }`}
                  >
                    <div className="flex items-center gap-1">
                      <CalendarDays className="w-3 h-3" />
                      <span>
                        {job.createdAt
                          ? `${Math.max(1, Math.floor((Date.now() - new Date(job.createdAt).getTime()) / (1000 * 60 * 60 * 24)))} ngày trước`
                          : "Mới đăng"}
                      </span>
                    </div>
                    <Button
                      size="sm"
                      className="rounded-xl text-xs font-semibold bg-blue-50 text-blue-700 hover:bg-blue-600 hover:text-white transition-all shadow-none border border-blue-200/80"
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(`/candidate/job/${job.id}`);
                      }}
                    >
                      Chi tiết
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-12">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                  disabled={currentPage === 1}
                  className="rounded-xl"
                >
                  <ChevronLeft className="w-4 h-4 mr-1" />
                  Trước
                </Button>

                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, idx) => {
                    const pageNum = idx + 1;
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`w-9 h-9 rounded-xl text-xs font-bold transition-all ${
                          currentPage === pageNum
                            ? "bg-blue-600 text-white shadow-xs"
                            : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="rounded-xl"
                >
                  Sau
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}