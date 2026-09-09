import { useEffect, useState } from "react";
import { JobPost } from "@/types/JobPost";
import axiosInstance from "@/lib/axiosInstance";

export function useFeaturedJobs() {
  const [jobs, setJobs] = useState<JobPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axiosInstance
      .get<JobPost[] | { items: JobPost[] }>("/jobpost", {
        params: { page: 1, pageSize: 100 },
      })
      .then((res) =>
        setJobs(Array.isArray(res.data) ? res.data : res.data.items),
      )
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return { jobs, loading };
}
