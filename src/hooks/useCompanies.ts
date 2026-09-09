import { Company } from "./../types/Company";
import { useEffect, useState } from "react";
import axiosInstance from "@/lib/axiosInstance";

export function useCompanies() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    axiosInstance
      .get<Company[]>("/companies")
      .then((res) => setCompanies(res.data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return { companies, loading, error };
}
