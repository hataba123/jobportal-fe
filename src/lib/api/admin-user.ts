import axiosInstance from "../axiosInstance";
import { User } from "@/types/user";
import { normalizePage, type PageResponse } from "./contract";

export const fetchAllUsers = async (page = 1, pageSize = 100): Promise<User[]> => {
  const res = await axiosInstance.get<PageResponse<User>>("/admin/users", {
    params: { page, pageSize },
  });
  return normalizePage(res.data, { page, pageSize }).items;
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
