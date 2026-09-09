import { useEffect, useState } from "react";
import axiosInstance from "@/lib/axiosInstance";
import { Review } from "@/types/Review";

export function useReviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    axiosInstance
      .get<Review[]>("/reviews")
      .then((res) => setReviews(res.data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);
  return { reviews, loading, error };
}
