| Tiêu chí                               | `useAuth` (Custom Hook)                                       | `react-hook-form`                                                |                                         |
| -------------------------------------- | ------------------------------------------------------------- | ---------------------------------------------------------------- | --------------------------------------- |
| **Mục đích chính**                     | Xử lý logic xác thực (login, logout, check user, redirect)    | Quản lý form state, validate input, xử lý lỗi người dùng nhập    |                                         |
| **Nơi định nghĩa**                     | `/src/hooks/useAuth.ts`                                       | Trong component (qua `useForm<FormValues>()`)                    |                                         |
| **Xử lý đăng nhập**                    | Gửi API (`loginUser()`), lưu thông tin người dùng, điều hướng | Gửi `data` từ form sang `login()` của `useAuth` nếu hợp lệ       |                                         |
| **Lưu trạng thái người dùng (`user`)** | ✅ Có, dùng \`useState\<User                                  | null>()\`                                                        | ❌ Không, chỉ lo dữ liệu nhập trên form |
| **Kiểm tra trạng thái login ban đầu**  | ✅ Có (qua `useEffect -> getUser()`)                          | ❌ Không                                                         |                                         |
| **Redirect sau đăng nhập**             | ✅ Có (sau login thành công → `router.push("/dashboard")`)    | ❌ Không tự làm — chỉ submit form thôi                           |                                         |
| **Hiển thị thông báo lỗi từ API**      | ❌ Không hiển thị trực tiếp                                   | ✅ Có thể hiển thị lỗi từ API bằng `setError("root", {...})`     |                                         |
| **Quản lý giá trị input**              | ❌ Không quản lý                                              | ✅ Tự động quản lý (`register("email")`, `register("password")`) |                                         |
| **Validate dữ liệu nhập**              | ❌ Không                                                      | ✅ Có qua `register(..., { required: "..." })`                   |                                         |
| **Tối ưu re-render**                   | Bình thường (`useState`)                                      | ✅ Cao — không re-render toàn form mỗi lần nhập                  |                                         |
| **Thích hợp cho**                      | Logic business/auth độc lập với UI                            | Form UI: quản lý, kiểm tra, gửi dữ liệu nhập                     |                                         |

Tóm tắt
| `useAuth` | `react-hook-form` |
| ------------------------------------------------------ | ------------------------------------------------------- |
| Quản lý logic đăng nhập | Quản lý dữ liệu form và xác thực đầu vào |
| Tương tác với API và router | Xử lý input người dùng và validate |
| Trả về trạng thái `user`, `loading`, `isAuthenticated` | Trả về `errors`, `handleSubmit`, `register`, `setError` |
