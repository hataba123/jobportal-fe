/** Chuyển đường dẫn API/file tương đối qua BFF để không lộ backend URL. */
export function toBackendUrl(value: string | null | undefined): string {
  if (!value) return "#";
  if (/^https?:\/\//i.test(value)) return value;
  if (value.startsWith("/api/")) return `/api/backend/${value.slice(5)}`;
  if (value.startsWith("/")) return `/api/backend${value}`;
  return `/api/backend/${value}`;
}
