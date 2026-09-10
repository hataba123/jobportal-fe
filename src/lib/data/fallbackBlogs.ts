import type { Blog } from "@/types/Blog";

/** Dữ liệu hiển thị dự phòng khi backend blog chưa sẵn sàng. */
export const FALLBACK_BLOGS: Blog[] = [
  {
    id: 1,
    title: "10 Kỹ năng lập trình viên cần có trong năm 2024",
    excerpt:
      "Khám phá những kỹ năng quan trọng nhất mà mọi lập trình viên cần phát triển để thành công trong thị trường công nghệ hiện tại.",
    content:
      "Thị trường công nghệ thay đổi nhanh, vì vậy lập trình viên cần liên tục cập nhật kỹ năng chuyên môn và khả năng cộng tác. Hãy bắt đầu bằng việc củng cố nền tảng, thực hành qua dự án thực tế và chia sẻ kết quả có thể đo lường trong hồ sơ nghề nghiệp.",
    author: { name: "Nguyễn Văn Tech", avatar: "/image/avatar.png", role: "Senior Developer" },
    category: "Kỹ năng",
    tags: ["Programming", "Skills", "Career"],
    publishedAt: "2024-01-15",
    readTime: "8 phút đọc",
    views: 2340,
    likes: 156,
    featured: true,
    image: "/image/blog/blog-career-profile.jpg",
  },
  {
    id: 2,
    title: "Xu hướng tuyển dụng IT 2024: Những gì nhà tuyển dụng đang tìm kiếm",
    excerpt:
      "Phân tích chi tiết về xu hướng tuyển dụng trong ngành IT và những yêu cầu mới từ các nhà tuyển dụng hàng đầu.",
    content:
      "Nhà tuyển dụng ngày càng quan tâm đến khả năng giải quyết vấn đề, giao tiếp và thích nghi bên cạnh kỹ năng công nghệ. Một hồ sơ có dự án thực tế, số liệu rõ ràng và mục tiêu phù hợp sẽ giúp ứng viên nổi bật hơn.",
    author: { name: "Trần Thị HR", avatar: "/image/avatar.png", role: "HR Manager" },
    category: "Tuyển dụng",
    tags: ["Recruitment", "Trends", "HR"],
    publishedAt: "2024-01-12",
    readTime: "6 phút đọc",
    views: 1890,
    likes: 98,
    featured: true,
    image: "/image/blog/blog-team-collaboration.jpg",
  },
  {
    id: 3,
    title: "Làm thế nào để viết CV IT thu hút nhà tuyển dụng",
    excerpt:
      "Hướng dẫn chi tiết cách tạo một CV IT ấn tượng, từ cấu trúc đến nội dung, giúp bạn nổi bật trong mắt nhà tuyển dụng.",
    content:
      "Một CV IT hiệu quả nên ngắn gọn, tập trung vào thành tựu và thể hiện rõ công nghệ bạn đã sử dụng. Hãy điều chỉnh phần kỹ năng, dự án và kinh nghiệm theo từng mô tả công việc thay vì dùng một mẫu duy nhất cho mọi vị trí.",
    author: { name: "Lê Văn Career", avatar: "/image/avatar.png", role: "Career Coach" },
    category: "Nghề nghiệp",
    tags: ["CV", "Career", "Tips"],
    publishedAt: "2024-01-10",
    readTime: "10 phút đọc",
    views: 3210,
    likes: 234,
    featured: false,
    image: "/image/blog/blog-tech-workspace.jpg",
  },
  {
    id: 4,
    title: "Remote Work: Bí quyết làm việc hiệu quả từ xa",
    excerpt:
      "Chia sẻ kinh nghiệm và mẹo hay để duy trì hiệu suất làm việc cao khi làm việc từ xa trong ngành IT.",
    content:
      "Làm việc từ xa hiệu quả bắt đầu bằng lịch làm việc rõ ràng, không gian tập trung và cách cập nhật tiến độ minh bạch. Hãy thống nhất kênh giao tiếp, ghi lại quyết định quan trọng và chủ động báo sớm khi có trở ngại.",
    author: { name: "Phạm Thị Remote", avatar: "/image/avatar.png", role: "Product Manager" },
    category: "Làm việc",
    tags: ["Remote", "Productivity", "Work-Life"],
    publishedAt: "2024-01-08",
    readTime: "7 phút đọc",
    views: 1560,
    likes: 89,
    featured: false,
    image: "/image/blog/blog-team-collaboration.jpg",
  },
  {
    id: 5,
    title: "Startup vs Công ty lớn: Nên chọn môi trường nào để phát triển sự nghiệp?",
    excerpt:
      "So sánh ưu nhược điểm của việc làm tại startup và công ty lớn, giúp bạn đưa ra quyết định phù hợp với mục tiêu nghề nghiệp.",
    content:
      "Startup thường đem lại phạm vi trách nhiệm rộng và tốc độ học hỏi nhanh, trong khi công ty lớn có quy trình, nguồn lực và lộ trình chuyên môn rõ hơn. Hãy cân nhắc mục tiêu nghề nghiệp, phong cách làm việc và mức độ rủi ro bạn sẵn sàng chấp nhận.",
    author: { name: "Hoàng Văn Startup", avatar: "/image/avatar.png", role: "Entrepreneur" },
    category: "Nghề nghiệp",
    tags: ["Startup", "Career", "Choice"],
    publishedAt: "2024-01-05",
    readTime: "9 phút đọc",
    views: 2100,
    likes: 145,
    featured: false,
    image: "/image/blog/blog-career-profile.jpg",
  },
];
