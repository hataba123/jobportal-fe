import axiosInstance from "../axiosInstance";
import { User } from "@/types/User";

export const fetchAllUsers = async (): Promise<User[]> => {
  const res = await axiosInstance.get("/admin/users");
  return res.data;
};

export const fetchUserById = async (id: string): Promise<User> => {
  const res = await axiosInstance.get(`/admin/users/${id}`);
  return res.data;
};

export const createUser = async (data: Partial<User>) => {
  return await axiosInstance.post("/admin/users", data);
};

export const updateUser = async (id: string, data: Partial<User>) => {
  return await axiosInstance.put(`/admin/users/${id}`, data);
};

export const deleteUser = async (id: string) => {
  return await axiosInstance.delete(`/admin/users/${id}`);
}; 