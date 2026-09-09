export interface Notification {
  id: string;
  userId: string;
  title?: string;
  message: string;
  read: boolean;
  createdAt: string;
  type?: string; // ví dụ: "job", "system", "apply"
  actionUrl?: string;
}
