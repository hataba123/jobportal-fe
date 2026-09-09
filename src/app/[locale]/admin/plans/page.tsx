"use client";

import { useCallback, useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  createAdminPlan,
  fetchAdminPlans,
  updateAdminPlan,
  type AdminPlanPayload,
} from "@/lib/api/payments";
import type { CreditType, ServicePlan } from "@/types/Payment";

type EditableEntitlement = {
  creditType: CreditType;
  quantity: string;
  expiresInDays: string;
};

type PlanForm = {
  name: string;
  price: string;
  currency: string;
  isActive: boolean;
  entitlements: EditableEntitlement[];
};

const creditTypes: CreditType[] = ["JobPost", "FeaturedJob", "MatchUnlock"];
const creditLabels: Record<CreditType, string> = {
  JobPost: "Đăng tin",
  FeaturedJob: "Đẩy tin nổi bật",
  MatchUnlock: "Mở khóa xếp hạng",
};

const emptyForm = (): PlanForm => ({
  name: "",
  price: "",
  currency: "VND",
  isActive: true,
  entitlements: creditTypes.map((creditType) => ({ creditType, quantity: "", expiresInDays: "" })),
});

const toForm = (plan: ServicePlan): PlanForm => ({
  name: plan.name,
  price: String(plan.price),
  currency: plan.currency,
  isActive: plan.isActive !== false,
  entitlements: creditTypes.map((creditType) => {
    const item = plan.entitlements.find((entry) => entry.creditType === creditType);
    return {
      creditType,
      quantity: item ? String(item.quantity) : "",
      expiresInDays: item?.expiresInDays ? String(item.expiresInDays) : "",
    };
  }),
});

const toPayload = (form: PlanForm): AdminPlanPayload => ({
  name: form.name.trim(),
  price: Number(form.price),
  currency: form.currency.trim().toUpperCase(),
  isActive: form.isActive,
  entitlements: form.entitlements
    .filter((entry) => Number(entry.quantity) > 0)
    .map((entry) => ({
      creditType: entry.creditType,
      quantity: Number(entry.quantity),
      expiresInDays: Number(entry.expiresInDays) > 0 ? Number(entry.expiresInDays) : null,
    })),
});

export default function AdminPlansPage() {
  const [plans, setPlans] = useState<ServicePlan[]>([]);
  const [form, setForm] = useState<PlanForm>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setPlans(await fetchAdminPlans());
    } catch {
      setError("Không thể tải cấu hình gói tín dụng.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const save = async () => {
    const payload = toPayload(form);
    if (!payload.name || !Number.isFinite(payload.price) || payload.entitlements.length === 0) {
      setError("Cần nhập tên, giá hợp lệ và ít nhất một loại tín dụng.");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      if (editingId) await updateAdminPlan(editingId, payload);
      else await createAdminPlan(payload);
      setEditingId(null);
      setForm(emptyForm());
      await load();
    } catch {
      setError("Không thể lưu gói tín dụng. Hãy kiểm tra dữ liệu và quyền Admin.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_380px]">
      <Card>
        <CardHeader><CardTitle>Danh sách gói tín dụng</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          {error && <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>}
          {loading ? <p className="text-sm text-gray-500">Đang tải...</p> : plans.length === 0 ? <p className="text-sm text-gray-500">Chưa có gói nào.</p> : plans.map((plan) => (
            <div key={plan.id} className="flex flex-col gap-3 rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="flex items-center gap-2 font-semibold">{plan.name}<Badge variant={plan.isActive === false ? "outline" : "secondary"}>{plan.isActive === false ? "Tắt" : "Đang bán"}</Badge></div>
                <p className="text-sm text-gray-600">{new Intl.NumberFormat("vi-VN", { style: "currency", currency: plan.currency }).format(plan.price)}</p>
                <p className="text-xs text-gray-500">{plan.entitlements.map((item) => `${item.quantity} ${creditLabels[item.creditType]}`).join(" · ")}</p>
              </div>
              <Button variant="outline" onClick={() => { setEditingId(plan.id); setForm(toForm(plan)); }}>Chỉnh sửa</Button>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>{editingId ? "Chỉnh sửa gói" : "Tạo gói mới"}</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2"><Label htmlFor="plan-name">Tên gói</Label><Input id="plan-name" value={form.name} onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))} /></div>
          <div className="grid grid-cols-2 gap-3"><div className="space-y-2"><Label htmlFor="plan-price">Giá</Label><Input id="plan-price" type="number" min="0" value={form.price} onChange={(event) => setForm((current) => ({ ...current, price: event.target.value }))} /></div><div className="space-y-2"><Label htmlFor="plan-currency">Tiền tệ</Label><Input id="plan-currency" value={form.currency} onChange={(event) => setForm((current) => ({ ...current, currency: event.target.value }))} /></div></div>
          <div className="flex items-center justify-between"><Label htmlFor="plan-active">Đang bán</Label><Switch id="plan-active" checked={form.isActive} onCheckedChange={(value) => setForm((current) => ({ ...current, isActive: value }))} /></div>
          <div className="space-y-3"><Label>Tín dụng trong gói</Label>{form.entitlements.map((entry, index) => <div key={entry.creditType} className="grid grid-cols-[1fr_80px_90px] items-center gap-2"><span className="text-sm">{creditLabels[entry.creditType]}</span><Input aria-label={`Số lượng ${entry.creditType}`} type="number" min="0" placeholder="SL" value={entry.quantity} onChange={(event) => setForm((current) => ({ ...current, entitlements: current.entitlements.map((item, itemIndex) => itemIndex === index ? { ...item, quantity: event.target.value } : item) }))} /><Input aria-label={`Hạn ${entry.creditType}`} type="number" min="0" placeholder="Ngày" value={entry.expiresInDays} onChange={(event) => setForm((current) => ({ ...current, entitlements: current.entitlements.map((item, itemIndex) => itemIndex === index ? { ...item, expiresInDays: event.target.value } : item) }))} /></div>)}</div>
          <div className="flex gap-2"><Button onClick={() => void save()} disabled={saving}>{saving ? "Đang lưu..." : "Lưu gói"}</Button>{editingId && <Button variant="outline" onClick={() => { setEditingId(null); setForm(emptyForm()); }}>Hủy</Button>}</div>
        </CardContent>
      </Card>
    </div>
  );
}
