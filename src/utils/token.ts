/**
 * Tương thích ngược cho các import cũ.
 *
 * JWT hiện được NextAuth giữ trong cookie HttpOnly và BFF gắn vào request
 * phía server. Không lưu access token trong kho lưu trữ trình duyệt.
 */
/** @deprecated Dùng phiên NextAuth thay vì tự lưu JWT. */
export function setAccessToken(token: string): void {
  // Cố ý không lưu token ở phía trình duyệt.
  void token;
}

/** @deprecated Dùng useSession/getServerSession thay vì đọc JWT thủ công. */
export function getAccessToken(): null {
  return null;
}

/** @deprecated Phiên NextAuth được đăng xuất qua signOut(). */
export function clearAccessToken(): void {
  // Cố ý không thao tác với kho lưu trữ trình duyệt.
}
