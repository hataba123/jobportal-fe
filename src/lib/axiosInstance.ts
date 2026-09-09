// src/utils/axiosInstance.ts
import axios from "axios";
import { getSession } from "next-auth/react";

type SessionWithJwt = {
  jwt?: string;
};

function getLocalToken() {
  if (typeof window !== "undefined") {
    return localStorage.getItem("access_token");
  }
  return null;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "/api";

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

// ✅ Thêm interceptor để tự động gắn token vào headers
axiosInstance.interceptors.request.use(
  async (config) => {
    let token = getLocalToken();
    if (!token) {
      const session = await getSession();
      token = (session as SessionWithJwt)?.jwt as string;
    }
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;
