// src/utils/axiosInstance.ts
import axios from "axios";
import { getAccessToken } from "@/utils/token"; // ✅ import hàm có sẵn

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
console.log("🌐 API_BASE_URL đang dùng:", API_BASE_URL); // 👈 THÊM DÒNG NÀY

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  // withCredentials: true, // bật nếu dùng cookie HttpOnly thay vì localStorage
});

// ✅ Thêm interceptor để tự động gắn token vào headers
axiosInstance.interceptors.request.use(
  (config) => {
    const token = getAccessToken(); // ✅ dùng đúng key "access_token"
    console.log("Token gửi đi:", token); // 👈 debug

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;
