# Common UI Components

📦 Thư mục này chứa các UI components được tái sử dụng trong toàn bộ dự án Job Portal, giúp code dễ quản lý và tái sử dụng.

---

## 📘 Danh sách Component

### 1. `Button.tsx`
- Nút bấm có thể tùy biến kiểu: `primary`, `secondary`, `danger`.
- Props:
  - `onClick`, `type`, `disabled`, `variant`, `className`
- Client Component

---

### 2. `Input.tsx`
- Input cơ bản có hỗ trợ `label`, `placeholder`, `required`.
- Props:
  - `value`, `onChange`, `type`, `label`, `required`
- Client Component

---

### 3. `Select.tsx`
- Dropdown chọn giá trị trong form.
- Props:
  - `options`, `value`, `onChange`, `label`
- Client Component

---

### 4. `Modal.tsx`
- Hộp thoại hiển thị qua `React Portal`.
- Dùng để hiển thị form hoặc thông báo.
- Props:
  - `isOpen`, `onClose`, `title`, `children`
- Client Component

---

### 5. `Pagination.tsx`
- Điều hướng phân trang cho danh sách dữ liệu.
- Props:
  - `currentPage`, `totalPages`, `onPageChange`
- Client Component

---

## 🧠 Ghi chú

- Tất cả components ở đây đều là **Client Component** → cần `"use client"` nếu dùng App Router.
- Các component được thiết kế đơn giản, dễ mở rộng.

---

## 🛠 Hướng dẫn sử dụng

```tsx
import Button from "@/components/common/Button";

<Button onClick={() => console.log("Clicked")} variant="primary">
  Apply Now
</Button>

//
---------------------------------------------------
| JobPortal     Trang chủ | Việc làm | Hồ sơ | ... |  ← Navbar.tsx
---------------------------------------------------
| Việc làm của tôi            [+ Thêm việc làm]    |  ← Header.tsx
| Quản lý tất cả tin đã đăng                       |
---------------------------------------------------
| - Công việc A                                     |  ← Nội dung page
| - Công việc B                                     |
---------------------------------------------------

🧩 1. Navbar.tsx: thanh điều hướng toàn trang
📌 Vị trí:
Nằm trên cùng hoặc bên trái (nếu là sidebar)

Dùng cho layout chính

🧱 Ví dụ:
tsx
Copy
Edit
// components/Navbar.tsx
export default function Navbar() {
  return (
    <nav className="bg-white shadow px-4 py-3 flex justify-between items-center">
      <div className="font-bold text-xl">JobPortal</div>
      <div className="flex gap-4">
        <Link href="/">Trang chủ</Link>
        <Link href="/jobs">Việc làm</Link>
        <Link href="/profile">Hồ sơ</Link>
        <Link href="/logout">Đăng xuất</Link>
      </div>
    </nav>
  );
}
🧩 2. Header.tsx: tiêu đề và thao tác của trang con
📌 Vị trí:
Nằm bên dưới Navbar

Gắn trực tiếp vào mỗi page (JobsPage.tsx, CandidatesPage.tsx, AdminDashboard.tsx, ...)

🧱 Ví dụ:
tsx
Copy
Edit
<Header
  title="Việc làm của tôi"
  subtitle="Quản lý tất cả tin đã đăng"
  rightElement={<button className="btn-primary">+ Thêm việc làm</button>}
/>