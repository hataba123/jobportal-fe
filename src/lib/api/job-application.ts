import axiosInstance from "../axiosInstance";

export const fetchMyAppliedJobs = async () => {
  const res = await axiosInstance.get("/jobapplication/my-jobs");
  return res.data;
};

export const deleteJobApplication = async (id: string) => {
  return await axiosInstance.delete(`/jobapplication/${id}`);
};

export const fetchJobApplicationDetail = async (id: string) => {
  const res = await axiosInstance.get(`/jobapplication/${id}`);
  return res.data;
}; 