import { useEffect, useState } from "react";
import axios from "axios";
import { Review } from "@/types/Review";

export function useReviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    axios
      .get<Review[]>(`${apiUrl}/reviews`)
      .then((res) => setReviews(res.data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);
  return { reviews, loading, error };
}
