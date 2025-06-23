"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  DollarSign,
  Users,
  TrendingUp,
  Star,
  ArrowRight,
  CheckCircle,
  MapPin,
  Clock,
  Palette,
  BarChart3,
  Shield,
  Headphones,
  Code,
  Search,
} from "lucide-react";

const iconMap: Record<string, React.ElementType> = {
  DollarSign,
  Users,
  TrendingUp,
  Star,
  ArrowRight,
  CheckCircle,
  MapPin,
  Clock,
  Palette,
  BarChart3,
  Shield,
  Headphones,
  Code,
  Search,
};
import Image from "next/image";
import { useFeaturedJobs } from "@/hooks/useFeaturedJobs";
import { useCategories } from "@/hooks/useCategories";
import { useJobPosts } from "@/hooks/useJobPosts";
import { useCompanies } from "@/hooks/useCompanies";
import { useReviews } from "@/hooks/useReviews";
import { Company } from "@/types/Company";
import { Review } from "@/types/Review";
import { useMemo } from "react";

// Mock data
// const featuredJobs = [
//   {
//     id: 1,
//     title: "Senior Frontend Developer",
//     company: "TechCorp Vietnam",
//     logo: "/placeholder.svg?height=60&width=60",
//     location: "Hồ Chí Minh",
//     salary: "$1,500 - $2,500",
//     type: "Full-time",
//     tags: ["React", "TypeScript", "Next.js"],
//     postedDays: 2,
//     applicants: 45,
//   },
//   {
//     id: 2,
//     title: "Backend Developer",
//     company: "StartupXYZ",
//     logo: "/placeholder.svg?height=60&width=60",
//     location: "Hà Nội",
//     salary: "$1,200 - $2,000",
//     type: "Full-time",
//     tags: ["Node.js", "MongoDB", "Express"],
//     postedDays: 1,
//     applicants: 32,
//   },
//   {
//     id: 3,
//     title: "UI/UX Designer",
//     company: "Design Studio",
//     logo: "/placeholder.svg?height=60&width=60",
//     location: "Đà Nẵng",
//     salary: "$800 - $1,500",
//     type: "Full-time",
//     tags: ["Figma", "Adobe XD", "Sketch"],
//     postedDays: 3,
//     applicants: 28,
//   },
//   {
//     id: 4,
//     title: "DevOps Engineer",
//     company: "CloudTech",
//     logo: "/placeholder.svg?height=60&width=60",
//     location: "Remote",
//     salary: "$2,000 - $3,000",
//     type: "Full-time",
//     tags: ["AWS", "Docker", "Kubernetes"],
//     postedDays: 1,
//     applicants: 18,
//   },
//   {
//     id: 5,
//     title: "Product Manager",
//     company: "InnovateCorp",
//     logo: "/placeholder.svg?height=60&width=60",
//     location: "Hồ Chí Minh",
//     salary: "$1,800 - $2,800",
//     type: "Full-time",
//     tags: ["Product Strategy", "Agile", "Analytics"],
//     postedDays: 4,
//     applicants: 22,
//   },
//   {
//     id: 6,
//     title: "Mobile Developer",
//     company: "AppFactory",
//     logo: "/placeholder.svg?height=60&width=60",
//     location: "Hà Nội",
//     salary: "$1,300 - $2,200",
//     type: "Full-time",
//     tags: ["React Native", "Flutter", "iOS"],
//     postedDays: 2,
//     applicants: 35,
//   },
// ];

// const jobCategories = [
//   {
//     name: "Công nghệ thông tin",
//     icon: Code,
//     jobs: 1234,
//     color: "bg-blue-100 text-blue-600",
//   },
//   {
//     name: "Thiết kế",
//     icon: Palette,
//     jobs: 567,
//     color: "bg-purple-100 text-purple-600",
//   },
//   {
//     name: "Marketing",
//     icon: BarChart3,
//     jobs: 890,
//     color: "bg-green-100 text-green-600",
//   },
//   {
//     name: "Tài chính",
//     icon: DollarSign,
//     jobs: 432,
//     color: "bg-yellow-100 text-yellow-600",
//   },
//   {
//     name: "Nhân sự",
//     icon: Users,
//     jobs: 321,
//     color: "bg-pink-100 text-pink-600",
//   },
//   {
//     name: "Bán hàng",
//     icon: TrendingUp,
//     jobs: 654,
//     color: "bg-orange-100 text-orange-600",
//   },
//   {
//     name: "Bảo mật",
//     icon: Shield,
//     jobs: 234,
//     color: "bg-red-100 text-red-600",
//   },
//   {
//     name: "Hỗ trợ khách hàng",
//     icon: Headphones,
//     jobs: 345,
//     color: "bg-indigo-100 text-indigo-600",
//   },
// ];

