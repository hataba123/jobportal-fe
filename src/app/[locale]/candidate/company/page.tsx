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
  Grid3X3,
  List,
} from "lucide-react";
import Image from "next/image";
import { useState, useMemo } from "react";
import { useRouter } from "@/i18n/navigation";
import { useCompanies } from "@/hooks/useCompanies";
import { useJobPosts } from "@/hooks/useJobPosts";
import { useReviews } from "@/hooks/useReviews";
import { useTranslations } from 'next-intl';

export default function AllCompaniesPage() {
  const router = useRouter();
  const { companies, loading } = useCompanies();
  const { jobPosts } = useJobPosts();
  const { reviews } = useReviews();
  const t = useTranslations();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [industryFilter, setIndustryFilter] = useState("all");
  const [locationFilter, setLocationFilter] = useState("all");
  const [sizeFilter, setSizeFilter] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [currentPage, setCurrentPage] = useState(1);
  const companiesPerPage = 9;

  // Calculate company statistics
  const companiesWithStats = useMemo(() => {
    return companies.map((company) => {
      const companyJobs = jobPosts.filter((job) => job.companyId === company.id);
      const companyReviews = reviews.filter((review) => review.companyId === company.id);
      const averageRating = companyReviews.length > 0 
        ? companyReviews.reduce((sum, review) => sum + review.rating, 0) / companyReviews.length 
        : 0;

      return {
        ...company,
        openJobs: companyJobs.length,
        rating: averageRating,
        reviewCount: companyReviews.length,
      };
    });
  }, [companies, jobPosts, reviews]);

  const filteredCompanies = useMemo(() => {
    let filtered = companiesWithStats;

    if (searchTerm) {
      filtered = filtered.filter(
        (company) =>
          company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          company.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          company.industry?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (Array.isArray(company.tags) && company.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))),
      );
    }

    if (industryFilter !== "all") {
      filtered = filtered.filter((company) => company.industry === industryFilter);
    }

    if (locationFilter !== "all") {
      filtered = filtered.filter((company) => company.location === locationFilter);
    }

    if (sizeFilter !== "all") {
      filtered = filtered.filter((company) => company.employees === sizeFilter);
    }

    return filtered;
  }, [companiesWithStats, searchTerm, industryFilter, locationFilter, sizeFilter]);

  const totalPages = Math.ceil(filteredCompanies.length / companiesPerPage);
  const currentCompanies = useMemo(() => {
    const startIndex = (currentPage - 1) * companiesPerPage;
    const endIndex = startIndex + companiesPerPage;
    return filteredCompanies.slice(startIndex, endIndex);
  }, [filteredCompanies, currentPage, companiesPerPage]);

  const uniqueIndustries = useMemo(() => {
    const industries = new Set(
      companies
        .map((company) => company.industry)
        .filter((ind): ind is string => Boolean(ind))
    );
    return ["all", ...Array.from(industries)];
  }, [companies]);

  const uniqueLocations = useMemo(() => {
    const locations = new Set(
      companies
        .map((company) => company.location)
        .filter((loc): loc is string => Boolean(loc))
    );
    return ["all", ...Array.from(locations)];
  }, [companies]);

  const uniqueSizes = useMemo(() => {
    const sizes = new Set(
      companies
        .map((company) => company.employees)
        .filter((size): size is string => Boolean(size))
    );
    return ["all", ...Array.from(sizes)];
  }, [companies]);

  const handleCompanyClick = (companyId: string) => {
    router.push(`/candidate/company/${companyId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
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
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-white border-b">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {t('AllCompaniesPage.title')}
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              {t('AllCompaniesPage.description')}
            </p>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="bg-white border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <Input
                type="text"
                placeholder={t('AllCompaniesPage.search_placeholder')}
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Select value={industryFilter} onValueChange={setIndustryFilter}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder={t('AllCompaniesPage.industry')} />
                </SelectTrigger>
                <SelectContent>
                  {uniqueIndustries.map((industry) => (
                    <SelectItem key={industry} value={industry}>
                      {industry === "all" ? t('AllCompaniesPage.all_industries') : industry}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={locationFilter} onValueChange={setLocationFilter}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder={t('AllCompaniesPage.location')} />
                </SelectTrigger>
                <SelectContent>
                  {uniqueLocations.map((location) => (
                    <SelectItem key={location} value={location}>
                      {location === "all" ? t('AllCompaniesPage.all_locations') : location}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={sizeFilter} onValueChange={setSizeFilter}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder={t('AllCompaniesPage.size')} />
                </SelectTrigger>
                <SelectContent>
                  {uniqueSizes.map((size) => (
                    <SelectItem key={size} value={size}>
                      {size === "all" ? t('AllCompaniesPage.all_sizes') : size}
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
              >
                <Grid3X3 className="h-5 w-5" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                onClick={() => setViewMode("list")}
                size="icon"
              >
                <List className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Results */}
      <section className="container mx-auto px-4 py-8">
        {filteredCompanies.length === 0 ? (
          <div className="text-center text-gray-500 py-10">
            <Building2 className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-semibold mb-2">{t('AllCompaniesPage.no_companies')}</h3>
            <p>{t('AllCompaniesPage.try_adjusting_filters')}</p>
          </div>
        ) : (
          <>
            <div className="mb-4">
              <p className="text-gray-600">
                {t('AllCompaniesPage.showing')} {currentCompanies.length} {t('AllCompaniesPage.of')} {filteredCompanies.length} {t('AllCompaniesPage.companies')}
              </p>
            </div>

            <div
              className={
                viewMode === "grid"
                  ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                  : "grid grid-cols-1 gap-6"
              }
            >
              {currentCompanies.map((company) => (
                <Card
                  key={company.id}
                  className={`hover:shadow-lg transition-shadow cursor-pointer ${
                    viewMode === "list" ? "flex flex-col md:flex-row" : ""
                  }`}
                  onClick={() => handleCompanyClick(company.id as string)}
                >
                  <CardContent className={`p-6 ${viewMode === "list" ? "flex-1" : ""}`}>
                    <div className={`flex ${viewMode === "list" ? "items-start space-x-4" : "flex-col"}`}>
                      <Image
                        src={company.logo || "/placeholder.svg"}
                        alt={`${company.name} Logo`}
                        width={80}
                        height={80}
                        className={`object-contain rounded-lg border ${
                          viewMode === "list" ? "w-20 h-20 flex-shrink-0" : "w-20 h-20 mx-auto mb-4"
                        }`}
                      />
                      <div className={`flex-1 ${viewMode === "list" ? "ml-4" : ""}`}>
                        <h3 className="text-xl font-semibold mb-2">{company.name}</h3>
                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                          {company.description || t('AllCompaniesPage.no_description')}
                        </p>
                        <div className="space-y-2 mb-4">
                          <div className="flex items-center text-sm text-gray-500">
                            <MapPin className="w-4 h-4 mr-2" />
                            {company.location || "N/A"}
                          </div>
                          <div className="flex items-center text-sm text-gray-500">
                            <Users className="w-4 h-4 mr-2" />
                            {company.employees || "N/A"} {t('AllCompaniesPage.employees')}
                          </div>
                          <div className="flex items-center text-sm text-gray-500">
                            <Star className="w-4 h-4 mr-2 fill-yellow-400 text-yellow-400" />
                            {company.rating.toFixed(1)}/5.0 ({company.reviewCount} {t('AllCompaniesPage.reviews')})
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2 mb-4">
                          {Array.isArray(company.tags) && company.tags.slice(0, 3).map((tag) => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-blue-600">
                            {company.openJobs} {t('AllCompaniesPage.open_jobs')}
                          </span>
                          <Button size="sm" variant="outline">
                            {t('AllCompaniesPage.view_details')}
                            <ArrowRight className="w-4 h-4 ml-1" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
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
                  {t('AllCompaniesPage.previous')}
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
                  {t('AllCompaniesPage.next')}
                </Button>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
}
