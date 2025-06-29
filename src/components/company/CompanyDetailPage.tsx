"use client";

import { useState, useEffect } from "react";
import { useRouter } from "@/i18n/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import {
  MapPin,
  Users,
  Calendar,
  Globe,
  Star,
  ArrowLeft,
  DollarSign,
  Briefcase,
} from "lucide-react";
import Image from "next/image";
import { Company } from "@/types/Company";
import { JobPost } from "@/types/JobPost";
import { Review } from "@/types/Review";
import { fetchCompanyById, fetchJobsByCompany } from "@/lib/api/company";
import { fetchReviewsByCompany } from "@/lib/api/review";

interface CompanyDetailPageProps {
  companyId: string;
}

export default function CompanyDetailPage({
  companyId,
}: CompanyDetailPageProps) {
  const router = useRouter();
  const [company, setCompany] = useState<Company | null>(null);
  const [companyJobs, setCompanyJobs] = useState<JobPost[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    const fetchCompanyData = async () => {
      setIsLoading(true);
      try {
        const [companyData, jobsData, reviewsData] = await Promise.all([
          fetchCompanyById(companyId),
          fetchJobsByCompany(companyId),
          fetchReviewsByCompany(companyId),
        ]);

        setCompany(companyData);
        setCompanyJobs(jobsData);
        setReviews(reviewsData);
      } catch (error) {
        console.error("Error fetching company data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCompanyData();
  }, [companyId]);

  // Calculate average rating
  const averageRating =
    reviews.length > 0
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
      : 0;

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-32 bg-gray-200 rounded mb-6"></div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="h-64 bg-gray-200 rounded mb-6"></div>
            </div>
            <div className="h-96 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!company) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Không tìm thấy công ty</h1>
        <p className="text-gray-600 mb-6">
          Công ty bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.
        </p>
        <Button onClick={() => router.push("/candidate/company")}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Quay lại danh sách công ty
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center text-sm text-gray-600 mb-6">
        <button
          onClick={() => router.push("/candidate/company")}
          className="hover:text-blue-600"
        >
          Công ty
        </button>
        <span className="mx-2">/</span>
        <span className="text-gray-900">{company.name}</span>
      </div>

      {/* Company Header */}
      <Card className="mb-8">
        <CardHeader>
          <div className="flex flex-col md:flex-row gap-6">
            <Image
              src={company.logo || "/placeholder.svg"}
              alt={`${company.name} Logo`}
              width={96}
              height={96}
              className="w-24 h-24 object-contain rounded-lg border mx-auto md:mx-0"
            />
            <div className="flex-1 text-center md:text-left">
              <CardTitle className="text-3xl font-bold mb-2">
                {company.name}
              </CardTitle>
              <CardDescription className="text-lg text-gray-600 mb-4">
                {company.industry}
              </CardDescription>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600 mb-4">
                <div className="flex items-center justify-center md:justify-start">
                  <MapPin className="w-4 h-4 mr-2" />
                  {company.location}
                </div>
                <div className="flex items-center justify-center md:justify-start">
                  <Users className="w-4 h-4 mr-2" />
                  {company.employees} nhân viên
                </div>
                <div className="flex items-center justify-center md:justify-start">
                  <Calendar className="w-4 h-4 mr-2" />
                  Thành lập {company.founded}
                </div>
                <div className="flex items-center justify-center md:justify-start">
                  <Star className="w-4 h-4 mr-2 fill-yellow-400 text-yellow-400" />
                  {averageRating.toFixed(1)}/5.0
                </div>
              </div>
              <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                {Array.isArray(company.tags) &&
                  company.tags.slice(0, 6).map((tag) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3 justify-center md:justify-start">
            <Button
              size="lg"
              className="px-8"
              onClick={() => setActiveTab("jobs")}
            >
              Xem {companyJobs.length} việc làm
            </Button>
            {company.website && (
              <Button variant="outline" size="lg" asChild>
                <a
                  href={company.website}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Globe className="w-4 h-4 mr-2" />
                  Truy cập website
                </a>
              </Button>
            )}
            <Button variant="outline" size="lg">
              Theo dõi công ty
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">Giới thiệu</TabsTrigger>
              <TabsTrigger value="jobs">
                Việc làm ({companyJobs.length})
              </TabsTrigger>
              <TabsTrigger value="reviews">
                Đánh giá ({reviews.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Về {company.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose max-w-none">
                    {company.description ? (
                      <p className="text-gray-700 leading-relaxed">
                        {company.description}
                      </p>
                    ) : (
                      <p className="text-gray-500 italic">
                        Chưa có thông tin mô tả về công ty này.
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {Array.isArray(company.tags) && company.tags.length > 0 && (
                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle>Công nghệ & Kỹ năng</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-3">
                      {company.tags.map((tag) => (
                        <Badge
                          key={tag}
                          variant="outline"
                          className="text-sm py-2 px-3"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="jobs" className="mt-6">
              <div className="space-y-4">
                {companyJobs.length === 0 ? (
                  <Card>
                    <CardContent className="text-center py-8">
                      <p className="text-gray-600">
                        Hiện tại công ty chưa có vị trí tuyển dụng nào.
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  companyJobs.map((job) => (
                    <Card
                      key={job.id}
                      className="hover:shadow-md transition-shadow"
                      onClick={() => router.push(`/candidate/job/${job.id}`)} // 👈 Điều hướng khi click
                    >
                      <CardContent className="p-6">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h3 className="text-xl font-semibold mb-2">
                              <button
                                onClick={() =>
                                  router.push(`/candidate/job/${job.id}`)
                                }
                                className="hover:text-blue-600"
                              >
                                {job.title}
                              </button>
                            </h3>
                            <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-3">
                              <div className="flex items-center">
                                <MapPin className="w-4 h-4 mr-1" />
                                {job.location}
                              </div>
                              <div className="flex items-center">
                                <DollarSign className="w-4 h-4 mr-1" />$
                                {job.salary.toLocaleString()}/tháng
                              </div>
                              <div className="flex items-center">
                                <Briefcase className="w-4 h-4 mr-1" />
                                {job.type}
                              </div>
                            </div>
                            <p className="text-sm text-gray-500">
                              Đăng ngày{" "}
                              {new Date(job.createdAt).toLocaleDateString(
                                "vi-VN"
                              )}
                            </p>
                          </div>
                          <Button
                            onClick={() =>
                              router.push(`/candidate/job/${job.id}`)
                            }
                            className="ml-4"
                          >
                            Xem chi tiết
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </TabsContent>

            <TabsContent value="reviews" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Đánh giá từ nhân viên</CardTitle>
                </CardHeader>
                <CardContent>
                  {reviews.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-gray-500">
                        Chưa có đánh giá nào cho công ty này.
                      </p>
                    </div>
                  ) : (
                    <div>
                      <div className="text-center py-8">
                        <div className="text-4xl font-bold text-gray-900 mb-2">
                          {averageRating.toFixed(1)}/5.0
                        </div>
                        <div className="flex justify-center mb-4">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`w-6 h-6 ${
                                star <= Math.floor(averageRating)
                                  ? "fill-yellow-400 text-yellow-400"
                                  : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                        <p className="text-gray-600 mb-6">
                          Dựa trên {reviews.length} đánh giá
                        </p>
                      </div>

                      <div className="space-y-4">
                        {reviews.map((review) => (
                          <div key={review.id} className="border-t pt-4">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center">
                                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center mr-3">
                                  <span className="text-sm font-medium">A</span>
                                </div>
                                <div>
                                  <p className="font-medium">Anonymous</p>
                                  <p className="text-sm text-gray-500">
                                    {new Date(
                                      review.createdAt
                                    ).toLocaleDateString("vi-VN")}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <Star
                                    key={star}
                                    className={`w-4 h-4 ${
                                      star <= review.rating
                                        ? "fill-yellow-400 text-yellow-400"
                                        : "text-gray-300"
                                    }`}
                                  />
                                ))}
                              </div>
                            </div>
                            <p className="text-gray-700">{review.comment}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Company Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Thông tin tóm tắt</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Ngành nghề:</span>
                  <span className="font-medium">{company.industry}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Quy mô:</span>
                  <span>{company.employees} nhân viên</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Thành lập:</span>
                  <span>{company.founded}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Địa điểm:</span>
                  <span>{company.location}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Việc làm:</span>
                  <span className="font-medium text-blue-600">
                    {companyJobs.length} vị trí
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Đánh giá:</span>
                  <div className="flex items-center">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 mr-1" />
                    <span>{averageRating.toFixed(1)}/5.0</span>
                  </div>
                </div>
              </div>
              {company.website && (
                <>
                  <Separator className="my-4" />
                  <Button
                    variant="outline"
                    className="w-full bg-transparent"
                    asChild
                  >
                    <a
                      href={company.website}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Globe className="w-4 h-4 mr-2" />
                      Truy cập website
                    </a>
                  </Button>
                </>
              )}
            </CardContent>
          </Card>

          {/* Featured Jobs */}
          {companyJobs.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Việc làm nổi bật</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {companyJobs.slice(0, 3).map((job) => (
                    <div
                      key={job.id}
                      className="border-b border-gray-100 pb-4 last:border-b-0"
                    >
                      <h4 className="font-semibold text-sm mb-1">
                        <button
                          onClick={() =>
                            router.push(`/candidate/job/${job.id}`)
                          }
                          className="hover:text-blue-600"
                        >
                          {job.title}
                        </button>
                      </h4>
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>{job.location}</span>
                        <span>${job.salary.toLocaleString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
