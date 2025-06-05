✅ 1. Server Components (chạy trên server, nhẹ, tối ưu SEO)
Server Components nên dùng cho:

Trang tĩnh hoặc dữ liệu không cần tương tác nhiều.

Fetching dữ liệu từ backend để hiển thị (SSR).

Các phần không cần dùng trạng thái (state), event handler, useEffect,...

🧩 Ví dụ Server Components:
| Component             | Vai trò                        | Ghi chú                             |
| --------------------- | ------------------------------ | ----------------------------------- |
| `JobListPage.tsx`     | Danh sách job tổng (home page) | Gọi API hiển thị việc làm           |
| `JobDetails.tsx`      | Chi tiết 1 job                 | Gọi API job theo slug/id            |
| `CompanyProfile.tsx`  | Trang công ty tuyển dụng       | Hiển thị tĩnh                       |
| `CandidateList.tsx`   | Admin xem danh sách ứng viên   | Nếu không có nhiều tương tác        |
| `SearchResults.tsx`   | Kết quả tìm kiếm việc làm      | Có thể server-side nếu chỉ hiển thị |
| `CategorySidebar.tsx` | Lọc theo ngành nghề            | Nếu không cần tương tác JS          |
| `Navbar.tsx`          | Thanh điều hướng chính         | Nếu không có toggle hoặc login menu |


✅ 2. Client Components (chạy trên trình duyệt – cần JS)
Client Components nên dùng cho:

Các thành phần cần tương tác: form, nút bấm, modals...

Các phần dùng useState, useEffect, onClick, animations.

Upload file, xử lý input động.

🧩 Ví dụ Client Components:
| Component                            | Vai trò                               | Ghi chú                          |
| ------------------------------------ | ------------------------------------- | -------------------------------- |
| `JobFilter.tsx`                      | Bộ lọc động (lương, vị trí, loại job) | Cần `useState`, lọc client       |
| `ApplyJobForm.tsx`                   | Form nộp đơn ứng tuyển                | Gửi dữ liệu + validation         |
| `LoginForm.tsx` / `RegisterForm.tsx` | Đăng nhập, đăng ký                    | Có form input                    |
| `ProfileEditForm.tsx`                | Sửa thông tin cá nhân                 | Có nhiều input và state          |
| `BookmarkButton.tsx`                 | Lưu job                               | Tương tác API, toggle trạng thái |
| `ThemeToggle.tsx`                    | Đổi dark/light mode                   | Trạng thái toàn cục              |
| `NotificationBell.tsx`               | Hiển thị thông báo realtime           | Có thể dùng WebSocket            |
| `ChatBox.tsx`                        | Giao tiếp giữa recruiter và candidate | Cần WebSocket, event             |
