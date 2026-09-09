// src/utils/axiosInstance.ts
import axios from "axios";

const API_BASE_URL =
  typeof window === "undefined"
    ? process.env.BACKEND_API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/api"
    : "/api/backend";

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

export default axiosInstance;
