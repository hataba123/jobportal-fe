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
  Calendar,
  Clock,
  Eye,
  Heart,
  Share2,
  ArrowRight,
  TrendingUp,
  Building2,
  Users,
  Briefcase,
  Code,
  Lightbulb,
  Target,
} from "lucide-react";
import Image from "next/image";

// Mock data for blog posts
const blogPosts = [
  {
    id: 1,
    title: "10 Kỹ năng lập trình viên cần có trong năm 2024",
    excerpt:
      "Khám phá những kỹ năng quan trọng nhất mà mọi lập trình viên cần phát triển để thành công trong thị trường công nghệ hiện tại.",
    content:
      "Trong thế giới công nghệ đang phát triển nhanh chóng, việc cập nhật và phát triển kỹ năng là điều cần thiết...",
    author: {
      name: "Nguyễn Văn Tech",
      avatar: "/placeholder.svg?height=40&width=40",
      role: "Senior Developer",
    },
    category: "Kỹ năng",
    tags: ["Programming", "Skills", "Career"],
    publishedAt: "2024-01-15",
    readTime: "8 phút đọc",
    views: 2340,
    likes: 156,
    featured: true,
    image: "/placeholder.svg?height=400&width=600",
  },
  {
    id: 2,
    title: "Xu hướng tuyển dụng IT 2024: Những gì nhà tuyển dụng đang tìm kiếm",
    excerpt:
      "Phân tích chi tiết về xu hướng tuyển dụng trong ngành IT và những yêu cầu mới từ các nhà tuyển dụng hàng đầu.",
    content:
      "Thị trường tuyển dụng IT năm 2024 đang chứng kiến nhiều thay đổi đáng kể...",
    author: {
      name: "Trần Thị HR",
      avatar: "/placeholder.svg?height=40&width=40",
      role: "HR Manager",
    },
    category: "Tuyển dụng",
    tags: ["Recruitment", "Trends", "HR"],
    publishedAt: "2024-01-12",
    readTime: "6 phút đọc",
    views: 1890,
    likes: 98,
    featured: true,
    image: "/placeholder.svg?height=400&width=600",
  },
  {
    id: 3,
    title: "Làm thế nào để viết CV IT thu hút nhà tuyển dụng",
    excerpt:
      "Hướng dẫn chi tiết cách tạo một CV IT ấn tượng, từ cấu trúc đến nội dung, giúp bạn nổi bật trong mắt nhà tuyển dụng.",
    content: "Một CV tốt là chìa khóa mở cửa cho cơ hội nghề nghiệp của bạn...",
    author: {
      name: "Lê Văn Career",
      avatar: "/placeholder.svg?height=40&width=40",
      role: "Career Coach",
    },
    category: "Nghề nghiệp",
    tags: ["CV", "Career", "Tips"],
    publishedAt: "2024-01-10",
    readTime: "10 phút đọc",
    views: 3210,
    likes: 234,
    featured: false,
    image: "/placeholder.svg?height=400&width=600",
  },
  {
    id: 4,
    title: "Remote Work: Bí quyết làm việc hiệu quả từ xa",
    excerpt:
      "Chia sẻ kinh nghiệm và mẹo hay để duy trì hiệu suất làm việc cao khi làm việc từ xa trong ngành IT.",
    content:
      "Làm việc từ xa đã trở thành xu hướng phổ biến trong ngành công nghệ...",
    author: {
      name: "Phạm Thị Remote",
      avatar: "/placeholder.svg?height=40&width=40",
      role: "Product Manager",
    },
    category: "Làm việc",
    tags: ["Remote", "Productivity", "Work-Life"],
    publishedAt: "2024-01-08",
    readTime: "7 phút đọc",
    views: 1560,
    likes: 89,
    featured: false,
    image: "/placeholder.svg?height=400&width=600",
  },
  {
    id: 5,
    title:
      "Startup vs Công ty lớn: Nên chọn môi trường nào để phát triển sự nghiệp?",
    excerpt:
      "So sánh ưu nhược điểm của việc làm tại startup và công ty lớn, giúp bạn đưa ra quyết định phù hợp với mục tiêu nghề nghiệp.",
    content:
      "Lựa chọn môi trường làm việc là một quyết định quan trọng trong sự nghiệp...",
    author: {
      name: "Hoàng Văn Startup",
      avatar: "/placeholder.svg?height=40&width=40",
      role: "Entrepreneur",
    },
    category: "Nghề nghiệp",
    tags: ["Startup", "Career", "Choice"],
    publishedAt: "2024-01-05",
    readTime: "9 phút đọc",
    views: 2100,
    likes: 145,
    featured: false,
    image: "/placeholder.svg?height=400&width=600",
  },
  {
    id: 6,
    title: "AI và Machine Learning: Cơ hội nghề nghiệp trong tương lai",
    excerpt:
      "Khám phá các cơ hội nghề nghiệp mới trong lĩnh vực AI và Machine Learning, cùng với những kỹ năng cần thiết để thành công.",
    content:
      "Trí tuệ nhân tạo và Machine Learning đang tạo ra cuộc cách mạng trong nhiều ngành...",
    author: {
      name: "Vũ Thị AI",
      avatar: "/placeholder.svg?height=40&width=40",
      role: "AI Researcher",
    },
    category: "Công nghệ",
    tags: ["AI", "Machine Learning", "Future"],
    publishedAt: "2024-01-03",
    readTime: "12 phút đọc",
    views: 2890,
    likes: 198,
    featured: false,
    image: "/placeholder.svg?height=400&width=600",
  },
  {
    id: 7,
    title: "Phỏng vấn IT: Những câu hỏi thường gặp và cách trả lời ấn tượng",
    excerpt:
      "Tổng hợp các câu hỏi phỏng vấn phổ biến trong ngành IT và hướng dẫn cách trả lời để tạo ấn tượng tốt với nhà tuyển dụng.",
    content: "Phỏng vấn là bước quan trọng trong quá trình tuyển dụng...",
    author: {
      name: "Đỗ Văn Interview",
      avatar: "/placeholder.svg?height=40&width=40",
      role: "Technical Lead",
    },
    category: "Phỏng vấn",
    tags: ["Interview", "Tips", "Preparation"],
    publishedAt: "2024-01-01",
    readTime: "11 phút đọc",
    views: 1750,
    likes: 112,
    featured: false,
    image: "/placeholder.svg?height=400&width=600",
  },
  {
    id: 8,
    title: "Salary Negotiation: Nghệ thuật thương lượng mức lương hiệu quả",
    excerpt:
      "Hướng dẫn chi tiết cách thương lượng mức lương một cách chuyên nghiệp và hiệu quả trong ngành IT.",
    content:
      "Thương lượng mức lương là một kỹ năng quan trọng mà mọi IT professional cần có...",
    author: {
      name: "Bùi Thị Salary",
      avatar: "/placeholder.svg?height=40&width=40",
      role: "Compensation Specialist",
    },
    category: "Lương thưởng",
    tags: ["Salary", "Negotiation", "Career"],
    publishedAt: "2023-12-28",
    readTime: "8 phút đọc",
    views: 2650,
    likes: 187,
    featured: false,
    image: "/placeholder.svg?height=400&width=600",
  },
];

