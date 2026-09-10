"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  Flag,
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  ExternalLink,
  RefreshCw,
  Eye,
  AlertTriangle,
  Building2,
  Mail,
} from "lucide-react";
import { Link } from "@/i18n/navigation";
import { fetchJobReports, updateReportStatus, JobReport } from "@/lib/api/reports";
import { toast } from "sonner";

export default function AdminReportsPage() {
  const [reports, setReports] = useState<JobReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "pending" | "resolved" | "dismissed">("all");
  const [selectedReport, setSelectedReport] = useState<JobReport | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const loadReports = async () => {
    setLoading(true);
    try {
      const data = await fetchJobReports();
      setReports(data);
    } catch {
      toast.error("Không thể tải danh sách báo cáo vi phạm.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReports();
  }, []);

  const handleStatusChange = async (reportId: string, newStatus: "pending" | "resolved" | "dismissed") => {
    setUpdatingId(reportId);
    try {
      await updateReportStatus(reportId, newStatus);
      toast.success(
        newStatus === "resolved"
          ? "Đã đánh dấu báo cáo là ĐÃ XỬ LÝ."
          : newStatus === "dismissed"
          ? "Đã bỏ qua báo cáo này."
          : "Đã chuyển lại trạng thái Chờ xử lý."
      );
      setReports((prev) =>
        prev.map((r) =>
          r.id === reportId
            ? {
                ...r,
                status: newStatus,
                resolvedAt: newStatus !== "pending" ? new Date().toISOString() : undefined,
              }
            : r
        )
      );
      if (selectedReport && selectedReport.id === reportId) {
        setSelectedReport((prev: JobReport | null) =>
          prev
            ? {
                ...prev,
                status: newStatus,
                resolvedAt: newStatus !== "pending" ? new Date().toISOString() : undefined,
              }
            : null
        );
      }
    } catch {
      toast.error("Không thể cập nhật trạng thái báo cáo.");
    } finally {
      setUpdatingId(null);
    }
  };

  // KPI counts
  const stats = useMemo(() => {
    const total = reports.length;
    const pending = reports.filter((r) => r.status === "pending").length;
    const resolved = reports.filter((r) => r.status === "resolved").length;
    const dismissed = reports.filter((r) => r.status === "dismissed").length;
    return { total, pending, resolved, dismissed };
  }, [reports]);

  // Filtered list
  const filteredReports = useMemo(() => {
    return reports.filter((r) => {
      const matchesStatus = statusFilter === "all" || r.status === statusFilter;
      const term = searchTerm.toLowerCase();
      const matchesSearch =
        r.jobTitle.toLowerCase().includes(term) ||
        r.companyName.toLowerCase().includes(term) ||
        r.reason.toLowerCase().includes(term) ||
        (r.description && r.description.toLowerCase().includes(term)) ||
        (r.reporterEmail && r.reporterEmail.toLowerCase().includes(term));
      return matchesStatus && matchesSearch;
    });
  }, [reports, statusFilter, searchTerm]);

  const getStatusBadge = (status: JobReport["status"]) => {
    switch (status) {
      case "pending":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            <Clock className="w-3.5 h-3.5" />
            Chờ xử lý
          </span>
        );
      case "resolved":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Đã xử lý
          </span>
        );
      case "dismissed":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 border border-slate-200">
            <XCircle className="w-3.5 h-3.5" />
            Đã bỏ qua
          </span>
        );
    }
  };

  return (
    <div className="p-6 sm:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2.5">
            <div className="p-2 bg-rose-50 text-rose-600 rounded-xl">
              <Flag className="w-6 h-6" />
            </div>
            Quản lý Báo cáo Vi phạm
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Tiếp nhận và xử lý phản ánh của ứng viên về tin tuyển dụng có dấu hiệu vi phạm tiêu chuẩn cộng đồng
          </p>
        </div>

        <button
          onClick={loadReports}
          disabled={loading}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold rounded-xl text-sm transition-all shadow-xs"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          <span>Làm mới</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Tổng báo cáo</p>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-3xl font-black text-slate-900">{stats.total}</span>
            <AlertTriangle className="w-5 h-5 text-slate-400" />
          </div>
        </div>

        <div className="bg-amber-50/50 p-5 rounded-2xl border border-amber-200/70 shadow-xs">
          <p className="text-xs font-bold text-amber-700 uppercase tracking-wider">Chờ xử lý</p>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-3xl font-black text-amber-700">{stats.pending}</span>
            <Clock className="w-5 h-5 text-amber-600" />
          </div>
        </div>

        <div className="bg-emerald-50/50 p-5 rounded-2xl border border-emerald-200/70 shadow-xs">
          <p className="text-xs font-bold text-emerald-700 uppercase tracking-wider">Đã giải quyết</p>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-3xl font-black text-emerald-700">{stats.resolved}</span>
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          </div>
        </div>

        <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 shadow-xs">
          <p className="text-xs font-bold text-slate-600 uppercase tracking-wider">Đã bỏ qua</p>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-3xl font-black text-slate-700">{stats.dismissed}</span>
            <XCircle className="w-5 h-5 text-slate-400" />
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Tìm theo việc làm, công ty, lý do..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500"
          />
        </div>

        {/* Status Filter Buttons */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100/80 rounded-xl w-full sm:w-auto overflow-x-auto">
          {(
            [
              { key: "all", label: "Tất cả" },
              { key: "pending", label: "Chờ xử lý" },
              { key: "resolved", label: "Đã xử lý" },
              { key: "dismissed", label: "Bỏ qua" },
            ] as const
          ).map((tab) => (
            <button
              key={tab.key}
              onClick={() => setStatusFilter(tab.key)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                statusFilter === tab.key
                  ? "bg-white text-slate-900 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Reports Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-400 animate-pulse">
            Đang tải dữ liệu báo cáo vi phạm...
          </div>
        ) : filteredReports.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
            <h3 className="text-base font-bold text-slate-800">Không có báo cáo nào</h3>
            <p className="text-xs text-slate-500">
              Hiện tại không có tin tuyển dụng nào bị báo cáo vi phạm phù hợp với bộ lọc.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50/80 text-slate-700 font-bold border-b border-slate-200">
                <tr>
                  <th className="py-3.5 px-4">Thời gian</th>
                  <th className="py-3.5 px-4">Tin tuyển dụng & Công ty</th>
                  <th className="py-3.5 px-4">Lý do phản ánh</th>
                  <th className="py-3.5 px-4">Người báo cáo</th>
                  <th className="py-3.5 px-4">Trạng thái</th>
                  <th className="py-3.5 px-4 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredReports.map((report) => (
                  <tr key={report.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3.5 px-4 text-slate-500 whitespace-nowrap">
                      {new Date(report.createdAt).toLocaleString("vi-VN", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                    <td className="py-3.5 px-4 max-w-xs">
                      <div className="font-bold text-slate-900 truncate">{report.jobTitle}</div>
                      <div className="text-slate-500 flex items-center gap-1 mt-0.5">
                        <Building2 className="w-3 h-3" />
                        <span className="truncate">{report.companyName}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 max-w-xs">
                      <div className="font-semibold text-rose-600 truncate">{report.reason}</div>
                      <div className="text-slate-500 truncate mt-0.5">{report.description}</div>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {report.reporterEmail ? (
                        <div className="flex items-center gap-1.5 text-slate-700">
                          <Mail className="w-3.5 h-3.5 text-slate-400" />
                          <span>{report.reporterEmail}</span>
                        </div>
                      ) : (
                        <span className="text-slate-400 italic">Ẩn danh</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {getStatusBadge(report.status)}
                    </td>
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setSelectedReport(report)}
                          className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Xem chi tiết"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        {report.status !== "resolved" && (
                          <button
                            onClick={() => handleStatusChange(report.id, "resolved")}
                            disabled={updatingId === report.id}
                            className="p-1.5 text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                            title="Xác nhận xử lý"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                          </button>
                        )}
                        {report.status !== "dismissed" && (
                          <button
                            onClick={() => handleStatusChange(report.id, "dismissed")}
                            disabled={updatingId === report.id}
                            className="p-1.5 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                            title="Bỏ qua báo cáo"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal Detail */}
      {selectedReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-5">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-rose-50 text-rose-600 rounded-xl">
                  <Flag className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">Chi tiết báo cáo vi phạm</h3>
                  <p className="text-xs text-slate-400">Mã: {selectedReport.id}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedReport(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3.5 bg-slate-50 p-4 rounded-2xl border border-slate-100 text-xs">
              <div>
                <span className="text-slate-400 font-bold block uppercase tracking-wider text-[10px]">
                  Tin tuyển dụng
                </span>
                <div className="font-bold text-slate-900 text-sm mt-0.5">
                  {selectedReport.jobTitle}
                </div>
                <div className="flex items-center gap-1 text-slate-600 mt-1">
                  <Building2 className="w-3.5 h-3.5" />
                  <span>{selectedReport.companyName}</span>
                </div>
                <Link
                  href={`/candidate/job/${selectedReport.jobId}`}
                  target="_blank"
                  className="inline-flex items-center gap-1 text-blue-600 hover:underline mt-2 font-semibold"
                >
                  <span>Mở xem trang tin tuyển dụng</span>
                  <ExternalLink className="w-3 h-3" />
                </Link>
              </div>

              <div className="border-t border-slate-200/60 pt-3">
                <span className="text-slate-400 font-bold block uppercase tracking-wider text-[10px]">
                  Lý do vi phạm
                </span>
                <p className="text-rose-600 font-bold mt-0.5">{selectedReport.reason}</p>
              </div>

              <div className="border-t border-slate-200/60 pt-3">
                <span className="text-slate-400 font-bold block uppercase tracking-wider text-[10px]">
                  Nội dung chi tiết từ ứng viên
                </span>
                <p className="text-slate-700 whitespace-pre-wrap mt-1 leading-relaxed bg-white p-3 rounded-xl border border-slate-200">
                  {selectedReport.description}
                </p>
              </div>

              <div className="border-t border-slate-200/60 pt-3 grid grid-cols-2 gap-2 text-slate-600">
                <div>
                  <span className="text-slate-400 font-bold block uppercase tracking-wider text-[10px]">
                    Người gửi
                  </span>
                  <p className="font-medium mt-0.5">
                    {selectedReport.reporterEmail || "Ẩn danh"}
                  </p>
                </div>
                <div>
                  <span className="text-slate-400 font-bold block uppercase tracking-wider text-[10px]">
                    Trạng thái hiện tại
                  </span>
                  <div className="mt-1">{getStatusBadge(selectedReport.status)}</div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between gap-3 pt-2">
              <button
                onClick={() => setSelectedReport(null)}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Đóng
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleStatusChange(selectedReport.id, "dismissed")}
                  disabled={updatingId === selectedReport.id}
                  className="px-4 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all"
                >
                  Bỏ qua
                </button>
                <button
                  onClick={() => handleStatusChange(selectedReport.id, "resolved")}
                  disabled={updatingId === selectedReport.id}
                  className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-all shadow-sm"
                >
                  Đã xử lý xong
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}