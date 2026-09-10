"use client";

import React, { useState, useMemo, useRef, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import CompanyLogo from "@/components/common/CompanyLogo";
import {
  Search,
  MapPin,
  Clock,
  DollarSign,
  Users,
  TrendingUp,
  Star,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Building2,
  Briefcase,
  Layers,
  Code,
  Laptop,
  Palette,
  Server,
  Cpu,
  BarChart3,
  SlidersHorizontal,
} from "lucide-react";
import { useFeaturedJobs } from "@/hooks/useFeaturedJobs";
import { useCategories } from "@/hooks/useCategories";
import { useJobPosts } from "@/hooks/useJobPosts";
import { useCompanies } from "@/hooks/useCompanies";
import { useReviews } from "@/hooks/useReviews";
import { Company } from "@/types/Company";
import { Review } from "@/types/Review";

const categoryIconMap: Record<string, React.ElementType> = {
  Code,
  Laptop,
  Palette,
  Server,
  Cpu,
  BarChart3,
  Briefcase,
  Layers,
};

function getTopCompanies(companies: Company[], reviews: Review[], topN = 6) {
  return companies
    .map((company) => {
      const companyReviews = reviews.filter((r) => r.companyId === company.id);
      const averageRating =
        companyReviews.length > 0
          ? companyReviews.reduce((sum, r) => sum + r.rating, 0) / companyReviews.length
          : 0;

      return {
        ...company,
        averageRating,
        reviewCount: companyReviews.length,
      };
    })
    .sort((a, b) => b.averageRating - a.averageRating)
    .slice(0, topN);
}

export default function HomepageContent() {
  const t = useTranslations("HomePage");
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [location, setLocation] = useState("");
  const [useComplexSearch, setUseComplexSearch] = useState(false);
  const [showSearchSuggestions, setShowSearchSuggestions] = useState(false);
  const [showLocationSuggestions, setShowLocationSuggestions] = useState(false);

  const searchBoxRef = useRef<HTMLDivElement>(null);

  const { jobs: featuredJobs, loading } = useFeaturedJobs();
  const { categories, loading: loadingCategories } = useCategories();
  const { jobPosts } = useJobPosts();
  const { companies, loading: loadingCompanies } = useCompanies();
  const { reviews, loading: loadingReviews } = useReviews();

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchBoxRef.current && !searchBoxRef.current.contains(e.target as Node)) {
        setShowSearchSuggestions(false);
        setShowLocationSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = () => {
    if (!searchTerm.trim() && !location.trim()) return;

    const params = new URLSearchParams();
    if (searchTerm.trim()) params.append("q", searchTerm.trim());
    if (location.trim()) params.append("location", location.trim());
    if (useComplexSearch) params.append("algorithm", "complex");

    router.push(`/candidate/search?${params.toString()}`);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const searchSuggestions = useMemo(() => {
    if (!searchTerm.trim() || searchTerm.length < 2) return [];
    const suggestions = new Set<string>();
    const searchLower = searchTerm.toLowerCase();

    jobPosts.forEach((job) => {
      if (job.title.toLowerCase().includes(searchLower)) {
        suggestions.add(job.title);
      }
      if (job.employer?.fullName?.toLowerCase().includes(searchLower)) {
        suggestions.add(job.employer.fullName);
      }
    });

    return Array.from(suggestions).slice(0, 5);
  }, [searchTerm, jobPosts]);

  const locationSuggestions = useMemo(() => {
    if (!location.trim() || location.length < 2) return [];
    const suggestions = new Set<string>();
    const locLower = location.toLowerCase();

    jobPosts.forEach((job) => {
      if (job.location?.toLowerCase().includes(locLower)) {
        suggestions.add(job.location);
      }
    });

    return Array.from(suggestions).slice(0, 5);
  }, [location, jobPosts]);

  return (
    <div className="min-h-screen bg-slate-50/50">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-50/70 via-slate-50 to-white pt-16 pb-24 md:pt-24 md:pb-32 border-b border-slate-100">
        {/* Subtle Background Blobs */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full overflow-hidden pointer-events-none -z-10">
          <div className="absolute top-10 left-1/4 w-72 h-72 bg-blue-400/10 rounded-full blur-3xl"></div>
          <div className="absolute top-20 right-1/4 w-96 h-96 bg-indigo-400/10 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200/70 text-blue-700 text-xs font-semibold mb-6 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>{t("badge")}</span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight max-w-4xl mx-auto leading-tight sm:leading-tight">
            {t("hero_title_prefix")}{" "}
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              {t("hero_title_highlight")}
            </span>{" "}
            {t("hero_title_suffix")}
          </h1>

          <p className="mt-5 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            {t("hero_description")}
          </p>

          {/* Search Box */}
          <div ref={searchBoxRef} className="max-w-4xl mx-auto mt-10">
            <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/60 border border-slate-200/80 p-3 sm:p-4 transition-all">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                {/* Search Keywords */}
                <div className="md:col-span-6 relative">
                  <div className="flex items-center px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200/80 focus-within:border-blue-500 focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-500/20 transition-all">
                    <Search className="w-4 h-4 text-slate-400 mr-2.5 flex-shrink-0" />
                    <input
                      type="text"
                      placeholder={t("search_keyword_placeholder")}
                      className="w-full bg-transparent text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
                      value={searchTerm}
                      onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setShowSearchSuggestions(true);
                      }}
                      onFocus={() => setShowSearchSuggestions(true)}
                      onKeyDown={handleKeyPress}
                    />
                  </div>

                  {/* Autocomplete Suggestions */}
                  {showSearchSuggestions && searchSuggestions.length > 0 && (
                    <div className="absolute top-full left-0 right-0 bg-white border border-slate-200 rounded-2xl shadow-xl z-20 mt-1.5 overflow-hidden text-left p-1">
                      {searchSuggestions.map((suggestion, idx) => (
                        <button
                          key={idx}
                          type="button"
                          className="w-full px-3.5 py-2 text-xs text-slate-700 hover:bg-blue-50 hover:text-blue-600 rounded-xl flex items-center gap-2 transition-colors text-left"
                          onClick={() => {
                            setSearchTerm(suggestion);
                            setShowSearchSuggestions(false);
                          }}
                        >
                          <Search className="w-3.5 h-3.5 text-slate-400" />
                          <span>{suggestion}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Location */}
                <div className="md:col-span-4 relative">
                  <div className="flex items-center px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200/80 focus-within:border-blue-500 focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-500/20 transition-all">
                    <MapPin className="w-4 h-4 text-slate-400 mr-2.5 flex-shrink-0" />
                    <input
                      type="text"
                      placeholder={t("search_location_placeholder")}
                      className="w-full bg-transparent text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
                      value={location}
                      onChange={(e) => {
                        setLocation(e.target.value);
                        setShowLocationSuggestions(true);
                      }}
                      onFocus={() => setShowLocationSuggestions(true)}
                      onKeyDown={handleKeyPress}
                    />
                  </div>

                  {/* Location Suggestions */}
                  {showLocationSuggestions && locationSuggestions.length > 0 && (
                    <div className="absolute top-full left-0 right-0 bg-white border border-slate-200 rounded-2xl shadow-xl z-20 mt-1.5 overflow-hidden text-left p-1">
                      {locationSuggestions.map((loc, idx) => (
                        <button
                          key={idx}
                          type="button"
                          className="w-full px-3.5 py-2 text-xs text-slate-700 hover:bg-blue-50 hover:text-blue-600 rounded-xl flex items-center gap-2 transition-colors text-left"
                          onClick={() => {
                            setLocation(loc);
                            setShowLocationSuggestions(false);
                          }}
                        >
                          <MapPin className="w-3.5 h-3.5 text-slate-400" />
                          <span>{loc}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Search Button */}
                <div className="md:col-span-2">
                  <Button
                    size="lg"
                    className="w-full h-[42px] rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-xs shadow-blue-500/20 active:scale-95 transition-all flex items-center justify-center gap-1.5"
                    onClick={handleSearch}
                  >
                    <span>{t("search_button")}</span>
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Complex Search Algorithm Toggle */}
              <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 px-1">
                <label className="inline-flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={useComplexSearch}
                    onChange={(e) => setUseComplexSearch(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="font-medium text-slate-600 flex items-center gap-1">
                    <SlidersHorizontal className="w-3 h-3 text-blue-600" />
                    {t("complex_search_label")}
                  </span>
                </label>
                <span className="hidden sm:inline text-slate-400">
                  {t("search_tip")}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mt-12 pt-6">
            <div className="p-4 rounded-2xl bg-white/70 backdrop-blur-xs border border-slate-200/60 shadow-2xs">
              <div className="text-2xl sm:text-3xl font-extrabold text-blue-600">10,000+</div>
              <div className="text-xs sm:text-sm font-medium text-slate-500 mt-0.5">{t("stats_jobs")}</div>
            </div>
            <div className="p-4 rounded-2xl bg-white/70 backdrop-blur-xs border border-slate-200/60 shadow-2xs">
              <div className="text-2xl sm:text-3xl font-extrabold text-indigo-600">5,000+</div>
              <div className="text-xs sm:text-sm font-medium text-slate-500 mt-0.5">{t("stats_companies")}</div>
            </div>
            <div className="p-4 rounded-2xl bg-white/70 backdrop-blur-xs border border-slate-200/60 shadow-2xs">
              <div className="text-2xl sm:text-3xl font-extrabold text-emerald-600">50,000+</div>
              <div className="text-xs sm:text-sm font-medium text-slate-500 mt-0.5">{t("stats_candidates")}</div>
            </div>
            <div className="p-4 rounded-2xl bg-white/70 backdrop-blur-xs border border-slate-200/60 shadow-2xs">
              <div className="text-2xl sm:text-3xl font-extrabold text-amber-600">98%</div>
              <div className="text-xs sm:text-sm font-medium text-slate-500 mt-0.5">{t("stats_satisfaction")}</div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Jobs Section */}
      <section className="py-16 md:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{t("featured_jobs_badge")}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              {t("featured_jobs_title")}
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              {t("featured_jobs_desc")}
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() => router.push("/candidate/job")}
            className="rounded-xl border-slate-300 hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50/50 self-start md:self-auto text-xs font-semibold"
          >
            <span>{t("view_all_jobs")}</span>
            <ArrowRight className="ml-1.5 w-3.5 h-3.5" />
          </Button>
        </div>

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
        ) : featuredJobs.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-200/80 p-8">
            <Briefcase className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-base font-semibold text-slate-700">{t("no_featured_jobs")}</p>
            <p className="text-xs text-slate-400 mt-1">{t("no_featured_jobs_desc")}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredJobs.slice(0, 9).map((job) => (
              <div
                key={job.id}
                onClick={() => router.push(`/candidate/job/${job.id}`)}
                className="group relative flex flex-col justify-between p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:shadow-xl hover:border-blue-500/50 hover:-translate-y-1 transition-all duration-200 cursor-pointer overflow-hidden"
              >
                <div>
                  {/* Top Header */}
                  <div className="flex items-start gap-4 mb-4">
                    <CompanyLogo
                      src={job.logo}
                      name={job.employer?.fullName || job.companyName || t("company_default")}
                      size="md"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-base text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1">
                        {job.title}
                      </h3>
                      <p className="text-xs text-slate-500 line-clamp-1 mt-0.5 flex items-center gap-1">
                        <Building2 className="w-3 h-3 text-slate-400 flex-shrink-0" />
                        <span>{job.employer?.fullName || job.companyName || t("company_default")}</span>
                      </p>
                    </div>
                  </div>

                  {/* Highlights Pill */}
                  <div className="flex flex-wrap items-center gap-2 mb-4 text-xs">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 font-bold border border-emerald-200/60">
                      <DollarSign className="w-3.5 h-3.5" />
                      {Number(job.salary) > 0 ? `${Number(job.salary).toLocaleString()}$ ${t("per_month")}` : t("salary_negotiable")}
                    </span>
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-slate-100 text-slate-600">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      {job.location || t("nationwide")}
                    </span>
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-slate-100 text-slate-600">
                      <Clock className="w-3 h-3 text-slate-400" />
                      {job.type || "Full-time"}
                    </span>
                  </div>

                  {/* Tags */}
                  {Array.isArray(job.tags) && job.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {job.tags.slice(0, 3).map((tag) => (
                        <Badge
                          key={tag}
                          variant="secondary"
                          className="text-[11px] font-medium bg-slate-100/90 text-slate-600 hover:bg-slate-200"
                        >
                          {tag}
                        </Badge>
                      ))}
                      {job.tags.length > 3 && (
                        <span className="text-[11px] text-slate-400 self-center">
                          +{job.tags.length - 3}
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Card Footer */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400 mt-2">
                  <span>
                    {job.createdAt
                      ? t("days_ago", {
                          days: Math.max(1, Math.floor((Date.now() - new Date(job.createdAt).getTime()) / (1000 * 60 * 60 * 24))),
                        })
                      : t("just_posted")}
                  </span>
                  <span className="font-medium text-slate-500">
                    {t("applicants_submitted", { count: job.applicants ?? 0 })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Categories Section */}
      <section className="py-16 md:py-20 bg-white border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              {t("categories_title")}
            </h2>
            <p className="text-sm text-slate-500 mt-2">
              {t("categories_desc")}
            </p>
          </div>

          {loadingCategories ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                <div key={n} className="h-32 bg-slate-100 rounded-2xl animate-pulse"></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {categories.map((category) => {
                const IconComponent = category.icon ? categoryIconMap[category.icon] || Code : Code;
                const categoryId = category.id == null ? "" : String(category.id);
                const categoryName = category.name.trim().toLocaleLowerCase();
                const jobCount = jobPosts.filter((job) => {
                  const belongsToCategory =
                    (Boolean(job.categoryId) && String(job.categoryId) === categoryId) ||
                    job.categoryName?.trim().toLocaleLowerCase() === categoryName;

                  return belongsToCategory && (!job.status || job.status === "Active");
                }).length;

                return (
                  <div
                    key={category.id || category.name}
                    onClick={() => router.push(`/candidate/category/${category.id || category.name}`)}
                    className="group p-5 rounded-2xl bg-slate-50/70 hover:bg-white border border-slate-200/70 hover:border-blue-500 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 cursor-pointer flex flex-col items-center text-center select-none"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-3 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all duration-200 shadow-2xs">
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <h3 className="font-bold text-sm text-slate-800 group-hover:text-blue-600 transition-colors">
                      {category.name}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">
                      {t("jobs_open_count", { count: jobCount })}
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Top Companies Section */}
      <section className="py-16 md:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 uppercase tracking-wider mb-2">
              <Building2 className="w-3.5 h-3.5" />
              <span>{t("top_companies_badge")}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              {t("top_companies_title")}
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              {t("top_companies_desc")}
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() => router.push("/candidate/company")}
            className="rounded-xl border-slate-300 hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50/50 self-start md:self-auto text-xs font-semibold"
          >
            <span>{t("view_all_companies")}</span>
            <ArrowRight className="ml-1.5 w-3.5 h-3.5" />
          </Button>
        </div>

        {loadingCompanies || loadingReviews ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-40 bg-white rounded-2xl border border-slate-200 animate-pulse"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {getTopCompanies(companies, reviews, 6).map((company) => (
              <div
                key={company.id}
                onClick={() => router.push(`/candidate/company/${company.id}`)}
                className="group p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:shadow-xl hover:border-indigo-500/50 hover:-translate-y-1 transition-all duration-200 cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start gap-4 mb-4">
                    <CompanyLogo src={company.logo} name={company.name} size="md" />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-base text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1">
                        {company.name}
                      </h3>
                      <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-1">
                        <Users className="w-3.5 h-3.5 text-slate-400" />
                        <span>{t("employees_count", { count: company.employees || "50-100" })}</span>
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="font-semibold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-lg">
                    {t("jobs_open_badge", { count: company.openJobs || 0 })}
                  </span>
                  <div className="flex items-center gap-1 text-slate-700 font-bold">
                    <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                    <span>{company.averageRating > 0 ? company.averageRating.toFixed(1) : "5.0"}</span>
                    <span className="text-slate-400 font-normal">({company.reviewCount})</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Why Choose Us & Trust Section */}
      <section className="py-16 md:py-20 bg-slate-900 text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
              {t("why_us_title")}
            </h2>
            <p className="text-sm text-slate-400 mt-2">
              {t("why_us_desc")}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-3">
              <div className="w-12 h-12 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold">{t("why_us_feat1_title")}</h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                {t("why_us_feat1_desc")}
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold">{t("why_us_feat2_title")}</h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                {t("why_us_feat2_desc")}
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-3">
              <div className="w-12 h-12 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold">{t("why_us_feat3_title")}</h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                {t("why_us_feat3_desc")}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Dual CTA Banner */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Candidate Card */}
          <div className="p-8 rounded-3xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white shadow-xl shadow-blue-500/10 flex flex-col justify-between space-y-6">
            <div>
              <span className="inline-flex px-3 py-1 rounded-full text-xs font-bold bg-white/20 text-white mb-4">
                {t("candidate_badge")}
              </span>
              <h3 className="text-2xl font-extrabold tracking-tight">
                {t("candidate_title")}
              </h3>
              <p className="text-sm text-blue-100 mt-2 leading-relaxed">
                {t("candidate_desc")}
              </p>
            </div>
            <div>
              <Button
                onClick={() => router.push("/candidate/job")}
                className="h-11 px-6 rounded-xl bg-white text-blue-700 font-bold hover:bg-blue-50 active:scale-95 transition-all shadow-md"
              >
                <span>{t("candidate_btn")}</span>
                <ArrowRight className="ml-1.5 w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Recruiter Card */}
          <div className="p-8 rounded-3xl bg-slate-900 text-white border border-slate-800 shadow-xl flex flex-col justify-between space-y-6">
            <div>
              <span className="inline-flex px-3 py-1 rounded-full text-xs font-bold bg-slate-800 text-amber-400 border border-slate-700 mb-4">
                {t("recruiter_badge")}
              </span>
              <h3 className="text-2xl font-extrabold tracking-tight">
                {t("recruiter_title")}
              </h3>
              <p className="text-sm text-slate-400 mt-2 leading-relaxed">
                {t("recruiter_desc")}
              </p>
            </div>
            <div>
              <Button
                onClick={() => router.push("/recruiter/jobs")}
                className="h-11 px-6 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 active:scale-95 transition-all shadow-md shadow-blue-500/20"
              >
                <span>{t("recruiter_btn")}</span>
                <ArrowRight className="ml-1.5 w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
