import axiosInstance from "../axiosInstance";
import { Notification } from "@/types/Notification";

// Lấy danh sách thông báo của user hiện tại
export const fetchMyNotifications = async (): Promise<Notification[]> => {
  const res = await axiosInstance.get("/notifications");
  return res.data;
};

// Lấy chi tiết 1 thông báo
export const fetchNotificationById = async (id: string): Promise<Notification> => {
  const res = await axiosInstance.get(`/notifications/${id}`);
  return res.data;
};

// Đánh dấu đã đọc
export const markNotificationAsRead = async (id: string) => {
  return await axiosInstance.put(`/notifications/${id}/read`);
};

// Xóa thông báo
export const deleteNotification = async (id: string) => {
  return await axiosInstance.delete(`/notifications/${id}`);
}; 