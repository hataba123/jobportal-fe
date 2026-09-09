"use client";

import { FormEvent, useState } from "react";
import { Link, useRouter } from "@/i18n/navigation";
import { requestPasswordReset } from "@/lib/api/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await requestPasswordReset(email);
      setSubmitted(true);
    } catch {
      // Luôn hiển thị thông báo chung, tránh dò email tồn tại.
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="mx-auto mt-16 max-w-md rounded-xl border bg-white p-6 shadow-sm">
      <h1 className="text-2xl font-semibold">Quên mật khẩu</h1>
      <p className="mt-2 text-sm text-gray-600">
        Nhập email để nhận hướng dẫn đặt lại mật khẩu.
      </p>
      {submitted ? (
        <div className="mt-6 space-y-4">
          <p className="text-sm text-green-700">
            Nếu email tồn tại, hướng dẫn đặt lại mật khẩu đã được gửi.
          </p>
          <Link href="/candidate/auth/login">
            <Button variant="outline">Quay lại đăng nhập</Button>
          </Link>
        </div>
      ) : (
        <form onSubmit={submit} className="mt-6 space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <Button type="submit" disabled={loading}>
            {loading ? "Đang gửi..." : "Gửi hướng dẫn"}
          </Button>
          <Button
            type="button"
            variant="ghost"
            onClick={() => router.push("/candidate/auth/login")}
          >
            Hủy
          </Button>
        </form>
      )}
    </main>
  );
}
