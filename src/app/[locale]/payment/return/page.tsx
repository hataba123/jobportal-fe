"use client";

import { Suspense } from "react";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { fetchPaymentOrderByTxnRef } from "@/lib/api/payments";
import type { PaymentOrder } from "@/types/Payment";
import { CheckCircle2, CircleAlert, Clock } from "lucide-react";

function PaymentReturnContent() {
  const searchParams = useSearchParams();
  const txnRef = searchParams.get("vnp_TxnRef");
  const [order, setOrder] = useState<PaymentOrder | null>(null);
  const [verificationError, setVerificationError] = useState(false);

  useEffect(() => {
    if (!txnRef) return;

    let cancelled = false;
    let attempts = 0;
    let timer: ReturnType<typeof setTimeout> | undefined;

    const verify = async () => {
      attempts += 1;
      try {
        const result = await fetchPaymentOrderByTxnRef(txnRef);
        if (cancelled) return;
        setOrder(result);
        if (result.status === "Pending" && attempts < 6) {
          timer = setTimeout(() => void verify(), 2000);
        }
      } catch {
        if (!cancelled && attempts >= 6) setVerificationError(true);
        if (!cancelled && attempts < 6) timer = setTimeout(() => void verify(), 2000);
      }
    };

    void verify();
    return () => {
      cancelled = true;
      if (timer) clearTimeout(timer);
    };
  }, [txnRef]);

  const success = order?.status === "Paid";
  const pending = !order || order.status === "Pending";
  const failed = order && !pending && !success;

  return (
    <Card className="mx-auto max-w-lg">
      <CardHeader className="items-center text-center">
        {success ? <CheckCircle2 className="h-12 w-12 text-green-600" /> : pending ? <Clock className="h-12 w-12 text-blue-600" /> : <CircleAlert className="h-12 w-12 text-amber-600" />}
        <CardTitle>
          {success ? "Thanh toán đã được xác nhận" : pending ? "Đang xác nhận thanh toán" : "Thanh toán chưa hoàn tất"}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 text-center text-sm text-gray-600">
        <p>
          {success
            ? "Trạng thái được đọc từ đơn thanh toán trên máy chủ; tín dụng đã được ghi nhận sau khi IPN hợp lệ."
            : pending
              ? "IPN của VNPAY có thể cần thêm vài giây. Trang sẽ tự kiểm tra tối đa 5 lần."
              : "Bạn có thể thử lại từ trang gói tín dụng hoặc kiểm tra lại giao dịch trong VNPAY sandbox."}
        </p>
        {verificationError && <p className="text-red-600">Không thể xác minh đơn thanh toán trên máy chủ. Vui lòng đăng nhập lại rồi kiểm tra lịch sử giao dịch.</p>}
        {failed && order && <p>Trạng thái máy chủ: <span className="font-medium text-gray-900">{order.status}</span></p>}
        {txnRef && <p>Mã giao dịch: <span className="font-medium text-gray-900">{txnRef}</span></p>}
        <Link href="/recruiter/plans"><Button>Quay lại gói tín dụng</Button></Link>
      </CardContent>
    </Card>
  );
}

export default function PaymentReturnPage() {
  return (
    <main className="min-h-[60vh] px-4 py-12">
      <Suspense fallback={<div className="mx-auto max-w-lg rounded-xl border bg-white p-10 text-center text-gray-500">Đang kiểm tra kết quả...</div>}>
        <PaymentReturnContent />
      </Suspense>
    </main>
  );
}
