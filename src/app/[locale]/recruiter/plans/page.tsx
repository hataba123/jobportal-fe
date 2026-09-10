"use client";

import { useCallback, useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  createPaymentOrder,
  fetchCreditBalance,
  fetchPlans,
  fetchRecruiterPaymentOrders,
} from "@/lib/api/payments";
import type { CreditBalance, PaymentOrderListItem, ServicePlan } from "@/types/Payment";
import { CreditCard, RefreshCw, Sparkles, CheckCircle2, Clock, XCircle, Receipt } from "lucide-react";

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
  const [myOrders, setMyOrders] = useState<PaymentOrderListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [buyingId, setBuyingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [planResult, balanceResult, orderResult] = await Promise.all([
        fetchPlans(),
        fetchCreditBalance(),
        fetchRecruiterPaymentOrders().catch(() => []),
      ]);
      setPlans(planResult);
      setBalance(balanceResult);
      setMyOrders(orderResult || []);
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

      {/* Lịch sử giao dịch của Recruiter */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Receipt className="h-5 w-5 text-purple-600" />
              Lịch sử mua gói & nạp tín dụng
            </CardTitle>
            <span className="text-xs text-slate-500 font-medium">
              {myOrders.length} giao dịch
            </span>
          </div>
        </CardHeader>
        <CardContent>
          {myOrders.length === 0 ? (
            <div className="py-8 text-center text-slate-400 text-sm">
              Bạn chưa có giao dịch mua gói nào.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-600">
                <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500 border-b">
                  <tr>
                    <th className="py-3 px-4">Mã đơn (VNPAY)</th>
                    <th className="py-3 px-4">Gói dịch vụ</th>
                    <th className="py-3 px-4">Số tiền</th>
                    <th className="py-3 px-4">Trạng thái</th>
                    <th className="py-3 px-4">Ngày giao dịch</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {myOrders.map((o) => {
                    const st = String(o.status).toLowerCase();
                    const isPaid = st === "paid" || st === "1";
                    const isPending = st === "pending" || st === "0";
                    return (
                      <tr key={o.id} className="hover:bg-slate-50/80">
                        <td className="py-3 px-4 font-mono text-xs font-semibold text-slate-800">
                          {o.vnpTxnRef}
                        </td>
                        <td className="py-3 px-4 font-medium text-slate-900">
                          {o.planName || "Gói dịch vụ"}
                        </td>
                        <td className="py-3 px-4 font-bold text-slate-900">
                          {formatPrice(o.amount, o.currency || "VND")}
                        </td>
                        <td className="py-3 px-4">
                          {isPaid ? (
                            <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                              Thành công
                            </span>
                          ) : isPending ? (
                            <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                              <Clock className="w-3 h-3 text-amber-600" />
                              Đang chờ
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-xs font-semibold text-red-700 bg-red-50 px-2 py-0.5 rounded-full border border-red-200">
                              <XCircle className="w-3 h-3 text-red-600" />
                              Thất bại / Hủy
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-xs text-slate-500">
                          {o.createdAt
                            ? new Date(o.createdAt).toLocaleString("vi-VN")
                            : "N/A"}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
