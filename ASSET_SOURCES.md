# Nguồn asset demo

## Logo công ty

Backend seed trả về logo riêng cho từng công ty demo qua `/uploads/logo/...`:

- `JobPortal Demo Company` — `/uploads/logo/jobportal-demo.svg`
- `Microsoft Vietnam (Demo)` — `/uploads/logo/company-microsoft.svg`
- `Google Vietnam (Demo)` — `/uploads/logo/company-google.svg`
- `Amazon Web Services (Demo)` — `/uploads/logo/company-amazon.svg`
- `GitHub Vietnam (Demo)` — `/uploads/logo/company-github.svg`
- `Apple Developer (Demo)` — `/uploads/logo/company-apple.svg`

Nguồn gốc CDN và license được ghi trong tài liệu asset của từng backend. Các tên có hậu tố `(Demo)` chỉ là dữ liệu minh họa.

## Ảnh blog

Các ảnh fallback dưới đây được tải về từ Unsplash, resize/crop ở kích thước 1200px và lưu cục bộ để trang blog vẫn có hình khi backend chưa sẵn sàng:

- `public/image/blog/blog-career-profile.jpg` — [Unsplash image](https://images.unsplash.com/photo-1499750310107-5fef28a66643)
- `public/image/blog/blog-team-collaboration.jpg` — [Unsplash image](https://images.unsplash.com/photo-1521737711867-e3b97375f902)
- `public/image/blog/blog-tech-workspace.jpg` — [Unsplash image](https://images.unsplash.com/photo-1516321318423-f06f85e504b3)

Ảnh được dùng theo [Unsplash License](https://unsplash.com/license); đây là fixture nội dung cho môi trường phát triển, không phải dữ liệu người dùng.
