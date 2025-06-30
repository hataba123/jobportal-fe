import axiosInstance from "../axiosInstance";
import { SavedJob } from "@/types/Savedjob";

// Lấy danh sách job đã lưu
export const fetchSavedJobs = async (): Promise<SavedJob[]> => {
  const res = await axiosInstance.get("/saved-jobs");
  return res.data;
};

// Lưu job
export const saveJob = async (jobPostId: string) => {
  return await axiosInstance.post(`/saved-jobs/${jobPostId}`);
};

// Bỏ lưu job
export const unsaveJob = async (jobPostId: string) => {
  return await axiosInstance.delete(`/saved-jobs/${jobPostId}`);
}; 