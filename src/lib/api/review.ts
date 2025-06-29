import axiosInstance from "@/lib/axiosInstance";
import { Review } from "@/types/Review";

/**
 * Fetch all reviews
 */
export const fetchAllReviews = async (): Promise<Review[]> => {
  try {
    const response = await axiosInstance.get("/reviews");
    return response.data;
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'response' in error) {
      const axiosError = error as { response?: { data?: { message?: string } } };
      if (axiosError.response?.data?.message) {
        throw new Error(axiosError.response.data.message);
      }
    }
    throw new Error("Không thể tải danh sách đánh giá. Vui lòng thử lại sau.");
  }
};

/**
 * Fetch review by ID
 */
export const fetchReviewById = async (id: string): Promise<Review> => {
  try {
    const response = await axiosInstance.get(`/reviews/${id}`);
    return response.data;
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'response' in error) {
      const axiosError = error as { response?: { data?: { message?: string } } };
      if (axiosError.response?.data?.message) {
        throw new Error(axiosError.response.data.message);
      }
    }
    throw new Error("Không thể tải thông tin đánh giá. Vui lòng thử lại sau.");
  }
};

/**
 * Fetch reviews by company ID
 */
export const fetchReviewsByCompany = async (companyId: string): Promise<Review[]> => {
  try {
    const response = await axiosInstance.get(`/reviews/company/${companyId}`);
    return response.data;
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'response' in error) {
      const axiosError = error as { response?: { data?: { message?: string } } };
      if (axiosError.response?.data?.message) {
        throw new Error(axiosError.response.data.message);
      }
    }
    throw new Error("Không thể tải đánh giá của công ty. Vui lòng thử lại sau.");
  }
};

/**
 * Create a new review
 */
export const createReview = async (reviewData: Partial<Review>): Promise<Review> => {
  try {
    const response = await axiosInstance.post("/reviews", reviewData);
    return response.data;
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'response' in error) {
      const axiosError = error as { response?: { data?: { message?: string } } };
      if (axiosError.response?.data?.message) {
        throw new Error(axiosError.response.data.message);
      }
    }
    throw new Error("Không thể tạo đánh giá. Vui lòng thử lại sau.");
  }
};

/**
 * Update review
 */
export const updateReview = async (id: string, reviewData: Partial<Review>): Promise<Review> => {
  try {
    const response = await axiosInstance.put(`/reviews/${id}`, reviewData);
    return response.data;
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'response' in error) {
      const axiosError = error as { response?: { data?: { message?: string } } };
      if (axiosError.response?.data?.message) {
        throw new Error(axiosError.response.data.message);
      }
    }
    throw new Error("Không thể cập nhật đánh giá. Vui lòng thử lại sau.");
  }
};

/**
 * Delete review
 */
export const deleteReview = async (id: string): Promise<void> => {
  try {
    await axiosInstance.delete(`/reviews/${id}`);
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'response' in error) {
      const axiosError = error as { response?: { data?: { message?: string } } };
      if (axiosError.response?.data?.message) {
        throw new Error(axiosError.response.data.message);
      }
    }
    throw new Error("Không thể xóa đánh giá. Vui lòng thử lại sau.");
  }
}; 