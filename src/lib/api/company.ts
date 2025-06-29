import axiosInstance from "@/lib/axiosInstance";
import { Company } from "@/types/Company";
import { JobPost } from "@/types/JobPost";
import { Review } from "@/types/Review";

/**
 * Fetch all companies
 */
export const fetchAllCompanies = async (): Promise<Company[]> => {
  try {
    const response = await axiosInstance.get("/companies");
    return response.data;
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'response' in error) {
      const axiosError = error as { response?: { data?: { message?: string } } };
      if (axiosError.response?.data?.message) {
        throw new Error(axiosError.response.data.message);
      }
    }
    throw new Error("Không thể tải danh sách công ty. Vui lòng thử lại sau.");
  }
};

/**
 * Fetch company by ID
 */
export const fetchCompanyById = async (id: string): Promise<Company> => {
  try {
    const response = await axiosInstance.get(`/companies/${id}`);
    return response.data;
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'response' in error) {
      const axiosError = error as { response?: { data?: { message?: string } } };
      if (axiosError.response?.data?.message) {
        throw new Error(axiosError.response.data.message);
      }
    }
    throw new Error("Không thể tải thông tin công ty. Vui lòng thử lại sau.");
  }
};

/**
 * Fetch jobs by company ID
 */
export const fetchJobsByCompany = async (companyId: string): Promise<JobPost[]> => {
  try {
    const response = await axiosInstance.get(`/jobpost/company/${companyId}`);
    return response.data;
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'response' in error) {
      const axiosError = error as { response?: { data?: { message?: string } } };
      if (axiosError.response?.data?.message) {
        throw new Error(axiosError.response.data.message);
      }
    }
    throw new Error("Không thể tải danh sách việc làm của công ty. Vui lòng thử lại sau.");
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
 * Create a new company
 */
export const createCompany = async (companyData: Partial<Company>): Promise<Company> => {
  try {
    const response = await axiosInstance.post("/companies", companyData);
    return response.data;
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'response' in error) {
      const axiosError = error as { response?: { data?: { message?: string } } };
      if (axiosError.response?.data?.message) {
        throw new Error(axiosError.response.data.message);
      }
    }
    throw new Error("Không thể tạo công ty. Vui lòng thử lại sau.");
  }
};

/**
 * Update company
 */
export const updateCompany = async (id: string, companyData: Partial<Company>): Promise<Company> => {
  try {
    const response = await axiosInstance.put(`/companies/${id}`, companyData);
    return response.data;
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'response' in error) {
      const axiosError = error as { response?: { data?: { message?: string } } };
      if (axiosError.response?.data?.message) {
        throw new Error(axiosError.response.data.message);
      }
    }
    throw new Error("Không thể cập nhật thông tin công ty. Vui lòng thử lại sau.");
  }
};

/**
 * Delete company
 */
export const deleteCompany = async (id: string): Promise<void> => {
  try {
    await axiosInstance.delete(`/companies/${id}`);
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'response' in error) {
      const axiosError = error as { response?: { data?: { message?: string } } };
      if (axiosError.response?.data?.message) {
        throw new Error(axiosError.response.data.message);
      }
    }
    throw new Error("Không thể xóa công ty. Vui lòng thử lại sau.");
  }
}; 