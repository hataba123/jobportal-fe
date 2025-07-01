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
// chức năng mới
export const applyJob = async (jobPostId: string, cvUrl?: string) => {
  return await axiosInstance.post("/jobapplication", { jobPostId, cvUrl });
};
export const fetchCandidatesForJob = async (jobPostId: string) => {
  const res = await axiosInstance.get(`/jobapplication/job/${jobPostId}/candidates`);
  return res.data;
};
export const updateJobApplicationStatus = async (
  applicationId: string,
  status: "Pending" | "Reviewed" | "Accepted" | "Rejected"
) => {
  return await axiosInstance.put(`/jobapplication/${applicationId}/status`, {
    status,
  });
};