import { useEffect, useState } from "react";
import { JobPost } from "@/types/JobPost";
import axiosInstance from "@/lib/axiosInstance";

export function useJobPosts() {
  const [jobPosts, setJobPosts] = useState<JobPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    axiosInstance
      .get<JobPost[] | { items: JobPost[] }>("/jobpost", {
        params: { page: 1, pageSize: 100 },
      })
      .then((res) =>
        setJobPosts(Array.isArray(res.data) ? res.data : res.data.items),
      )
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return { jobPosts, loading, error };
}
