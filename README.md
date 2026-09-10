# JobPortal Frontend

Ứng dụng web Next.js của hệ thống JobPortal. Frontend cung cấp giao diện cho ứng viên, nhà tuyển dụng và quản trị viên, đồng thời kết nối tới backend qua lớp proxy `/api/backend/*`.

| Thông tin | Giá trị |
| --- | --- |
| Framework | Next.js 15 (App Router) |
| Ngôn ngữ | TypeScript |
| UI | React 19, Tailwind CSS 4, Radix UI, Flowbite |
| Xác thực | NextAuth |
| Đa ngôn ngữ | `en`, `vi` với `next-intl` |
| HTTP client | Axios |
| State và form | Zustand, React Hook Form |
| Cổng mặc định | `3000` |

## Chức năng theo vai trò

### Khách và ứng viên

- Trang chủ, tìm kiếm và lọc việc làm.
- Xem công ty, danh mục, blog và đánh giá.
- Đăng ký, đăng nhập, OAuth, quên/đặt lại mật khẩu.
- Quản lý hồ sơ, CV, việc làm đã lưu và lịch sử ứng tuyển.
- Theo dõi thông báo và kết quả matching việc làm.

### Nhà tuyển dụng

- Dashboard và thống kê tuyển dụng.
- Quản lý công ty và tin tuyển dụng.
- Xem, tìm kiếm ứng viên và quản lý đơn ứng tuyển.
- Theo dõi matching, thông báo, gói dịch vụ và credit.
- Danh sách công ty dùng phân trang, lọc và tổng số bản ghi từ server.

### Quản trị viên

- Dashboard quản trị.
- Quản lý người dùng, công ty, tin tuyển dụng và đơn ứng tuyển.
- Kiểm duyệt đánh giá, thông báo và trạng thái xác minh công ty.
- Quản lý gói dịch vụ.

## Luồng kết nối backend

```text
Trình duyệt
    │
    ├── /api/backend/*  ──>  Next.js Route Handler  ──>  BACKEND_API_URL
    │
    └── /api/auth/*      ──>  NextAuth
```

Ở phía trình duyệt, Axios dùng `/api/backend` để request đi qua Next.js. Ở phía server, Axios dùng trực tiếp `BACKEND_API_URL`. Backend canonical của frontend là ASP.NET Core 8 + SQL Server, chạy local tại `http://localhost:5042/api`. NestJS/PostgreSQL chỉ được giữ như implementation legacy/reference và không nhận feature mới.

## Cấu trúc thư mục

```text
src/
├── app/
│   ├── [locale]/        # Route theo ngôn ngữ
│   │   ├── admin/       # Khu vực quản trị
│   │   ├── candidate/   # Khu vực ứng viên
│   │   └── recruiter/   # Khu vực nhà tuyển dụng
│   ├── api/
│   │   ├── auth/        # NextAuth
│   │   └── backend/     # Proxy tới backend API
│   └── globals.css
├── components/          # UI dùng chung và theo nghiệp vụ
├── contexts/            # Context ứng dụng và xác thực
├── hooks/               # React hooks
├── i18n/                # Cấu hình next-intl
├── lib/api/             # Client cho từng nhóm API
├── types/               # TypeScript types
└── utils/               # Hàm tiện ích
messages/
├── en.json
└── vi.json
public/                  # Ảnh và tài nguyên tĩnh
```

## Yêu cầu môi trường

- Node.js 20 trở lên.
- npm 10 trở lên.
- Một backend tương thích đang chạy.
- Git.

## Cài đặt và chạy local

### 1. Lấy mã nguồn

```bash
git clone https://github.com/hataba123/jobportal-fe.git
cd jobportal-fe
npm ci
```

### 2. Cấu hình biến môi trường

Tạo `.env.local` từ `.env.example`:

```bash
cp .env.example .env.local
```

PowerShell:

```powershell
Copy-Item .env.example .env.local
```

