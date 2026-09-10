import axiosInstance from "../axiosInstance";
import { Category } from "@/types/Category";
import { JobPost } from "@/types/JobPost";

export const fetchCategories = async (): Promise<Category[]> => {
  const res = await axiosInstance.get("/categories");
  return res.data;
};

export const fetchCategoryById = async (id: string): Promise<Category> => {
  const res = await axiosInstance.get(`/categories/${id}`);
  return res.data;
};

export const fetchJobsByCategory = async (categoryId: string): Promise<JobPost[]> => {
  const res = await axiosInstance.get(`/jobpost/category/${categoryId}`);
  return res.data;
};

export const createCategory = async (data: {
  name: string;
  icon?: string;
  color?: string;
}): Promise<Category> => {
  const res = await axiosInstance.post("/categories", data);
  return res.data;
};

export const updateCategory = async (
  id: string,
  data: { name?: string; icon?: string; color?: string }
): Promise<Category> => {
  const res = await axiosInstance.put(`/categories/${id}`, data);
  return res.data;
};

export const deleteCategory = async (id: string): Promise<void> => {
  await axiosInstance.delete(`/categories/${id}`);
}; 