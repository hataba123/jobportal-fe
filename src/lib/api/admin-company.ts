import axiosInstance from "../axiosInstance";
import { Company } from "@/types/Company";
import { ifMatchHeaders, normalizePage, type PageResponse } from "./contract";

export const fetchAllCompanies = async (page = 1, pageSize = 100): Promise<Company[]> => {
  const res = await axiosInstance.get<PageResponse<Company>>("/admin/companies", {
    params: { page, pageSize },
  });
  return normalizePage(res.data, { page, pageSize }).items;
};

export const fetchCompanyById = async (id: string): Promise<Company> => {
  const res = await axiosInstance.get(`/admin/companies/${id}`);
  return res.data;
};

export const createCompany = async (data: Partial<Company>) => {
  return await axiosInstance.post("/admin/companies", data);
};

export const updateCompany = async (id: string, data: Partial<Company>, version?: string) => {
  return await axiosInstance.put(`/admin/companies/${id}`, data, {
    headers: ifMatchHeaders(version),
  });
};

export const deleteCompany = async (id: string, version?: string) => {
  return await axiosInstance.delete(`/admin/companies/${id}`, {
    headers: ifMatchHeaders(version),
  });
};

export const updateCompanyVerification = async (
  id: string,
  verificationStatus: "Pending" | "Verified" | "Rejected",
  version?: string,
): Promise<Company> => {
  const res = await axiosInstance.patch(`/admin/companies/${id}/verification`, {
    verificationStatus,
  }, { headers: ifMatchHeaders(version) });
  return res.data;
};
