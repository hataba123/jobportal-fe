import axiosInstance from "../axiosInstance";
import type {
  CreditBalance,
  CreditLedgerEntry,
  PaymentOrder,
  ServicePlan,
} from "@/types/Payment";

export const fetchPlans = async (): Promise<ServicePlan[]> => {
  const response = await axiosInstance.get<ServicePlan[]>("/plans");
  return response.data;
};

export const createPaymentOrder = async (planId: string): Promise<PaymentOrder> => {
  const response = await axiosInstance.post<PaymentOrder>("/payment-orders", { planId });
  return response.data;
};

export const fetchPaymentOrder = async (id: string): Promise<PaymentOrder> => {
  const response = await axiosInstance.get<PaymentOrder>(`/payment-orders/${id}`);
  return response.data;
};

export const fetchCreditBalance = async (): Promise<CreditBalance> => {
  const response = await axiosInstance.get<CreditBalance>("/credits/balance");
  return response.data;
};

export const fetchCreditLedger = async (): Promise<CreditLedgerEntry[]> => {
  const response = await axiosInstance.get<CreditLedgerEntry[]>("/credits/ledger");
  return response.data;
};

export type AdminPlanPayload = {
  name: string;
  price: number;
  currency: string;
  isActive: boolean;
  entitlements: ServicePlan["entitlements"];
};

export const fetchAdminPlans = async (): Promise<ServicePlan[]> => {
  const response = await axiosInstance.get<ServicePlan[]>("/admin/plans");
  return response.data;
};

export const createAdminPlan = async (payload: AdminPlanPayload): Promise<ServicePlan> => {
  const response = await axiosInstance.post<ServicePlan>("/admin/plans", payload);
  return response.data;
};

export const updateAdminPlan = async (
  id: string,
  payload: AdminPlanPayload
): Promise<ServicePlan> => {
  const response = await axiosInstance.put<ServicePlan>(`/admin/plans/${id}`, payload);
  return response.data;
};

export const fetchAdminPaymentOrders = async (): Promise<
  import("@/types/Payment").PaymentOrderListItem[]
> => {
  const response = await axiosInstance.get<
    import("@/types/Payment").PaymentOrderListItem[]
  >("/admin/payment-orders");
  return response.data;
};

export const fetchRecruiterPaymentOrders = async (): Promise<
  import("@/types/Payment").PaymentOrderListItem[]
> => {
  const response = await axiosInstance.get<
    import("@/types/Payment").PaymentOrderListItem[]
  >("/recruiter/payment-orders");
  return response.data;
};