| Biến | Bắt buộc | Mô tả |
| --- | --- | --- |
| `BACKEND_API_URL` | Có | URL API ASP.NET Core canonical, ví dụ `http://localhost:5042/api` |
| `NEXTAUTH_URL` | Có | URL frontend, local là `http://localhost:3000` |
| `NEXTAUTH_SECRET` | Có | Secret dùng để mã hóa session NextAuth |
| `OAUTH_EXCHANGE_SECRET` | Có | Phải trùng secret tương ứng ở backend |

Không dùng tiền tố `NEXT_PUBLIC_` cho các secret ở trên. Không commit `.env.local`.

### 3. Khởi động development server

```bash
npm run dev
```

Mở <http://localhost:3000>. Các route hỗ trợ ngôn ngữ:

- <http://localhost:3000/en>
- <http://localhost:3000/vi>

Ngôn ngữ mặc định trong cấu hình hiện tại là `en`.

## Chạy bằng Docker Compose

Compose canonical đặt ở repository backend `JobPortalApi`, vì nó kết nối cùng lúc frontend, ASP.NET Core API và SQL Server:

```bash
cd ../JobPortalApi
cp .env.example .env
# điền các biến bắt buộc trong .env
docker compose up --build
```

Frontend chạy ở cổng `3000`. Trong canonical Compose, container frontend gọi backend qua `http://aspnet-api:8080/api`; API gọi SQL Server qua service name `sqlserver`, không dùng `localhost` giữa các container. Named volume `cv-data` giữ dữ liệu CV private và `sqlserver-data` giữ dữ liệu SQL Server.

File `jobportal-fe/docker-compose.yml` chỉ dùng khi chạy frontend độc lập. Khi đó phải cung cấp rõ `BACKEND_API_URL` tới backend có thể truy cập được; không có giá trị mặc định dùng `host.docker.internal`.

`docker compose config` đã được kiểm tra ở local; build image, startup, healthcheck và persistence cần Docker Desktop daemon đang chạy mới có thể xác minh đầy đủ.

## Lệnh phát triển

| Lệnh | Mục đích |
| --- | --- |
| `npm run dev` | Chạy Next.js development mode với Turbopack |
| `npm run build` | Build production |
| `npm run start` | Chạy production build |
| `npm run lint` | Chạy kiểm tra lint theo script của repository |
| `npm run contract:test` | Kiểm tra contract giữa frontend và backend |

Trước khi mở Pull Request nên chạy:

```bash
npm run build
npm run contract:test
```

## Đa ngôn ngữ

- Bản dịch nằm trong `messages/en.json` và `messages/vi.json`.
- Route nghiệp vụ nằm dưới `src/app/[locale]`.
- Khi thêm text hiển thị, cập nhật cả hai file dịch để tránh thiếu khóa ở một ngôn ngữ.

## Bảo mật và triển khai

- `NEXTAUTH_SECRET` và `OAUTH_EXCHANGE_SECRET` phải là secret ngẫu nhiên, khác nhau giữa development và production.
- Chỉ backend được phép nhận các secret; không đưa secret vào client bundle.
- Cấu hình `BACKEND_API_URL` theo network thực tế khi chạy Docker hoặc triển khai cloud.
- Kiểm tra CORS ở backend khi frontend dùng domain mới.
- Không commit `.env.local`, token, cookie, CV hoặc dữ liệu người dùng.
- BFF giữ các secret server-side; browser gọi `/api/backend/*` thay vì truy cập trực tiếp API nội bộ.

## Liên kết các thành phần

- API canonical: ASP.NET Core 8 + SQL Server: <https://github.com/hataba123/JobPortalApi>
- Backend NestJS/PostgreSQL: legacy/reference, không phát triển feature mới: <https://github.com/hataba123/jobportal-be>

## Đóng góp

1. Tạo branch theo tính năng hoặc bug cần xử lý.
2. Giữ component, API client và bản dịch ở đúng khu vực của chúng.
3. Chạy build và contract test trước khi mở Pull Request.
4. Dùng commit message theo quy ước `feat:`, `fix:`, `docs:`, `test:` hoặc `chore:`.
