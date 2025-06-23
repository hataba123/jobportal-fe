import { useEffect, useState } from "react";
import axios from "axios";
import { JobPost } from "@/types/JobPost";

export function useJobPosts() {
  const [jobPosts, setJobPosts] = useState<JobPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    axios
      .get<JobPost[]>(`${apiUrl}/JobPost`)
      .then((res) => setJobPosts(res.data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return { jobPosts, loading, error };
}
