"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import JobItem from "./JobItem"; // Đường dẫn nếu cùng folder
// Nếu đặt JobItem trong components/ thì dùng: '@/components/JobItem'

// Kiểu dữ liệu của 1 job từ API
interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  postedAt: string;
}

// Component hiển thị danh sách công việc
export default function JobList() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Gọi API lấy danh sách công việc từ .NET Core
    axios
      .get("https://your-api.com/api/jobs") // 🔁 Thay bằng URL thật
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
        <JobItem key={job.id} {...job} />
      ))}
    </div>
  );
}
