import axiosInstance from "../axiosInstance";
import { Notification } from "@/types/Notification";

export const fetchAllNotifications = async (): Promise<Notification[]> => {
  const res = await axiosInstance.get("/admin/notifications");
  return res.data;
};

export const fetchNotificationById = async (id: string): Promise<Notification> => {
  const res = await axiosInstance.get(`/admin/notifications/${id}`);
  return res.data;
};

export const createNotification = async (data: Partial<Notification>) => {
  return await axiosInstance.post("/admin/notifications", data);
};

export const markNotificationAsRead = async (id: string) => {
  return await axiosInstance.put(`/admin/notifications/${id}/read`);
};

export const deleteNotification = async (id: string) => {
  return await axiosInstance.delete(`/admin/notifications/${id}`);
}; 