// const topCompanies = [
//   {
//     name: "TechCorp Vietnam",
//     logo: "/placeholder.svg?height=80&width=80",
//     employees: "200-500",
//     openJobs: 15,
//     rating: 4.8,
//   },
//   {
//     name: "StartupXYZ",
//     logo: "/placeholder.svg?height=80&width=80",
//     employees: "50-100",
//     openJobs: 8,
//     rating: 4.6,
//   },
//   {
//     name: "Design Studio",
//     logo: "/placeholder.svg?height=80&width=80",
//     employees: "20-50",
//     openJobs: 5,
//     rating: 4.9,
//   },
//   {
//     name: "CloudTech",
//     logo: "/placeholder.svg?height=80&width=80",
//     employees: "100-200",
//     openJobs: 12,
//     rating: 4.7,
//   },
//   {
//     name: "InnovateCorp",
//     logo: "/placeholder.svg?height=80&width=80",
//     employees: "500+",
//     openJobs: 25,
//     rating: 4.5,
//   },
//   {
//     name: "AppFactory",
//     logo: "/placeholder.svg?height=80&width=80",
//     employees: "100-200",
//     openJobs: 10,
//     rating: 4.8,
//   },
// ];

function getTopCompanies(companies: Company[], reviews: Review[], topN = 6) {
  // Tạo map companyId -> [review...]
  const reviewMap = reviews.reduce((acc, review) => {
    if (!acc[review.companyId]) acc[review.companyId] = [];
    acc[review.companyId].push(review.rating);
    return acc;
  }, {} as Record<string, number[]>);

  // Gắn rating trung bình vào từng công ty
  const companiesWithRating = companies.map((company) => {
    const companyId = String(company.id); // Đảm bảo là string
    const ratings = reviewMap[companyId] || [];
    const avgRating =
      ratings.length > 0
        ? ratings.reduce((a, b) => a + b, 0) / ratings.length
        : 0;
    return { ...company, avgRating, reviewCount: ratings.length };
  });

  // Sắp xếp theo rating giảm dần, lấy topN
  return companiesWithRating
    .sort((a, b) => b.avgRating - a.avgRating)
    .slice(0, topN);
}
export default function HomepageContent() {
  const { jobs: featuredJobs, loading } = useFeaturedJobs();
  const { categories, loading: loadingCategories } = useCategories();
  const { jobPosts } = useJobPosts();
  const { companies, loading: loadingCompanies } = useCompanies();
  const { reviews, loading: loadingReviews } = useReviews();
  const topCompanies = useMemo(
    () => getTopCompanies(companies, reviews, 6),
    [companies, reviews]
  );
  // Tính số lượng jobs cho từng category

  const categoriesWithJobs = categories.map((category) => ({
    ...category,
    jobs: jobPosts.filter((job) => job.categoryName === category.name).length,
  }));

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-100 py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Tìm công việc <span className="text-blue-600">mơ ước</span> của bạn
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Khám phá hàng nghìn cơ hội việc làm từ các công ty hàng đầu. Bắt đầu
            hành trình sự nghiệp của bạn ngay hôm nay.
          </p>

          {/* Search Bar */}
          <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-4 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-2">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Tìm kiếm công việc, công ty..."
                    className="pl-10 border-0 focus:ring-0"
                  />
                </div>
              </div>
              <div>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Địa điểm"
                    className="pl-10 border-0 focus:ring-0"
                  />
                </div>
              </div>
              <Button size="lg" className="w-full">
                Tìm kiếm
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-2xl mx-auto">
            <div>
              <div className="text-3xl font-bold text-blue-600">10K+</div>
              <div className="text-gray-600">Việc làm</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-600">5K+</div>
              <div className="text-gray-600">Công ty</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-600">50K+</div>
              <div className="text-gray-600">Ứng viên</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-600">95%</div>
              <div className="text-gray-600">Thành công</div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Jobs */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Việc làm nổi bật
              </h2>
              <p className="text-gray-600">
                Khám phá những cơ hội việc làm tốt nhất
              </p>
            </div>
            <Button variant="outline">
              Xem tất cả <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>

          {loading ? (
            <p>Đang tải việc làm nổi bật...</p>
          ) : featuredJobs.length === 0 ? (
            <p>Không có việc làm nổi bật nào vào lúc này.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredJobs.slice(0, 9).map((job) => (
                <Card
                  key={job.id}
                  className="hover:shadow-lg transition-shadow cursor-pointer"
                >
                  <CardContent className="p-6">
                    {/* Render thông tin job từ API */}
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
                        {job.salary}
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
      </section>

      {/* Job Categories */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Danh mục việc làm
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Khám phá các lĩnh vực nghề nghiệp phổ biến và tìm kiếm cơ hội phù
              hợp với bạn
            </p>
          </div>

          {loadingCategories ? (
            <p>Đang tải danh mục...</p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {categoriesWithJobs.map((category) => {
                const IconComponent = category.icon
                  ? iconMap[category.icon]
                  : undefined;
                return (
                  <Card
                    key={category.name}
                    className="hover:shadow-lg transition-shadow cursor-pointer"
                  >
                    <CardContent className="p-6 text-center">
                      <div
                        className={`w-16 h-16 rounded-full ${category.color} flex items-center justify-center mx-auto mb-4`}
                      >
                        {IconComponent ? (
                          <IconComponent className="h-8 w-8" />
                        ) : null}
                      </div>
                      <h3 className="font-semibold mb-2">{category.name}</h3>
                      <p className="text-sm text-gray-600">
                        {category.jobs.toLocaleString()} việc làm
                      </p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Top Companies */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Công ty hàng đầu
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Làm việc cùng những công ty uy tín và phát triển sự nghiệp của bạn
            </p>
          </div>

          {loadingCompanies || loadingReviews ? (
            <p>Đang tải...</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {topCompanies.map((company) => (
                <Card
                  key={company.id}
                  className="hover:shadow-lg transition-shadow cursor-pointer"
                >
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4 mb-4">
                      <Image
                        src={company.logo || "/placeholder.svg"}
                        alt={company.name}
                        width={60}
                        height={60}
                        className="rounded-lg border"
                      />
                      <div>
                        <h3 className="font-semibold text-lg">
                          {company.name}
                        </h3>
                        <div className="flex items-center text-sm text-gray-600">
                          <Users className="h-4 w-4 mr-1" />
                          {company.employees} nhân viên
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="text-sm text-gray-600">
                          Đang tuyển:{" "}
                        </span>
                        <span className="font-semibold text-blue-600">
                          {company.openJobs} vị trí
                        </span>
                      </div>
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="ml-1 text-sm font-semibold">
                          {company.avgRating.toFixed(1)}
                        </span>
                        <span className="ml-1 text-xs text-gray-500">
                          ({company.reviewCount} đánh giá)
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 bg-blue-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Tại sao chọn IT Job?
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Chúng tôi cam kết mang đến trải nghiệm tuyển dụng tốt nhất cho cả
              ứng viên và nhà tuyển dụng
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Xác thực công ty</h3>
              <p className="text-gray-600">
                Tất cả công ty đều được xác thực kỹ lưỡng để đảm bảo tính chính
                xác và uy tín
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Hỗ trợ 24/7</h3>
              <p className="text-gray-600">
                Đội ngũ hỗ trợ chuyên nghiệp luôn sẵn sàng giúp đỡ bạn trong quá
                trình tìm việc
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">
                Tỷ lệ thành công cao
              </h3>
              <p className="text-gray-600">
                95% ứng viên tìm được việc làm phù hợp trong vòng 30 ngày đầu
                tiên
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Đăng ký nhận thông tin việc làm mới
          </h2>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
            Nhận thông báo về những cơ hội việc làm phù hợp với bạn qua email
            hàng tuần
          </p>
          <div className="max-w-md mx-auto flex gap-4">
            <Input
              placeholder="Nhập email của bạn"
              className="bg-white text-gray-900"
            />
            <Button>Đăng ký</Button>
          </div>
        </div>
      </section>
    </div>
  );
}
