export interface Notification {
  id: string;
  userId: string;
  message: string;
  read: boolean;
  createdAt: string;
  type?: string; // ví dụ: "job", "system", "apply"
}
