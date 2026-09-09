"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, CircleAlert } from "lucide-react";

function PaymentReturnContent() {
  const searchParams = useSearchParams();
  const responseCode = searchParams.get("vnp_ResponseCode");
  const success = responseCode === "00";

  return (
    <Card className="mx-auto max-w-lg">
      <CardHeader className="items-center text-center">
        {success ? <CheckCircle2 className="h-12 w-12 text-green-600" /> : <CircleAlert className="h-12 w-12 text-amber-600" />}
        <CardTitle>{success ? "Đã tiếp nhận thanh toán" : "Thanh toán chưa hoàn tất"}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 text-center text-sm text-gray-600">
        <p>
          {success
            ? "VNPAY đã chuyển kết quả về hệ thống. Tín dụng sẽ chỉ được cộng sau khi IPN được xác minh."
            : "Bạn có thể thử lại từ trang gói tín dụng hoặc kiểm tra lại giao dịch trong VNPAY sandbox."}
        </p>
        {searchParams.get("vnp_TxnRef") && <p>Mã giao dịch: <span className="font-medium text-gray-900">{searchParams.get("vnp_TxnRef")}</span></p>}
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
