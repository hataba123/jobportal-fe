export type PaymentOrderStatus =
  | "Pending"
  | "Paid"
  | "Failed"
  | "Expired"
  | "Refunded";

export type CreditType = "JobPost" | "FeaturedJob" | "MatchUnlock";

export interface PlanEntitlement {
  creditType: CreditType;
  quantity: number;
  expiresInDays?: number | null;
}

export interface ServicePlan {
  id: string;
  name: string;
  price: number;
  currency: string;
  isActive?: boolean;
  entitlements: PlanEntitlement[];
}

export interface PaymentOrder {
  id: string;
  planId: string;
  vnpTxnRef: string;
  amount: number;
  currency: string;
  status: PaymentOrderStatus;
  createdAt: string;
  expiresAt: string;
  paidAt?: string | null;
  paymentUrl?: string;
}

export interface PaymentOrderListItem extends PaymentOrder {
  userId?: string;
  userFullName?: string;
  userEmail?: string;
  planName?: string;
  providerResponseCode?: string | null;
}

export interface CreditBalance {
  balances: Partial<Record<CreditType, number>>;
}

export interface CreditLedgerEntry {
  id: string;
  creditType: CreditType;
  quantity: number;
  expiresAt?: string | null;
  createdAt: string;
  paymentOrderId?: string | null;
}
