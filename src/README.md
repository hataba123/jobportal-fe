🗂️ app
Ý nghĩa: Dùng trong cấu trúc App Router của Next.js (app/ directory feature).

Chứa: Layout, page, loading, error, server actions,...

Ví dụ:

bash
Copy
Edit
app/
├── layout.tsx
├── page.tsx
└── (route groups)
🧩 components
Ý nghĩa: Chứa các component UI tái sử dụng như Button, Card, Navbar, CompanyCard...

Vai trò: Tái sử dụng code + tách biệt UI logic.

🧠 context
Ý nghĩa: Chứa các file sử dụng React Context API để quản lý state toàn cục (VD: AuthContext, ThemeContext,...).

Vai trò: Quản lý trạng thái toàn cục mà nhiều component cần dùng.

🪝 hooks
Ý nghĩa: Chứa các custom React hooks (VD: useAuth, useFetch, useToggle...)

Vai trò: Tái sử dụng logic, viết gọn code.

🌍 i18n
Ý nghĩa: Internationalization – chứa file đa ngôn ngữ, cấu hình cho next-intl, i18next,...

Ví dụ:

pgsql
Copy
Edit
i18n/
├── en.json
└── vi.json
⚙️ lib
Ý nghĩa: Viết tắt của "library" – chứa các hàm xử lý logic riêng (không phải UI).

Vai trò: Dùng cho hàm utilities, hàm xử lý dữ liệu, API wrapper,...

Ví dụ: lib/api.ts, lib/formatDate.ts,...

🎨 styles
Ý nghĩa: Chứa các file CSS, SCSS hoặc Tailwind config tùy dự án.

Vai trò: Định nghĩa global styles, theme,...

📘 types
Ý nghĩa: Chứa các định nghĩa TypeScript (interface, type, enum).

Ví dụ: User, Job, Company,...

🧰 utils
Ý nghĩa: Chứa các hàm tiện ích nhỏ như formatCurrency, slugify, delay,...

Vai trò: Tái sử dụng logic helper.

| Thư mục       | Vai trò chính                           |
| ------------- | --------------------------------------- |
| `app/`        | Cấu trúc chính của App Router (Next.js) |
| `components/` | UI component tái sử dụng                |
| `context/`    | Quản lý state toàn cục bằng Context     |
| `hooks/`      | Các custom React hook                   |
| `i18n/`       | Đa ngôn ngữ                             |
| `lib/`        | Hàm logic phức tạp / API                |
| `styles/`     | Style toàn cục                          |
| `types/`      | TypeScript type definitions             |
| `utils/`      | Hàm tiện ích                            |
