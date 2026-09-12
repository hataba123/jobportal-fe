import { useEffect, useState } from "react";
import { JobPost } from "@/types/JobPost";
import { fetchPagedJobPosts, type JobPostPageQuery } from "@/lib/api/jobpost";

export function useJobPosts(options: JobPostPageQuery = {}) {
  const { page = 1, pageSize = 100, search, location, type, categoryId, minSalary } = options;
  const [jobPosts, setJobPosts] = useState<JobPost[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);
    fetchPagedJobPosts({ page, pageSize, search, location, type, categoryId, minSalary })
      .then((result) => {
        if (!active) return;
        setJobPosts(result.items);
        setTotalItems(result.totalItems);
        setTotalPages(result.totalPages);
      })
      .catch((err) => setError(err.message))
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [page, pageSize, search, location, type, categoryId, minSalary]);

  return { jobPosts, totalItems, totalPages, loading, error };
}
