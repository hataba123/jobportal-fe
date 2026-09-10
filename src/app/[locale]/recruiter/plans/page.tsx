"use client";

import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  createPaymentOrder,
  fetchCreditBalance,
  fetchPlans,
  fetchRecruiterPaymentOrders,
} from "@/lib/api/payments";
import type { CreditBalance, PaymentOrderListItem, ServicePlan } from "@/types/Payment";
import {
  RefreshCw,
  CheckCircle2,
  Clock,
  XCircle,
  Receipt,
  ShieldCheck,
  Zap,
  Check,
} from "lucide-react";

const creditLabels: Record<string, string> = {
  JobPost: "đăng tin tuyển dụng",
  FeaturedJob: "đẩy tin lên nổi bật",
  MatchUnlock: "mở khóa xếp hạng AI",
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
      setError("Không thể tải thông tin gói dịch vụ. Vui lòng thử lại sau.");
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
        throw new Error("Không nhận được liên kết thanh toán từ cổng thanh toán.");
      }
      window.location.assign(order.paymentUrl);
    } catch {
      setError("Không thể tạo đơn thanh toán VNPAY. Vui lòng thử lại.");
      setBuyingId(null);
    }
  };

  return (
    <div className="space-y-8">
      {/* Top Banner & Balance */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold mb-1 border border-blue-200">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
            <span>Thanh toán an toàn qua cổng VNPAY</span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Gói dịch vụ được kích hoạt tự động ngay sau khi hoàn tất giao dịch.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={() => void load()} disabled={loading} className="rounded-xl self-start sm:self-auto text-xs">
          <RefreshCw className={`mr-1.5 h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
          Làm mới
        </Button>
      </div>

      {error && (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-xs font-semibold text-rose-700">
          {error}
        </div>
      )}

      {/* Credit Balance Card */}
      <Card className="rounded-2xl border-slate-200/80 shadow-xs bg-gradient-to-r from-blue-50/50 via-indigo-50/30 to-white">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-500 fill-amber-500" />
              Số dư tín dụng hiện có
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex gap-3">
              <Skeleton className="h-9 w-36 rounded-xl" />
              <Skeleton className="h-9 w-40 rounded-xl" />
            </div>
          ) : Object.entries(balance.balances).length === 0 ? (
            <div className="text-xs text-slate-500">
              Bạn chưa có lượt tín dụng nào. Hãy chọn gói dịch vụ bên dưới để bắt đầu đăng tin và tiếp cận ứng viên.
            </div>
          ) : (
            <div className="flex flex-wrap gap-2.5">
              {Object.entries(balance.balances).map(([type, quantity]) => (
                <div
                  key={type}
                  className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white border border-blue-200/80 shadow-2xs text-xs"
                >
                  <span className="font-semibold text-slate-600 capitalize">
                    {creditLabels[type] ?? type}:
                  </span>
                  <span className="font-extrabold text-blue-600 text-sm">
                    {quantity}
                  </span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Plans Grid */}
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-bold text-slate-900">Danh sách các gói dịch vụ</h3>
          <p className="text-xs text-slate-500">Lựa chọn gói phù hợp với quy mô và nhu cầu tuyển dụng của doanh nghiệp</p>
        </div>

        {loading ? (
          <div className="grid gap-6 md:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="rounded-2xl border-slate-200 p-6 space-y-4">
                <Skeleton className="h-6 w-32 rounded-lg" />
                <Skeleton className="h-10 w-44 rounded-lg" />
                <div className="space-y-2 pt-4">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-5/6" />
                </div>
                <Skeleton className="h-10 w-full rounded-xl mt-6" />
              </Card>
            ))}
          </div>
        ) : plans.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-12 text-center text-slate-400 text-sm">
            Hiện chưa có gói dịch vụ nào được mở bán. Vui lòng liên hệ quản trị viên.
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-3">
            {plans.map((plan, index) => {
              const isPopular = index === 1; // Highlight second card as popular
              return (
                <Card
                  key={plan.id}
                  className={`rounded-2xl flex flex-col justify-between transition-all duration-200 relative overflow-hidden ${
                    isPopular
                      ? "border-blue-500 shadow-xl shadow-blue-500/10 ring-2 ring-blue-500/20"
                      : "border-slate-200/90 shadow-xs hover:shadow-md hover:border-slate-300"
                  }`}
                >
                  {isPopular && (
                    <div className="absolute top-0 right-0">
                      <div className="bg-gradient-to-l from-blue-600 to-indigo-600 text-white text-[10px] font-extrabold uppercase px-3 py-1 rounded-bl-xl tracking-wider">
                        Phổ biến nhất
                      </div>
                    </div>
                  )}

                  <CardHeader className="p-6 pb-4">
                    <CardTitle className="text-base font-bold text-slate-900">{plan.name}</CardTitle>
                    <div className="mt-3">
                      <span className="text-3xl font-extrabold text-slate-900">
                        {formatPrice(plan.price, plan.currency)}
                      </span>
                    </div>
                  </CardHeader>

                  <CardContent className="p-6 pt-0 flex-1 flex flex-col justify-between gap-6">
                    <div className="border-t border-slate-100 pt-4">
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                        Quyền lợi gói bao gồm:
                      </p>
                      <ul className="space-y-2.5 text-xs text-slate-600">
                        {plan.entitlements.map((item) => (
                          <li key={item.creditType} className="flex items-start gap-2">
                            <Check className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                            <span>
                              <strong className="text-slate-900 font-bold">{item.quantity}</strong> lượt{" "}
                              {creditLabels[item.creditType] ?? item.creditType}
                              {item.expiresInDays && (
                                <span className="text-slate-400 block sm:inline">
                                  {" "}(hạn dùng {item.expiresInDays} ngày)
                                </span>
                              )}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <Button
                      onClick={() => void handleBuy(plan)}
                      disabled={buyingId !== null}
                      className={`w-full h-11 rounded-xl text-xs font-bold transition-all ${
                        isPopular
                          ? "bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/25"
                          : "bg-slate-900 hover:bg-slate-800 text-white"
                      }`}
                    >
                      {buyingId === plan.id ? "Đang kết nối VNPAY..." : "Nâng cấp gói ngay"}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Transaction History Table */}
      <Card className="rounded-2xl border-slate-200/80 shadow-xs">
        <CardHeader className="p-6 pb-4 border-b border-slate-100">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-base font-bold text-slate-900">
              <Receipt className="h-4 w-4 text-indigo-600" />
              <span>Lịch sử giao dịch & nạp tín dụng</span>
            </CardTitle>
            <span className="text-xs text-slate-400 font-medium">
              {myOrders.length} giao dịch đã ghi nhận
            </span>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {myOrders.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-xs">
              Chưa có giao dịch nào được thực hiện.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-100">
                  <tr>
                    <th className="py-3.5 px-6">Mã giao dịch</th>
                    <th className="py-3.5 px-6">Gói dịch vụ</th>
                    <th className="py-3.5 px-6">Số tiền thanh toán</th>
                    <th className="py-3.5 px-6">Trạng thái</th>
                    <th className="py-3.5 px-6">Thời gian</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {myOrders.map((o) => {
                    const st = String(o.status).toLowerCase();
                    const isPaid = st === "paid" || st === "1";
                    const isPending = st === "pending" || st === "0";
                    return (
                      <tr key={o.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-4 px-6 font-mono text-xs font-semibold text-slate-800">
                          {o.vnpTxnRef}
                        </td>
                        <td className="py-4 px-6 font-medium text-slate-900">
                          {o.planName || "Gói dịch vụ"}
                        </td>
                        <td className="py-4 px-6 font-bold text-slate-900">
                          {formatPrice(o.amount, o.currency || "VND")}
                        </td>
                        <td className="py-4 px-6">
                          {isPaid ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                              Thành công
                            </span>
                          ) : isPending ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                              <Clock className="w-3 h-3 text-amber-600" />
                              Đang chờ xử lý
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-700 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-200">
                              <XCircle className="w-3 h-3 text-rose-600" />
                              Thất bại
                            </span>
                          )}
                        </td>
                        <td className="py-4 px-6 text-slate-500">
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
