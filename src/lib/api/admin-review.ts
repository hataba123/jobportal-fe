import axiosInstance from "../axiosInstance";
import { Review } from "@/types/Review";

export const fetchAllReviews = async (): Promise<Review[]> => {
  const res = await axiosInstance.get("/admin/reviews");
  return res.data;
};

export const fetchReviewById = async (id: string): Promise<Review> => {
  const res = await axiosInstance.get(`/admin/reviews/${id}`);
  return res.data;
};

export const updateReview = async (id: string, data: Partial<Review>) => {
  return await axiosInstance.put(`/admin/reviews/${id}`, data);
};

export const deleteReview = async (id: string) => {
  return await axiosInstance.delete(`/admin/reviews/${id}`);
}; 