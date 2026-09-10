import axiosInstance from "@/lib/axiosInstance";

export interface NewsletterResponse {
  active: boolean;
  message?: string;
}

// Email không còn được nhận từ client; backend lấy email đã xác thực trong JWT/DB.
export const subscribeNewsletter = async (email?: string): Promise<NewsletterResponse> => {
  void email;
  const response = await axiosInstance.post<NewsletterResponse>("/newsletter/subscribe");
  return response.data;
};

export const unsubscribeNewsletter = async (): Promise<NewsletterResponse> => {
  const response = await axiosInstance.post<NewsletterResponse>("/newsletter/unsubscribe");
  return response.data;
};