const categories = [
  { name: "Tất cả", count: blogPosts.length, icon: Target },
  { name: "Kỹ năng", count: 15, icon: Code },
  { name: "Nghề nghiệp", count: 23, icon: Briefcase },
  { name: "Tuyển dụng", count: 18, icon: Users },
  { name: "Công nghệ", count: 12, icon: Lightbulb },
  { name: "Làm việc", count: 8, icon: Building2 },
];

const popularTags = [
  "Programming",
  "Career",
  "Remote",
  "AI",
  "Interview",
  "Salary",
  "Skills",
  "Startup",
  "Tips",
  "Future",
];

const featuredAuthors = [
  {
    name: "Nguyễn Văn Tech",
    avatar: "/placeholder.svg?height=60&width=60",
    role: "Senior Developer",
    posts: 12,
    followers: "2.3K",
  },
  {
    name: "Trần Thị HR",
    avatar: "/placeholder.svg?height=60&width=60",
    role: "HR Manager",
    posts: 8,
    followers: "1.8K",
  },
  {
    name: "Lê Văn Career",
    avatar: "/placeholder.svg?height=60&width=60",
    role: "Career Coach",
    posts: 15,
    followers: "3.1K",
  },
];

export default function BlogPage() {
  const featuredPosts = blogPosts.filter((post) => post.featured);
  const regularPosts = blogPosts.filter((post) => !post.featured);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-100 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Blog IT Job
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
              Khám phá những insights mới nhất về thị trường IT, kỹ năng nghề
              nghiệp và xu hướng công nghệ
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-4">
              <div className="flex gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Tìm kiếm bài viết..."
                    className="pl-10 border-0 focus:ring-0"
                  />
                </div>
                <Select>
                  <SelectTrigger className="w-48 border-0">
                    <SelectValue placeholder="Danh mục" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem
                        key={category.name}
                        value={category.name.toLowerCase()}
                      >
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button size="lg">Tìm kiếm</Button>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">150+</div>
              <div className="text-gray-600">Bài viết</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">25+</div>
              <div className="text-gray-600">Tác giả</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">50K+</div>
              <div className="text-gray-600">Lượt đọc</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">10K+</div>
              <div className="text-gray-600">Subscribers</div>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Featured Posts */}
            <section className="mb-12">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-gray-900">
                  Bài viết nổi bật
                </h2>
                <Badge className="bg-red-100 text-red-800">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  Hot
                </Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {featuredPosts.map((post) => (
                  <Card
                    key={post.id}
                    className="overflow-hidden hover:shadow-xl transition-shadow group cursor-pointer"
                  >
                    <div className="relative">
                      <Image
                        src={post.image || "/placeholder.svg"}
                        alt={post.title}
                        width={600}
                        height={300}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-4 left-4">
                        <Badge className="bg-blue-600 text-white">
                          {post.category}
                        </Badge>
                      </div>
                    </div>
                    <CardContent className="p-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                        {post.title}
                      </h3>
                      <p className="text-gray-600 mb-4 line-clamp-3">
                        {post.excerpt}
                      </p>

                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <Image
                            src={post.author.avatar || "/placeholder.svg"}
                            alt={post.author.name}
                            width={32}
                            height={32}
                            className="rounded-full"
                          />
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {post.author.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              {post.author.role}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <div className="flex items-center">
                            <Eye className="h-4 w-4 mr-1" />
                            {post.views.toLocaleString()}
                          </div>
                          <div className="flex items-center">
                            <Heart className="h-4 w-4 mr-1" />
                            {post.likes}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            {new Date(post.publishedAt).toLocaleDateString(
                              "vi-VN"
                            )}
                          </div>
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-1" />
                            {post.readTime}
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-blue-600 hover:text-blue-700"
                        >
                          Đọc tiếp <ArrowRight className="h-4 w-4 ml-1" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>

            {/* All Posts */}
            <section>
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-gray-900">
                  Tất cả bài viết
                </h2>
                <div className="flex items-center space-x-4">
                  <Select>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Sắp xếp" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="newest">Mới nhất</SelectItem>
                      <SelectItem value="popular">Phổ biến</SelectItem>
                      <SelectItem value="trending">Trending</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-8">
                {regularPosts.map((post) => (
                  <Card
                    key={post.id}
                    className="overflow-hidden hover:shadow-lg transition-shadow group cursor-pointer"
                  >
                    <div className="md:flex">
                      <div className="md:w-1/3">
                        <Image
                          src={post.image || "/placeholder.svg"}
                          alt={post.title}
                          width={400}
                          height={250}
                          className="w-full h-48 md:h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <CardContent className="md:w-2/3 p-6">
                        <div className="flex items-center space-x-2 mb-3">
                          <Badge variant="outline">{post.category}</Badge>
                          <div className="flex flex-wrap gap-1">
                            {post.tags.slice(0, 2).map((tag) => (
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

                        <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                          {post.title}
                        </h3>
                        <p className="text-gray-600 mb-4 line-clamp-2">
                          {post.excerpt}
                        </p>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <Image
                              src={post.author.avatar || "/placeholder.svg"}
                              alt={post.author.name}
                              width={32}
                              height={32}
                              className="rounded-full"
                            />
                            <div>
                              <p className="text-sm font-medium text-gray-900">
                                {post.author.name}
                              </p>
                              <div className="flex items-center space-x-4 text-xs text-gray-500">
                                <span>
                                  {new Date(
                                    post.publishedAt
                                  ).toLocaleDateString("vi-VN")}
                                </span>
                                <span>{post.readTime}</span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-3 text-sm text-gray-500">
                              <div className="flex items-center">
                                <Eye className="h-4 w-4 mr-1" />
                                {post.views.toLocaleString()}
                              </div>
                              <div className="flex items-center">
                                <Heart className="h-4 w-4 mr-1" />
                                {post.likes}
                              </div>
                            </div>
                            <Button variant="ghost" size="sm">
                              <Share2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </div>
                  </Card>
                ))}
              </div>

              {/* Load More */}
              <div className="text-center mt-12">
                <Button variant="outline" size="lg">
                  Xem thêm bài viết
                </Button>
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Categories */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Danh mục</h3>
                <div className="space-y-3">
                  {categories.map((category) => {
                    const IconComponent = category.icon;
                    return (
                      <div
                        key={category.name}
                        className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                      >
                        <div className="flex items-center space-x-3">
                          <IconComponent className="h-4 w-4 text-gray-500" />
                          <span className="text-sm font-medium">
                            {category.name}
                          </span>
                        </div>
                        <Badge variant="secondary" className="text-xs">
                          {category.count}
                        </Badge>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Popular Tags */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Tags phổ biến</h3>
                <div className="flex flex-wrap gap-2">
                  {popularTags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="outline"
                      className="cursor-pointer hover:bg-blue-50 hover:text-blue-600 transition-colors"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Featured Authors */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Tác giả nổi bật</h3>
                <div className="space-y-4">
                  {featuredAuthors.map((author) => (
                    <div
                      key={author.name}
                      className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                    >
                      <Image
                        src={author.avatar || "/placeholder.svg"}
                        alt={author.name}
                        width={48}
                        height={48}
                        className="rounded-full"
                      />
                      <div className="flex-1">
                        <p className="font-medium text-sm">{author.name}</p>
                        <p className="text-xs text-gray-500">{author.role}</p>
                        <div className="flex items-center space-x-3 text-xs text-gray-500 mt-1">
                          <span>{author.posts} bài viết</span>
                          <span>{author.followers} followers</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Newsletter */}
            <Card className="bg-gradient-to-br from-blue-50 to-indigo-100">
              <CardContent className="p-6 text-center">
                <h3 className="text-lg font-semibold mb-2">
                  Đăng ký Newsletter
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Nhận những bài viết mới nhất về IT và nghề nghiệp
                </p>
                <div className="space-y-3">
                  <Input placeholder="Email của bạn" />
                  <Button className="w-full">Đăng ký ngay</Button>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Hơn 10,000 người đã đăng ký
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
