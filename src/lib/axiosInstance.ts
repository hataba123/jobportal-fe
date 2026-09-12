// src/utils/axiosInstance.ts
import axios from "axios";

const API_BASE_URL =
  typeof window === "undefined"
    ? process.env.BACKEND_API_URL
    : "/api/backend";

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

if (typeof window !== "undefined") {
  axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
      const requestUrl = String(error.config?.url ?? "");
      if (error.response?.status === 401 && !requestUrl.includes("/auth/")) {
        window.dispatchEvent(new Event("jobportal:session-expired"));
      }
      return Promise.reject(error);
    },
  );
}

export default axiosInstance;
