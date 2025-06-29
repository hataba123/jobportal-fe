-- Blog System Mock Data for SQL Server
USE [JobPortalDB]
GO

-- Insert Blog Authors
INSERT INTO BlogAuthors (Name, Avatar, Role, CreatedAt) VALUES
('Nguyễn Văn Tech', '/image/avatar.png', 'Senior Developer', GETUTCDATE()),
('Trần Thị HR', '/image/avatar.png', 'HR Manager', GETUTCDATE()),
('Lê Văn Career', '/image/avatar.png', 'Career Coach', GETUTCDATE()),
('Phạm Thị Remote', '/image/avatar.png', 'Product Manager', GETUTCDATE()),
('Hoàng Văn Startup', '/image/avatar.png', 'Entrepreneur', GETUTCDATE());

-- Insert Blog Categories
INSERT INTO BlogCategories (Name, Description, CreatedAt) VALUES
('Kỹ năng', 'Các kỹ năng cần thiết cho lập trình viên', GETUTCDATE()),
('Nghề nghiệp', 'Hướng dẫn phát triển sự nghiệp', GETUTCDATE()),
('Tuyển dụng', 'Xu hướng và tips tuyển dụng IT', GETUTCDATE()),
('Công nghệ', 'Công nghệ mới và xu hướng', GETUTCDATE()),
('Làm việc', 'Kinh nghiệm làm việc và productivity', GETUTCDATE());

-- Insert Blogs
INSERT INTO Blogs (Title, Excerpt, Content, Slug, Category, Tags, PublishedAt, ReadTime, Views, Likes, Featured, Image, CreatedAt, AuthorId) VALUES
('10 Kỹ năng lập trình viên cần có trong năm 2024', 
'Khám phá những kỹ năng quan trọng nhất mà mọi lập trình viên cần phát triển để thành công trong thị trường công nghệ hiện tại.',
'Trong thế giới công nghệ đang phát triển nhanh chóng, việc cập nhật và phát triển kỹ năng là điều cần thiết...',
'10-ky-nang-lap-trinh-vien-can-co-trong-nam-2024',
'Kỹ năng',
'["Programming", "Skills", "Career"]',
'2024-01-15',
'8 phút đọc',
2340,
156,
1,
'/image/Image.jpg',
GETUTCDATE(),
1),

('Xu hướng tuyển dụng IT 2024: Những gì nhà tuyển dụng đang tìm kiếm',
'Phân tích chi tiết về xu hướng tuyển dụng trong ngành IT và những yêu cầu mới từ các nhà tuyển dụng hàng đầu.',
'Thị trường tuyển dụng IT năm 2024 đang chứng kiến nhiều thay đổi đáng kể...',
'xu-huong-tuyen-dung-it-2024',
'Tuyển dụng',
'["Recruitment", "Trends", "HR"]',
'2024-01-12',
'6 phút đọc',
1890,
98,
1,
'/image/Image.jpg',
GETUTCDATE(),
2),

('Làm thế nào để viết CV IT thu hút nhà tuyển dụng',
'Hướng dẫn chi tiết cách tạo một CV IT ấn tượng, từ cấu trúc đến nội dung, giúp bạn nổi bật trong mắt nhà tuyển dụng.',
'Một CV tốt là chìa khóa mở cửa cho cơ hội nghề nghiệp của bạn...',
'lam-the-nao-de-viet-cv-it-thu-hut-nha-tuyen-dung',
'Nghề nghiệp',
'["CV", "Career", "Tips"]',
'2024-01-10',
'10 phút đọc',
3210,
234,
0,
'/image/Image.jpg',
GETUTCDATE(),
3),

('Remote Work: Bí quyết làm việc hiệu quả từ xa',
'Chia sẻ kinh nghiệm và mẹo hay để duy trì hiệu suất làm việc cao khi làm việc từ xa trong ngành IT.',
'Làm việc từ xa đã trở thành xu hướng phổ biến trong ngành công nghệ...',
'remote-work-bi-quyet-lam-viec-hieu-qua-tu-xa',
'Làm việc',
'["Remote", "Productivity", "Work-Life"]',
'2024-01-08',
'7 phút đọc',
1560,
89,
0,
'/image/Image.jpg',
GETUTCDATE(),
4),

('Startup vs Công ty lớn: Nên chọn môi trường nào để phát triển sự nghiệp?',
'So sánh ưu nhược điểm của việc làm tại startup và công ty lớn, giúp bạn đưa ra quyết định phù hợp với mục tiêu nghề nghiệp.',
'Lựa chọn môi trường làm việc là một quyết định quan trọng trong sự nghiệp...',
'startup-vs-cong-ty-lon-nen-chon-moi-truong-nao',
'Nghề nghiệp',
'["Startup", "Career", "Choice"]',
'2024-01-05',
'9 phút đọc',
2100,
145,
0,
'/image/Image.jpg',
GETUTCDATE(),
5);

-- Verification
SELECT 'Total Blogs' as Metric, COUNT(*) as Count FROM Blogs
UNION ALL
SELECT 'Featured Blogs', COUNT(*) FROM Blogs WHERE Featured = 1
UNION ALL
SELECT 'Total Authors', COUNT(*) FROM BlogAuthors; 