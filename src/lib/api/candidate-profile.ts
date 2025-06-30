import axiosInstance from "../axiosInstance";
import { CandidateProfiles } from "@/types/CandidateProfile";
import { CandidateProfileUpdateDto } from "@/types/CandidateProfileUpdateDto";
// Upload CV file, trả về url
export const uploadCV = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append("file", file);
  const res = await axiosInstance.post("/candidate/upload-cv", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data.url; // backend trả về { url: "..." }
};

// Cập nhật profile (bao gồm resumeUrl)
export const updateCandidateProfile = async (
  data: Partial<CandidateProfiles>
) => {
  return await axiosInstance.patch("/candidate/profile", data);
};

// Lấy profile hiện tại
export const fetchCandidateProfile = async (): Promise<CandidateProfiles> => {
  const res = await axiosInstance.get("/candidate/profile");
  return res.data;
};

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
