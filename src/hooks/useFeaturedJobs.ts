import { useEffect, useState } from "react";
import axios from "axios";
import { JobPost } from "@/types/JobPost";

export function useFeaturedJobs() {
  const [jobs, setJobs] = useState<JobPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    axios
      .get<JobPost[]>(`${apiUrl}/JobPost`)
      .then((res) => setJobs(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return { jobs, loading };
}
