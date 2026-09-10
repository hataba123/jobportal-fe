import axiosInstance from "../axiosInstance";
import { Review } from "@/types/Review";
import { normalizePage, type PageResponse } from "./contract";

export const fetchAllReviews = async (page = 1, pageSize = 100): Promise<Review[]> => {
  const res = await axiosInstance.get<PageResponse<Review>>("/admin/reviews", {
    params: { page, pageSize },
  });
  return normalizePage(res.data, { page, pageSize }).items;
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
