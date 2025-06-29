import axiosInstance from "../axiosInstance";
import { Company } from "@/types/Company";

export const fetchAllCompanies = async (): Promise<Company[]> => {
  const res = await axiosInstance.get("/admin/companies");
  return res.data;
};

export const fetchCompanyById = async (id: string): Promise<Company> => {
  const res = await axiosInstance.get(`/admin/companies/${id}`);
  return res.data;
};

export const createCompany = async (data: Partial<Company>) => {
  return await axiosInstance.post("/admin/companies", data);
};

export const updateCompany = async (id: string, data: Partial<Company>) => {
  return await axiosInstance.put(`/admin/companies/${id}`, data);
};

export const deleteCompany = async (id: string) => {
  return await axiosInstance.delete(`/admin/companies/${id}`);
}; 