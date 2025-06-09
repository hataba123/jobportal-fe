import axios from "axios";
// ✅ Sử dụng biến môi trường bạn đã đặt
const API_BASE_URL = `${process.env.NEXT_PUBLIC_API_URL}`;

// ✅ Tạo một axios instance dùng chung
const axiosInstance = axios.create({
  baseURL: API_BASE_URL, // http://localhost:5000/api
  // withCredentials: true, // gửi cookie (như JWT HttpOnly) kèm request
});

export default axiosInstance;
