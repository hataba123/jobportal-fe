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

export default axiosInstance;
