// src/utils/axiosInstance.ts
import axios from "axios";

const API_BASE_URL = `${process.env.NEXT_PUBLIC_API_URL}`;

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  // withCredentials: true, // bật nếu dùng cookie HttpOnly thay vì localStorage
});

// ✅ Thêm interceptor để tự động gắn token vào headers
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); // bạn có thể đổi sang lấy từ AuthContext nếu muốn
    console.log("Token gửi đi:", token); // 👈 debug

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;
