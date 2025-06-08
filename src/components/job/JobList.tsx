"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import JobCard from "./JobCard";
import { JobPost } from "@/types/job-post";

export default function JobList() {
  const [jobs, setJobs] = useState<JobPost[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL; // 👈 Lấy từ biến môi trường
    axios
      .get<JobPost[]>(`${apiUrl}/api/JobPost`) // 👈 Sử dụng biến
      .then((res) => {
        setJobs(res.data);
      })
      .catch((err) => {
        console.error("Lỗi khi gọi API Job:", err);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Đang tải danh sách công việc...</p>;

  if (jobs.length === 0) return <p>Không có công việc nào!</p>;

  return (
    <div className="grid gap-4">
      {jobs.map((job) => (
        <JobCard key={job.id} {...job} />
      ))}
    </div>
  );
}
