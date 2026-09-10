"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  CreditCard,
  Search,
  Download,
  CheckCircle2,
  Clock,
  XCircle,
  AlertCircle,
  DollarSign,
  TrendingUp,
  RefreshCw,
  Eye,
  X,
  FileSpreadsheet,
} from "lucide-react";
import { fetchAdminPaymentOrders } from "@/lib/api/payments";
import { PaymentOrderListItem, PaymentOrderStatus } from "@/types/Payment";
import { exportToCsv } from "@/lib/utils/exportCsv";

export default function AdminTransactionsPage() {
  const [orders, setOrders] = useState<PaymentOrderListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Detail Modal State
  const [selectedOrder, setSelectedOrder] = useState<PaymentOrderListItem | null>(null);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchAdminPaymentOrders();
      setOrders(data || []);
    } catch (err: unknown) {
      const errObj = err as { message?: string };
      setError(errObj?.message || "Không thể tải danh sách giao dịch.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const formatVND = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchSearch =
        order.vnpTxnRef?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.userFullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.userEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.planName?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchStatus =
        statusFilter === "all" ||
        order.status?.toLowerCase() === statusFilter.toLowerCase();

      return matchSearch && matchStatus;
    });
  }, [orders, searchTerm, statusFilter]);

  // Statistics
  const stats = useMemo(() => {
    const paidOrders = orders.filter((o) => {
      const s = String(o.status).toLowerCase();
      return s === "paid" || s === "1";
    });
    const totalRevenue = paidOrders.reduce((sum, o) => sum + (o.amount || 0), 0);
    const totalCount = orders.length;
    const paidCount = paidOrders.length;
    const successRate = totalCount > 0 ? Math.round((paidCount / totalCount) * 100) : 0;
    const averageOrderValue = paidCount > 0 ? Math.round(totalRevenue / paidCount) : 0;

    return {
      totalRevenue,
      totalCount,
      paidCount,
      successRate,
      averageOrderValue,
    };
  }, [orders]);

  const handleExportCsv = () => {
    exportToCsv(
      filteredOrders,
      [
        { header: "Mã giao dịch (VnpTxnRef)", accessor: "vnpTxnRef" },
        { header: "Khách hàng", accessor: (item) => item.userFullName || "N/A" },
        { header: "Email khách hàng", accessor: (item) => item.userEmail || "N/A" },
        { header: "Gói dịch vụ", accessor: (item) => item.planName || "N/A" },
        { header: "Số tiền (VND)", accessor: "amount" },
        { header: "Trạng thái", accessor: "status" },
        {
          header: "Thời gian tạo",
          accessor: (item) =>
            item.createdAt ? new Date(item.createdAt).toLocaleString("vi-VN") : "",
        },
        {
          header: "Thời gian thanh toán",
          accessor: (item) =>
            item.paidAt ? new Date(item.paidAt).toLocaleString("vi-VN") : "",
        },
      ],
      "bao_cao_giao_dich_jobportal"
    );
  };

  const getStatusBadge = (status: PaymentOrderStatus | number) => {
    const st = String(status).toLowerCase();
    if (st === "paid" || st === "1") {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          Thành công
        </span>
      );
    }
    if (st === "pending" || st === "0") {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
          <Clock className="w-3.5 h-3.5 text-amber-600" />
          Chờ thanh toán
        </span>
      );
    }
    if (st === "failed" || st === "2") {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-red-50 text-red-700 border border-red-200">
          <XCircle className="w-3.5 h-3.5 text-red-600" />
          Thất bại
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600">
        Hết hạn / Hủy
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Alert */}
      {error && (
        <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 text-red-800 rounded-xl text-sm font-medium animate-in fade-in">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
          <span>{error}</span>
          <button
            onClick={() => setError(null)}
            className="ml-auto text-red-500 hover:text-red-700"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2.5">
            <CreditCard className="w-6 h-6 text-purple-600" />
            Lịch sử Giao dịch & Quản lý Doanh thu
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Theo dõi tất cả đơn nạp điểm và mua gói dịch vụ từ nhà tuyển dụng qua cổng VNPAY
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadData}
            disabled={loading}
            className="p-2.5 text-slate-600 hover:bg-slate-100 rounded-xl border border-slate-200 transition-colors"
            title="Tải lại dữ liệu"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>

          <button
            onClick={handleExportCsv}
            disabled={filteredOrders.length === 0}
            className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-medium shadow-xs shadow-emerald-600/20 transition-all hover:shadow-md disabled:opacity-50"
          >
            <FileSpreadsheet className="w-4 h-4" />
            Xuất file Excel/CSV
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <DollarSign className="w-4 h-4 text-emerald-500" />
            Tổng doanh thu thực nhận
          </p>
          <div className="mt-2">
            <span className="text-2xl font-extrabold text-emerald-600">
              {formatVND(stats.totalRevenue)}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Từ {stats.paidCount} giao dịch thành công
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-purple-500" />
            Đơn nạp thành công
          </p>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-2xl font-extrabold text-slate-900">
              {stats.paidCount} / {stats.totalCount}
            </span>
            <span className="text-xs px-2.5 py-1 bg-purple-50 text-purple-700 rounded-full font-medium">
              Đạt {stats.successRate}%
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Tỷ lệ hoàn tất thanh toán
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <TrendingUp className="w-4 h-4 text-blue-500" />
            Giá trị trung bình mỗi đơn (AOV)
          </p>
          <div className="mt-2">
            <span className="text-2xl font-extrabold text-blue-600">
              {formatVND(stats.averageOrderValue)}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Doanh thu bình quân / lượt nạp
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Cổng thanh toán
          </p>
          <div className="mt-2 flex items-center gap-2">
            <span className="text-lg font-bold text-slate-800">VNPAY QR & Thẻ</span>
            <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
              SANDBOX / PROD
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Xác thực chữ ký SHA512 bảo mật
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm theo mã giao dịch, họ tên nhà tuyển dụng, email..."
            className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600 transition-all"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="w-full sm:w-auto px-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600 font-medium text-slate-700"
        >
          <option value="all">Tất cả trạng thái</option>
          <option value="paid">Thành công (Paid)</option>
          <option value="pending">Chờ thanh toán (Pending)</option>
          <option value="failed">Thất bại (Failed)</option>
          <option value="expired">Hết hạn (Expired)</option>
        </select>
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-12 flex flex-col items-center justify-center gap-3">
            <div className="w-8 h-8 rounded-full border-2 border-purple-600 border-t-transparent animate-spin" />
            <p className="text-sm text-slate-500">Đang tải lịch sử giao dịch...</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="p-12 text-center">
            <CreditCard className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-semibold text-slate-800">Không tìm thấy giao dịch nào</h3>
            <p className="text-sm text-slate-500 mt-1 max-w-sm mx-auto">
              {searchTerm || statusFilter !== "all"
                ? "Không có bản ghi giao dịch nào khớp với bộ lọc."
                : "Chưa có lượt nạp hoặc mua gói nào được tạo."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50/80 text-xs uppercase tracking-wider font-semibold text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="py-3.5 px-6">Mã giao dịch</th>
                  <th className="py-3.5 px-6">Nhà tuyển dụng</th>
                  <th className="py-3.5 px-6">Gói dịch vụ</th>
                  <th className="py-3.5 px-6">Số tiền</th>
                  <th className="py-3.5 px-6 text-center">Trạng thái</th>
                  <th className="py-3.5 px-6">Thời gian</th>
                  <th className="py-3.5 px-6 text-right">Chi tiết</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredOrders.map((order) => (
                  <tr
                    key={order.id}
                    className="hover:bg-slate-50/80 transition-colors group"
                  >
                    <td className="py-4 px-6 font-mono text-xs font-semibold text-slate-800">
                      {order.vnpTxnRef}
                    </td>

                    <td className="py-4 px-6">
                      <div className="min-w-0">
                        <p className="font-semibold text-slate-900 text-sm">
                          {order.userFullName || "Nhà tuyển dụng"}
                        </p>
                        <p className="text-xs text-slate-400 mt-0.5">
                          {order.userEmail || "Chưa có email"}
                        </p>
                      </div>
                    </td>

                    <td className="py-4 px-6 font-medium text-slate-800">
                      {order.planName || "Gói dịch vụ"}
                    </td>

                    <td className="py-4 px-6 font-bold text-slate-900">
                      {formatVND(order.amount)}
                    </td>

                    <td className="py-4 px-6 text-center">
                      {getStatusBadge(order.status)}
                    </td>

                    <td className="py-4 px-6 text-xs text-slate-500">
                      <div>
                        {order.createdAt
                          ? new Date(order.createdAt).toLocaleString("vi-VN")
                          : "N/A"}
                      </div>
                      {order.paidAt && (
                        <div className="text-emerald-600 text-[11px] mt-0.5">
                          Khớp lệnh: {new Date(order.paidAt).toLocaleTimeString("vi-VN")}
                        </div>
                      )}
                    </td>

                    <td className="py-4 px-6 text-right">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="p-2 text-slate-500 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                        title="Xem chi tiết đơn"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white w-full max-w-lg rounded-2xl border border-slate-200 shadow-2xl p-6 space-y-5 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-purple-600" />
                Chi tiết Giao dịch VNPAY
              </h3>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between py-1.5 border-b border-slate-50">
                <span className="text-slate-500">Mã đơn hàng nội bộ (ID)</span>
                <span className="font-mono text-xs text-slate-700">{selectedOrder.id}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-50">
                <span className="text-slate-500">Mã giao dịch VNPAY</span>
                <span className="font-mono font-semibold text-slate-900">{selectedOrder.vnpTxnRef}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-50">
                <span className="text-slate-500">Khách hàng</span>
                <span className="font-semibold text-slate-800">{selectedOrder.userFullName || "N/A"}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-50">
                <span className="text-slate-500">Email</span>
                <span className="text-slate-700">{selectedOrder.userEmail || "N/A"}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-50">
                <span className="text-slate-500">Gói dịch vụ đã mua</span>
                <span className="font-medium text-purple-700">{selectedOrder.planName || "Gói dịch vụ"}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-50">
                <span className="text-slate-500">Số tiền thanh toán</span>
                <span className="text-base font-bold text-emerald-600">{formatVND(selectedOrder.amount)}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-50">
                <span className="text-slate-500">Trạng thái</span>
                <div>{getStatusBadge(selectedOrder.status)}</div>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-50">
                <span className="text-slate-500">Thời gian tạo đơn</span>
                <span className="text-slate-700">
                  {selectedOrder.createdAt ? new Date(selectedOrder.createdAt).toLocaleString("vi-VN") : "N/A"}
                </span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-slate-500">Thời gian hoàn tất</span>
                <span className="text-slate-700">
                  {selectedOrder.paidAt ? new Date(selectedOrder.paidAt).toLocaleString("vi-VN") : "Chưa hoàn tất"}
                </span>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="px-5 py-2 text-sm font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-colors"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
