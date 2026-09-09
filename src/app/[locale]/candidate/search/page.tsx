"use client";

import { Suspense, useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, MapPin, DollarSign, Clock, ArrowLeft, Briefcase, Building2 } from "lucide-react";
import CompanyLogo from "@/components/common/CompanyLogo";
import { useRouter } from "@/i18n/navigation";
import { useJobPosts } from "@/hooks/useJobPosts";
import { JobPost } from "@/types/JobPost";

// Simple search algorithm - exact match and contains
const simpleSearch = (jobs: JobPost[], searchTerm: string, location: string) => {
  const searchLower = searchTerm.toLowerCase().trim();
  const locationLower = location.toLowerCase().trim();

  return jobs.filter((job) => {
    const titleMatch = job.title?.toLowerCase().includes(searchLower);
    const companyMatch = job.employer?.fullName?.toLowerCase().includes(searchLower);
    const locationMatch = !locationLower || job.location?.toLowerCase().includes(locationLower);
    return (titleMatch || companyMatch) && locationMatch;
  });
};

// Complex search algorithm - fuzzy search with scoring
const complexSearch = (jobs: JobPost[], searchTerm: string, location: string) => {
  const searchLower = searchTerm.toLowerCase().trim();
  const locationLower = location.toLowerCase().trim();
  
  if (!searchLower && !locationLower) return jobs;

  const searchWords = searchLower.split(/\s+/).filter(word => word.length > 0);
  const locationWords = locationLower.split(/\s+/).filter(word => word.length > 0);

  const scoredJobs = jobs.map((job) => {
    let score = 0;
    const titleLower = job.title?.toLowerCase() || '';
    const companyLower = job.employer?.fullName?.toLowerCase() || '';
    const jobLocationLower = job.location?.toLowerCase() || '';

    if (searchWords.length > 0) {
      if (titleLower === searchLower) score += 100;
      if (companyLower === searchLower) score += 100;
      if (titleLower.includes(searchLower)) score += 50;
      if (companyLower.includes(searchLower)) score += 50;
      
      searchWords.forEach(word => {
        if (titleLower.includes(word)) score += 20;
        if (companyLower.includes(word)) score += 20;
        if (job.tags?.some(tag => tag.toLowerCase().includes(word))) score += 10;
      });
    }

    if (locationWords.length > 0) {
      if (jobLocationLower === locationLower) score += 80;
      if (jobLocationLower.includes(locationLower)) score += 40;
      locationWords.forEach(word => {
        if (jobLocationLower.includes(word)) score += 15;
      });
    }

    return { job, score };
  });

  return scoredJobs
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .map(item => item.job);
};

function SearchPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { jobPosts, loading } = useJobPosts();
  
  const [searchTerm, setSearchTerm] = useState(searchParams.get('q') || '');
  const [location, setLocation] = useState(searchParams.get('location') || '');
  const [useComplexSearch, setUseComplexSearch] = useState(searchParams.get('algorithm') === 'complex');

  const searchResults = useMemo(() => {
    if (!jobPosts || jobPosts.length === 0) return [];
    if (useComplexSearch) {
      return complexSearch(jobPosts, searchTerm, location);
    } else {
      return simpleSearch(jobPosts, searchTerm, location);
    }
  }, [jobPosts, searchTerm, location, useComplexSearch]);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchTerm.trim()) params.append('q', searchTerm.trim());
    if (location.trim()) params.append('location', location.trim());
    if (useComplexSearch) params.append('algorithm', 'complex');
    router.push(`/candidate/search?${params.toString()}`);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/60 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-4 rounded-xl text-xs"
        >
          <ArrowLeft className="w-4 h-4 mr-1.5" />
          Quay lại
        </Button>
        
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-4 tracking-tight">
          Kết quả tìm kiếm việc làm
        </h1>
        
        {/* Search Bar */}
        <div className="bg-white rounded-2xl shadow-xs border border-slate-200/80 p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
            <div className="md:col-span-6 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Tìm kiếm công việc, công ty..."
                className="pl-10 rounded-xl"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={handleKeyPress}
              />
            </div>
            <div className="md:col-span-4 relative">
              <MapPin className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Địa điểm"
                className="pl-10 rounded-xl"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                onKeyDown={handleKeyPress}
              />
            </div>
            <div className="md:col-span-2">
              <Button 
                onClick={handleSearch}
                disabled={!searchTerm.trim() && !location.trim()}
                className="w-full rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold"
              >
                Tìm kiếm
              </Button>
            </div>
          </div>
          
          <div className="mt-3 flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={useComplexSearch}
                onChange={(e) => setUseComplexSearch(e.target.checked)}
                className="rounded text-blue-600 focus:ring-blue-500"
              />
              <span className="font-medium text-slate-700">Sử dụng thuật toán tìm kiếm nâng cao</span>
            </label>
            <span>
              Tìm thấy <strong className="text-slate-900">{searchResults.length}</strong> kết quả
            </span>
          </div>
        </div>

        {/* Search Results */}
        {loading ? (
          <div className="text-center py-16">
            <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="mt-3 text-sm text-slate-500">Đang tìm kiếm việc làm phù hợp...</p>
          </div>
        ) : searchResults.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-200/80 p-8">
            <Briefcase className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-800 mb-1">
              Không tìm thấy kết quả nào
            </h3>
            <p className="text-xs text-slate-500 mb-6">
              Thử thay đổi từ khóa tìm kiếm hoặc kiểm tra lại địa điểm
            </p>
            <Button onClick={() => router.push('/candidate/job')} className="rounded-xl">
              Xem tất cả việc làm
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {searchResults.map((job) => (
              <Card
                key={job.id}
                className="hover:shadow-xl hover:border-blue-500/50 transition-all duration-200 cursor-pointer rounded-2xl border-slate-200/80 overflow-hidden"
                onClick={() => router.push(`/candidate/job/${job.id}`)}
              >
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4 mb-4">
                    <CompanyLogo
                      src={job.logo}
                      name={job.employer?.fullName || "Công ty"}
                      size="md"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-base text-slate-900 hover:text-blue-600 transition-colors truncate">
                        {job.title}
                      </h3>
                      <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5 truncate">
                        <Building2 className="w-3 h-3 text-slate-400" />
                        <span>{job.employer?.fullName || "Công ty công nghệ"}</span>
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-2 mb-4 text-xs text-slate-600">
                    <div className="flex items-center">
                      <MapPin className="h-3.5 w-3.5 mr-1.5 text-slate-400" />
                      <span>{job.location || "Toàn quốc"}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-3.5 w-3.5 mr-1.5 text-slate-400" />
                      <span>{job.type || "Full-time"}</span>
                    </div>
                    <div className="flex items-center font-bold text-emerald-600">
                      <DollarSign className="h-3.5 w-3.5 mr-1 text-emerald-500" />
                      <span>{Number(job.salary) > 0 ? `${Number(job.salary).toLocaleString()}$ / tháng` : "Thương lượng"}</span>
                    </div>
                  </div>
                  
                  {Array.isArray(job.tags) && job.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {job.tags.slice(0, 3).map((tag) => (
                        <Badge
                          key={tag}
                          variant="secondary"
                          className="text-[11px] bg-slate-100 text-slate-600"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                  
                  <div className="flex justify-between items-center text-xs text-slate-400 pt-3 border-t border-slate-100">
                    <span>
                      {job.createdAt
                        ? `${Math.max(1, Math.floor((Date.now() - new Date(job.createdAt).getTime()) / (1000 * 60 * 60 * 24)))} ngày trước`
                        : "Mới đăng"}
                    </span>
                    <span className="font-medium text-slate-500">{job.applicants ?? 0} ứng viên</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-slate-400 text-sm">Đang tải trang tìm kiếm...</div>}>
      <SearchPageContent />
    </Suspense>
  );
}
