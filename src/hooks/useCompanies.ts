import { Company } from "./../types/Company";
import { useEffect, useState } from "react";
import { fetchCompaniesPage, type CompanyPageQuery } from "@/lib/api/company";

export function useCompanies(options: CompanyPageQuery = {}) {
  const {
    page,
    pageSize,
    search,
    industry,
    location,
    employees,
  } = options;
  const [companies, setCompanies] = useState<Company[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);
    fetchCompaniesPage({ page, pageSize, search, industry, location, employees })
      .then((result) => {
        if (!active) return;
        setCompanies(result.items);
        setTotalItems(result.totalItems);
        setTotalPages(result.totalPages);
      })
      .catch((err: unknown) => {
        if (!active) return;
        setError(err instanceof Error ? err.message : "Không thể tải danh sách công ty");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [
    page,
    pageSize,
    search,
    industry,
    location,
    employees,
  ]);

  return { companies, totalItems, totalPages, loading, error };
}
