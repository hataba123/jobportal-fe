/** Chuyển đường dẫn API/file tương đối qua BFF để không lộ backend URL. */
export function toBackendUrl(value: string | null | undefined): string {
  if (!value) return "#";

  // URL ngoài được render trực tiếp bằng <img>; không đưa qua backend proxy.
  if (/^https?:\/\//i.test(value)) {
    try {
      const parsed = new URL(value);
      if (parsed.pathname.startsWith("/uploads/")) {
        return `/api/media${parsed.pathname}${parsed.search}`;
      }
    } catch {
      return "#";
    }
    return value;
  }

  // API vẫn đi qua BFF backend, còn file public của backend đi qua BFF media
  // (origin backend không có tiền tố /api).
  const normalized = value.startsWith("/") ? value : `/${value}`;
  if (normalized.startsWith("/uploads/")) return `/api/media${normalized}`;
  if (normalized.startsWith("/api/")) return `/api/backend/${normalized.slice(5)}`;

  // Ảnh tĩnh thuộc frontend (ví dụ /image/avatar.png) phải giữ nguyên.
  if (normalized.startsWith("/image/") || normalized.startsWith("/placeholder.svg")) {
    return normalized;
  }

  return `/api/backend${normalized}`;
}

export function isExternalImageUrl(value: string): boolean {
  return /^https?:\/\//i.test(value);
}
