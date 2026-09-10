import axios from "axios";

export interface NewsletterResponse {
  success: boolean;
  message: string;
}

export const subscribeNewsletter = async (email: string): Promise<NewsletterResponse> => {
  const response = await axios.post<NewsletterResponse>("/api/newsletter/subscribe", { email });
  return response.data;
};