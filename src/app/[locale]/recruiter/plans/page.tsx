"use client";

import { useCallback, useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  createPaymentOrder,
  fetchCreditBalance,
  fetchPlans,
} from "@/lib/api/payments";
import type { CreditBalance, ServicePlan } from "@/types/Payment";
import { CreditCard, RefreshCw, Sparkles } from "lucide-react";

const creditLabels: Record<string, string> = {
  JobPost: "đăng tin",
  FeaturedJob: "đẩy tin nổi bật",
  MatchUnlock: "mở khóa xếp hạng",
};

const formatPrice = (price: number, currency: string) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency }).format(price);

export default function RecruiterPlansPage() {
  const [plans, setPlans] = useState<ServicePlan[]>([]);
  const [balance, setBalance] = useState<CreditBalance>({ balances: {} });
  const [loading, setLoading] = useState(true);
  const [buyingId, setBuyingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [planResult, balanceResult] = await Promise.all([
        fetchPlans(),
        fetchCreditBalance(),
      ]);
      setPlans(planResult);
      setBalance(balanceResult);
    } catch {
      setError("Không thể tải gói tín dụng. Vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const handleBuy = async (plan: ServicePlan) => {
    setBuyingId(plan.id);
    setError(null);
    try {
      const order = await createPaymentOrder(plan.id);
      if (!order.paymentUrl) {
        throw new Error("VNPAY chưa trả về đường dẫn thanh toán.");
      }
      window.location.assign(order.paymentUrl);
    } catch {
      setError("Không thể tạo đơn VNPAY. Kiểm tra cấu hình sandbox rồi thử lại.");
      setBuyingId(null);
    }
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2 text-blue-600">
            <CreditCard className="h-5 w-5" />
            <span className="text-sm font-semibold">VNPAY sandbox</span>
          </div>
          <h2 className="text-2xl font-bold">Gói tín dụng tuyển dụng</h2>
          <p className="mt-1 text-gray-600">
            Chỉ IPN đã xác minh mới cấp tín dụng; Candidate vẫn dùng gợi ý việc làm miễn phí.
          </p>
        </div>
        <Button variant="outline" onClick={() => void load()} disabled={loading}>
          <RefreshCw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          Làm mới
        </Button>
      </div>

      {error && <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>}

      <Card>
        <CardHeader><CardTitle>Số dư hiện tại</CardTitle></CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          {Object.entries(balance.balances).length === 0 ? (
            <span className="text-sm text-gray-500">Chưa có tín dụng.</span>
          ) : Object.entries(balance.balances).map(([type, quantity]) => (
            <Badge key={type} variant="secondary" className="px-3 py-1">
              {creditLabels[type] ?? type}: {quantity}
            </Badge>
          ))}
        </CardContent>
      </Card>

      {loading ? (
        <div className="rounded-xl border bg-white p-10 text-center text-gray-500">Đang tải gói tín dụng...</div>
      ) : plans.length === 0 ? (
        <div className="rounded-xl border border-dashed bg-white p-10 text-center text-gray-500">Admin chưa cấu hình gói tín dụng.</div>
      ) : (
        <div className="grid gap-5 md:grid-cols-3">
          {plans.map((plan) => (
            <Card key={plan.id} className="flex flex-col">
              <CardHeader>
                <div className="flex items-start justify-between gap-3">
                  <CardTitle>{plan.name}</CardTitle>
                  <Sparkles className="h-5 w-5 text-amber-500" />
                </div>
                <p className="text-2xl font-bold text-blue-700">{formatPrice(plan.price, plan.currency)}</p>
              </CardHeader>
              <CardContent className="flex flex-1 flex-col justify-between gap-6">
                <ul className="space-y-2 text-sm text-gray-600">
                  {plan.entitlements.map((item) => (
                    <li key={item.creditType}>
                      <span className="font-semibold text-gray-900">{item.quantity}</span> lượt {creditLabels[item.creditType] ?? item.creditType}
                      {item.expiresInDays ? ` · hết hạn sau ${item.expiresInDays} ngày` : ""}
                    </li>
                  ))}
                </ul>
                <Button onClick={() => void handleBuy(plan)} disabled={buyingId !== null}>
                  {buyingId === plan.id ? "Đang chuyển sang VNPAY..." : "Mua gói"}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
