"use client";

import { useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, MapPin, DollarSign, Clock, ArrowLeft } from "lucide-react";
import Image from "next/image";
import { useRouter } from "@/i18n/navigation";
import { useJobPosts } from "@/hooks/useJobPosts";
import { JobPost } from "@/types/JobPost";

// Simple search algorithm - exact match and contains
const simpleSearch = (jobs: JobPost[], searchTerm: string, location: string) => {
  const searchLower = searchTerm.toLowerCase().trim();
  const locationLower = location.toLowerCase().trim();

  return jobs.filter((job) => {
    const titleMatch = job.title.toLowerCase().includes(searchLower);
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
    const titleLower = job.title.toLowerCase();
    const companyLower = job.employer?.fullName?.toLowerCase() || '';
    const jobLocationLower = job.location?.toLowerCase() || '';

    // Search term scoring
    if (searchWords.length > 0) {
      // Exact matches get highest score
      if (titleLower === searchLower) score += 100;
      if (companyLower === searchLower) score += 100;
      
      // Contains matches
      if (titleLower.includes(searchLower)) score += 50;
      if (companyLower.includes(searchLower)) score += 50;
      
      // Word-by-word matching
      searchWords.forEach(word => {
        if (titleLower.includes(word)) score += 20;
        if (companyLower.includes(word)) score += 20;
        if (job.tags?.some(tag => tag.toLowerCase().includes(word))) score += 10;
      });
    }

    // Location scoring
    if (locationWords.length > 0) {
      if (jobLocationLower === locationLower) score += 80;
      if (jobLocationLower.includes(locationLower)) score += 40;
      
      locationWords.forEach(word => {
        if (jobLocationLower.includes(word)) score += 15;
      });
    }

    // Bonus for recent jobs
    if (job.createdAt) {
      const daysSincePosted = Math.floor(
        (Date.now() - new Date(job.createdAt).getTime()) / (1000 * 60 * 60 * 24)
      );
      if (daysSincePosted <= 7) score += 10;
      if (daysSincePosted <= 30) score += 5;
    }

    return { job, score };
  });

  // Filter jobs with score > 0 and sort by score
  return scoredJobs
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .map(item => item.job);
};

export default function SearchPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { jobPosts, loading } = useJobPosts();
  
  const [searchTerm, setSearchTerm] = useState(searchParams.get('q') || '');
  const [location, setLocation] = useState(searchParams.get('location') || '');
  const [useComplexSearch, setUseComplexSearch] = useState(searchParams.get('algorithm') === 'complex');

  // Get search results
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
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Quay lại
          </Button>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Kết quả tìm kiếm
          </h1>
          
          {/* Search Bar */}
          <div className="bg-white rounded-lg shadow-md p-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-2">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Tìm kiếm công việc, công ty..."
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyPress={handleKeyPress}
                  />
                </div>
              </div>
              <div>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Địa điểm"
                    className="pl-10"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    onKeyPress={handleKeyPress}
                  />
                </div>
              </div>
              <Button 
                onClick={handleSearch}
                disabled={!searchTerm.trim() && !location.trim()}
                className="w-full"
              >
                Tìm kiếm
              </Button>
            </div>
            
            {/* Search Algorithm Toggle */}
            <div className="mt-3 flex items-center justify-center">
              <label className="flex items-center space-x-2 text-sm text-gray-600">
                <input
                  type="checkbox"
                  checked={useComplexSearch}
                  onChange={(e) => setUseComplexSearch(e.target.checked)}
                  className="rounded"
                />
                <span>Sử dụng thuật toán tìm kiếm nâng cao</span>
              </label>
            </div>
          </div>

          {/* Search Summary */}
          <div className="flex items-center justify-between mb-6">
            <p className="text-gray-600">
              Tìm thấy <span className="font-semibold">{searchResults.length}</span> kết quả
              {searchTerm && ` cho "${searchTerm}"`}
              {location && ` tại "${location}"`}
            </p>
            <p className="text-sm text-gray-500">
              Thuật toán: {useComplexSearch ? 'Nâng cao' : 'Đơn giản'}
            </p>
          </div>
        </div>

        {/* Search Results */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Đang tải kết quả tìm kiếm...</p>
          </div>
        ) : searchResults.length === 0 ? (
          <div className="text-center py-12">
            <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Không tìm thấy kết quả nào
            </h3>
            <p className="text-gray-600 mb-6">
              Thử thay đổi từ khóa tìm kiếm hoặc địa điểm
            </p>
            <Button onClick={() => router.push('/candidate/dashboard')}>
              Xem tất cả việc làm
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {searchResults.map((job) => (
              <Card
                key={job.id}
                className="hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => router.push(`/candidate/job/${job.id}`)}
              >
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4 mb-4">
                    <Image
                      src={job.logo || "/placeholder.svg"}
                      alt={job.employer?.fullName || "Company"}
                      width={50}
                      height={50}
                      className="rounded-lg border"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-1">
                        {job.title}
                      </h3>
                      <p className="text-blue-600 font-medium">
                        {job.employer?.fullName}
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin className="h-4 w-4 mr-2" />
                      {job.location}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Clock className="h-4 w-4 mr-2" />
                      {job.type}
                    </div>
                    <div className="flex items-center text-sm font-semibold text-green-600">
                      <DollarSign className="h-4 w-4 mr-2" />
                      ${job.salary.toLocaleString()}/tháng
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {job.tags?.map((tag) => (
                      <Badge
                        key={tag}
                        variant="secondary"
                        className="text-xs"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="flex justify-between items-center text-sm text-gray-500">
                    <span>
                      {job.createdAt
                        ? `${Math.floor(
                            (Date.now() - new Date(job.createdAt).getTime()) /
                              (1000 * 60 * 60 * 24)
                          )} ngày trước`
                        : ""}
                    </span>
                    <span>{job.applicants ?? 0} ứng viên</span>
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