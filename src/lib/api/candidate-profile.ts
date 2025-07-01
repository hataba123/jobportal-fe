import axiosInstance from "../axiosInstance";

import { CandidateProfileUpdateDto } from "@/types/CandidateProfileUpdateDto";
// Upload CV file, trả về url

// API mới cho mục hồ sơ của tôi
export const fetchMyProfile = async () => {
  const res = await axiosInstance.get("/candidate-profile/me");
  return res.data;
};

export const updateMyProfile = async (
  data: Partial<CandidateProfileUpdateDto>
) => {
  return await axiosInstance.put("/candidate-profile/me", data);
};

// Upload CV file, trả về url
export const uploadCv = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append("file", file);
  const res = await axiosInstance.post("/candidate-profile/me/upload-cv", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data.url;
};

// Xóa CV đã nộp
export const deleteCv = async (): Promise<void> => {
  await axiosInstance.delete("/candidate-profile/me/delete-cv");
};
